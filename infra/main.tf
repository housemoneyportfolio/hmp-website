provider "aws" {
  region = var.aws_region
}

locals {
  account_id = "897545367327"
  tags = {
    Project   = "hmp-website"
    ManagedBy = "terraform"
  }

}

# ── S3 — Static site hosting ────────────────────────────────────────────────

resource "aws_s3_bucket" "prod" {
  bucket = "housemoneyportfolio.com"
  tags   = local.tags
}

resource "aws_s3_bucket_versioning" "prod" {
  bucket = aws_s3_bucket.prod.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "prod" {
  bucket = aws_s3_bucket.prod.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "prod" {
  bucket = aws_s3_bucket.prod.id
  # All four intentionally false: this is the S3 website hosting endpoint for a public
  # marketing site. No user data, no secrets, no sensitive content in this bucket.
  # Cloudflare sits in front for WAF/DDoS/Bot protection on normal traffic, but the
  # S3 website endpoint URL (s3-website.us-east-2.amazonaws.com) is publicly accessible
  # — that is an acceptable v1 tradeoff for static marketing copy.
  # Long-term: migrate to Cloudflare Worker with SigV4 fetch (OPS_003) to restore
  # origin-level access control without sacrificing the Cloudflare proxy stack.
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_lifecycle_configuration" "prod" {
  bucket = aws_s3_bucket.prod.id
  rule {
    id     = "expire-noncurrent-versions"
    status = "Enabled"
    filter {}
    noncurrent_version_expiration {
      noncurrent_days = 30
    }
  }
}

resource "aws_s3_bucket_website_configuration" "prod" {
  bucket = aws_s3_bucket.prod.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "404.html"
  }
}

# Public-read bucket policy for S3 static website hosting.
#
# Previously restricted to Cloudflare IP ranges (Phase 4) — changed to public-read
# in Phase 5 because Cloudflare-proxied S3 REST origin fails SNI validation under
# "Full (strict)" on the Free plan. The switch to S3 website hosting (s3-website.*
# endpoint) requires a public bucket policy because the website endpoint is always
# public regardless of bucket policy anyway.
#
# Acceptable v1 tradeoff: no user data, no secrets in this bucket. Cloudflare
# fronts this for WAF/DDoS/Bot Fight on normal traffic. Direct-to-S3-website
# access bypasses Cloudflare but only exposes public marketing HTML/CSS/JS.
#
# Revisit: OPS_003 (migrate to Cloudflare Worker with SigV4 fetch) when business
# case justifies Pro plan or Worker complexity.
resource "aws_s3_bucket_policy" "prod" {
  bucket = aws_s3_bucket.prod.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.prod.arn}/*"
      }
    ]
  })

  depends_on = [aws_s3_bucket_public_access_block.prod]
}

# ── DynamoDB — Waitlist table ────────────────────────────────────────────────

resource "aws_dynamodb_table" "waitlist" {
  name         = "hmp-website-waitlist"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "email"

  attribute {
    name = "email"
    type = "S"
  }

  point_in_time_recovery {
    enabled = true
  }

  tags = local.tags
}

# ── Secrets Manager — Resend API key ────────────────────────────────────────

resource "aws_secretsmanager_secret" "resend" {
  name        = "/hmp/prod/marketing/resend_api_key"
  description = "Resend API key for waitlist notification emails"
  tags        = local.tags
}

# ── CloudWatch log group — Lambda ────────────────────────────────────────────

resource "aws_cloudwatch_log_group" "waitlist" {
  name              = "/aws/lambda/hmp-website-waitlist-handler"
  retention_in_days = 30
  tags              = local.tags
}

# ── Lambda — IAM execution role ──────────────────────────────────────────────

resource "aws_iam_role" "lambda" {
  name = "hmp-website-lambda-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = { Service = "lambda.amazonaws.com" }
        Action    = "sts:AssumeRole"
      }
    ]
  })
  tags = local.tags
}

resource "aws_iam_role_policy" "lambda" {
  name = "hmp-website-lambda-policy"
  role = aws_iam_role.lambda.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid      = "DynamoDBPutItem"
        Effect   = "Allow"
        Action   = ["dynamodb:PutItem"]
        Resource = "arn:aws:dynamodb:${var.aws_region}:${local.account_id}:table/hmp-website-waitlist"
      },
      {
        Sid      = "SecretsManagerRead"
        Effect   = "Allow"
        Action   = ["secretsmanager:GetSecretValue"]
        Resource = "arn:aws:secretsmanager:${var.aws_region}:${local.account_id}:secret:/hmp/prod/marketing/resend_api_key*"
      },
      {
        Sid    = "CloudWatchLogs"
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
        ]
        Resource = "arn:aws:logs:${var.aws_region}:${local.account_id}:log-group:/aws/lambda/hmp-website-waitlist-handler:*"
      }
    ]
  })
}

# ── Lambda — function and Function URL ──────────────────────────────────────

data "archive_file" "lambda_zip" {
  type        = "zip"
  source_dir  = "../lambda/waitlist"
  output_path = "${path.module}/.lambda_build/waitlist.zip"
}

resource "aws_lambda_function" "waitlist" {
  function_name    = "hmp-website-waitlist-handler"
  role             = aws_iam_role.lambda.arn
  runtime          = "nodejs18.x"
  handler          = "index.handler"
  filename         = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256

  environment {
    variables = {
      DYNAMODB_TABLE     = aws_dynamodb_table.waitlist.name
      RESEND_SECRET_ARN  = aws_secretsmanager_secret.resend.arn
      NOTIFICATION_EMAIL = var.notification_email
    }
  }

  depends_on = [aws_cloudwatch_log_group.waitlist]

  tags = local.tags
}

resource "aws_lambda_function_url" "waitlist" {
  function_name      = aws_lambda_function.waitlist.function_name
  authorization_type = "NONE"

  cors {
    allow_origins = ["https://${var.domain}", "https://www.${var.domain}"]
    allow_methods = ["POST"]
    allow_headers = ["content-type"]
    max_age       = 300
  }
}

# ── IAM — deploy user for GitHub Actions ────────────────────────────────────

resource "aws_iam_user" "deploy" {
  name = "hmp-website-deploy"
  tags = local.tags
}

resource "aws_iam_access_key" "deploy" {
  user = aws_iam_user.deploy.name
}

resource "aws_iam_user_policy" "deploy" {
  name = "hmp-website-deploy-policy"
  user = aws_iam_user.deploy.name
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid      = "S3DeployObjects"
        Effect   = "Allow"
        Action   = ["s3:PutObject", "s3:DeleteObject"]
        Resource = "${aws_s3_bucket.prod.arn}/*"
      },
      {
        Sid      = "S3ListBucket"
        Effect   = "Allow"
        Action   = ["s3:ListBucket"]
        Resource = aws_s3_bucket.prod.arn
      }
    ]
  })
}

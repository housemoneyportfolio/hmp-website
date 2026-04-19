provider "aws" {
  region = var.aws_region
}

locals {
  account_id = "897545367327"
  tags = {
    Project   = "hmp-website"
    ManagedBy = "terraform"
  }

  # Cloudflare IP ranges — source: https://www.cloudflare.com/ips-v4 and /ips-v6
  # MAINTENANCE: These ranges rotate quarterly. Update this list and re-run
  # terraform plan/apply whenever Cloudflare publishes new ranges.
  cloudflare_ipv4_ranges = [
    "173.245.48.0/20",
    "103.21.244.0/22",
    "103.22.200.0/22",
    "103.31.4.0/22",
    "141.101.64.0/18",
    "108.162.192.0/18",
    "190.93.240.0/20",
    "188.114.96.0/20",
    "197.234.240.0/22",
    "198.41.128.0/17",
    "162.158.0.0/15",
    "104.16.0.0/13",
    "104.24.0.0/14",
    "172.64.0.0/13",
    "131.0.72.0/22",
  ]

  cloudflare_ipv6_ranges = [
    "2400:cb00::/32",
    "2606:4700::/32",
    "2803:f800::/32",
    "2405:b500::/32",
    "2405:8100::/32",
    "2a06:98c0::/29",
    "2c0f:f248::/32",
  ]
}

# ── S3 — Static site hosting ────────────────────────────────────────────────

resource "aws_s3_bucket" "prod" {
  bucket = "hmp-website-prod"
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
  bucket            = aws_s3_bucket.prod.id
  block_public_acls = true
  # Intentionally false: required to attach the IP-conditional bucket policy below.
  # The Principal:* statement in that policy is gated by aws:SourceIp conditions
  # restricting reads to Cloudflare's published IP ranges only. Any future bucket
  # policy additions MUST maintain equivalent IP gating — do not add broader
  # Principal:* statements without a matching Condition block.
  # Long-term migration path: Cloudflare Worker with SigV4 fetch (OPS_003).
  block_public_policy     = false
  ignore_public_acls      = true
  restrict_public_buckets = true
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

resource "aws_s3_bucket_policy" "prod" {
  bucket = aws_s3_bucket.prod.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "AllowCloudflareGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.prod.arn}/*"
        Condition = {
          IpAddress = {
            "aws:SourceIp" = concat(
              local.cloudflare_ipv4_ranges,
              local.cloudflare_ipv6_ranges
            )
          }
        }
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

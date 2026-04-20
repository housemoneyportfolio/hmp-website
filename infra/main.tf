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

# NOTE: The aws_lambda_function_url "waitlist" resource was removed in FIX_001
# Phase B. This AWS account has a server-side block on AuthType=NONE Function
# URLs that returns 403 on every invocation regardless of the resource policy.
# Public invocation now goes through the API Gateway HTTP API defined below.
# The orphaned FunctionURLAllowPublicAccess resource policy statement on the
# Lambda function is harmless (points at a nonexistent URL); optional cleanup
# in Phase E: aws lambda remove-permission --statement-id FunctionURLAllowPublicAccess.

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

# ── ACM — TLS certificate for api.housemoneyportfolio.com ───────────────────
# Fronts the API Gateway HTTP API that replaces the (blocked-by-account)
# Lambda Function URL. DNS-validated — operator must create the validation
# CNAME in Cloudflare with proxy OFF, then wait for Issued status before
# dependents (APIGW custom domain) can be created. See FIX_001 Phase A.

resource "aws_acm_certificate" "api" {
  domain_name       = "api.${var.domain}"
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }

  tags = local.tags
}

# Validation resource waits for ACM to flip to Issued. Operator created the
# CNAME manually in Cloudflare (proxy OFF); this resource just blocks downstream
# resources (custom domain) until the cert is actually usable.
resource "aws_acm_certificate_validation" "api" {
  certificate_arn = aws_acm_certificate.api.arn
}

# ── API Gateway HTTP API — public endpoint for waitlist Lambda ──────────────
# Replaces the account-blocked Lambda Function URL. HTTP API uses a different
# auth layer than Function URLs and is not affected by the account-level block.
# Free for first 1M req/month.

resource "aws_apigatewayv2_api" "waitlist" {
  name          = "hmp-website-waitlist-api"
  protocol_type = "HTTP"
  description   = "Public endpoint for waitlist signups (FIX_001 replacement for Lambda Function URL)"

  cors_configuration {
    allow_origins = ["https://${var.domain}", "https://www.${var.domain}"]
    allow_methods = ["POST", "OPTIONS"]
    allow_headers = ["content-type"]
    max_age       = 300
  }

  tags = local.tags
}

resource "aws_apigatewayv2_integration" "waitlist" {
  api_id                 = aws_apigatewayv2_api.waitlist.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.waitlist.invoke_arn
  integration_method     = "POST"
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "waitlist_post" {
  api_id    = aws_apigatewayv2_api.waitlist.id
  route_key = "POST /"
  target    = "integrations/${aws_apigatewayv2_integration.waitlist.id}"
}

resource "aws_apigatewayv2_stage" "waitlist_default" {
  api_id      = aws_apigatewayv2_api.waitlist.id
  name        = "$default"
  auto_deploy = true

  tags = local.tags
}

resource "aws_lambda_permission" "waitlist_apigw_invoke" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.waitlist.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.waitlist.execution_arn}/*/*"
}

# ── API Gateway custom domain — api.housemoneyportfolio.com ─────────────────
# Stabilizes the endpoint hostname across future API Gateway recreates.
# Cloudflare CNAME api.<domain> → target_domain_name below (proxy ON) completes
# the path in Phase C.

resource "aws_apigatewayv2_domain_name" "api" {
  domain_name = "api.${var.domain}"

  domain_name_configuration {
    certificate_arn = aws_acm_certificate_validation.api.certificate_arn
    endpoint_type   = "REGIONAL"
    security_policy = "TLS_1_2"
  }

  tags = local.tags
}

resource "aws_apigatewayv2_api_mapping" "api_default" {
  api_id      = aws_apigatewayv2_api.waitlist.id
  domain_name = aws_apigatewayv2_domain_name.api.id
  stage       = aws_apigatewayv2_stage.waitlist_default.id
}

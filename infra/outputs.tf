output "s3_bucket_name" {
  description = "Name of the S3 bucket serving the static site"
  value       = aws_s3_bucket.prod.bucket
}

output "lambda_function_url" {
  description = "Public Function URL for the waitlist handler — use as NEXT_PUBLIC_WAITLIST_ENDPOINT"
  value       = aws_lambda_function_url.waitlist.function_url
}

output "deploy_user_access_key_id" {
  description = "Access key ID for hmp-website-deploy (GitHub Actions AWS_ACCESS_KEY_ID secret)"
  value       = aws_iam_access_key.deploy.id
}

output "deploy_user_secret_access_key" {
  description = "Secret access key for hmp-website-deploy (GitHub Actions AWS_SECRET_ACCESS_KEY secret)"
  value       = aws_iam_access_key.deploy.secret
  sensitive   = true
}

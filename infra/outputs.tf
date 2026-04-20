output "s3_bucket_name" {
  description = "Name of the S3 bucket serving the static site"
  value       = aws_s3_bucket.prod.bucket
}

# ── FIX_001: API Gateway HTTP API replacement ───────────────────────────────
# aws_lambda_function_url.waitlist was removed in Phase B (account-level block
# on AuthType=NONE Function URLs). Public invocation goes through API Gateway.

output "acm_cert_arn" {
  description = "ARN of the ACM cert for api.<domain>. Validation complete after Phase A."
  value       = aws_acm_certificate.api.arn
}

output "acm_validation_record_name" {
  description = "CNAME name for ACM DNS validation (operator placed this in Cloudflare proxy-OFF during Phase A; can be removed in Phase C after cert issued)"
  value       = tolist(aws_acm_certificate.api.domain_validation_options)[0].resource_record_name
}

output "acm_validation_record_value" {
  description = "CNAME value for ACM DNS validation (see acm_validation_record_name)"
  value       = tolist(aws_acm_certificate.api.domain_validation_options)[0].resource_record_value
}

output "api_gateway_invoke_url" {
  description = "Direct API Gateway invoke URL (default stage). Use for Gate B canary — should return 200 on POST. Public production traffic uses api_custom_domain_target via Cloudflare instead."
  value       = aws_apigatewayv2_stage.waitlist_default.invoke_url
}

output "api_custom_domain_target" {
  description = "API Gateway regional target hostname. Cloudflare operator adds a CNAME api.<domain> pointing at this value with proxy ON in Phase C."
  value       = aws_apigatewayv2_domain_name.api.domain_name_configuration[0].target_domain_name
}

output "waitlist_endpoint" {
  description = "Public waitlist endpoint. Set as NEXT_PUBLIC_WAITLIST_ENDPOINT GitHub secret in Phase D. Live only after Phase C DNS cutover."
  value       = "https://api.${var.domain}"
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

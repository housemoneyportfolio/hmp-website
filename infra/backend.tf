terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.0"
    }
  }

  backend "s3" {
    bucket = "hmp-website-terraform-state-897545367327"
    key    = "hmp-website/terraform.tfstate"
    region = "us-east-2"
  }
}

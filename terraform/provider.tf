# Configure Terraform providers with specific versions
terraform {
  required_providers {
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 4.0"
    }
  }
}

# Configure provider to perform quota checks using the project specified in resource blocks
provider "google-beta" {
  user_project_override = true
  billing_project       = var.project_id
}

# Configure provider to not perform quota checks using the project specified in resource blocks
# This provider is used only for project creation and service initialization
provider "google-beta" {
  alias                 = "no_user_project_override"
  user_project_override = false
}

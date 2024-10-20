# Configure Terraform backend to use Google Cloud Storage (GCS)
terraform {
  backend "gcs" {
    bucket = "backend"
  }
}

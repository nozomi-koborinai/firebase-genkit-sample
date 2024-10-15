# Terraform のバックエンドを GCS に設定
terraform {
  backend "gcs" {
    bucket = "backend"
  }
}

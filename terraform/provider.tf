# Terraform のプロバイダをバージョンごとに設定
terraform {
  required_providers {
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 4.0"
    }
  }
}

# プロバイダを設定して、リソースブロックで指定されたプロジェクトを使用してクォータチェックを行う
provider "google-beta" {
  user_project_override = true
  billing_project       = var.project_id
}

# プロバイダを設定して、リソースブロックで指定されたプロジェクトを使用してクォータチェックを行わない
# このプロバイダはプロジェクト作成時とサービス初期化時にのみ使用する
provider "google-beta" {
  alias                 = "no_user_project_override"
  user_project_override = false
}

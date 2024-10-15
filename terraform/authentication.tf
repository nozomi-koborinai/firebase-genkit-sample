# Firebase Authentication のプロビジョニング
resource "google_identity_platform_config" "default" {
  provider = google-beta
  project  = var.project_id
  depends_on = [
    google_firebase_project.default,
  ]
}

# Firebase Authentication が依存する Identity Platform のプロビジョニング
# 今回は匿名認証のみ有効化
resource "google_identity_platform_project_default_config" "default" {
  provider = google-beta
  project  = var.project_id
  sign_in {
    anonymous {
      enabled = true
    }
  }
  depends_on = [
    google_identity_platform_config.default
  ]
}

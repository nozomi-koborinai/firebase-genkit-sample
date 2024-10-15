# 必要な API を有効化
resource "google_project_service" "default" {
  provider = google-beta.no_user_project_override
  project  = var.project_id
  for_each = toset([
    "cloudbilling.googleapis.com",
    "firebase.googleapis.com",
    "firebaserules.googleapis.com",
    "firebasestorage.googleapis.com",
    "firestore.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "serviceusage.googleapis.com",
    "identitytoolkit.googleapis.com",
    "storage.googleapis.com",
  ])
  service            = each.key
  disable_on_destroy = false
}

# 上記で作成した新しいプロジェクトに Firebase サービスを有効化
resource "google_firebase_project" "default" {
  provider = google-beta
  project  = var.project_id

  # 必要な API が有効化されるまで待つ
  depends_on = [
    google_project_service.default
  ]
}

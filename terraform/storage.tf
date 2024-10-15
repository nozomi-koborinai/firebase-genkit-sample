# プロジェクトのデフォルトの Cloud Storage バケットを Google App Engine でプロビジョニング
resource "google_app_engine_application" "default" {
  provider    = google-beta
  project     = var.project_id
  location_id = "asia-northeast1"

  depends_on = [
    google_firestore_database.firestore,
  ]
}

# デフォルトの Storage バケットを Firebase SDKs, Firebase Authentication, Firebase Security Rules でアクセス可能にする
resource "google_firebase_storage_bucket" "default-bucket" {
  provider  = google-beta
  project   = var.project_id
  bucket_id = google_app_engine_application.default.default_bucket

  depends_on = [
    google_app_engine_application.default,
  ]
}

# ローカルファイルから Cloud Storage Security Rules のルールセットを作成
resource "google_firebaserules_ruleset" "storage" {
  provider = google-beta
  project  = var.project_id
  source {
    files {
      name    = "storage.rules"
      content = file("firebase_rules/storage.rules")
    }
  }

  lifecycle {
    create_before_destroy = true
  }

  # デフォルトの Storage バケットがプロビジョニングされる前にこのルールセットを作成する前に待つ
  depends_on = [
    google_firebase_project.default,
    google_app_engine_application.default,
  ]
}

# ルールセットをデフォルトの Storage バケットにリリース
resource "google_firebaserules_release" "default-bucket" {
  provider     = google-beta
  name         = "firebase.storage/${google_app_engine_application.default.default_bucket}"
  ruleset_name = "projects/${var.project_id}/rulesets/${google_firebaserules_ruleset.storage.name}"
  project      = var.project_id

  depends_on = [
    google_app_engine_application.default,
  ]
}

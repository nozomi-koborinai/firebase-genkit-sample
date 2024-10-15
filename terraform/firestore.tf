# Firestore のマスタデータ管理　(アプリケーション設定)
locals {
  # Firestore master data (アプリケーション設定)
  docs = [
    {
      collection  = "appConf"
      document_id = "config"
      fields = jsonencode({
        "genkitEnabled" = { "booleanValue" = false }
      })
    },
  ]
}

# Firestore データベースのプロビジョニング
resource "google_firestore_database" "firestore" {
  provider         = google-beta
  project          = var.project_id
  name             = "(default)"
  location_id      = "asia-northeast1"
  type             = "FIRESTORE_NATIVE"
  concurrency_mode = "OPTIMISTIC"

  # Firebase が Google Cloud プロジェクトで有効になる前に Firestore を初期化する前に待つ
  depends_on = [
    google_firebase_project.default,
  ]
}

# Firestore のセキュリティルールをローカルファイルから作成
resource "google_firebaserules_ruleset" "firestore" {
  provider = google-beta
  project  = var.project_id
  source {
    files {
      name    = "firestore.rules"
      content = file("firebase_rules/firestore.rules")
    }
  }

  lifecycle {
    create_before_destroy = true
  }

  # Firestore がプロビジョニングされる前にこのルールセットを作成する前に待つ
  depends_on = [
    google_firestore_database.firestore,
  ]
}

# Firestore インスタンスのルールセットを解放
resource "google_firebaserules_release" "firestore" {
  provider     = google-beta
  name         = "cloud.firestore"
  ruleset_name = google_firebaserules_ruleset.firestore.name
  project      = var.project_id

  # Firestore がプロビジョニングされる前にこのルールセットを解放する前に待つ
  depends_on = [
    google_firestore_database.firestore,
  ]
}

# Firestore にマスタデータを追加
resource "google_firestore_document" "docs" {
  for_each    = { for doc in local.docs : doc.document_id => doc }
  provider    = google-beta
  project     = var.project_id
  collection  = each.value.collection
  document_id = each.value.document_id
  fields      = each.value.fields

  depends_on = [
    google_firestore_database.firestore,
  ]
}

# Firebase Firestore Index
# 今後書くコレクションのインデックスを定義する場合はコメントアウトを外して適宜編集してください
# resource "google_firestore_index" "user-index" {
#   project = var.project_id
#   collection = "user"
#   api_scope = "DATASTORE_MODE_API"

#   fields {
#     field_path = "name"
#     order      = "ASCENDING"
#   }

#   fields {
#     field_path = "description"
#     order      = "DESCENDING"
#   }
# }

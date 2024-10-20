# Firestore master data management (Application settings and sample data for Genkit reference)
locals {
  docs = [
    # Application settings
    {
      collection  = "appConf"
      document_id = "config"
      fields = jsonencode({
        "genkitEnabled" = { "booleanValue" = true }
      })
    },

    # Dummy users for chatbot interaction
    # Firestore data actually referenced by functions/src/genkit-functions
    {
      collection  = "users"
      document_id = "user123"
      fields = jsonencode({
        "userProfile" = {
          "mapValue" = {
            "fields" = {
              "name"              = { "stringValue" = "田中太郎" }
              "preferredLanguage" = { "stringValue" = "ja" }
              "accountType"       = { "stringValue" = "premium" }
            }
          }
        }
      })
    },
    {
      collection  = "users"
      document_id = "user456"
      fields = jsonencode({
        "userProfile" = {
          "mapValue" = {
            "fields" = {
              "name"              = { "stringValue" = "田中次郎" }
              "preferredLanguage" = { "stringValue" = "ja" }
              "accountType"       = { "stringValue" = "standard" }
            }
          }
        }
      })
    },

    # User chat history
    {
      collection  = "users/user123/chatHistory"
      document_id = "chat123"
      fields = jsonencode({
        "productId" = { "stringValue" = "tablet_1" },
        "messages" = {
          "arrayValue" = {
            "values" = [
              {
                "mapValue" = {
                  "fields" = {
                    "role"      = { "stringValue" = "user" }
                    "content"   = { "stringValue" = "7 インチタブレットの大きさはどれくらいなのでしょうか？" }
                    "timestamp" = { "stringValue" = "2024-04-20T10:00:00Z" }
                  }
                }
              },
              {
                "mapValue" = {
                  "fields" = {
                    "role"      = { "stringValue" = "assistant" }
                    "content"   = { "stringValue" = "7インチタブレットの大きさは、画面の対角線の長さが7インチ（約17.78 cm）であることを指します。" }
                    "timestamp" = { "stringValue" = "2024-04-20T10:00:05Z" }
                  }
                }
              }
            ]
          }
        }
      })
    },
    {
      collection  = "users/user456/chatHistory"
      document_id = "chat456"
      fields = jsonencode({
        "productId" = { "stringValue" = "tablet_1" },
        "messages" = {
          "arrayValue" = {
            "values" = [
              {
                "mapValue" = {
                  "fields" = {
                    "role"      = { "stringValue" = "user" }
                    "content"   = { "stringValue" = "こんにちは" }
                    "timestamp" = { "stringValue" = "2023-04-20T10:00:00Z" }
                  }
                }
              },
              {
                "mapValue" = {
                  "fields" = {
                    "role"      = { "stringValue" = "assistant" }
                    "content"   = { "stringValue" = "はい、どのようなご質問でしょうか？" }
                    "timestamp" = { "stringValue" = "2023-04-20T10:00:05Z" }
                  }
                }
              }
            ]
          }
        }
      })
    },

    # Product catalog
    {
      collection  = "productCatalog"
      document_id = "tablet_1"
      fields = jsonencode({
        "name"    = { "stringValue" = "タブレット_1" }
        "details" = { "stringValue" = "軽量 7 インチタブレット" }
        "price"   = { "integerValue" = "30000" }
      })
    }
  ]
}

# Provisioning Firestore database
resource "google_firestore_database" "firestore" {
  provider         = google-beta
  project          = var.project_id
  name             = "(default)"
  location_id      = "asia-northeast1"
  type             = "FIRESTORE_NATIVE"
  concurrency_mode = "OPTIMISTIC"

  # Wait for Firebase to be enabled in the Google Cloud project before initializing Firestore
  depends_on = [
    google_firebase_project.default,
  ]
}

# Create Firestore security rules from local file
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

  # Wait for Firestore to be provisioned before creating this ruleset
  depends_on = [
    google_firestore_database.firestore,
  ]
}

# Release ruleset for Firestore instance
resource "google_firebaserules_release" "firestore" {
  provider     = google-beta
  name         = "cloud.firestore"
  ruleset_name = google_firebaserules_ruleset.firestore.name
  project      = var.project_id

  # Wait for Firestore to be provisioned before releasing this ruleset
  depends_on = [
    google_firestore_database.firestore,
  ]
}

# Add master data to Firestore
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
# To define indexes for future collections, uncomment and edit as needed
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

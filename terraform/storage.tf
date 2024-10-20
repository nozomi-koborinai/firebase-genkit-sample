# Provision the project's default Cloud Storage bucket using Google App Engine
resource "google_app_engine_application" "default" {
  provider    = google-beta
  project     = var.project_id
  location_id = "asia-northeast1"

  depends_on = [
    google_firestore_database.firestore,
  ]
}

# Make the default Storage bucket accessible to Firebase SDKs, Firebase Authentication, and Firebase Security Rules
resource "google_firebase_storage_bucket" "default-bucket" {
  provider  = google-beta
  project   = var.project_id
  bucket_id = google_app_engine_application.default.default_bucket

  depends_on = [
    google_app_engine_application.default,
  ]
}

# Create Cloud Storage Security Rules ruleset from local file
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

  # Wait for the default Storage bucket to be provisioned before creating this ruleset
  depends_on = [
    google_firebase_project.default,
    google_app_engine_application.default,
  ]
}

# Release ruleset to the default Storage bucket
resource "google_firebaserules_release" "default-bucket" {
  provider     = google-beta
  name         = "firebase.storage/${google_app_engine_application.default.default_bucket}"
  ruleset_name = "projects/${var.project_id}/rulesets/${google_firebaserules_ruleset.storage.name}"
  project      = var.project_id

  depends_on = [
    google_app_engine_application.default,
  ]
}

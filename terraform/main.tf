# Enable necessary APIs
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

# Enable Firebase services for the newly created project above
resource "google_firebase_project" "default" {
  provider = google-beta
  project  = var.project_id

  # Wait for the necessary APIs to be enabled
  depends_on = [
    google_project_service.default
  ]
}

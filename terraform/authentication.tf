# Provisioning Firebase Authentication
resource "google_identity_platform_config" "default" {
  provider = google-beta
  project  = var.project_id
  depends_on = [
    google_firebase_project.default,
  ]
}

# Provisioning Identity Platform which Firebase Authentication depends on
# Only anonymous authentication is enabled for this configuration
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

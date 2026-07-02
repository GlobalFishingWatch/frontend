# Firestore session store for fishing-map auth: holds the rotating GFW refresh tokens
# server-side so token rotation can be serialized across tabs, SSR requests and Cloud
# Run instances (the gateway revokes ALL user tokens when a rotated token is replayed).
# Auth is ADC through the runtime service accounts — no secrets, no VPC.

provider "google" {
  alias   = "development"
  project = "gfw-development"
}

provider "google" {
  alias   = "production"
  project = "gfw-production"
}

resource "google_project_service" "firestore_dev" {
  provider           = google.development
  project            = "gfw-development"
  service            = "firestore.googleapis.com"
  disable_on_destroy = false
}

resource "google_project_service" "firestore_pro" {
  provider           = google.production
  project            = "gfw-production"
  service            = "firestore.googleapis.com"
  disable_on_destroy = false
}

resource "google_firestore_database" "sessions_dev" {
  provider                = google.development
  project                 = "gfw-development"
  name                    = "fishing-map-sessions"
  location_id             = "us-central1"
  type                    = "FIRESTORE_NATIVE"
  delete_protection_state = "DELETE_PROTECTION_ENABLED"
  depends_on              = [google_project_service.firestore_dev]
}

resource "google_firestore_database" "sessions_pro" {
  provider                = google.production
  project                 = "gfw-production"
  name                    = "fishing-map-sessions"
  location_id             = "us-central1"
  type                    = "FIRESTORE_NATIVE"
  delete_protection_state = "DELETE_PROTECTION_ENABLED"
  depends_on              = [google_project_service.firestore_pro]
}

# TTL policy: docs are deleted when `expiresAt` passes (bumped on every rotation)
resource "google_firestore_field" "sessions_ttl_dev" {
  for_each   = toset(["sessions-dev", "sessions-sta"])
  provider   = google.development
  project    = "gfw-development"
  database   = google_firestore_database.sessions_dev.name
  collection = each.key
  field      = "expiresAt"

  ttl_config {}
}

resource "google_firestore_field" "sessions_ttl_pro" {
  provider   = google.production
  project    = "gfw-production"
  database   = google_firestore_database.sessions_pro.name
  collection = "sessions-pro"
  field      = "expiresAt"

  ttl_config {}
}

# Runtime service accounts need datastore access. If service-account IAM is managed in
# the infra repo, move these there.
resource "google_project_iam_member" "sessions_datastore_dev" {
  for_each = toset([
    "serviceAccount:frontend-dev@gfw-development.iam.gserviceaccount.com",
    "serviceAccount:frontend-sta@gfw-development.iam.gserviceaccount.com",
  ])
  provider = google.development
  project  = "gfw-development"
  role     = "roles/datastore.user"
  member   = each.key
}

resource "google_project_iam_member" "sessions_datastore_pro" {
  provider = google.production
  project  = "gfw-production"
  role     = "roles/datastore.user"
  member   = "serviceAccount:frontend-pro@gfw-production.iam.gserviceaccount.com"
}

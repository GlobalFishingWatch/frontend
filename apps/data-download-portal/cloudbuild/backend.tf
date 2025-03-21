terraform {
  backend "gcs" {
    bucket = "gfw-int-infrastructure-tfstate-us-central1"
    prefix = "cloudbuild-frontend/data-download-portal"
  }
}

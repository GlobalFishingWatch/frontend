provider "google" {
  project = "gfw-int-infrastructure"
}

locals {
  app_name     = "fishing-map"
  secrets_path = "projects/706952489382/secrets"
}

module "develop" {
  source            = "../../../cloudbuild-template"
  project_id        = "gfw-development"
  short_environment = "dev"
  app_name          = local.app_name
  docker_image      = "us-central1-docker.pkg.dev/gfw-int-infrastructure/frontend/${local.app_name}:latest-dev"
  service_account   = "frontend@gfw-development.iam.gserviceaccount.com"
  labels = {
    environment      = "develop"
    resource_creator = "engineering"
    project          = "frontend"
  }
  push_config = {
    branch       = "develop"
    invert_regex = false
  }
  set_env_vars_build = [
    "API_GATEWAY=https://gateway.api.dev.globalfishingwatch.org",
    "NEXT_PUBLIC_API_VERSION=v3",
    "NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID=G-R3PWRQW70G",
    "NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID=GTM-KK5ZFST",
    "NEXT_PUBLIC_USE_LOCAL_DATASETS=true",
    "NEXT_PUBLIC_USE_LOCAL_DATAVIEWS=true",
    "NEXT_PUBLIC_WORKSPACE_ENV=development",
    "NEXT_PUBLIC_REPORT_DAYS_LIMIT=366"
  ]
  set_env_vars = [
    "BASIC_AUTH=on",
    "BASIC_AUTH_USER=gfw",
  ]
  set_secrets = [
    "BASIC_AUTH_PASS=${local.secrets_path}/BASIC_AUTH_PASS_FISHING_MAP",
    "NEXT_MAP_ERRORS_SPREADSHEET_ID=${local.secrets_path}/FISHING_MAP_ERRORS_SPREADSHEET_ID",
    "NEXT_FEEDBACK_SPREADSHEET_ID=${local.secrets_path}/FISHING_MAP_FEEDBACK_SPREADSHEET_ID",
    "NEXT_SPREADSHEET_CLIENT_EMAIL=${local.secrets_path}/FISHING_MAP_SPREADSHEET_CLIENT_EMAIL",
    // TODO: get this secret from actual secret manager value
    "NEXT_SPREADSHEET_PRIVATE_KEY=${local.secrets_path}/FISHING_MAP_NEXT_SPREADSHEET_PRIVATE_KEY",
  ]
}



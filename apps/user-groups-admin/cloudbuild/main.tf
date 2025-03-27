provider "google" {
  project = "gfw-int-infrastructure"
}

locals {
  app_name = "user-groups-admin"
}

module "develop" {
  source            = "../../../cloudbuild-template"
  project_id        = "gfw-development"
  short_environment = "dev"
  app_name          = local.app_name
  docker_image      = "us-central1-docker.pkg.dev/gfw-int-infrastructure/frontend/${local.app_name}:latest-dev"
  service_account   = "frontend-dev@gfw-development.iam.gserviceaccount.com"
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
  ]
  set_env_vars = [
    "BASIC_AUTH=off",
    "BASIC_AUTH_USER=gfw",
  ]
  set_secrets = [
    "BASIC_AUTH_PASS=projects/706952489382/secrets/BASIC_AUTH_PASS_TRACK_LABELER",
  ]
}



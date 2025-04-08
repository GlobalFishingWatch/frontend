provider "google" {
  project = "gfw-int-infrastructure"
}

locals {
  app_name = "port-labeler"
  secrets_path = {
    dev = "projects/706952489382/secrets"
    sta = "projects/706952489382/secrets"
    pro = "projects/674016975526/secrets"
  }
  service_account = {
    dev = "frontend-dev@gfw-development.iam.gserviceaccount.com"
    sta = "frontend-sta@gfw-development.iam.gserviceaccount.com"
    pro = "frontend-pro@gfw-production.iam.gserviceaccount.com"
  }
}

module "develop" {
  source            = "../../../cloudbuild-template"
  project_id        = "gfw-development"
  short_environment = "dev"
  app_name          = local.app_name
  docker_image      = "us-central1-docker.pkg.dev/gfw-int-infrastructure/frontend/${local.app_name}:latest-dev"
  service_account   = local.service_account.dev
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
    "API_GATEWAY=https://gateway.api.dev-v2.globalfishingwatch.org",
  ]
  set_env_vars = [
    "BASIC_AUTH=Restricted",
    "BASIC_AUTH_USER=gfw",
  ]
  set_secrets = [
    "BASIC_AUTH_PASS=${local.secrets_path.dev}/BASIC_AUTH_PASS_PORT_LABELER",
  ]
}

module "staging" {
  source            = "../../../cloudbuild-template"
  project_id        = "gfw-development"
  short_environment = "sta"
  app_name          = local.app_name
  docker_image      = "us-central1-docker.pkg.dev/gfw-int-infrastructure/frontend/${local.app_name}:latest-sta"
  service_account   = local.service_account.sta
  labels = {
    environment      = "staging"
    resource_creator = "engineering"
    project          = "frontend"
  }
  push_config = {
    branch       = "main"
    invert_regex = false
  }
  set_env_vars_build = [
    "API_GATEWAY=https://gateway.api.staging-v2.globalfishingwatch.org",
  ]
  set_env_vars = [
    "BASIC_AUTH=Restricted",
    "BASIC_AUTH_USER=gfw",
  ]
  set_secrets = [
    "BASIC_AUTH_PASS=${local.secrets_path.sta}/BASIC_AUTH_PASS_PORT_LABELER",
  ]
}

module "production" {
  source            = "../../../cloudbuild-template"
  project_id        = "gfw-production"
  short_environment = "pro"
  description       = "Deploy to production when pushing new tag @gfw/port-labeler@x.x.x"
  app_name          = local.app_name
  docker_image      = "us-central1-docker.pkg.dev/gfw-int-infrastructure/frontend/${local.app_name}:latest-pro"
  service_account   = local.service_account.pro
  labels = {
    environment      = "production"
    resource_creator = "engineering"
    project          = "frontend"
  }
  push_config = {
    tag          = "^@gfw/port-labeler@\\d+\\.\\d+\\.\\d+(\\.\\d+)?$"
    invert_regex = false
  }
  set_env_vars_build = [
    "API_GATEWAY=https://gateway.api.pro-v2.globalfishingwatch.org",
  ]
  set_env_vars = [
    "BASIC_AUTH=off"
  ]
  set_secrets = []
}



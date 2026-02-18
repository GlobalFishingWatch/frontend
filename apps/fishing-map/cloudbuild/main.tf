provider "google" {
  project = "gfw-int-infrastructure"
}

locals {
  app_name   = "fishing-map"
  repository = "frontend"
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
  // Ensure it is prefixed with FISHING_MAP_ in the secrets manager
  secrets = [
    "BASIC_AUTH_PASS",
    "NEXT_DOWNLOAD_SURVEY_SPREADSHEET_ID",
    "NEXT_FEEDBACK_SPREADSHEET_ID",
    "NEXT_GFW_API_KEY",
    "NEXT_IDENTITY_REVIEW_SPREADSHEET_ID",
    "NEXT_MAP_ERRORS_SPREADSHEET_ID",
    "NEXT_MASTRA_API_URL",
    "NEXT_SENTRY_AUTH_TOKEN",
    "NEXT_SPREADSHEET_CLIENT_EMAIL",
    "NEXT_SPREADSHEET_PRIVATE_KEY",
    "NEXT_TURNING_TIDES_AIS_ID",
    "NEXT_TURNING_TIDES_BRAZIL_ID",
    "NEXT_TURNING_TIDES_CHILE_ID",
    "NEXT_TURNING_TIDES_PERU_ID",
    "NEXT_WORKSPACES_AGENT_ID",
  ]

  generate_secrets = {
    for env, path in local.secrets_path : env => [
      for secret in local.secrets :
      "${secret}=${path}/FISHING_MAP_${secret}"
    ]
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
    branch = "develop"
  }
  set_env_vars_build = [
    "NEXT_PUBLIC_API_GATEWAY=https://gateway.api.dev.globalfishingwatch.org",
    "NEXT_PUBLIC_API_VERSION=v3",
    "NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID=G-R3PWRQW70G",
    "NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID=GTM-KK5ZFST",
    "NEXT_PUBLIC_USE_LOCAL_DATASETS=false",
    "NEXT_PUBLIC_USE_LOCAL_DATAVIEWS=false",
    "NEXT_PUBLIC_WORKSPACE_ENV=development",
    "NEXT_PUBLIC_REPORT_DAYS_LIMIT=366",
    "NEXT_PUBLIC_PIPE_DATASET_VERSION=4",
  ]
  build_secrets = {
    SENTRY_AUTH_TOKEN = "${local.secrets_path.dev}/FISHING_MAP_NEXT_SENTRY_AUTH_TOKEN"
  }
  set_env_vars = [
    "BASIC_AUTH=Restricted",
    "BASIC_AUTH_USER=gfw-fish",
  ]
  set_secrets  = local.generate_secrets.dev
  machine_type = "E2_HIGHCPU_8"
}

module "preview-dev" {
  source            = "../../../cloudbuild-template"
  project_id        = "gfw-development"
  short_environment = "dev"
  app_name          = local.app_name
  app_suffix        = "-preview-bot"
  cloudrun_name     = "fishing-map-$${BRANCH_NAME}"
  docker_image      = "us-central1-docker.pkg.dev/gfw-int-infrastructure/frontend/${local.app_name}:latest-preview-bot-dev"
  service_account   = local.service_account.dev
  labels = {
    environment      = "develop"
    resource_creator = "engineering"
    project          = "frontend"
  }
  push_config = {
    branch = "develop"
  }
  set_env_vars_build = [
    "NEXT_PUBLIC_API_GATEWAY=https://gateway.api.dev.globalfishingwatch.org",
    "NEXT_PUBLIC_API_VERSION=v3",
    "NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID=G-R3PWRQW70G",
    "NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID=GTM-KK5ZFST",
    "NEXT_PUBLIC_USE_LOCAL_DATASETS=true",
    "NEXT_PUBLIC_USE_LOCAL_DATAVIEWS=true",
    "NEXT_PUBLIC_WORKSPACE_ENV=development",
    "NEXT_PUBLIC_REPORT_DAYS_LIMIT=366",
    "NEXT_PUBLIC_PIPE_DATASET_VERSION=4",
  ]
  build_secrets = {
    NX_CLOUD_ACCESS_TOKEN = "${local.secrets_path.dev}/FRONTEND_NX_CLOUD_ACCESS_TOKEN"
    SENTRY_AUTH_TOKEN     = "${local.secrets_path.dev}/FISHING_MAP_NEXT_SENTRY_AUTH_TOKEN"
  }
  set_env_vars = [
    "BASIC_AUTH=Restricted",
    "BASIC_AUTH_USER=gfw-fish",
  ]
  set_secrets = local.generate_secrets.dev
}

module "router-refactor" {
  source            = "../../../cloudbuild-template"
  project_id        = "gfw-development"
  short_environment = "dev"
  app_name          = local.app_name
  app_suffix        = "-router-refactor"
  docker_image      = "us-central1-docker.pkg.dev/gfw-int-infrastructure/frontend/${local.app_name}:latest-random-forest-dev"
  service_account   = local.service_account.dev
  labels = {
    environment      = "develop"
    resource_creator = "engineering"
    project          = "frontend"
  }
  push_config = {
    branch  = "fishing-map/router-refactor-2"
    trigger = "branch"
  }
  set_env_vars_build = [
    "VITE_API_GATEWAY=https://gateway.api.dev.globalfishingwatch.org",
    "VITE_API_VERSION=v3",
    "VITE_GOOGLE_MEASUREMENT_ID=G-R3PWRQW70G",
    "VITE_GOOGLE_TAG_MANAGER_ID=GTM-KK5ZFST",
    "VITE_USE_LOCAL_DATASETS=false",
    "VITE_USE_LOCAL_DATAVIEWS=false",
    "VITE_WORKSPACE_ENV=development",
    "VITE_REPORT_DAYS_LIMIT=366",
    "VITE_PIPE_DATASET_VERSION=4",
  ]
  build_secrets = {
    SENTRY_AUTH_TOKEN = "${local.secrets_path.dev}/FISHING_MAP_VITE_SENTRY_AUTH_TOKEN"
  }
  set_env_vars = [
    "BASIC_AUTH=Restricted",
    "BASIC_AUTH_USER=gfw-fish",
  ]
  set_secrets = local.generate_secrets.dev
}


module "random-forest" {
  source            = "../../../cloudbuild-template"
  project_id        = "gfw-development"
  short_environment = "dev"
  app_name          = local.app_name
  app_suffix        = "-random-forest"
  docker_image      = "us-central1-docker.pkg.dev/gfw-int-infrastructure/frontend/${local.app_name}:latest-random-forest-dev"
  service_account   = local.service_account.dev
  labels = {
    environment      = "develop"
    resource_creator = "engineering"
    project          = "frontend"
  }
  push_config = {
    branch  = "fishing-map/random-forest"
    trigger = "branch"
  }
  set_env_vars_build = [
    "NEXT_PUBLIC_API_GATEWAY=https://gateway.api.staging.globalfishingwatch.org",
    "NEXT_PUBLIC_API_VERSION=v3",
    "NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID=G-R3PWRQW70G",
    "NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID=GTM-KK5ZFST",
    "NEXT_PUBLIC_USE_LOCAL_DATASETS=true",
    "NEXT_PUBLIC_USE_LOCAL_DATAVIEWS=true",
    "NEXT_PUBLIC_WORKSPACE_ENV=development",
    "NEXT_PUBLIC_REPORT_DAYS_LIMIT=366",
    "NEXT_PUBLIC_PIPE_DATASET_VERSION=4",
  ]
  build_secrets = {
    SENTRY_AUTH_TOKEN = "${local.secrets_path.dev}/FISHING_MAP_NEXT_SENTRY_AUTH_TOKEN"
  }
  set_env_vars = [
    "BASIC_AUTH=Restricted",
    "BASIC_AUTH_USER=gfw-fish",
  ]
  set_secrets = local.generate_secrets.dev
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
    "NEXT_PUBLIC_API_GATEWAY=https://gateway.api.staging.globalfishingwatch.org",
    "NEXT_PUBLIC_API_VERSION=v3",
    "NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID=G-R3PWRQW70G",
    "NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID=GTM-KK5ZFST",
    "NEXT_PUBLIC_USE_LOCAL_DATASETS=false",
    "NEXT_PUBLIC_USE_LOCAL_DATAVIEWS=false",
    "NEXT_PUBLIC_WORKSPACE_ENV=staging",
    "NEXT_PUBLIC_REPORT_DAYS_LIMIT=366",
    "NEXT_PUBLIC_PIPE_DATASET_VERSION=4",
  ]
  build_secrets = {
    SENTRY_AUTH_TOKEN = "${local.secrets_path.sta}/FISHING_MAP_NEXT_SENTRY_AUTH_TOKEN"
  }
  set_env_vars = [
    "BASIC_AUTH=Restricted",
    "BASIC_AUTH_USER=gfw-fish",
  ]
  set_secrets = local.generate_secrets.sta
}

module "production" {
  source            = "../../../cloudbuild-template"
  project_id        = "gfw-production"
  short_environment = "pro"
  description       = "Deploy to production when pushing new tag @gfw/fishing-map@x.x.x"
  app_name          = local.app_name
  machine_type      = "E2_HIGHCPU_8"
  docker_image      = "us-central1-docker.pkg.dev/gfw-int-infrastructure/frontend/${local.app_name}:latest-pro"
  service_account   = local.service_account.pro
  labels = {
    environment      = "production"
    resource_creator = "engineering"
    project          = "frontend"
  }
  push_config = {
    tag          = "^@gfw/fishing-map@\\d+\\.\\d+\\.\\d+(\\.\\d+)?$"
    invert_regex = false
  }
  set_env_vars_build = [
    "NEXT_PUBLIC_API_GATEWAY=https://gateway.api.globalfishingwatch.org",
    "NEXT_PUBLIC_API_VERSION=v3",
    "NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID=G-R3PWRQW70G",
    "NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID=GTM-WXTMN69",
    "NEXT_PUBLIC_USE_LOCAL_DATASETS=false",
    "NEXT_PUBLIC_USE_LOCAL_DATAVIEWS=false",
    "NEXT_PUBLIC_WORKSPACE_ENV=production",
    "NEXT_PUBLIC_REPORT_DAYS_LIMIT=366",
    "NEXT_PUBLIC_PIPE_DATASET_VERSION=3",
  ]
  build_secrets = {
    SENTRY_AUTH_TOKEN = "${local.secrets_path.pro}/FISHING_MAP_NEXT_SENTRY_AUTH_TOKEN"
  }
  set_env_vars = [
    "BASIC_AUTH=off"
  ]
  set_secrets = local.generate_secrets.pro
}

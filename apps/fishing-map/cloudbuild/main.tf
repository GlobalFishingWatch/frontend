provider "google" {
  project = "gfw-int-infrastructure"
}

locals {
  app_name = "fishing-map"
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
    "NEXT_PUBLIC_REPORT_DAYS_LIMIT=366"
  ]
  set_env_vars = [
    "BASIC_AUTH=Restricted",
    "BASIC_AUTH_USER=gfw-fish",
  ]
  set_secrets = [
    "BASIC_AUTH_PASS=${local.secrets_path.dev}/BASIC_AUTH_PASS_FISHING_MAP",
    "NEXT_MAP_ERRORS_SPREADSHEET_ID=${local.secrets_path.dev}/FISHING_MAP_ERRORS_SPREADSHEET_ID",
    "NEXT_IDENTITY_REVIEW_SPREADSHEET_ID=${local.secrets_path.dev}/FISHING_MAP_IDENTITY_REVIEW_SPREADSHEET_ID",
    "NEXT_FEEDBACK_SPREADSHEET_ID=${local.secrets_path.dev}/FISHING_MAP_FEEDBACK_SPREADSHEET_ID",
    "NEXT_SPREADSHEET_CLIENT_EMAIL=${local.secrets_path.dev}/FISHING_MAP_SPREADSHEET_CLIENT_EMAIL",
    "NEXT_SPREADSHEET_PRIVATE_KEY=${local.secrets_path.dev}/FISHING_MAP_SPREADSHEET_PRIVATE_KEY",
    "NEXT_TURNING_TIDES_BRAZIL_ID=${local.secrets_path.dev}/FISHING_MAP_NEXT_TURNING_TIDES_BRAZIL_ID",
    "NEXT_TURNING_TIDES_CHILE_ID=${local.secrets_path.dev}/FISHING_MAP_NEXT_TURNING_TIDES_CHILE_ID",
    "NEXT_TURNING_TIDES_PERU_ID=${local.secrets_path.dev}/FISHING_MAP_NEXT_TURNING_TIDES_PERU_ID",
    "NEXT_MASTRA_API_URL=${local.secrets_path.dev}/FISHING_MAP_NEXT_MASTRA_API_URL",
    "NEXT_WORKSPACES_AGENT_ID=${local.secrets_path.dev}/FISHING_MAP_NEXT_WORKSPACES_AGENT_ID",
    "NEXT_GFW_API_KEY=${local.secrets_path.dev}/FISHING_MAP_NEXT_GFW_API_KEY",
  ]
}

module "carrier-portal" {
  source            = "../../../cloudbuild-template"
  project_id        = "gfw-development"
  short_environment = "dev"
  app_name          = local.app_name
  app_suffix        = "-cvp"
  docker_image      = "us-central1-docker.pkg.dev/gfw-int-infrastructure/frontend/${local.app_name}:latest-cvp-dev"
  service_account   = local.service_account.dev
  labels = {
    environment      = "develop"
    resource_creator = "engineering"
    project          = "frontend"
  }
  push_config = {
    branch  = "fishing-map/carrier-portal-vessel-profile"
    trigger = "branch"
  }
  set_env_vars_build = [
    "NEXT_PUBLIC_API_GATEWAY=https://gateway.api.dev.globalfishingwatch.org",
    "NEXT_PUBLIC_API_VERSION=v3",
    "NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID=G-R3PWRQW70G",
    "NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID=GTM-KK5ZFST",
    "NEXT_PUBLIC_USE_LOCAL_DATASETS=true",
    "NEXT_PUBLIC_USE_LOCAL_DATAVIEWS=true",
    "NEXT_PUBLIC_WORKSPACE_ENV=development",
    "NEXT_PUBLIC_REPORT_DAYS_LIMIT=366"
  ]
  set_env_vars = [
    "BASIC_AUTH=off"
  ]
  set_secrets = [
    "BASIC_AUTH_PASS=${local.secrets_path.dev}/BASIC_AUTH_PASS_FISHING_MAP",
    "NEXT_MAP_ERRORS_SPREADSHEET_ID=${local.secrets_path.dev}/FISHING_MAP_ERRORS_SPREADSHEET_ID",
    "NEXT_IDENTITY_REVIEW_SPREADSHEET_ID=${local.secrets_path.dev}/FISHING_MAP_IDENTITY_REVIEW_SPREADSHEET_ID",
    "NEXT_FEEDBACK_SPREADSHEET_ID=${local.secrets_path.dev}/FISHING_MAP_FEEDBACK_SPREADSHEET_ID",
    "NEXT_SPREADSHEET_CLIENT_EMAIL=${local.secrets_path.dev}/FISHING_MAP_SPREADSHEET_CLIENT_EMAIL",
    "NEXT_SPREADSHEET_PRIVATE_KEY=${local.secrets_path.dev}/FISHING_MAP_SPREADSHEET_PRIVATE_KEY",
    "NEXT_TURNING_TIDES_BRAZIL_ID=${local.secrets_path.dev}/FISHING_MAP_NEXT_TURNING_TIDES_BRAZIL_ID",
    "NEXT_TURNING_TIDES_CHILE_ID=${local.secrets_path.dev}/FISHING_MAP_NEXT_TURNING_TIDES_CHILE_ID",
    "NEXT_TURNING_TIDES_PERU_ID=${local.secrets_path.dev}/FISHING_MAP_NEXT_TURNING_TIDES_PERU_ID",
    "NEXT_MASTRA_API_URL=${local.secrets_path.dev}/FISHING_MAP_NEXT_MASTRA_API_URL",
    "NEXT_WORKSPACES_AGENT_ID=${local.secrets_path.dev}/FISHING_MAP_NEXT_WORKSPACES_AGENT_ID",
    "NEXT_GFW_API_KEY=${local.secrets_path.dev}/FISHING_MAP_NEXT_GFW_API_KEY",
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
    "NEXT_PUBLIC_API_GATEWAY=https://gateway.api.staging.globalfishingwatch.org",
    "NEXT_PUBLIC_API_VERSION=v3",
    "NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID=G-R3PWRQW70G",
    "NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID=GTM-KK5ZFST",
    "NEXT_PUBLIC_USE_LOCAL_DATASETS=true",
    "NEXT_PUBLIC_USE_LOCAL_DATAVIEWS=true",
    "NEXT_PUBLIC_WORKSPACE_ENV=staging",
    "NEXT_PUBLIC_REPORT_DAYS_LIMIT=366"
  ]
  set_env_vars = [
    "BASIC_AUTH=Restricted",
    "BASIC_AUTH_USER=gfw-fish",
  ]
  set_secrets = [
    "BASIC_AUTH_PASS=${local.secrets_path.sta}/BASIC_AUTH_PASS_FISHING_MAP",
    "NEXT_MAP_ERRORS_SPREADSHEET_ID=${local.secrets_path.sta}/FISHING_MAP_ERRORS_SPREADSHEET_ID",
    "NEXT_IDENTITY_REVIEW_SPREADSHEET_ID=${local.secrets_path.sta}/FISHING_MAP_IDENTITY_REVIEW_SPREADSHEET_ID",
    "NEXT_FEEDBACK_SPREADSHEET_ID=${local.secrets_path.sta}/FISHING_MAP_FEEDBACK_SPREADSHEET_ID",
    "NEXT_SPREADSHEET_CLIENT_EMAIL=${local.secrets_path.sta}/FISHING_MAP_SPREADSHEET_CLIENT_EMAIL",
    "NEXT_SPREADSHEET_PRIVATE_KEY=${local.secrets_path.sta}/FISHING_MAP_SPREADSHEET_PRIVATE_KEY",
    "NEXT_TURNING_TIDES_BRAZIL_ID=${local.secrets_path.sta}/FISHING_MAP_NEXT_TURNING_TIDES_BRAZIL_ID",
    "NEXT_TURNING_TIDES_CHILE_ID=${local.secrets_path.sta}/FISHING_MAP_NEXT_TURNING_TIDES_CHILE_ID",
    "NEXT_TURNING_TIDES_PERU_ID=${local.secrets_path.sta}/FISHING_MAP_NEXT_TURNING_TIDES_PERU_ID",
    "NEXT_MASTRA_API_URL=${local.secrets_path.sta}/FISHING_MAP_NEXT_MASTRA_API_URL",
    "NEXT_WORKSPACES_AGENT_ID=${local.secrets_path.sta}/FISHING_MAP_NEXT_WORKSPACES_AGENT_ID",
    "NEXT_GFW_API_KEY=${local.secrets_path.sta}/FISHING_MAP_NEXT_GFW_API_KEY",
  ]
}

module "production" {
  source            = "../../../cloudbuild-template"
  project_id        = "gfw-production"
  short_environment = "pro"
  description       = "Deploy to production when pushing new tag @gfw/fishing-map@x.x.x"
  app_name          = local.app_name
  docker_image      = "us-central1-docker.pkg.dev/gfw-int-infrastructure/frontend/${local.app_name}:latest-sta"
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
    "NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID=GTM-KK5ZFST",
    "NEXT_PUBLIC_USE_LOCAL_DATASETS=true",
    "NEXT_PUBLIC_USE_LOCAL_DATAVIEWS=true",
    "NEXT_PUBLIC_WORKSPACE_ENV=staging",
    "NEXT_PUBLIC_REPORT_DAYS_LIMIT=366"
  ]
  set_env_vars = [
    "BASIC_AUTH=off"
  ]
  set_secrets = [
    "NEXT_MAP_ERRORS_SPREADSHEET_ID=${local.secrets_path.pro}/FISHING_MAP_ERRORS_SPREADSHEET_ID",
    "NEXT_IDENTITY_REVIEW_SPREADSHEET_ID=${local.secrets_path.pro}/FISHING_MAP_IDENTITY_REVIEW_SPREADSHEET_ID",
    "NEXT_FEEDBACK_SPREADSHEET_ID=${local.secrets_path.pro}/FISHING_MAP_FEEDBACK_SPREADSHEET_ID",
    "NEXT_SPREADSHEET_CLIENT_EMAIL=${local.secrets_path.pro}/FISHING_MAP_SPREADSHEET_CLIENT_EMAIL",
    "NEXT_SPREADSHEET_PRIVATE_KEY=${local.secrets_path.pro}/FISHING_MAP_SPREADSHEET_PRIVATE_KEY",
    "NEXT_TURNING_TIDES_BRAZIL_ID=${local.secrets_path.pro}/FISHING_MAP_NEXT_TURNING_TIDES_BRAZIL_ID",
    "NEXT_TURNING_TIDES_CHILE_ID=${local.secrets_path.pro}/FISHING_MAP_NEXT_TURNING_TIDES_CHILE_ID",
    "NEXT_TURNING_TIDES_PERU_ID=${local.secrets_path.pro}/FISHING_MAP_NEXT_TURNING_TIDES_PERU_ID",
    "NEXT_MASTRA_API_URL=${local.secrets_path.pro}/FISHING_MAP_NEXT_MASTRA_API_URL",
    "NEXT_WORKSPACES_AGENT_ID=${local.secrets_path.pro}/FISHING_MAP_NEXT_WORKSPACES_AGENT_ID",
    "NEXT_GFW_API_KEY=${local.secrets_path.pro}/FISHING_MAP_NEXT_GFW_API_KEY",
  ]
}


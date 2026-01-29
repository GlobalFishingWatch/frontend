provider "google" {
  project = "gfw-int-infrastructure"
}

locals {
  repository = "frontend"
  app_name   = "fishing-map-e2e"
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
    "NEXT_FEEDBACK_SPREADSHEET_ID",
    "NEXT_GFW_API_KEY",
    "NEXT_SENTRY_AUTH_TOKEN",
    "NEXT_IDENTITY_REVIEW_SPREADSHEET_ID",
    "NEXT_MAP_ERRORS_SPREADSHEET_ID",
    "NEXT_MASTRA_API_URL",
    "NEXT_SPREADSHEET_CLIENT_EMAIL",
    "NEXT_SPREADSHEET_PRIVATE_KEY",
    "NEXT_TURNING_TIDES_BRAZIL_ID",
    "NEXT_TURNING_TIDES_CHILE_ID",
    "NEXT_TURNING_TIDES_PERU_ID",
    "NEXT_TURNING_TIDES_AIS_ID",
    "NEXT_WORKSPACES_AGENT_ID",
  ]

  generate_secrets = {
    for env, path in local.secrets_path : env => [
      for secret in local.secrets :
      "${secret}=${path}/FISHING_MAP_${secret}"
    ]
  }
}

resource "google_cloudbuild_trigger" "integrations_tests_on_pr" {
  name        = "fishing-map-integrations-tests"
  location    = "us-central1"
  description = "Run integrations tests on PR"


  github {
    name  = local.repository
    owner = "GlobalFishingWatch"
    push {
      branch       = ".*"
      invert_regex = false
    }
  }

  service_account = "projects/gfw-int-infrastructure/serviceAccounts/cloudbuild@gfw-int-infrastructure.iam.gserviceaccount.com"

  build {
    step {
      id     = "Run integration tests"
      name   = "node:24-alpine"
      script = <<EOF
        yarn install --immutable --inline-builds
        yarn nx reset
        yarn nx run fishing-map-e2e:e2e
      EOF
    }

    options {
      logging = "CLOUD_LOGGING_ONLY"
    }

    timeout = "1800s"
  }
}

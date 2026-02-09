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
      id     = "Install Dependencies"
      name   = "us-central1-docker.pkg.dev/gfw-int-infrastructure/frontend/dependencies:latest"
      script = <<-EOF
        cp -R /app/node_modules /app/.yarn ./
        yarn set version 4.12.0
        yarn install --immutable --inline-builds
      EOF
    }

    step {
      id     = "Run integration tests"
      name   = "node:24-slim"
      script = <<EOF
        yarn install
        yarn playwright install chromium --with-deps
        yarn nx test fishing-map --browser="chromium"
      EOF
    }

    options {
      logging = "CLOUD_LOGGING_ONLY"
    }

    timeout = "1800s"
  }
}

resource "google_cloudbuild_trigger" "e2e_tests_on_pr" {
  name        = "fishing-map-e2e-tests"
  location    = "us-central1"
  description = "Run ent-to-end tests on PR"


  github {
    name  = local.repository
    owner = "GlobalFishingWatch"
    push {
      branch       = "^test/e2e-testing-branch$"
      invert_regex = false
    }
  }

  service_account = "projects/gfw-int-infrastructure/serviceAccounts/cloudbuild@gfw-int-infrastructure.iam.gserviceaccount.com"

  build {
    step {
      id     = "Install Dependencies"
      name   = "us-central1-docker.pkg.dev/gfw-int-infrastructure/frontend/dependencies:latest"
      script = <<-EOF
        cp -R /app/node_modules /app/.yarn ./
        yarn set version 4.12.0
        yarn install --immutable --inline-builds
      EOF
    }

    step {
      id     = "Run end-to-end tests"
      name   = "mcr.microsoft.com/playwright:v1.57.0-noble"
      script = <<EOF
        yarn install
        yarn nx e2e fishing-map-e2e -- --project="chromium" --no-cache
      EOF
      env = [
        "PLAYWRIGHT_BASE_URL=https://fishing-map.staging.globalfishingwatch.org/",
        "TEST_USER_EMAIL=francisco.pacio+testing@globalfishingwatch.org",
        "TEST_USER_PASSWORD=GlobalFishingWatch123!",
        "BASIC_AUTH_USER=gfw-fish"
      ]
      secret_env    = ["BASIC_AUTH_PASS"]
      allow_failure = true
    }

    step {
      id   = "Upload test artifacts"
      name = "gcr.io/cloud-builders/gsutil"
      args = ["-m", "cp", "-r", "apps/fishing-map-e2e/test-results", "apps/fishing-map-e2e/playwright-report", "gs://gfw-cloudbuild-artifacts-ttl30/frontend/e2e-tests/$BUILD_ID/"]
    }

    step {
      id         = "Print report link"
      name       = "gcr.io/cloud-builders/gcloud"
      entrypoint = "bash"
      args = ["-c", <<EOF
      echo '📊 Playwright Report: https://storage.cloud.google.com/gfw-cloudbuild-artifacts-ttl30/frontend/e2e-tests/$BUILD_ID/playwright-report/index.html'
      echo '🗂️ Test Results: https://console.cloud.google.com/storage/browser/gfw-cloudbuild-artifacts-ttl30/frontend/e2e-tests/$BUILD_ID'
      EOF
      ]
    }

    available_secrets {
      secret_manager {
        env          = "BASIC_AUTH_PASS"
        version_name = "projects/706952489382/secrets/FISHING_MAP_BASIC_AUTH_PASS/versions/latest"
      }
    }

    options {
      logging = "CLOUD_LOGGING_ONLY"
    }

    timeout = "1800s"
  }
}

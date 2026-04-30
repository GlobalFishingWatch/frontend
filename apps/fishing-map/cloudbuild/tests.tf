locals {
  e2e_trigger_configs = {
    staging = {
      name        = "fishing-map-e2e-tests-staging"
      description = "Run end-to-end tests on main branch"
      push = {
        branch       = "^main$"
        tag          = null
        invert_regex = false
      }
      env = {
        PLAYWRIGHT_BASE_URL = "https://fishing-map.staging.globalfishingwatch.org/map"
      }
      testing_account_email    = "projects/706952489382/secrets/E2E_TEST_ACCOUNT_EMAIL_STA/versions/latest"
      testing_account_password = "projects/706952489382/secrets/E2E_TEST_ACCOUNT_PASSWORD_STA/versions/latest"
    }
    production = {
      name        = "fishing-map-e2e-tests-prod"
      description = "Run end-to-end tests on tag @gfw/fishing-map@x.x.x"
      push = {
        branch       = null
        tag          = "^@gfw/fishing-map@\\d+\\.\\d+\\.\\d+(\\.\\d+)?$"
        invert_regex = false
      }
      env = {
        PLAYWRIGHT_BASE_URL = "https://globalfishingwatch.org/map"
      }
      testing_account_email    = "projects/674016975526/secrets/E2E_TEST_ACCOUNT_EMAIL/versions/latest"
      testing_account_password = "projects/674016975526/secrets/E2E_TEST_ACCOUNT_PASSWORD/versions/latest"
    }
  }
}

resource "google_cloudbuild_trigger" "e2e_tests" {
  for_each = local.e2e_trigger_configs

  name        = each.value.name
  location    = "us-central1"
  description = each.value.description

  github {
    name  = local.repository
    owner = "GlobalFishingWatch"
    push {
      branch       = each.value.push.branch
      tag          = each.value.push.tag
      invert_regex = each.value.push.invert_regex
    }
  }

  include_build_logs = "INCLUDE_BUILD_LOGS_WITH_STATUS"
  service_account    = "projects/gfw-int-infrastructure/serviceAccounts/cloudbuild@gfw-int-infrastructure.iam.gserviceaccount.com"

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
        "PLAYWRIGHT_BASE_URL=${each.value.env.PLAYWRIGHT_BASE_URL}",
        "BASIC_AUTH_USER=gfw-fish"
      ]
      secret_env = [
        "BASIC_AUTH_PASS",
        "TEST_USER_EMAIL",
        "TEST_USER_PASSWORD"
      ]
      allow_failure = true
    }

    step {
      id   = "Upload test artifacts"
      name = "gcr.io/cloud-builders/gsutil"
      args = ["-m", "cp", "-r", "apps/fishing-map-e2e/test-results", "apps/fishing-map-e2e/playwright-report", "gs://gfw-playwright-traces-ttl30/frontend/e2e-tests/$BUILD_ID/"]
    }

    step {
      id         = "Print report link"
      name       = "gcr.io/cloud-builders/gcloud"
      entrypoint = "bash"
      args = ["-c", <<EOF
      echo '📊 Playwright Report: https://storage.googleapis.com/gfw-playwright-traces-ttl30/frontend/e2e-tests/$BUILD_ID/playwright-report/index.html'

      echo '🗂️ Test Results folder: https://console.cloud.google.com/storage/browser/gfw-playwright-traces-ttl30/frontend/e2e-tests/$BUILD_ID'
      EOF
      ]
    }

    available_secrets {
      secret_manager {
        env          = "BASIC_AUTH_PASS"
        version_name = "projects/706952489382/secrets/FISHING_MAP_BASIC_AUTH_PASS/versions/latest"
      }
      secret_manager {
        env          = "TEST_USER_EMAIL"
        version_name = each.value.testing_account_email
      }
      secret_manager {
        env          = "TEST_USER_PASSWORD"
        version_name = each.value.testing_account_password
      }
    }

    options {
      logging      = "CLOUD_LOGGING_ONLY"
      machine_type = "E2_HIGHCPU_8"
    }

    timeout = "1800s"
  }
}

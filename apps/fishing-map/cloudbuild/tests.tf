resource "google_cloudbuild_trigger" "integrations_tests_on_pr" {
  name        = "fishing-map-integrations-tests"
  location    = "us-central1"
  description = "Run integrations tests on PR"

  github {
    name  = local.repository
    owner = "GlobalFishingWatch"
    pull_request {
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
      name   = "mcr.microsoft.com/playwright:v1.57.0-noble"
      script = <<EOF
        yarn install

        # Fetch origin/develop for nx affected (Cloud Build may use shallow clone)
        git fetch origin develop --depth=100 2>/dev/null || git fetch origin develop 2>/dev/null || true

        # Determine base: on develop/main use HEAD~1, else use merge base with develop
        if [ "$${BRANCH_NAME:-}" = "develop" ] || [ "$${BRANCH_NAME:-}" = "main" ]; then
          BASE="HEAD~1"
        else
          BASE=$$(git merge-base origin/develop HEAD 2>/dev/null || echo "HEAD~1")
        fi

        yarn nx affected -t test --base="$$BASE" --head=HEAD --browser="chromium"
      EOF
      env    = ["BRANCH_NAME=$$BRANCH_NAME"]
    }

    options {
      logging = "CLOUD_LOGGING_ONLY"
    }

    timeout = "1800s"
  }
}

locals {
  e2e_trigger_configs = {
    main = {
      name        = "fishing-map-e2e-tests-main"
      description = "Run end-to-end tests on main branch"
      push = {
        branch       = "^main$"
        tag          = null
        invert_regex = false
      }
      env = {
        PLAYWRIGHT_BASE_URL = "https://fishing-map.staging.globalfishingwatch.org/map"
      }
    }
    tag = {
      name        = "fishing-map-e2e-tests-tag"
      description = "Run end-to-end tests on tag @gfw/fishing-map@x.x.x"
      push = {
        branch       = null
        tag          = "^@gfw/fishing-map@\\d+\\.\\d+\\.\\d+(\\.\\d+)?$"
        invert_regex = false
      }
      env = {
        PLAYWRIGHT_BASE_URL = "https://globalfishingwatch.org/map"
      }
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
      echo '📊 Playwright Report: https://storage.googleapis.com/gfw-cloudbuild-artifacts-ttl30/frontend/e2e-tests/$BUILD_ID/playwright-report/index.html'

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

resource "google_cloudbuild_trigger" "integrations_tests_on_pr" {
  name        = "fishing-map-integrations-tests"
  location    = "us-central1"
  description = "Run integrations tests on PR"

  github {
    name  = local.repository
    owner = "GlobalFishingWatch"
    push {
      branch       = "l18n_.*"
      invert_regex = true
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
      id         = "Run integration tests"
      name       = "mcr.microsoft.com/playwright:v1.57.0-noble"
      entrypoint = "bash"
      env = [
        "NEXT_PUBLIC_API_GATEWAY=https://gateway.api.dev.globalfishingwatch.org",
        "NEXT_PUBLIC_WORKSPACE_ENV=development",
      ]
      args = ["-c", <<EOF
        set +e  # Don't exit on error

        # Skip if integration tests folder doesn't exist in this branch
        if [ ! -d "apps/fishing-map/test/integration" ]; then
          echo "No apps/fishing-map/test/integration folder found. Skipping."
          echo "## ✅ Integration Tests" > /workspace/summary.txt
          echo "" >> /workspace/summary.txt
          echo "Skipped: no \`apps/fishing-map/test/integration\` folder in source." >> /workspace/summary.txt
          echo "0" > /workspace/test-exit-code.txt
          exit 0
        fi

        # Skip native module rebuilds — binaries from Step #0 are already in
        # /workspace/node_modules and are compatible (both images are Linux x86_64)
        YARN_ENABLE_SCRIPTS=0 yarn install

        # Fetch origin/develop for nx affected (Cloud Build uses shallow clone)
        git fetch origin develop --depth=100 2>/dev/null || git fetch origin develop 2>/dev/null || true

        # Fetch current branch with depth to ensure we have history
        git fetch --depth=10 2>/dev/null || true

        # Determine base: on develop/main use origin/develop, else use merge base with develop
        if [ "$${BRANCH_NAME:-}" = "develop" ] || [ "$${BRANCH_NAME:-}" = "main" ]; then
          BASE="origin/develop~1"
        else
          BASE=$$(git merge-base origin/develop HEAD 2>/dev/null || echo "origin/develop")
        fi

        # Get list of affected projects that have a test target
        AFFECTED_PROJECTS=$$(yarn nx show projects --affected --base="$$BASE" --head=HEAD --withTarget=test 2>/dev/null \
          | grep -v "^\s*NX" | grep -v "^>" | grep -v "^yarn" | grep -v "^$")

        if [ -z "$$AFFECTED_PROJECTS" ]; then
          echo "## ✅ Integration Tests" > /workspace/summary.txt
          echo "" >> /workspace/summary.txt
          echo "No affected projects with tests found." >> /workspace/summary.txt
          echo "0" > /workspace/test-exit-code.txt
          exit 0
        fi

        OVERALL_EXIT=0

        # Run tests per project and build per-project summary sections
        > /workspace/summary-body.txt
        for PROJECT in $$AFFECTED_PROJECTS; do
          echo ""
          echo "=============================="
          echo "Running tests for: $$PROJECT"
          echo "=============================="

          yarn nx run $$PROJECT:test --browser="chromium" > /workspace/test-$$PROJECT.txt 2>&1
          PROJECT_EXIT=$$?

          cat /workspace/test-$$PROJECT.txt
          sed 's/\x1b\[[0-9;]*m//g' /workspace/test-$$PROJECT.txt > /workspace/test-$$PROJECT-clean.txt

          if [ $$PROJECT_EXIT -ne 0 ]; then
            OVERALL_EXIT=1
          fi

          # Build inline stats line from vitest output
          TESTS_INFO=$$(grep -E "^ *Tests " /workspace/test-$$PROJECT-clean.txt | tail -1 | sed 's/^ *Tests *//' | sed 's/ (.*//')
          DURATION=$$(grep -E "^ *Duration" /workspace/test-$$PROJECT-clean.txt | tail -1 | sed 's/^ *Duration *//' | sed 's/ (.*//')
          if [ -n "$$TESTS_INFO" ] && [ -n "$$DURATION" ]; then
            STATS=" · $$TESTS_INFO · $$DURATION"
          elif [ -n "$$TESTS_INFO" ]; then
            STATS=" · $$TESTS_INFO"
          else
            STATS=""
          fi

          if [ $$PROJECT_EXIT -eq 0 ]; then
            echo "**✅ \`$$PROJECT\`**$$STATS" >> /workspace/summary-body.txt
          else
            echo "**❌ \`$$PROJECT\`**$$STATS" >> /workspace/summary-body.txt
          fi
          echo "" >> /workspace/summary-body.txt
          echo "<details><summary>View output</summary>" >> /workspace/summary-body.txt
          echo "" >> /workspace/summary-body.txt
          echo "\`\`\`" >> /workspace/summary-body.txt
          cat /workspace/test-$$PROJECT-clean.txt >> /workspace/summary-body.txt
          echo "\`\`\`" >> /workspace/summary-body.txt
          echo "" >> /workspace/summary-body.txt
          echo "</details>" >> /workspace/summary-body.txt
          echo "" >> /workspace/summary-body.txt
          echo "---" >> /workspace/summary-body.txt
          echo "" >> /workspace/summary-body.txt
        done

        echo $$OVERALL_EXIT > /workspace/test-exit-code.txt

        # Build final summary with header + per-project sections
        if [ $$OVERALL_EXIT -eq 0 ]; then
          echo "## ✅ Integration Tests Passed" > /workspace/summary.txt
        else
          echo "## ❌ Integration Tests Failed" > /workspace/summary.txt
        fi
        echo "" >> /workspace/summary.txt
        cat /workspace/summary-body.txt >> /workspace/summary.txt

        exit $$OVERALL_EXIT
      EOF
      ]
      allow_failure = true
    }

    step {
      id         = "Archive the integration tests traces"
      name       = "alpine"
      entrypoint = "sh"
      args = ["-c", <<EOF
      if [ -d "apps/fishing-map/test/integration" ]; then
        tar -czf traces.tar.gz apps/fishing-map/test/integration
      else
        echo "No integration tests folder found. Skipping archive."
      fi
      EOF
      ]
    }

    step {
      id         = "Upload tests traces"
      name       = "gcr.io/cloud-builders/gsutil"
      entrypoint = "bash"
      args = ["-c", <<EOF
      if [ -f "traces.tar.gz" ]; then
        gsutil -m cp -r traces.tar.gz gs://gfw-playwright-traces-ttl30/frontend/integration-tests/$BUILD_ID/
      else
        echo "No traces archive found. Skipping upload."
      fi
      EOF
      ]
    }

    step {
      id         = "Print traces link"
      name       = "gcr.io/cloud-builders/gcloud"
      entrypoint = "bash"
      args = ["-c", <<EOF
      echo '📊 Integration Tests Traces: https://storage.googleapis.com/gfw-playwright-traces-ttl30/frontend/integration-tests/$BUILD_ID/traces.tar.gz'
      EOF
      ]
    }

    step {
      id         = "create-token"
      name       = "alpine"
      wait_for   = ["Run integration tests"]
      entrypoint = "sh"
      args = ["-c", <<EOF
        set -eu
        if [ $BRANCH_NAME = 'main' ]; then
          exit 0
        fi
        apk add --no-cache openssl curl jq >/dev/null 2>&1

        client_id=$_APP_ID
        pem="$$GITHUB_BOT_PRIVATE_KEY"

        # If the env var contains the PEM text instead of a file path, write it to a temp file
        case "$$pem" in
          *"BEGIN RSA PRIVATE KEY"*|*"BEGIN PRIVATE KEY"*)
            pem_file=$$(mktemp)
            echo "$$pem" | sed 's/\\n/\n/g' > "$$pem_file"
            ;;
          *)
            pem_file="$$pem"
            ;;
        esac

        now=$$(date +%s)
        iat=$$((now - 60))  # Issued 60s ago
        exp=$$((now + 600)) # Expires in 10 minutes

        b64enc() { openssl base64 -A | tr '+/' '-_' | tr -d '='; }

        header_json='{"typ":"JWT","alg":"RS256"}'
        header=$$(echo -n "$$header_json" | b64enc)

        payload_json="{\"iat\":$${iat},\"exp\":$${exp},\"iss\":\"$${client_id}\"}"
        payload=$$(echo -n "$$payload_json" | b64enc)

        header_payload="$$header.$$payload"

        signature=$$(echo -n "$$header_payload" \
          | openssl dgst -sha256 -sign "$$pem_file" \
          | b64enc)
        JWT="$$header_payload.$$signature"


        printf 'JWT: %s\n' "$$JWT"
        TOKEN_RESPONSE=$$(curl -s -X POST \
          -H "Authorization: Bearer $$JWT" \
          -H "Accept: application/vnd.github+json" \
          "https://api.github.com/app/installations/$_INSTALLATION_ID/access_tokens"
        )
        TOKEN=$(echo "$$TOKEN_RESPONSE" | jq -r '.token')
        echo "$$TOKEN" > /workspace/token.txt
        printf 'TOKEN: %s\n' "$$TOKEN"
      EOF
      ]
      secret_env = ["GITHUB_BOT_PRIVATE_KEY"]
    }

    step {
      id         = "find-and-comment-pr"
      name       = "alpine"
      wait_for   = ["create-token"]
      entrypoint = "sh"
      args = ["-c", <<EOF
        set -euo pipefail
        if [ $BRANCH_NAME = 'main' ]; then
          exit 0
        fi
        echo "Installing curl and jq..."
        apk add --no-cache curl jq >/dev/null 2>&1
        echo "Looking for PR associated with branch: $BRANCH_NAME"

        GITHUB_TOKEN=$$(cat /workspace/token.txt)

        # Find PR number
        PR_NUMBER=$$(curl -s -H "Authorization: token $$GITHUB_TOKEN" \
          "https://api.github.com/repos/$_REPO_OWNER/$_REPO_NAME/pulls?state=open&head=$_REPO_OWNER:$BRANCH_NAME" \
          | jq -r '.[0].number // empty')

        if [ -z "$$PR_NUMBER" ]; then
          echo "No open PR found for branch '$BRANCH_NAME'. Skipping PR comment."
          exit 0
        fi

        echo "PR found: #$$PR_NUMBER"

        # Prepare comment body
        echo "" >> /workspace/summary.txt
        echo "📊 Integration Tests Traces [here](https://storage.googleapis.com/gfw-playwright-traces-ttl30/frontend/integration-tests/$BUILD_ID/traces.tar.gz)" >> /workspace/summary.txt
        COMMENT_MARKER="<!-- integration-tests-bot-comment -->"
        FOOTER="Posted by [this build](https://console.cloud.google.com/cloud-build/builds;region=us-central1/$BUILD_ID?project=gfw-int-infrastructure)"
        jq -n --rawfile summary /workspace/summary.txt --arg footer "$$FOOTER" --arg marker "$$COMMENT_MARKER" \
          '{body: ($$marker + "\n" + $$summary + "\n\n" + $$footer)}' > /tmp/payload.json

        # Search for existing bot comment
        echo "Searching for existing bot comment..."
        EXISTING_COMMENT_ID=$$(curl -s -H "Authorization: token $$GITHUB_TOKEN" \
          "https://api.github.com/repos/$_REPO_OWNER/$_REPO_NAME/issues/$$PR_NUMBER/comments" \
          | jq -r ".[] | select(.body | contains(\"$$COMMENT_MARKER\")) | .id" | head -1)

        if [ -n "$$EXISTING_COMMENT_ID" ]; then
          echo "Found existing comment ID: $$EXISTING_COMMENT_ID. Updating..."
          curl -s -X PATCH \
               -H "Authorization: token $$GITHUB_TOKEN" \
               -H "Content-Type: application/json" \
               -d @/tmp/payload.json \
               "https://api.github.com/repos/$_REPO_OWNER/$_REPO_NAME/issues/comments/$$EXISTING_COMMENT_ID"
          echo "Comment updated!"
        else
          echo "No existing comment found. Creating new comment..."
          curl -s -X POST \
               -H "Authorization: token $$GITHUB_TOKEN" \
               -H "Content-Type: application/json" \
               -d @/tmp/payload.json \
               "https://api.github.com/repos/$_REPO_OWNER/$_REPO_NAME/issues/$$PR_NUMBER/comments"
          echo "Comment created!"
        fi
      EOF
      ]
    }

    available_secrets {
      secret_manager {
        env          = "GITHUB_BOT_PRIVATE_KEY"
        version_name = "projects/gfw-int-infrastructure/secrets/GITHUB_BOT_PRIVATE_KEY/versions/latest"
      }
    }

    substitutions = {
      _INSTALLATION_ID = "9051610"
      _APP_ID          = "65572"
      _REPO_OWNER      = "GlobalFishingWatch"
      _REPO_NAME       = "frontend"
    }


    options {
      logging      = "CLOUD_LOGGING_ONLY"
      machine_type = "E2_HIGHCPU_8"
    }

    timeout = "1800s"
  }
}

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

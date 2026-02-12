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
      id         = "Run integration tests"
      name       = "mcr.microsoft.com/playwright:v1.57.0-noble"
      entrypoint = "bash"
      args = ["-c", <<EOF
        set +e  # Don't exit on error
        
        yarn install

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

        # Run tests, save output to file, and capture exit code
        yarn nx affected -t test --base="$$BASE" --head=HEAD --browser="chromium" > /workspace/test-output.txt 2>&1
        echo $$? > /workspace/test-exit-code.txt
        
        # Display the output
        cat /workspace/test-output.txt

        # Strip ANSI color codes from output for clean parsing
        sed 's/\x1b\[[0-9;]*m//g' /workspace/test-output.txt > /workspace/test-output-clean.txt

        # Generate detailed summary for PR comment
        EXIT_CODE=$$(cat /workspace/test-exit-code.txt)
        
        if [ $$EXIT_CODE -eq 0 ]; then
          echo "## ✅ Integration Tests Passed" > /workspace/summary.txt
          echo "" >> /workspace/summary.txt
          
          # Extract test summary if available
          if grep -q "Test Suites:" /workspace/test-output-clean.txt; then
            echo "\`\`\`" >> /workspace/summary.txt
            grep -E "Test Suites:|Tests:|Time:" /workspace/test-output-clean.txt | tail -3 >> /workspace/summary.txt
            echo "\`\`\`" >> /workspace/summary.txt
          fi
        else
          echo "## ❌ Integration Tests Failed" > /workspace/summary.txt
          echo "" >> /workspace/summary.txt
          
          # Extract test summary statistics
          if grep -q "Test Suites:" /workspace/test-output-clean.txt; then
            echo "### Summary" >> /workspace/summary.txt
            echo "\`\`\`" >> /workspace/summary.txt
            grep -E "Test Suites:|Tests:|Time:" /workspace/test-output-clean.txt | tail -3 >> /workspace/summary.txt
            echo "\`\`\`" >> /workspace/summary.txt
            echo "" >> /workspace/summary.txt
          fi
          
          # Extract failed tests with context
          echo "### Failed Tests" >> /workspace/summary.txt
          echo "" >> /workspace/summary.txt
          
          # Extract failed test names (look for FAIL lines and test suite names)
          grep "FAIL" /workspace/test-output-clean.txt | sed 's/^[ \t]*//' | head -20 | while read -r line; do
            echo "- \`$$line\`" >> /workspace/summary.txt
          done
          
          echo "" >> /workspace/summary.txt
          echo "<details>" >> /workspace/summary.txt
          echo "<summary>Error Details</summary>" >> /workspace/summary.txt
          echo "" >> /workspace/summary.txt
          echo "\`\`\`" >> /workspace/summary.txt
          
          # Extract error messages with better filtering
          grep -E "AssertionError|Error:|Expected|Received" /workspace/test-output-clean.txt | head -30 >> /workspace/summary.txt || echo "No specific error details found. See build logs for full output." >> /workspace/summary.txt
          
          echo "\`\`\`" >> /workspace/summary.txt
          echo "</details>" >> /workspace/summary.txt
        fi
        
        # Exit with the captured code
        exit $$(cat /workspace/test-exit-code.txt)
      EOF
      ]
      allow_failure = true
    }

    step {
      id         = "create-token"
      name       = "ubuntu"
      entrypoint = "bash"
      args = ["-c", <<EOF
        set -euo pipefail
        if [ $BRANCH_NAME = 'main' ]; then
          exit 0
        fi  
        apt-get update -y && apt-get install -y openssl curl jq

        client_id=$_APP_ID
        pem="$$GITHUB_BOT_PRIVATE_KEY"

        # If the env var contains the PEM text instead of a file path, write it to a temp file
        if [[ "$$pem" == *"BEGIN RSA PRIVATE KEY"* ]] || [[ "$$pem" == *"BEGIN PRIVATE KEY"* ]]; then
          pem_file=$$(mktemp)
          echo "$$pem" | sed 's/\\n/\n/g' > "$$pem_file"
        else
          pem_file="$$pem"
        fi

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
      entrypoint = "sh"
      args = ["-c", <<EOF
        set -euo pipefail
        if [ $BRANCH_NAME = 'main' ]; then
          exit 0
        fi  
        echo "Installing curl and jq..."
        apk add --no-cache curl jq >/dev/null 2>&1
        echo "Looking for PR associated with branch: $BRANCH_NAME"
        # Try direct lookup using head=owner:branch (works when PR comes from same repo)
        GITHUB_TOKEN=$$(cat /workspace/token.txt)
        PR_NUMBER=$$(curl -s -H "Authorization: token $$GITHUB_TOKEN" \
          "https://api.github.com/repos/$_REPO_OWNER/$_REPO_NAME/pulls?state=open&head=$_REPO_OWNER:$BRANCH_NAME" \
          | jq -r '.[0].number // empty')
        if [ -z "$$PR_NUMBER" ]; then
          echo "No open PR found for branch '$BRANCH_NAME'. Skipping PR comment."
          exit 0
        fi
        echo "PR found: #$$PR_NUMBER"
        # Prepare comment body (escape double quotes)
        FOOTER="Posted by [this build](https://console.cloud.google.com/cloud-build/builds;region=us-central1/$BUILD_ID?project=gfw-int-infrastructure)"
        jq -n --rawfile summary /workspace/summary.txt --arg footer "$$FOOTER" '{body: ($$summary + "\n\n" + $$footer)}' > /tmp/payload.json
        echo "Posting comment to PR #$$PR_NUMBER..."
        echo "Payload:"
        cat /tmp/payload.json
        curl -s -H "Authorization: token $$GITHUB_TOKEN" \
             -H "Content-Type: application/json" \
             -d @/tmp/payload.json \
             "https://api.github.com/repos/$_REPO_OWNER/$_REPO_NAME/issues/$$PR_NUMBER/comments"
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

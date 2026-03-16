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
      id         = "Notify about workflow running"
      name       = "alpine"
      entrypoint = "sh"
      args = ["-c", <<EOF
        set -euo pipefail
        [ "$BRANCH_NAME" = "main" ] && exit 0
        apk add --no-cache openssl curl jq >/dev/null 2>&1

        # --- Generate GitHub App token ---
        b64enc() { openssl base64 -A | tr '+/' '-_' | tr -d '='; }

        pem_file=$$(mktemp)
        echo "$$GITHUB_BOT_PRIVATE_KEY" | sed 's/\\n/\n/g' > "$$pem_file"

        now=$$(date +%s)
        header=$$(echo -n '{"typ":"JWT","alg":"RS256"}' | b64enc)
        payload=$$(printf '{"iat":%d,"exp":%d,"iss":"%s"}' $$((now - 60)) $$((now + 540)) "$_APP_ID" | b64enc)
        signature=$$(echo -n "$$header.$$payload" | openssl dgst -sha256 -sign "$$pem_file" | b64enc)

        GITHUB_TOKEN_RESPONSE=$$(curl -s -X POST \
          -H "Authorization: Bearer $$header.$$payload.$$signature" \
          -H "Accept: application/vnd.github+json" \
          "https://api.github.com/app/installations/$_INSTALLATION_ID/access_tokens")

        echo "GitHub API response: $$GITHUB_TOKEN_RESPONSE"
        GITHUB_TOKEN=$$(echo "$$GITHUB_TOKEN_RESPONSE" | jq -r '.token')

        echo "$$GITHUB_TOKEN" > /workspace/token.txt

        if [ -z "$$GITHUB_TOKEN" ] || [ "$$GITHUB_TOKEN" = "null" ]; then
          echo "Failed to generate GitHub token"
          exit 1
        fi

        # --- Find PR for this branch ---
        PR_NUMBER=$$(curl -s \
          -H "Authorization: token $$GITHUB_TOKEN" \
          "https://api.github.com/repos/$_REPO_OWNER/$_REPO_NAME/pulls?state=open&head=$_REPO_OWNER:$BRANCH_NAME" \
          | jq -r 'if type == "array" then .[0].number // empty else empty end')

        if [ -z "$$PR_NUMBER" ]; then
          echo "No PR found for '$BRANCH_NAME'. Skipping."
          exit 0
        fi
        echo "PR found: #$$PR_NUMBER"

        # --- Post or update PR comment ---
        MARKER="<!-- integration-tests-bot-comment -->"
        echo "## Integration tests are running... 🧪" > /tmp/comment.txt
        FOOTER="Posted by [this build](https://console.cloud.google.com/cloud-build/builds;region=us-central1/$BUILD_ID?project=gfw-int-infrastructure)"
        jq -n --rawfile summary /tmp/comment.txt --arg footer "$$FOOTER" --arg marker "$$MARKER" \
          '{body: ($$marker + "\n" + $$summary + "\n\n" + $$footer)}' > /tmp/payload.json

        COMMENT_ID=$$(curl -s \
          -H "Authorization: token $$GITHUB_TOKEN" \
          "https://api.github.com/repos/$_REPO_OWNER/$_REPO_NAME/issues/$$PR_NUMBER/comments" \
          | jq -r ".[] | select(.body | contains(\"$$MARKER\")) | .id" | head -1)

        if [ -n "$$COMMENT_ID" ]; then
          curl -s -X PATCH -H "Authorization: token $$GITHUB_TOKEN" -H "Content-Type: application/json" \
            -d @/tmp/payload.json \
            "https://api.github.com/repos/$_REPO_OWNER/$_REPO_NAME/issues/comments/$$COMMENT_ID" > /dev/null
          echo "Updated comment $$COMMENT_ID"
        else
          curl -s -X POST -H "Authorization: token $$GITHUB_TOKEN" -H "Content-Type: application/json" \
            -d @/tmp/payload.json \
            "https://api.github.com/repos/$_REPO_OWNER/$_REPO_NAME/issues/$$PR_NUMBER/comments" > /dev/null
          echo "Created new comment"
        fi
      EOF
      ]
      secret_env = ["GITHUB_BOT_PRIVATE_KEY"]
    }

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
      id   = "Run integration tests"
      name = "mcr.microsoft.com/playwright:v1.58.2-noble"
      env = [
        "NEXT_PUBLIC_API_GATEWAY=https://gateway.api.dev.globalfishingwatch.org",
        "NEXT_PUBLIC_WORKSPACE_ENV=development",
        "CI=1",
        "NX_DAEMON=false",
        "NODE_OPTIONS=--trace-warnings",
      ]
      secret_env = [
        "TEST_USER_EMAIL",
        "TEST_USER_PASSWORD"
      ]
      script        = <<EOF
#!/bin/bash

git fetch origin develop --depth=100

# Run tests only for affected projects
yarn nx affected \
  --target test \
  --base=origin/develop \
  --head=HEAD \
  | tee integration-tests-output

# Parse the tests output to create a Github Comment

cat integration-tests-output | sed 's/\x1b\[[0-9;]*[a-zA-Z]//g; s/\x1b\[[?][0-9]*[a-zA-Z]//g' | awk '
  function flush() {
    if (target != "" && is_test) {
      status = (failed ? "❌" : "✅")
      printf "<details>\n<summary>%s %s</summary>\n\n```\n%s\n```\n\n</details>\n\n", status, target, output
      if (failed) fail_count++; else pass_count++
    }
  }
  BEGIN { print "## Test Results\n" }
  /^> nx run /{
    flush()
    target = $4
    is_test = ($4 ~ /:test$/)
    output = ""
    failed = 0
  }
  is_test {
    output = (output == "" ? $0 : output "\n" $0)
    if (/Unhandled Error/ || /exited with non-zero/ || /exiting with code 1/) failed = 1
  }
  END {
    flush()
    if (pass_count == 0 && fail_count == 0) {
      printf "---\n**Summary:** No tests were ran\n"
    } else {
      printf "---\n**Summary:** %d passed, %d failed\n", pass_count, fail_count
    }
  }
' > /workspace/summary.txt
EOF
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
        exp=$$((now + 540)) # Expires in 9 minutes (buffer for clock skew)

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
      secret_manager {
        env          = "TEST_USER_EMAIL"
        version_name = "projects/706952489382/secrets/E2E_TEST_ACCOUNT_EMAIL/versions/latest"
      }
      secret_manager {
        env          = "TEST_USER_PASSWORD"
        version_name = "projects/706952489382/secrets/E2E_TEST_ACCOUNT_PASSWORD/versions/latest"
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
      name   = "mcr.microsoft.com/playwright:v1.58.2-noble"
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

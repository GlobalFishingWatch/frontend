provider "google" {
  project = "gfw-int-infrastructure"
}

locals {
  repository = "frontend"
  location   = "us-central1"
  project    = "gfw-int-infrastructure"
  cache_env = [
    "PROJECT=${local.project}",
    "REPOSITORY=${local.repository}",
    "LOCATION=${local.location}"
  ]
  secrets_path = "projects/461136692125/secrets"
}

resource "google_cloudbuild_trigger" "i18n-labels-stable" {
  name        = "ui-libs-i18n-labels-stable"
  description = "Promote latest version of i18n-labels to stable"
  tags        = ["frontend"]
  project     = local.project
  location    = local.location

  github {
    owner = "GlobalFishingWatch"
    name  = "frontend"
    push {
      branch = "^main$"
    }
  }

  service_account = "projects/${local.project}/serviceAccounts/cloudbuild@gfw-int-infrastructure.iam.gserviceaccount.com"
  build {

    step {
      id         = "Setup Auth and Publish Stable"
      name       = "us-central1-docker.pkg.dev/gfw-int-infrastructure/frontend/dependencies:latest"
      script     = <<-EOF
        cd /app/
        cp -r /workspace/* .
        
        echo "--- Publishing i18n-labels stable ---"

        echo "//registry.npmjs.org/:_authToken=$$NODE_AUTH_TOKEN" > .npmrc
        npx nx run i18n-labels:"publish:stable"

        echo "--- Purging i18n-labels stable ---"
        apt-get update && apt install curl -y
        npx nx run i18n-labels:"purge:stable"

      EOF
      secret_env = ["NODE_AUTH_TOKEN"]
      env = [
        "NX_CLOUD_AUTH_TOKEN=$_NX_CLOUD_AUTH_TOKEN"
      ]
    }

    options {
      logging = "CLOUD_LOGGING_ONLY"
    }

    available_secrets {
      secret_manager {
        version_name = "${local.secrets_path}/NPM_TOKEN/versions/latest"
        env          = "NODE_AUTH_TOKEN"
      }
    }

    timeout = "1800s"
  }
}

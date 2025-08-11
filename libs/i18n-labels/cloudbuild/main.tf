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
      id         = "compute-cache-key"
      name       = "gcr.io/cloud-builders/gcloud"
      entrypoint = "bash"
      args = [
        "-c",
        "echo $(sha256sum yarn.lock | cut -d' ' -f1) > /workspace/cache-key"
      ]
      wait_for = ["-"]
    }

    step {
      id       = "restore-cache"
      name     = "gcr.io/cloud-builders/gcloud"
      script   = file("../../../cloudbuild-template/scripts/restore-cache.sh")
      wait_for = ["compute-cache-key"]
      env      = local.cache_env
    }

    step {
      id       = "install-yarn"
      name     = "node:24"
      script   = file("../../../cloudbuild-template/scripts/install-yarn.sh")
      wait_for = ["restore-cache"]
    }

    step {
      id         = "setup auth to npmjs"
      name       = "node:24"
      entrypoint = "bash"
      args = [
        "-c",
        "echo \"//registry.npmjs.org/:_authToken=$$NODE_AUTH_TOKEN\" > .npmrc"
      ]
      wait_for   = ["install-yarn"]
      secret_env = ["NODE_AUTH_TOKEN"]
    }

    step {
      id         = "i18n-labels publish stable"
      name       = "node:24"
      entrypoint = "npx"
      args       = ["nx", "publish:stable", "i18n-labels"]
      wait_for   = ["setup auth to npmjs"]
      env = [
        "NX_CLOUD_AUTH_TOKEN=$_NX_CLOUD_AUTH_TOKEN"
      ]
    }

    step {
      id         = "i18n-labels purge stable"
      name       = "node:24"
      entrypoint = "npx"
      args       = ["nx", "purge:stable", "i18n-labels"]
      wait_for   = ["i18n-labels publish stable"]
      env = [
        "NX_CLOUD_AUTH_TOKEN=$_NX_CLOUD_AUTH_TOKEN"
      ]
    }

    step {
      id       = "save-cache"
      name     = "gcr.io/cloud-builders/gcloud"
      script   = file("../../../cloudbuild-template/scripts/save-cache.sh")
      wait_for = ["i18n-labels purge stable"]
      env      = local.cache_env
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

    timeout = "1200s"
  }
}

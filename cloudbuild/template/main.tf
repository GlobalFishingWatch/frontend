locals {
  repository = "frontend-dependencies-cache"
  location   = "us-central1"
  project    = "gfw-int-infrastructure"
  cache_env = [
    "PROJECT=${local.project}",
    "REPOSITORY=${local.repository}",
    "LOCATION=${local.location}"
  ]
}

resource "google_cloudbuild_trigger" "ui-trigger-affected" {
  name        = "ui-trigger-affected-${var.short_environment}"
  description = "Install and cache dependencies, then deploy affected apps"
  tags        = ["frontend"]
  project     = local.project
  location    = local.location

  github {
    owner = "GlobalFishingWatch"
    name  = "frontend"
    push {
      branch = "^${var.branch_name}$"
    }
  }

  service_account = "projects/${local.project}/serviceAccounts/cloudbuild@gfw-int-infrastructure.iam.gserviceaccount.com"
  build {
    step {
      id   = "Fetch"
      name = "gcr.io/cloud-builders/git"
      args = ["fetch", "--unshallow", "--no-tags"]
    }

    step {
      id     = "Get Affected"
      name   = "node:24-slim"
      script = file("${path.module}/scripts/affected-apps.sh")
    }

    step {
      id     = "Deploy to Cloud Run"
      name   = "gcr.io/cloud-builders/gcloud"
      script = file("${path.module}/scripts/deploy-cloud-run.sh")
      env = [
        "BRANCH=${var.branch_name}",
        "SHORT_ENV=${var.short_environment}",
        "LOCATION=${local.location}"
      ]
    }

    options {
      logging = "CLOUD_LOGGING_ONLY"
    }

    timeout = "1800s"
  }
}

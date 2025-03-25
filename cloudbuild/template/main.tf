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
      id       = "fetch"
      name     = "gcr.io/cloud-builders/git"
      args     = ["fetch", "--unshallow", "--no-tags"]
      wait_for = ["-"]
    }

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
      script   = file("../cloudbuild-template/scripts/restore-cache.sh")
      wait_for = ["compute-cache-key"]
      env      = local.cache_env
    }

    step {
      id       = "install-yarn"
      name     = "node:23"
      script   = file("../cloudbuild-template/scripts/install-yarn.sh")
      wait_for = ["restore-cache"]
    }

    step {
      id       = "get-affected"
      name     = "node:23"
      script   = file("${path.module}/scripts/affected-apps.sh")
      wait_for = ["install-yarn"]
    }

    step {
      id       = "deploy-cloud-run"
      name     = "gcr.io/cloud-builders/gcloud"
      script   = file("${path.module}/scripts/deploy-cloud-run.sh")
      wait_for = ["get-affected"]
      env = [
        "SHORT_ENV=${var.short_environment}"
      ]
    }

    step {
      id       = "save-cache"
      name     = "gcr.io/cloud-builders/gcloud"
      script   = file("../cloudbuild-template/scripts/save-cache.sh")
      wait_for = ["install-yarn"]
      env      = local.cache_env
    }

    options {
      logging = "CLOUD_LOGGING_ONLY"
    }

    timeout = "1200s"
  }
}

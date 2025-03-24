resource "google_cloudbuild_trigger" "ui-trigger-affected-dev" {
  name        = "ui-trigger-affected-dev"
  description = "Install and cache dependencies, then deploy affected apps"
  tags        = ["frontend"]
  project     = "gfw-int-infrastructure"
  location    = "us-central1"

  github {
    owner = "GlobalFishingWatch"
    name  = "frontend"
    push {
      branch = "^develop$"
    }
  }

  service_account = "projects/gfw-int-infrastructure/serviceAccounts/cloudbuild@gfw-int-infrastructure.iam.gserviceaccount.com"
  build {

    step {
      id       = "fetch"
      name     = "gcr.io/cloud-builders/git"
      args     = ["fetch", "--unshallow", "--no-tags"]
      wait_for = ["-"]
    }

    step {
      id       = "restore_cache"
      name     = "us-central1-docker.pkg.dev/gfw-int-infrastructure/frontend/restore_cache:latest-prod"
      script   = file("../cloudbuild-template/scripts/restore_cache.sh")
      wait_for = ["-"]
    }


    step {
      id       = "install-yarn"
      name     = "node:21"
      script   = file("../cloudbuild-template/scripts/install_yarn.sh")
      wait_for = ["restore_cache"]
    }

    step {
      id       = "save_cache"
      name     = "us-central1-docker.pkg.dev/gfw-int-infrastructure/frontend/restore_cache:latest-prod"
      script   = file("../cloudbuild-template/scripts/save_cache.sh")
      wait_for = ["install-yarn"]
    }

    step {
      id         = "get-affected"
      name       = "node:21"
      entrypoint = "yarn"
      args       = ["affected"]
    }

    step {
      id       = "deploy-cloud-run"
      name     = "gcr.io/cloud-builders/gcloud"
      script   = file("./scripts/deploy-cloud-run.sh")
      wait_for = ["get-affected"]
    }

    options {
      logging      = "CLOUD_LOGGING_ONLY"
      machine_type = "E2_HIGHCPU_8"
    }

    timeout = "1200s"
  }
}

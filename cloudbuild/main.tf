resource "google_cloudbuild_trigger" "ui-trigger-affected-dev" {
  name     = "ui-trigger-affected-dev"
  location = "us-central1"


  github {
    name  = "frontend"
    owner = "GlobalFishingWatch"
    push {
      tag          = "^develop$"
      invert_regex = false
    }
  }

  service_account = "projects/gfw-int-infrastructure/serviceAccounts/cloudbuild@gfw-int-infrastructure.iam.gserviceaccount.com"
  build {

    step {
      id   = "fetch"
      name = "gcr.io/cloud-builders/git"
      args = [
        "fetch", "--unshallow", "--no-tags"
      ]
      wait_for = ["-"]
    }

    step {
      id       = "restore_cache"
      name     = "gcr.io/gfw-int-infrastructure/restore_cache" # Todo: This image is not yet in the registry
      script   = file("./scripts/restore_cache.sh")
      wait_for = ["-"]
    }


    step {
      id       = "install-yarn"
      name     = "node:21"
      script   = file("./scripts/install_yarn.sh")
      wait_for = ["restore_cache"]
    }

    step {
      id       = "save_cache"
      name     = "gcr.io/gfw-int-infrastructure/restore_cache" # Todo: This image is not yet in the registry
      script   = file("./scripts/save_cache.sh")
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

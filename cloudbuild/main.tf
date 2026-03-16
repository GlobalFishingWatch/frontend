provider "google" {
  project = "gfw-int-infrastructure"
}

module "develop" {
  source            = "./template"
  short_environment = "dev"
  branch_name       = "develop"
}

module "staging" {
  source            = "./template"
  short_environment = "sta"
  branch_name       = "main"
}

resource "google_cloudbuild_trigger" "dependencies-base-image-trigger" {
  name        = "build-dependencies-frontend"
  description = "Update the base image that has all dependencies."
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

  included_files = [
    "package.json",
    "yarn.lock",
    ".yarnrc.yml",
    ".yarn/releases/**",
    "Dockerfile",
    "cloudbuild/affected-nx.package.json"
  ]

  service_account = "projects/gfw-int-infrastructure/serviceAccounts/cloudbuild@gfw-int-infrastructure.iam.gserviceaccount.com"
  build {

    step {
      id   = "Build Docker Image"
      name = "gcr.io/cloud-builders/docker"
      args = [
        "build",
        "-t",
        "$_IMAGE_NAME:$_TAG_NAME",
        "--target",
        "deps",
        "."
      ]
    }

    step {
      id   = "Push Image to Registry"
      name = "gcr.io/cloud-builders/docker"
      args = [
        "push",
        "$_IMAGE_NAME:$_TAG_NAME"
      ]
    }

    step {
      id   = "Build Affected Nx Image"
      name = "gcr.io/cloud-builders/docker"
      args = [
        "build",
        "-t",
        "$_AFFECTED_NX_IMAGE_NAME:$_TAG_NAME",
        "--target",
        "affected-nx",
        "."
      ]
    }

    step {
      id   = "Push Affected Nx Image to Registry"
      name = "gcr.io/cloud-builders/docker"
      args = [
        "push",
        "$_AFFECTED_NX_IMAGE_NAME:$_TAG_NAME"
      ]
    }

    options {
      logging               = "CLOUD_LOGGING_ONLY"
      machine_type          = "E2_HIGHCPU_8"
      dynamic_substitutions = true
    }

    substitutions = {
      _IMAGE_NAME             = "us-central1-docker.pkg.dev/gfw-int-infrastructure/frontend/dependencies"
      _AFFECTED_NX_IMAGE_NAME = "us-central1-docker.pkg.dev/gfw-int-infrastructure/frontend/affected-nx"
      _TAG_NAME               = "latest"
    }

    timeout = "1800s"
  }
}

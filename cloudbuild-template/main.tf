locals {
  location         = "us-central1"
  project          = "gfw-int-infrastructure"
  ui_name          = "ui-${var.app_name}"
  cloudrun_name    = "${var.short_environment != "pro" ? "${var.short_environment}-" : ""}${local.ui_name}"
  cache_repository = "frontend-dependencies-cache"
  cache_env = [
    "PROJECT=${local.project}",
    "REPOSITORY=${local.cache_repository}",
    "LOCATION=${local.location}"
  ]
}

resource "google_cloudbuild_trigger" "trigger" {
  name        = "${local.ui_name}-${var.short_environment}"
  location    = local.location
  description = var.description


  dynamic "github" {
    for_each = var.push_config.tag != null ? [var.push_config] : []
    content {
      name  = "frontend"
      owner = "GlobalFishingWatch"
      push {
        tag          = github.value.tag
        invert_regex = github.value.invert_regex
      }
    }
  }

  dynamic "source_to_build" {
    for_each = var.push_config.branch != null ? [var.push_config] : []
    content {
      uri       = "https://github.com/GlobalFishingWatch/frontend"
      ref       = "refs/heads/${source_to_build.value.branch}"
      repo_type = "GITHUB"
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
      script   = file("${path.module}/scripts/restore-cache.sh")
      wait_for = ["compute-cache-key"]
      env      = local.cache_env
    }

    step {
      id       = "install-yarn"
      name     = "node:23"
      script   = file("${path.module}/scripts/install-yarn.sh")
      wait_for = ["restore-cache"]
    }

    step {
      id       = "build-app"
      name     = "node:23"
      script   = "yarn nx run ${var.app_name}:build --parallel"
      wait_for = ["install-yarn"]
      env      = var.set_env_vars_build
    }

    step {
      id       = "build-image"
      name     = "gcr.io/kaniko-project/executor:debug"
      wait_for = ["build-app"]
      args = [
        "--destination=${var.docker_image}",
        "--build-arg", "APP_NAME=${var.app_name}",
        "--target", "production",
        "-f", "./apps/${var.app_name}/Dockerfile",
        "-c", "./dist/apps/${var.app_name}",
      ]
    }

    step {
      id   = "deploy-cloud-run"
      name = "gcr.io/cloud-builders/gcloud"
      args = [
        "run",
        "deploy",
        "${local.cloudrun_name}",
        "--project",
        "${var.project_id}",
        "--image",
        "${var.docker_image}",
        "--region",
        "us-central1",
        "--allow-unauthenticated",
        "--platform",
        "managed",
        "--set-env-vars",
        "${join(",", var.set_env_vars)}",
        "${length(var.set_secrets) > 0 ? "--set-secrets=${join(",", var.set_secrets)}" : "--clear-secrets"}",
        "--service-account", "${var.service_account}",
        "--labels", "${join(",", [for k, v in var.labels : "${k}=${v}"])}",
      ]
    }

    step {
      id       = "save-cache"
      name     = "gcr.io/cloud-builders/gcloud"
      script   = file("${path.module}/scripts/save-cache.sh")
      wait_for = ["install-yarn"]
      env      = local.cache_env
    }

    step {
      id         = "clean revisions"
      name       = "gcr.io/cloud-builders/gcloud"
      entrypoint = "bash"
      args = [
        "-c",
        <<-EOF
          gcloud --project ${var.project_id} \
           run revisions list --service ${local.cloudrun_name} --region us-central1 \
           --format="value(metadata.name)" \
           --sort-by="~metadata.creationTimestamp" | tail -n +4 | xargs -n1 \
            -r gcloud --project ${var.project_id} run revisions delete --quiet --region us-central1
        EOF
      ]
    }


    options {
      logging = "CLOUD_LOGGING_ONLY"
    }

    timeout = "1200s"
  }
}

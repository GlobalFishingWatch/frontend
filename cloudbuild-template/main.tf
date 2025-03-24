locals {
  ui_name       = "ui-${var.app_name}"
  cloudrun_name = "${var.short_environment != "pro" ? "${var.short_environment}-" : ""}${local.ui_name}"
}

resource "google_cloudbuild_trigger" "trigger" {
  name     = "${local.ui_name}-${lookup(var.push_config, "branch", "tag")}"
  location = "us-central1"


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


  service_account = "projects/gfw-int-infrastructure/serviceAccounts/cloudbuild@gfw-int-infrastructure.iam.gserviceaccount.com"
  build {

    step {
      id       = "restore_cache"
      name     = "us-central1-docker.pkg.dev/gfw-int-infrastructure/frontend/restore_cache:latest-prod" # Todo: This image is not yet in the registry
      wait_for = ["-"]
      script   = file("${path.module}/scripts/restore_cache.sh")
    }

    step {
      id       = "install-yarn"
      wait_for = ["restore_cache"]
      name     = "node:21"
      script   = file("${path.module}/scripts/install_yarn.sh")
    }

    step {
      id       = "save_cache"
      wait_for = ["install-yarn"]
      name     = "us-central1-docker.pkg.dev/gfw-int-infrastructure/frontend/restore_cache:latest-prod" # Todo: This image is not yet in the registry
      script   = file("${path.module}/scripts/save_cache.sh")
    }

    step {
      id       = "build-app"
      wait_for = ["install-yarn"]
      name     = "node:21"
      script   = "yarn nx run ${var.app_name}:build --parallel"
      env      = var.set_env_vars_build
    }

    step {
      id       = "build-image"
      wait_for = ["build-app"]
      name     = "gcr.io/kaniko-project/executor:debug"
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
        "--set-secrets",
        "${join(",", var.set_secrets)}",
        "--service-account", "${var.service_account}",
        "--labels", "${join(",", [for k, v in var.labels : "${k}=${v}"])}",
      ]

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

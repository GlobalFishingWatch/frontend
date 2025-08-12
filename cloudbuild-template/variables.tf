variable "project_id" {
  description = "The ID of the project to deploy to"
  type        = string
}

variable "description" {
  description = "The description of the trigger"
  type        = string
  default     = ""
}

variable "docker_image" {
  description = "The full path to the docker image to deploy"
  type        = string
}

variable "service_account" {
  description = "The service account to use"
  type        = string
}

variable "app_name" {
  description = "The name of the application to build and deploy"
  type        = string
}

variable "app_suffix" {
  description = "The suffix to add to the UI name"
  type        = string
  default     = ""
}

variable "short_environment" {
  description = "The short name of the environment (dev, sta, pro)"
  type        = string
}

variable "set_env_vars" {
  description = "The environment variables to set on the Cloud Run service"
  type        = list(string)
  default     = []
}

variable "set_env_vars_build" {
  description = "The environment variables to set for the build"
  type        = list(string)
  default     = []
}

variable "set_secrets" {
  description = "The environment secrets to set"
  type        = list(string)
  default     = []
}
variable "labels" {
  description = "The labels to set"
  type        = map(string)
}

variable "push_config" {
  description = "The configuration for the push trigger"
  type = object({
    branch       = optional(string)
    tag          = optional(string)
    invert_regex = optional(bool, false)
    trigger      = optional(string, "manual")
  })
  default = {}

  validation {
    condition     = var.push_config.trigger == null || contains(["manual", "tag", "branch"], var.push_config.trigger)
    error_message = "The trigger value must be one of: manual, tag, or branch."
  }
}

variable "machine_type" {
  description = "Optional Cloud Build machine type. Example: E2_HIGHCPU_8"
  type        = string
  default     = null
  validation {
    condition     = var.machine_type == null || contains(["E2_HIGHCPU_8", "E2-STANDARD-2"], var.machine_type)
    error_message = "machine_type must be one of: E2_HIGHCPU_8, E2-STANDARD-2"
  }
}


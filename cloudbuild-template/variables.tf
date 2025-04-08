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
  })
}

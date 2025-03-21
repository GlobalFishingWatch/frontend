variable "project_id" {
  description = "The project ID to deploy to"
  type        = string
}

variable "docker_image" {
  description = "The docker image to deploy"
  type        = string
}

variable "service_account" {
  description = "The service account to use"
  type        = string
}

variable "app_name" {
  description = "The name of the app"
  type        = string
}

variable "short_environment" {
  description = "The short environment (dev, staging)"
  type        = string
}

variable "set_env_vars" {
  description = "The environment variables to set in the cloud run revision"
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
  description = "The push config"
  type = object({
    branch       = optional(string)
    invert_regex = bool
    tag          = optional(string)
  })
}


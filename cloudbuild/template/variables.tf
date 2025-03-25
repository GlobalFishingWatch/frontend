variable "short_environment" {
  description = "The short name of the environment (dev, sta, pro)"
  type        = string
}

variable "branch_name" {
  description = "The name of the branch to trigger the build on"
  type        = string
}

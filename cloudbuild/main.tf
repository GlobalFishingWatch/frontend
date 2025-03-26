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


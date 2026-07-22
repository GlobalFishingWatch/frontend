provider "google" {
  project = "gfw-int-infrastructure"
}

module "staging" {
  source            = "./template"
  short_environment = "sta"
  branch_name       = "main"
}

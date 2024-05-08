variable "azurerm_resource_group_name" {
  type        = string
  default     = "srs2024-stu-g12"
  description = "Name of the resource group."
}

variable "azurerm_storage_account_name" {
  type        = string
  default     = "shodantfstorageaccount"
  description = "Name of the storage account."
}

variable "azurerm_region" {
  type        = string
  default     = "westeurope"
  description = "Azure region to deploy resources."
}

variable "azurerm_function_consumer_name" {
  type        = string
  default     = "ShodanConsumer"
  description = "Name of the function app consumer."
}

variable "project_prefix" {
  type        = string
  default     = "shodan-srs"
  description = "The prefix to use for all resources in this project."
}

variable "repo_name" {
  type        = string
  default     = "rickycraft/srs-shodan"
  description = "The name of the GitHub repository."
}

variable "docker_image_name" {
  type        = string
  default     = "shodan-srs-next:main"
  description = "The docker image to use for the web app."

}

variable "azurerm_web_app_name" {
  type        = string
  default     = "shodan-srs-next"
  description = "Name of the web app."
}

variable "shodan_api_key" {
  type        = string
  description = "Shodan API key"
  sensitive   = true
}

variable "telegram_api_key" {
  type        = string
  description = "Telegram API key"
  sensitive   = true
}

variable "sql_administrator_user" {
  type        = string
  description = "Username for the SQL administrator"
  default     = "psqladmin"
}

variable "sql_administrator_password" {
  type        = string
  description = "Password for the SQL administrator"
  sensitive   = true
}

variable "web_nextauth_secret" {
  type      = string
  default   = "NextAuthSecret for the web app"
  sensitive = true
}

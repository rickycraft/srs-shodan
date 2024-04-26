variable "azurerm_resource_group_name" {
  type        = string
  default     = "rg-student-tf"
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

variable "docker_image_name" {
  type        = string
  default     = "rickycraft/srs-shodan:main"
  description = "The docker image to use for the web app."

}

variable "azurerm_web_app_name" {
  type        = string
  default     = "shodan-srs-next"
  description = "Name of the web app."
}

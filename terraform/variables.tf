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
  default     = "germanywestcentral"
  description = "Azure region to deploy resources."
}

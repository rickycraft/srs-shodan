terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.100.0"
    }
  }

  backend "azurerm" {
    resource_group_name  = "rg-terraform-backend"
    storage_account_name = "saterraformstatebackend"
    container_name       = "terraformstate"
    key                  = "terraform.tfstate"
  }

  required_version = ">= 1.1.0"
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "rg" {
  name     = var.azurerm_resource_group_name
  location = var.azurerm_region
}

resource "azurerm_storage_account" "default" {
  name                     = var.azurerm_storage_account_name
  resource_group_name      = var.azurerm_resource_group_name
  location                 = var.azurerm_region
  account_tier             = "Standard"
  account_replication_type = "GRS"
}

resource "azurerm_service_plan" "elastic" {
  name                = "linux-elastic"
  resource_group_name = var.azurerm_resource_group_name
  location            = var.azurerm_region
  os_type             = "Linux"
  sku_name            = "Y1"
}

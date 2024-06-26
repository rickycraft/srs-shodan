terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.100.0"
    }
    null = {
      source  = "hashicorp/null"
      version = "~> 3.2.2"
    }
    http = {
      source  = "hashicorp/http"
      version = "~> 3.4.2"
    }
  }

  backend "azurerm" {
    resource_group_name  = "srs2024-stu-g12"
    storage_account_name = "saterraformstatebackend"
    container_name       = "terraformstate"
    key                  = "terraform.tfstate"
  }

  required_version = ">= 1.1.0"
}

provider "azurerm" {
  features {}
  skip_provider_registration = true
}

# resource "azurerm_resource_group" "rg" {
#   name     = var.azurerm_resource_group_name
#   location = var.azurerm_region
# }

data "azurerm_subscription" "primary" {
}

resource "azurerm_storage_account" "default" {
  name                     = var.azurerm_storage_account_name
  resource_group_name      = var.azurerm_resource_group_name
  location                 = var.azurerm_region
  account_tier             = "Standard"
  account_replication_type = "GRS"
}

resource "azurerm_log_analytics_workspace" "main" {
  name                = "shodan-srs-main"
  resource_group_name = var.azurerm_resource_group_name
  location            = var.azurerm_region
  sku                 = "PerGB2018"
  daily_quota_gb      = 1
}

resource "azurerm_application_insights" "main" {
  name                = "shodan-srs-insight"
  resource_group_name = var.azurerm_resource_group_name
  location            = var.azurerm_region
  depends_on          = [azurerm_log_analytics_workspace.main]
  workspace_id        = azurerm_log_analytics_workspace.main.id
  application_type    = "other"
}

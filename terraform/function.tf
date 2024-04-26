resource "azurerm_linux_function_app" "shodan" {
  name                       = "shodan-srs"
  resource_group_name        = var.azurerm_resource_group_name
  location                   = var.azurerm_region
  storage_account_name       = azurerm_storage_account.default.name
  storage_account_access_key = azurerm_storage_account.default.primary_access_key
  service_plan_id            = azurerm_service_plan.elastic.id

  site_config {
    application_stack {
      python_version = "3.10"
    }
  }
}



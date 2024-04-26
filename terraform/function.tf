resource "azurerm_linux_function_app" "shodan" {
  name                       = "shodan-srs"
  resource_group_name        = var.azurerm_resource_group_name
  location                   = var.azurerm_region
  depends_on                 = [azurerm_service_plan.elastic, azurerm_storage_account.default, azurerm_application_insights.main]
  storage_account_name       = azurerm_storage_account.default.name
  storage_account_access_key = azurerm_storage_account.default.primary_access_key
  service_plan_id            = azurerm_service_plan.elastic.id

  site_config {
    application_stack {
      python_version = "3.10"
    }

    application_insights_connection_string = azurerm_application_insights.main.connection_string
    application_insights_key               = azurerm_application_insights.main.instrumentation_key
  }

  app_settings = {
    EVENTGRID_KEY      = azurerm_eventgrid_topic.shodan.primary_access_key
    EVENTGRID_ENDPOINT = azurerm_eventgrid_topic.shodan.endpoint
  }
}


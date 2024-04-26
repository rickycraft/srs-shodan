resource "azurerm_service_plan" "app_service" {
  name                = "linux-app-service"
  resource_group_name = var.azurerm_resource_group_name
  location            = var.azurerm_region
  os_type             = "Linux"
  sku_name            = "Y1"
  # maximum_elastic_worker_count = 2
}

resource "azurerm_linux_web_app" "next-app" {
  name                = "shodan-srs-next"
  resource_group_name = var.azurerm_resource_group_name
  location            = var.azurerm_region
  service_plan_id     = azurerm_service_plan.app_service.id

  site_config {
    application_stack {
      docker_image_name   = var.docker_image_name
      docker_registry_url = "https://ghcr.io"
    }

    http2_enabled     = true
    health_check_path = "/"
  }

  app_settings = {
    APPINSIGHTS_INSTRUMENTATIONKEY        = azurerm_application_insights.main.instrumentation_key
    APPLICATIONINSIGHTS_CONNECTION_STRING = azurerm_application_insights.main.connection_string
  }

  # for database config
  # connection_string {}
}

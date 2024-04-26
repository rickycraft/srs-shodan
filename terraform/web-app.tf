resource "azurerm_service_plan" "app_service" {
  name                = "linux-app-service"
  resource_group_name = var.azurerm_resource_group_name
  location            = var.azurerm_region
  os_type             = "Linux"
  sku_name            = "B1"
}

resource "azurerm_linux_web_app" "next_app" {
  name                = var.azurerm_web_app_name
  resource_group_name = var.azurerm_resource_group_name
  location            = var.azurerm_region
  service_plan_id     = azurerm_service_plan.app_service.id
  depends_on          = [azurerm_application_insights.main, azurerm_service_plan.app_service]

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

}


resource "null_resource" "app_publish_profile" {
  depends_on = [azurerm_linux_web_app.next_app]
  triggers = {
    trigger_value = "${azurerm_linux_web_app.next_app.id}"
  }

  provisioner "local-exec" {
    command = <<EOF
    az functionapp deployment list-publishing-profiles --name ${azurerm_linux_web_app.next_app.name} --resource-group ${var.azurerm_resource_group_name} --xml > ${azurerm_linux_web_app.next_app.name}.xml
    gh secret set -R ${var.repo_name} AZURE_WEBAPP_PUBLISH_PROFILE < ${azurerm_linux_web_app.next_app.name}.xml
    EOF
    when    = create
  }
}

resource "azurerm_service_plan" "app_service" {
  name                = "linux-app-service"
  resource_group_name = var.azurerm_resource_group_name
  location            = var.azurerm_region
  os_type             = "Linux"
  sku_name            = "B1"
}

resource "azurerm_user_assigned_identity" "web_app" {
  name                = "web-app"
  resource_group_name = var.azurerm_resource_group_name
  location            = var.azurerm_region
}

resource "azurerm_role_assignment" "web_app" {
  depends_on           = [azurerm_user_assigned_identity.web_app]
  principal_id         = azurerm_user_assigned_identity.web_app.principal_id
  scope                = "${data.azurerm_subscription.primary.id}/resourceGroups/${var.azurerm_resource_group_name}"
  role_definition_name = "AcrPull"
}

resource "azurerm_linux_web_app" "next_app" {
  name                = var.azurerm_web_app_name
  resource_group_name = var.azurerm_resource_group_name
  location            = var.azurerm_region
  service_plan_id     = azurerm_service_plan.app_service.id
  depends_on          = [azurerm_application_insights.main, azurerm_service_plan.app_service]
  https_only          = true

  site_config {
    # login to the registry with managed identity
    container_registry_use_managed_identity       = true
    container_registry_managed_identity_client_id = azurerm_user_assigned_identity.web_app.principal_id

    # no need to set it here, will be setup in github actions
    # application_stack {
    # docker_image_name   = var.docker_image_name
    # docker_registry_url = "https://ghcr.io"
    # }

    http2_enabled     = true
    health_check_path = "/"
  }

  app_settings = {
    APPINSIGHTS_INSTRUMENTATIONKEY        = azurerm_application_insights.main.instrumentation_key
    APPLICATIONINSIGHTS_CONNECTION_STRING = azurerm_application_insights.main.connection_string
    # use this to login with admin user
    # DOCKER_REGISTRY_SERVER_USERNAME = azurerm_container_registry.main.admin_username
    # DOCKER_REGISTRY_SERVER_PASSWORD = azurerm_container_registry.main.admin_password
  }

  identity {
    type         = "UserAssigned"
    identity_ids = [azurerm_user_assigned_identity.web_app.id]
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

resource "azurerm_monitor_diagnostic_setting" "web_app" {
  name                       = "app-service-diagnostic"
  depends_on                 = [azurerm_linux_web_app.next_app, azurerm_log_analytics_workspace.main]
  target_resource_id         = azurerm_linux_web_app.next_app.id
  log_analytics_workspace_id = azurerm_log_analytics_workspace.main.id

  enabled_log {
    category = "AppServiceHTTPLogs"
  }

  enabled_log {
    category = "AppServiceConsoleLogs"
  }

  metric {
    category = "AllMetrics"
    enabled  = false
  }
}

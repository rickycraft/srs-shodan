resource "azurerm_service_plan" "app_service" {
  name                = "linux-app-service"
  resource_group_name = var.azurerm_resource_group_name
  location            = var.azurerm_region
  os_type             = "Linux"
  sku_name            = "S1"
  worker_count        = 1
}

resource "azurerm_user_assigned_identity" "web_app" {
  name                = "web-app"
  resource_group_name = var.azurerm_resource_group_name
  location            = var.azurerm_region
}

# resource "azurerm_role_assignment" "web_app" {
#   depends_on           = [azurerm_user_assigned_identity.web_app]
#   principal_id         = azurerm_user_assigned_identity.web_app.principal_id
#   scope                = "${data.azurerm_subscription.primary.id}/resourceGroups/${var.azurerm_resource_group_name}"
#   role_definition_name = "AcrPull"
# }

resource "azurerm_linux_web_app" "next_app" {
  name                = var.azurerm_web_app_name
  resource_group_name = var.azurerm_resource_group_name
  location            = var.azurerm_region
  service_plan_id     = azurerm_service_plan.app_service.id
  depends_on          = [azurerm_application_insights.main, azurerm_service_plan.app_service, azurerm_container_registry.main]
  https_only          = true

  site_config {
    # login to the registry with managed identity
    # container_registry_use_managed_identity       = true
    # container_registry_managed_identity_client_id = azurerm_user_assigned_identity.web_app.principal_id


    application_stack {
      docker_image_name   = var.docker_image_name
      docker_registry_url = "https://${azurerm_container_registry.main.login_server}"
      # use this to login with admin user
      docker_registry_username = azurerm_container_registry.main.admin_username
      docker_registry_password = azurerm_container_registry.main.admin_password
    }

    http2_enabled     = true
    health_check_path = "/api/health"
  }

  app_settings = {
    # set application insights
    APPINSIGHTS_INSTRUMENTATIONKEY        = azurerm_application_insights.main.instrumentation_key
    APPLICATIONINSIGHTS_CONNECTION_STRING = azurerm_application_insights.main.connection_string
    # add env variables
    NEXTAUTH_SECRET      = var.web_nextauth_secret
    NEXTAUTH_URL         = "https://${var.azurerm_web_app_name}.azurewebsites.net"
    GITHUB_CLIENT_ID     = var.web_github_client_id
    GITHUB_CLIENT_SECRET = var.web_github_client_secret
    # add function
    AZURE_FUNC_TOKEN = data.azurerm_function_app_host_keys.default.default_function_key
    AZURE_FUNC_NAME  = azurerm_linux_function_app.shodan.name
  }

  connection_string {
    name  = "MAIN"
    type  = "PostgreSQL"
    value = local.postgresql_connection_string
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
    enabled  = true
  }
}

resource "azurerm_monitor_autoscale_setting" "web_scale" {
  name                = "web-app-scale"
  resource_group_name = var.azurerm_resource_group_name
  location            = var.azurerm_region
  target_resource_id  = azurerm_service_plan.app_service.id

  profile {
    name = "Cpu70"

    capacity {
      default = 1
      minimum = 1
      maximum = 3
    }

    rule {
      metric_trigger {
        metric_namespace   = "microsoft.web/serverfarms"
        metric_name        = "CpuPercentage"
        metric_resource_id = azurerm_service_plan.app_service.id
        statistic          = "Average"
        time_window        = "PT3M"
        time_grain         = "PT1M"
        time_aggregation   = "Average"
        operator           = "GreaterThan"
        threshold          = 80
      }

      scale_action {
        direction = "Increase"
        type      = "ChangeCount"
        value     = "1"
        cooldown  = "PT3M"
      }
    }
    rule {
      metric_trigger {
        metric_namespace   = "microsoft.web/serverfarms"
        metric_name        = "CpuPercentage"
        metric_resource_id = azurerm_service_plan.app_service.id
        statistic          = "Average"
        time_window        = "PT5M"
        time_grain         = "PT1M"
        time_aggregation   = "Average"
        operator           = "LessThan"
        threshold          = 50
      }

      scale_action {
        direction = "Decrease"
        type      = "ChangeCount"
        value     = "1"
        cooldown  = "PT5M"
      }
    }
    rule {
      metric_trigger {
        metric_namespace   = "microsoft.web/sites"
        metric_name        = "HttpResponseTime"
        metric_resource_id = azurerm_linux_web_app.next_app.id
        statistic          = "Average"
        time_window        = "PT5M"
        time_grain         = "PT1M"
        time_aggregation   = "Average"
        operator           = "GreaterThan"
        threshold          = 0.5
      }

      scale_action {
        direction = "Increase"
        type      = "ChangeCount"
        value     = "1"
        cooldown  = "PT5M"
      }
    }
  }

}

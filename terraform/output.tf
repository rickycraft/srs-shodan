output "event_grid_key" {
  value     = azurerm_eventgrid_topic.shodan.primary_access_key
  sensitive = true
}

output "event_grid_endpoint" {
  value = azurerm_eventgrid_topic.shodan.endpoint
}

output "github_registry_password" {
  value     = local.github_token_pass
  sensitive = true
}

output "postgresql_connection_string" {
  value     = local.postgresql_connection_string
  sensitive = true
}

output "function_key" {
  value     = data.azurerm_function_app_host_keys.default.default_function_key
  sensitive = true
}

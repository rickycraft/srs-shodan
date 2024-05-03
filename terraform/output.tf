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
  value     = "postgresql://${azurerm_postgresql_flexible_server.main.fqdn}:5432/${azurerm_postgresql_flexible_server_database.shodan.name}?user=${var.sql_administrator_user}&password=${var.sql_administrator_password}&sslmode=require"
  sensitive = true
}

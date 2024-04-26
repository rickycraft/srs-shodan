output "event_grid_key" {
  value     = azurerm_eventgrid_topic.shodan.primary_access_key
  sensitive = true
}

output "event_grid_endpoint" {
  value = azurerm_eventgrid_topic.shodan.endpoint
}
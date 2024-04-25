resource "azurerm_eventgrid_topic" "eventgrid-topic" {
  name                = "shodan-eventgrid-topic"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
}

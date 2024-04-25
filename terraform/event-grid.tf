resource "azurerm_eventgrid_topic" "shodan" {
  name                = "shodan-eventgrid-topic"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
}

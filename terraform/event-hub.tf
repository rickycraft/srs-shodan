resource "azurerm_eventhub_namespace" "event_hub_ns" {
  name                = "shodan-ns"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  sku                 = "Standard"
  capacity            = 1

  tags = {}
}

resource "azurerm_eventhub" "event_hub" {
  name = "shodan-hub"
  resource_group_name = azurerm_resource_group.rg.name
  namespace_name = azurerm_eventhub_namespace.event_hub_ns.name
  partition_count     = 1
  message_retention   = 1
}
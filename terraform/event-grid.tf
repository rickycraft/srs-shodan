resource "azurerm_eventgrid_topic" "shodan" {
  name                = "shodan-eventgrid-topic"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
}

resource "azurerm_eventgrid_event_subscription" "consumer" {
  name  = "shodan-srs-consumer"
  scope = azurerm_eventgrid_topic.shodan.id

  azure_function_endpoint {
    function_id                       = "${azurerm_linux_function_app.shodan.id}/functions/${var.azurerm_function_consumer_name}"
    max_events_per_batch              = 1
    preferred_batch_size_in_kilobytes = 64
  }
}

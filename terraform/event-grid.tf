resource "azurerm_eventgrid_topic" "shodan" {
  name                = "shodan-eventgrid-topic"
  resource_group_name = var.azurerm_resource_group_name
  location            = var.azurerm_region
}

resource "azurerm_eventgrid_event_subscription" "consumer" {
  name       = "shodan-srs-consumer"
  depends_on = [azurerm_linux_function_app.shodan, azurerm_eventgrid_topic.shodan]
  scope      = azurerm_eventgrid_topic.shodan.id

  azure_function_endpoint {
    function_id                       = "${azurerm_linux_function_app.shodan.id}/functions/${var.azurerm_function_consumer_name}"
    max_events_per_batch              = 1
    preferred_batch_size_in_kilobytes = 64
  }
}

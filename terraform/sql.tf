
resource "azurerm_postgresql_flexible_server" "main" {
  name                = "shodan-srs-sql"
  resource_group_name = var.azurerm_resource_group_name
  location            = var.azurerm_region
  version             = "16"
  # delegated_subnet_id    = azurerm_subnet.example.id
  # private_dns_zone_id    = azurerm_private_dns_zone.example.id
  administrator_login    = var.sql_administrator_user
  administrator_password = var.sql_administrator_password

  zone                  = "1"
  sku_name              = "B_Standard_B1ms"
  storage_mb            = 32768
  storage_tier          = "P6"
  auto_grow_enabled     = false
  backup_retention_days = 7
}

resource "azurerm_postgresql_flexible_server_database" "shodan" {
  name      = "shodan"
  server_id = azurerm_postgresql_flexible_server.main.id
  collation = "en_US.utf8"
  charset   = "utf8"

  # prevent the possibility of accidental data loss
  lifecycle {
    prevent_destroy = true
  }
}

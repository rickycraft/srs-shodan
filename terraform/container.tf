resource "azurerm_user_assigned_identity" "registry" {
  name                = "container-registry"
  resource_group_name = var.azurerm_resource_group_name
  location            = var.azurerm_region
}

# resource "azurerm_role_assignment" "registry" {
#   depends_on           = [azurerm_user_assigned_identity.registry]
#   principal_id         = azurerm_user_assigned_identity.registry.principal_id
#   scope                = "${data.azurerm_subscription.primary.id}/resourceGroups/${var.azurerm_resource_group_name}"
#   role_definition_name = "AcrPush"
# }

resource "azurerm_container_registry" "main" {
  name                = "shodansrs"
  resource_group_name = var.azurerm_resource_group_name
  location            = var.azurerm_region
  depends_on          = []
  sku                 = "Basic"
  # to disable when going to production
  admin_enabled                 = true
  public_network_access_enabled = true
  anonymous_pull_enabled        = false

  identity {
    type         = "UserAssigned"
    identity_ids = [azurerm_user_assigned_identity.registry.id]
  }
}

resource "azurerm_container_registry_scope_map" "push_pull" {
  name                    = "push-pull"
  description             = "Push and pull permissions for the container registry"
  resource_group_name     = var.azurerm_resource_group_name
  depends_on              = [azurerm_container_registry.main]
  container_registry_name = azurerm_container_registry.main.name
  actions = [
    "repositories/*/content/read",
    "repositories/*/content/write"
  ]
}

resource "azurerm_container_registry_token" "github" {
  name                    = "github"
  resource_group_name     = var.azurerm_resource_group_name
  depends_on              = [azurerm_container_registry_scope_map.push_pull]
  container_registry_name = azurerm_container_registry.main.name
  scope_map_id            = azurerm_container_registry_scope_map.push_pull.id
}

resource "azurerm_container_registry_token_password" "github" {
  depends_on                  = [azurerm_container_registry_token.github]
  container_registry_token_id = azurerm_container_registry_token.github.id

  password1 {
  }
}

locals {
  github_token_pass = azurerm_container_registry_token_password.github.password1[0].value
}

resource "null_resource" "registry_credential" {
  depends_on = [azurerm_container_registry_token_password.github]
  triggers = {
    trigger_value = "${local.github_token_pass}"
  }

  provisioner "local-exec" {
    command = "echo ${local.github_token_pass} | gh secret set -R ${var.repo_name} AZURE_REGISTRY_TOKEN"
    when    = create
  }
}

# Progetto

## Webapp
Core:
- Login tramite SSO
- Visualizzazione ip monitorati
- Modifica ip monitorati (api shodan)
- Binding account <-> telegram

Technologies:
- NextJS
- Docker
- Typescript
- drizzle-orm
- shadcn/ui

## Telegram BOT
Usare getUpdate oppure le callback?

Core:
- /start link di registrazione

Technologies:
- Docker
- Python
- python-telegram-bot

## Lambda
Core:
- Callback da shodan -> event hub
- Event hub -> bot telegram

Technologies:
- Azure functions
- Python
- python-telegram-bot

## DevOps
Core:
- CI/CD
- IaC con terraform
  - Azure functions
  - Event Hub
  - Docker registry
  - App engine
  - SQL

Limitazioni:
- Impossibilità di utilizzare le managed identity per maggiore sicurezza a causa delle impostazioni del tenant

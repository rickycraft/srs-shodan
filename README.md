# Progetto

## Webapp
Core:
- Login tramite SSO
- Visualizzazione ip monitorati
- Modifica ip monitorati (api shodan)
- Binding account <-> telegram

Extra:
- Search ip

Technologies:
- NextJS
- Docker
- Typescript
- drizzle-orm
- shadcn/ui

## Telegram bot
Core:
- /start link di registrazione

Extra:
- /list ip monitorati
- /add | /remove ip monitorati

Technologies:
- Docker
- Python
- python-telegram-bot

## Lambda
Core:
- Callback da shodan -> event hub
- Event hub -> bot telegram

Extra:
- Event hub -> sistema x (mail/sms)

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

Extra:
- Dependency analyzer (security)
- Static code analyzer

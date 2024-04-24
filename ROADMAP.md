# Roadmap

## Global
- Definizione schema del databse

## Webapp
- Init del progetto (librerie grafiche + database)
- Init del db
- Creazione maschera di login
- Binding SSO al sito (creazione key e url / link al db)
- Pagina CRUD per ip (lista/add/delete)
- Creazione endpoint verso shodan
  - Interazione con le azure functions?
  - Come interrogare le API di shodan?
- Creazione endpoint di registrazione dal bot telegram

## Lambda
- Webook -> Event Hub
- Event Hub -> Bot Telegram

# DevOps
- Setup CI/CD su github
- CI/CD build container docker (registry)
- Setup terraform
- Deploy del database
- Deploy Azure functions
- CI/CD Azure functions
- CI/CD deploy su app engine
- Deploy Event Hub

## Telegram BOT
- Comando /start callback verso webapp
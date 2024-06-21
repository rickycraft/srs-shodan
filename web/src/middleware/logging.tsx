import fs from 'fs'
import path from 'path'

// Definire il percorso del file di log
const logFilePath = path.join(process.cwd(), 'logs', 'auth.log')

// Assicurarsi che la directory di log esista
if (!fs.existsSync(path.dirname(logFilePath))) {
  fs.mkdirSync(path.dirname(logFilePath), { recursive: true })
}

// Funzione per registrare i messaggi nel file
export const logToFile = (message: string) => {
  const timestamp = new Date().toISOString()
  const logMessage = `[${timestamp}] ${message}\n`

  // Log di debug nel terminale
  console.log(logMessage)

  fs.appendFileSync(logFilePath, logMessage)
}

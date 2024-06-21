import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Funzione per scrivere i log su un file, garantendo che la directory e il file esistano
function writeLog(message: string) {
  const logDir = path.join(process.cwd(), 'logs')
  const logFilePath = path.join(logDir, 'auth.log')

  // Verifica se la directory dei log esiste, altrimenti la crea
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir)
  }

  // Verifica se il file di log esiste, altrimenti lo crea
  if (!fs.existsSync(logFilePath)) {
    fs.writeFileSync(logFilePath, '', { encoding: 'utf8' })
  }

  const logMessage = `${new Date().toISOString()} - ${message}\n`
  fs.appendFileSync(logFilePath, logMessage, { encoding: 'utf8' })

  // Stampa su console
  console.log(
    'Sto scrivendo sul file di log ogni volta che un utente si autentica o fa logout'
  )
}

export function authLoggingMiddleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Loggare solo le richieste di autenticazione (login e logout)
  if (
    pathname.startsWith('/api/auth/login') ||
    pathname.startsWith('/api/auth/logout')
  ) {
    const method = req.method
    const success = req.cookies.get('auth') ? 'success' : 'failed'
    writeLog(
      `Auth request to: ${pathname}, method: ${method}, status: ${success}`
    )
  }

  return NextResponse.next()
}

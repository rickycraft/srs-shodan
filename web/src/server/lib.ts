import { getServerSession } from 'next-auth'
import { authOptions } from './auth'
import { logToFile } from '~/middleware/logging'

export function isIPv4Address(inputString: string): boolean {
  const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/
  if (!ipv4Pattern.test(inputString)) return false

  const parts = inputString.split('.').map(Number)
  return parts.every((part) => part >= 0 && part <= 255)
}

export async function getServerUser() {
  const session = await getServerSession(authOptions)
  if (!session) {
    // Log per debug
    const message = 'Nessuna sessione trovata - accesso non autorizzato'
    console.log(message)
    logToFile(message)
    return null
  }
  return session.user
}

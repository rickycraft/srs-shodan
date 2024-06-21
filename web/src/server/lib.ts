import { getServerSession } from 'next-auth'
import { authOptions } from './auth'

export function isIPv4Address(inputString: string): boolean {
  const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/
  if (!ipv4Pattern.test(inputString)) return false

  const parts = inputString.split('.').map(Number)
  return parts.every((part) => part >= 0 && part <= 255)
}

export async function getServerUser() {
  const session = await getServerSession(authOptions)
  if (!session) {
    const message = 'No session found - access denied'
    console.log(message)
    throw new Error('403')
  }
  return session.user
}

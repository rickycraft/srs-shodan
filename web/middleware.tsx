import { NextRequest, NextResponse } from 'next/server'
import { authMiddleware } from './middleware/auth'
import { loggingMiddleware } from './middleware/logging'
import { errorHandlerMiddleware } from './middleware/errorHandler'
import { authLoggingMiddleware } from './middleware/authLogging'

export async function middleware(req: NextRequest) {
  // Auth logging middleware
  authLoggingMiddleware(req)

  // Logging middleware
  loggingMiddleware(req)

  // Error handling middleware
  errorHandlerMiddleware(req)

  // Auth middleware
  const authResponse = authMiddleware(req)
  if (authResponse) return authResponse

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Protegge tutte le rotte tranne quelle sotto `/api/auth`

    '/((?!api/auth).*)',
  ],
}

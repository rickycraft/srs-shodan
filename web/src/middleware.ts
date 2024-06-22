import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import logger from '~/server/logger'

export default withAuth(
  function middleware({ url, nextauth, nextUrl }) {
    if (!nextauth.token || nextauth.token.user === null) {
      logger.warn(`Tentativo di accesso non autorizzato a ${url}`)
      return NextResponse.rewrite(new URL('/auth/login', url))
    }
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return token !== null && token.user !== null
      },
    },
  }
)

// Applicare il middleware alle route protette
export const config = {
  matcher: ['/', '/me', '/dashboard/:path*', '/api/register'],
}

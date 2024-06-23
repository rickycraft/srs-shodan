import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import pino from 'pino'

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  browser: {
    asObject: false,
  },
})
const loggerWrapper = (data: any, msg: string) =>
  JSON.stringify({ ...data, tag: 'middleware', msg })

export default withAuth(
  function middleware({ url, nextauth, nextUrl }) {
    // shoud never happen but useful for types
    if (!nextauth.token || nextauth.token.user === null)
      return NextResponse.rewrite(new URL('/auth/login', url))

    logger.info(
      loggerWrapper(
        {
          name: nextauth.token.name,
          path: nextUrl.pathname,
        },
        'user ok'
      )
    )
    return NextResponse.next()
  },
  {
    callbacks: {
      // just exclude if not authorized
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

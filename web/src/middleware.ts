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
    if (!nextauth.token || nextauth.token.user === null) {
      return NextResponse.rewrite(new URL('/auth/login', url))
    }

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
        const isAuthorized = token !== null && token.user !== null

        if (!isAuthorized) {
          // Log when the user is not authorized
          logger.warn(
            loggerWrapper(
              {
                token,
              },
              'user not authorized'
            )
          )
        }

        return isAuthorized
      },
    },
  }
)

// Apply middleware to protected routes
export const config = {
  matcher: ['/me', '/dashboard/:path*', '/api/register'],
}

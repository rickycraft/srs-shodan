import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware({ url, nextauth, nextUrl }) {
    // shoud never happen but useful for types
    if (!nextauth.token || nextauth.token.user === null)
      return NextResponse.rewrite(new URL('/auth/login', url))

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
  matcher: ['/me', '/dashboard/:path*', '/api/register'],
}

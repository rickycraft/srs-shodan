import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { logToFile } from './logging'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname.startsWith('/dashboard')) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    const message = 'MIDDLEWARE: Tentativo di accesso non autorizzato'

    if (!token) {
      logToFile(
        `MIDDLEWARE: Tentativo di accesso non autorizzato a ${pathname}`
      )
      console.log(message)
      return NextResponse.redirect(new URL('/api/auth/signin', req.url))
    }

    // Controllo specifico per l'accesso alla rotta /dashboard/admin
    if (pathname.startsWith('/dashboard/admin') && !token.isAdmin) {
      logToFile(
        `MIDDLEWARE: Accesso non autorizzato da ${token.email} a ${pathname}`
      )
      return NextResponse.redirect(new URL('/dashboard', req.url)) // Reindirizzare ad una pagina appropriata
    }

    logToFile(`MIDDLEWARE: Accesso autorizzato da ${token.email} a ${pathname}`)
  }

  if (pathname.startsWith('/api/auth/callback')) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (token) {
      const response = NextResponse.next()
      response.cookies.set('user-email', token.email || '', { httpOnly: true })
      response.cookies.set('user-name', token.name || '', { httpOnly: true })
      return response
    }
  }

  if (pathname === '/api/auth/signout') {
    const email = req.cookies.get('user-email')?.value || 'sconosciuto'
    const name = req.cookies.get('user-name')?.value || 'sconosciuto'
    logToFile(`MIDDLEWARE: Utente ${name} (${email}) ha effettuato il logout`)
    const response = NextResponse.next()
    response.cookies.delete('user-email')
    response.cookies.delete('user-name')
    return response
  }

  logToFile(`Middleware attivato per: ${pathname}`)

  return NextResponse.next()
}

// Applicare il middleware alle route protette
export const config = {
  matcher: ['/dashboard/:path*', '/dashboard/admin/:path*'],
}

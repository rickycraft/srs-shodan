import { NextRequest, NextResponse } from 'next/server'

export function authMiddleware(req: NextRequest) {
  const token = req.cookies.get('token')

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}

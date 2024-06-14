import { NextRequest, NextResponse } from 'next/server'

export function loggingMiddleware(req: NextRequest) {
  console.log(
    `Request made to: ${req.nextUrl.pathname} at ${new Date().toISOString()}`
  )
  return NextResponse.next()
}

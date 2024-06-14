import { NextRequest, NextResponse } from 'next/server'

export function errorHandlerMiddleware(req: NextRequest) {
  try {
    return NextResponse.next()
  } catch (error) {
    console.error('Error handling request', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

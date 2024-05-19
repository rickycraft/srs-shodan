import { type NextRequest, NextResponse } from 'next/server'
import {
  shodan_add_alert,
  shodan_alerts,
  shodan_del_alert,
  shodan_get_alert,
} from '~/server/shodan'

async function call_shodan(method: string, ip: string) {
  switch (method) {
    case 'GET':
      return await shodan_get_alert(ip)
      break
    case 'POST':
      return await shodan_add_alert(ip)
      break
    case 'DELETE':
      return await shodan_del_alert(ip)
      break
  }
}

async function handler(req: NextRequest) {
  try {
    const method = req.method as 'GET' | 'POST' | 'DELETE'
    const ip = req.nextUrl.searchParams.get('ip')
    const res = ip ? await call_shodan(method, ip) : await shodan_alerts()
    console.log(res)
    return NextResponse.json(res)
  } catch (error) {
    return NextResponse.json(error, { status: 500 })
  }
}

export { handler as DELETE, handler as GET, handler as POST }

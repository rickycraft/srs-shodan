import { type NextRequest, NextResponse } from 'next/server'
import {
  shodan_add_alert,
  shodan_alerts,
  shodan_del_alert,
  shodan_get_alert,
} from '~/server/shodan'

async function handler(req: NextRequest) {
  try {
    const method = req.method as 'GET' | 'POST' | 'DELETE'
    const ip = req.nextUrl.searchParams.get('ip')
    if (!ip) {
      const res = await shodan_alerts()
      console.log(res)
    } else {
      switch (method) {
        case 'GET':
          console.log(await shodan_get_alert(ip))
          break
        case 'POST':
          console.log(await shodan_add_alert(ip))
          break
        case 'DELETE':
          console.log(await shodan_del_alert(ip))
          break
      }
    }
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json(error, { status: 500 })
  }
}

export { handler as DELETE, handler as GET, handler as POST }

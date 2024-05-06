import { NextResponse } from 'next/server'
import { db } from '~/server/db'
import { users } from '~/server/db/schema'

async function handler(req: Request) {
  try {
    const usr = await db.select({ id: users.id }).from(users)

    return NextResponse.json({ userCount: usr.length })
  } catch (error) {
    return NextResponse.json(error, { status: 500 })
  }
}

export { handler as GET, handler as POST }

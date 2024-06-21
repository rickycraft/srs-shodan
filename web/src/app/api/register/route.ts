import { NextRequest, NextResponse } from 'next/server'
import { db } from '~/server/db'
import { userToken } from '~/server/db/schema'
import { getServerUser } from '~/server/lib'

async function handler(req: NextRequest) {
  console.log('register', req.nextUrl)
  const origin = req.nextUrl.origin
  // should be protected by middleware
  const user = await getServerUser()
  const chatId = req.nextUrl.searchParams.get('chatid')
  if (!chatId) {
    return new Response('Missing chatId', { status: 400 })
  }

  // search if is already registered redirect to /
  const tokens = await db.query.userToken.findMany({
    where: (t, { eq }) => eq(t.value, chatId),
  })
  if (tokens.length > 0) {
    return NextResponse.redirect(origin + '/?registered=true')
  }

  // insert the token (telegram by default)
  await db.insert(userToken).values({
    userId: user.id,
    type: 'telegram',
    value: chatId,
  })

  return NextResponse.redirect(origin + '/?registered=true')
}

export { handler as GET, handler as POST }

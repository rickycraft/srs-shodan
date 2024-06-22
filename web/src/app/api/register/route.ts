import { NextRequest, NextResponse } from 'next/server'
import { db } from '~/server/db'
import { userToken } from '~/server/db/schema'
import { baseLogger, getServerUser } from '~/server/lib'

const REDIRECT_PATH = '/dashboard/register'
const logger = baseLogger('register')

async function handler(req: NextRequest) {
  const origin = process.env.NEXTAUTH_URL
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
    return NextResponse.redirect(origin + REDIRECT_PATH + '?status=already')
  }

  // insert the token (telegram by default)
  await db.insert(userToken).values({
    userId: user.id,
    type: 'telegram',
    value: chatId,
  })

  logger.info({ chatId, userId: user.id }, 'token registered')
  return NextResponse.redirect(origin + REDIRECT_PATH + '?status=now')
}

export { handler as GET, handler as POST }

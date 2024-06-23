'use server'

import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { db } from './db'
import { notification, userToken } from './db/schema'
import { getServerUser, isIPv4Address } from './lib'
import { shodan_add_alert, shodan_del_alert } from './shodan'
import { baseLogger } from '~/server/log'

const logger = baseLogger('action')

// export async function addIpAlert(data: FormData) {
//   const ip = data.get('ip') as string
//   if (!isIPv4Address(ip)) throw new Error('Invalid IP Address')

//   const aid = await shodan_add_alert(ip)
//   revalidatePath('/dashboard')
//   return aid
// }

export async function addNotification(data: FormData) {
  const user = await getServerUser()

  const ip = (data.get('ip') as string).trim()
  if (!isIPv4Address(ip)) {
    logger.error({ userId: user.id, ip }, 'Invalid IP Address')
    throw new Error('Invalid IP Address')
  }

  logger.info({ userId: user.id, ip }, 'Adding notification')
  const alert = await db.query.shodanAlert.findFirst({
    where: (row, { eq }) => eq(row.ip, ip),
  })
  const alertId = alert ? alert.id : await shodan_add_alert(ip)
  await db.insert(notification).values({ userId: user.id, alertId })

  revalidatePath('/dashboard')
  logger.info({ userId: user.id, alertId }, 'Notification added successfully')
  return alertId
}

export async function delNotification(data: FormData) {
  const alertId = data.get('aid') as string
  const user = await getServerUser()

  logger.info({ userId: user.id, alertId }, 'Deleting notification')
  await db
    .delete(notification)
    .where(
      and(eq(notification.alertId, alertId), eq(notification.userId, user.id))
    )
  // check if the alert is still in the database
  const n = await db.query.notification.findFirst({
    where: (row, { eq }) => eq(row.alertId, alertId),
  })
  if (!n) {
    await shodan_del_alert(alertId)
  }
  revalidatePath('/dashboard')
  logger.info({ userId: user.id, alertId }, 'Notification deleted successfully')
}

export async function registerTelegram(data: FormData) {
  const user = await getServerUser()
  const chatid = data.get('chatid') as string

  logger.info({ userId: user.id, chatid }, 'Registering Telegram user')
  await db
    .insert(userToken)
    .values({ userId: user.id, value: chatid, type: 'telegram' })
  logger.info(
    { userId: user.id, chatid },
    'Telegram user registered successfully'
  )
}

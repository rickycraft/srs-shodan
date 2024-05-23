'use server'

import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { db } from './db'
import { notification } from './db/schema'
import { getServerUser, isIPv4Address } from './lib'
import { shodan_add_alert, shodan_del_alert } from './shodan'

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
  if (!isIPv4Address(ip)) throw new Error('Invalid IP Address')

  // search for the alert in the database
  const alert = await db.query.shodanAlert.findFirst({
    where: (row, { eq }) => eq(row.ip, ip),
  })
  const alertId = alert ? alert.id : await shodan_add_alert(ip)
  await db.insert(notification).values({ userId: user.id, alertId })

  revalidatePath('/dashboard')
  return alertId
}

export async function delNotification(data: FormData) {
  const alertId = data.get('aid') as string
  const user = await getServerUser()

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
}

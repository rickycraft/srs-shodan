import { and, eq } from 'drizzle-orm'
import { db } from '.'
import {
  notification as Notification,
  notificationEnum,
  shodanAlert,
  userToken,
} from './schema'

export const notifyTelegram = async (ip: string) => {
  const t = await db
    .select({
      alertId: shodanAlert.id,
      userId: userToken.userId,
      value: userToken.value,
    })
    .from(shodanAlert)
    .innerJoin(Notification, eq(shodanAlert.id, Notification.alertId))
    .innerJoin(userToken, eq(Notification.userId, userToken.userId))
    .where(
      and(
        eq(shodanAlert.ip, ip),
        eq(userToken.type, notificationEnum.enumValues[0])
      )
    )
  return t
}

const createShodanAlert = async (ip: string, trigger: string) => {
  // call the azure function to create the alert
  const id = '1234567890'
  // insert the alert into the database
  await db.insert(shodanAlert).values({ id, ip, trigger })

  return id
}

export const registerAlert = async (
  userId: string,
  ip: string,
  trigger = 'any'
) => {
  // check if alert already exists
  const alert = await db.query.shodanAlert.findFirst({
    where: (field, { eq, and }) =>
      and(eq(field.ip, ip), eq(field.trigger, trigger)),
    columns: { id: true },
  })
  // if alert does not exist, create it
  const alertId = alert ? alert.id : await createShodanAlert(ip, trigger)
  // check if the user is already subscribed to the alert
  const notification = await db.query.notification.findFirst({
    where: (field, { eq, and }) =>
      and(eq(field.userId, userId), eq(field.alertId, alertId)),
  })
  // if exists, return the alertId instead of error
  if (notification) {
    return notification.alertId
  }
  // create the notification
  await db.insert(Notification).values({ userId, alertId })
  return alertId
}

const removeShodanAlert = async (alertId: string) => {
  // call the azure function to remove the alert
  // remove the alert from the database
  await db.delete(shodanAlert).where(eq(shodanAlert.id, alertId))
}

export const unregisterAlert = async (userId: string, alertId: string) => {
  // delete the notification
  await db
    .delete(Notification)
    .where(
      and(eq(Notification.userId, userId), eq(Notification.alertId, alertId))
    )
  // check if the alert is still in use
  const notifications = await db.query.notification.findMany({
    where: (field, { eq }) => eq(field.alertId, alertId),
  })
  // if no more notifications, remove the alert
  if (notifications.length === 0) {
    await removeShodanAlert(alertId)
  }
}

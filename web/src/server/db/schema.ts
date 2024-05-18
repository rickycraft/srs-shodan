import { eq } from 'drizzle-orm'
import {
  inet,
  integer,
  pgEnum,
  pgTable,
  pgView,
  primaryKey,
  text,
  timestamp,
  unique,
  varchar,
} from 'drizzle-orm/pg-core'
import type { AdapterAccount } from 'next-auth/adapters'

export const users = pgTable('user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').notNull(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
})

export const accounts = pgTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccount['type']>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
    refresh_token_expires_in: integer('refresh_token_expires_in'), // only for github
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
)

export const sessions = pgTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
})

export const verificationTokens = pgTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
)

export const notificationEnum = pgEnum('notificationType', [
  'telegram',
  'email',
])

export const userToken = pgTable(
  'userToken',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: notificationEnum('type').notNull(),
    value: varchar('value', { length: 255 }).notNull(),
  },
  (table) => {
    return {
      notificationUserIdTypeValuePk: primaryKey({
        columns: [table.userId, table.type],
        name: 'notification_userId_type_pk',
      }),
    }
  }
)

export const shodanAlert = pgTable(
  'shodan_alert',
  {
    id: varchar('id', { length: 32 }).primaryKey().notNull(),
    ip: inet('ip').notNull(),
    trigger: varchar('trigger', { length: 255 }).default('any').notNull(),
  },
  (table) => ({
    shodanAlertUnique: unique().on(table.ip, table.trigger),
  })
)
export const notification = pgTable(
  'notification',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    alertId: varchar('alertId', { length: 32 })
      .references(() => shodanAlert.id)
      .notNull(),
  },
  (table) => {
    return {
      notificationUserIdAlertIdPk: primaryKey({
        columns: [table.userId, table.alertId],
        name: 'notification_userId_alertId_pk',
      }),
    }
  }
)

export const ipView = pgView('telegram_ip').as((qb) =>
  qb
    .select({
      ip: shodanAlert.ip,
      alertId: shodanAlert.id,
      userId: userToken.userId,
      token: userToken.value,
    })
    .from(shodanAlert)
    .leftJoin(notification, eq(shodanAlert.id, notification.alertId))
    .leftJoin(userToken, eq(notification.userId, userToken.userId))
    .where(eq(userToken.type, notificationEnum.enumValues[0]))
)

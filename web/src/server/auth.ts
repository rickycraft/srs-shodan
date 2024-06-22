import { DrizzleAdapter } from '@auth/drizzle-adapter'
import {
  ISODateString,
  type NextAuthOptions,
  getServerSession,
} from 'next-auth'
import type { Adapter } from 'next-auth/adapters'
import Github from 'next-auth/providers/github'
import { db } from '~/server/db'
import { baseLogger } from '~/server/lib'

const MAX_AGE = 7 * 24 * 60 * 60 // 7 days
const logger = baseLogger('auth')

declare module 'next-auth' {
  interface User {
    id: string
    name: string
    email: string
    admin: boolean
  }
  interface AdapterUser extends User {}
  interface Session {
    user: User
    expires: ISODateString
  }
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.user = user
      }
      return token
    },
    session({ session, token }) {
      session.user = token.user as any
      return session
    },
  },
  session: { strategy: 'jwt', maxAge: MAX_AGE },
  jwt: { maxAge: MAX_AGE },
  adapter: DrizzleAdapter(db) as Adapter,
  providers: [
    Github({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  events: {
    signIn: async ({ user }) => {
      logger.info({ name: user.name, email: user.email }, 'user logged in')
    },
    signOut: async ({ token }) => {
      if (token) {
        logger.info({ name: token.name, email: token.email }, 'user logged out')
      } else {
        logger.info(`Unknown user has logged out !`)
      }
    },
  },
}

export const getServerAuthSession = () => getServerSession(authOptions)

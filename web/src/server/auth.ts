import { DrizzleAdapter } from '@auth/drizzle-adapter'
import {
  ISODateString,
  type NextAuthOptions,
  getServerSession,
} from 'next-auth'
import type { Adapter } from 'next-auth/adapters'
import Github from 'next-auth/providers/github'
import { db } from '~/server/db'
import { accounts, sessions, users, verificationTokens } from './db/schema'

const MAX_AGE = 7 * 24 * 60 * 60 // 7 days

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
        console.log('jwt', user)
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
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }) as Adapter,
  providers: [
    Github({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  events: {
    signIn: async ({ user }) => {
      console.log(`Utente ${user.name} (${user.email}) ha effettuato il login`)
    },
    signOut: async ({ token }) => {
      if (token) {
        console.log(
          `Utente ${token.name} (${token.email}) ha effettuato il logout`
        )
      } else {
        console.log(`Utente sconosciuto ha effettuato il logout`)
      }
    },
  },
}

export const getServerAuthSession = () => getServerSession(authOptions)

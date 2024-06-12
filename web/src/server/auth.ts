import { DrizzleAdapter } from '@auth/drizzle-adapter';
import {
  type DefaultSession,
  type NextAuthOptions,
  getServerSession,
} from 'next-auth';
import type { Adapter } from 'next-auth/adapters';
import Github from 'next-auth/providers/github';
import { db } from '~/server/db';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
    } & DefaultSession['user'];
  }
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
    redirect: async ({ url, baseUrl }: { url: string, baseUrl: string }) => {
      if (url.startsWith(baseUrl)) {
        return `${baseUrl}/dashboard`;
      }
      return baseUrl;
    },
  },
  adapter: DrizzleAdapter(db) as Adapter,
  providers: [
    Github({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  debug: true,
};

export const getServerAuthSession = () => getServerSession(authOptions);

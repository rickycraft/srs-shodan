import { Viewport } from 'next'
import { Inter as FontSans } from 'next/font/google'
import { Toaster } from '~/components/ui/toaster'
import { cn } from '~/components/utils'
import '~/styles/globals.css'
import SessionLayout from './SessionLayout'
import type { Session } from 'next-auth'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const viewport: Viewport = {
  themeColor: 'black',
}

export default function RootLayout({
  children,
  session,
}: {
  children: React.ReactNode
  session: Session | null
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable
        )}
      >
        <SessionLayout session={session}>{children}</SessionLayout>
        <Toaster />
      </body>
    </html>
  )
}

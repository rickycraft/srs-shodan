'use client'

import { SessionProvider, useSession } from 'next-auth/react'
import Link from 'next/link'
import { MainNav } from './main-nav'
import { buttonVariants } from './ui/button'
import { cn } from './utils'
// const UserAccountNav = dynamic(() => import('./user-nav'), { ssr: false })

const LoginNav = () => (
  <nav>
    <Link
      href="/login"
      className={cn(
        buttonVariants({ variant: 'secondary', size: 'sm' }),
        'px-4'
      )}
    >
      Login
    </Link>
  </nav>
)

function NavWrapper() {
  const session = useSession()
  const authed = session.status == 'authenticated'
  const user = session.data?.user
  const isAdmin = false

  // const UserNav = () =>
  //   session.status == 'loading' ? null : authed ? (
  //     <UserAccountNav
  //       user={{
  //         name: session.data.user.name,
  //         username: session.data.user.email,
  //       }}
  //     />
  //   ) : (
  //     <LoginNav />
  //   )

  return (
    <>
      <MainNav items={[]} isAdmin={isAdmin} />
      {/* <UserNav /> */}
    </>
  )
}

export default function Nav() {
  return (
    <SessionProvider>
      <NavWrapper />
    </SessionProvider>
  )
}

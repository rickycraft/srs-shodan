'use client'

import { SessionProvider, useSession } from 'next-auth/react'
import Link from 'next/link'
import { MainNav, NavItem } from './main-nav'
import { buttonVariants } from './ui/button'
import { UserNav } from './user-nav'
import { cn } from './utils'

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

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    requireAdmin: false,
  },
  {
    title: 'Admin',
    href: '/dashboard/admin',
    requireAdmin: true,
  },
]

function NavWrapper() {
  const session = useSession()
  const authed = session.status == 'authenticated'
  const user = session.data?.user
  const isAdmin = user?.admin || false

  const AccountNav = () =>
    session.status == 'loading' ? null : authed && user ? (
      <UserNav
        name={user.name}
        email={user.email}
        image={user.image || undefined}
        admin={user.admin}
      />
    ) : (
      <LoginNav />
    )

  return (
    <>
      <MainNav items={navItems} isAdmin={isAdmin} />
      <AccountNav />
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

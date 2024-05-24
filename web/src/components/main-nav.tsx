'use client'

import { CircleXIcon, ShieldBanIcon } from 'lucide-react'
import { Route } from 'next'
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'
import * as React from 'react'
import { cn } from './utils'

export type NavItem = {
  title: string
  href: Route
  requireAdmin?: boolean
}

interface MainNavProps {
  items?: NavItem[]
  children?: React.ReactNode
  isAdmin: boolean | undefined
}

export function MainNav({ items, children, isAdmin }: MainNavProps) {
  const segment = useSelectedLayoutSegment()
  const [showMobileMenu, setShowMobileMenu] = React.useState<boolean>(false)
  const filteredItems = items?.filter(
    (item) => !item.requireAdmin || isAdmin == true
  )

  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="hidden items-center space-x-2 md:flex">
        <ShieldBanIcon />
        <span className="hidden font-bold sm:inline-block">SRS SHODAN</span>
      </Link>
      {filteredItems?.length ? (
        <nav className="hidden gap-6 md:flex">
          {filteredItems?.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className={cn(
                'flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm',
                item.href.startsWith(`/${segment}`)
                  ? 'text-foreground'
                  : 'text-foreground/60'
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>
      ) : null}
      <button
        className="flex items-center space-x-2 md:hidden"
        onClick={() => setShowMobileMenu(!showMobileMenu)}
      >
        {showMobileMenu ? <CircleXIcon /> : <ShieldBanIcon />}
        <span className="font-bold">Menu</span>
      </button>
    </div>
  )
}

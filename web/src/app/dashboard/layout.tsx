import Nav from '@/components/nav'
import { Suspense } from 'react'

interface DefaultLayoutProps {
  children: React.ReactNode
}

export default function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <div className="w-100 flex min-h-screen flex-col px-3 lg:px-8">
      <header className="z-40 bg-background">
        <div className="h-15 flex items-center justify-between py-3 md:py-4 lg:h-20">
          <Suspense>
            <Nav />
          </Suspense>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}

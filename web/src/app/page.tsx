import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '~/server/auth'
import { User } from 'next-auth'

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  const user: User | null = session ? session.user : null

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          <span className="text-[hsl(280,100%,70%)]">SHODAN Monitoring</span>{' '}
          WebApp
        </h1>
        {user && <div className="mt-4 text-lg">Benvenuto, {user.name}!</div>}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
            href="/dashboard"
          >
            <h3 className="text-2xl font-bold">Go to Dashboard →</h3>
            <div className="text-lg">Vai alla dashboard</div>
          </Link>
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
            href="https://github.com/rickycraft/srs-shodan"
            target="_blank"
          >
            <h3 className="text-2xl font-bold">Repo Github →</h3>
            <div className="text-lg">
              Repository GitHub del Progetto di Scalable and Reliable Services M
            </div>
          </Link>
        </div>
      </div>
    </main>
  )
}

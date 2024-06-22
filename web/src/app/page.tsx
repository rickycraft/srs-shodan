import { ArrowRight } from 'lucide-react'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { authOptions } from '~/server/auth'

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  const user = session ? session.user : null

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white">
      <h1 className="text-5xl font-bold text-purple-700">
        SHODAN <span className="text-black">Monitoring</span>{' '}
        <span className="text-black">WebApp</span>
      </h1>
      {user && (
        <p className="mt-4 text-lg text-gray-700">Welcome, {user.name}!</p>
      )}
      <div className="mt-8 grid grid-cols-2 space-x-4">
        <Link href="/dashboard">
          <Card className="bg-white p-4 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Go to Dashboard{' '}
                <ArrowRight className="ml-2 inline-block h-5 w-5" />
              </CardTitle>
              <CardDescription className="text-gray-600">
                Here you can find the monitored ip
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link href="https://github.com/rickycraft/srs-shodan" target="_blank">
          <Card className="bg-white p-4 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Github Repository{' '}
                <ArrowRight className="ml-2 inline-block h-5 w-5" />
              </CardTitle>
              <CardDescription className="text-gray-600">
                Project for Scalable and Reliable Services M
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  )
}

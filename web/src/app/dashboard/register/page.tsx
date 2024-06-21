import { CircleAlert, CircleCheck } from 'lucide-react'
import Link from 'next/link'

const Message = ({ status }: { status: string | undefined }) => {
  switch (status) {
    case 'now':
      return <RegisterSuccess />
    case 'already':
      return <RegisterAlready />
    default:
      return <RegisterFail />
  }
}

const RegisterSuccess = () => (
  <>
    <CircleCheck className="h-12 w-12 text-green-500" />
    <div className="space-y-2 text-center">
      <h2 className="text-2xl font-bold">Congratulations!</h2>
      <p className="text-muted-foreground">
        You have successfully registered your telegram chat id.
      </p>
    </div>
  </>
)

const RegisterAlready = () => (
  <>
    <CircleCheck className="h-12 w-12 text-green-500" />
    <div className="space-y-2 text-center">
      <p className="text-muted-foreground">Your id was already registered.</p>
    </div>
  </>
)

const RegisterFail = () => (
  <>
    <CircleAlert className="h-12 w-12 text-red-500" />
    <div className="space-y-2 text-center">
      <h2 className="text-2xl font-bold">Something went wrong</h2>
    </div>
  </>
)

export default function Register({
  searchParams,
}: {
  searchParams: { status: string | undefined }
}) {
  const status = searchParams['status']
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-lg space-y-6 rounded-lg border bg-card p-8 shadow-lg">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Message status={status} />
        </div>
        <Link
          href="/dashboard"
          className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          prefetch={false}
        >
          Return to Home
        </Link>
      </div>
    </div>
  )
}

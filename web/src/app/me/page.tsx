'use client'
import { SessionProvider, useSession } from 'next-auth/react'

const _MePage = () => {
  const { data, status } = useSession()

  if (status == 'loading') {
    return <div>Loading...</div>
  }

  if (status == 'unauthenticated' || !data) {
    return <div>You are not logged in.</div>
  }

  return (
    <div>
      <p>Id: {data.user.id}</p>
      <h1>Welcome, {data.user.name}!</h1>
      <p>Email: {data.user.email}</p>
    </div>
  )
}

export default function MePage() {
  return (
    <SessionProvider>
      <_MePage />
    </SessionProvider>
  )
}

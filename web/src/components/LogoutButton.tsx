'use client'

import { signOut } from 'next-auth/react'

const LogoutButton = () => {
  const handleLogout = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
    >
      Logout
    </button>
  )
}

export default LogoutButton

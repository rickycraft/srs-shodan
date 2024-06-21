'use client'

import { GithubIcon } from 'lucide-react'
import { Button } from '~/components/ui/button'

export default function LoginPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="mx-4 w-full max-w-lg space-y-8 rounded-lg border border-input bg-card p-8 shadow-lg sm:mx-0">
        <div className="flex flex-col items-center justify-center space-y-3">
          <GithubIcon className="h-12 w-12 text-primary" />
          <h1 className="text-3xl font-bold">Sign in with GitHub</h1>
          <p className="text-muted-foreground">
            Sign in to your account using your GitHub Oauth.
          </p>
        </div>
        <Button className="w-full">
          <GithubIcon className="mr-2 h-4 w-4" />
          Sign in with GitHub
        </Button>
      </div>
    </div>
  )
}

'use client'
import { LoaderCircle } from 'lucide-react'
import { FormEvent, useState } from 'react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { toast } from '~/components/ui/use-toast'
import { addNotification } from '~/server/action'

export default function AddNotification() {
  const [isLoading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    try {
      await addNotification(formData)
      toast({
        title: `IP ${formData.get('ip')} added successfully`,
        variant: 'default',
      })
    } catch (err) {
      console.error(err)
      toast({
        title: `Errore adding ${formData.get('ip')}`,
        description: (err as Error).message,
        variant: 'destructive',
      })
    }

    const f = e.target as HTMLFormElement
    f.reset()
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center space-x-4">
        <Input
          className="rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Add IP Address"
          type="text"
          name="ip"
          disabled={isLoading}
        />
        <Button variant="default" type="submit" disabled={isLoading}>
          {isLoading ? <LoaderCircle className="animate-spin" /> : <p>Add</p>}
        </Button>
      </div>
    </form>
  )
}

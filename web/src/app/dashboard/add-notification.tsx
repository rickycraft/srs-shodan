'use client'
import { FormEvent } from 'react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { addNotification } from '~/server/action'

export default function AddNotification() {
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    await addNotification(formData)

    const f = e.target as HTMLFormElement
    f.reset()
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center space-x-4">
        <Input
          className="rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Add IP Address"
          type="text"
          name="ip"
        />
        <Button variant="default" type="submit">
          Add
        </Button>
      </div>
    </form>
  )
}

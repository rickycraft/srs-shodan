'use client'
import { LoaderCircle } from 'lucide-react'
import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { toast } from '~/components/ui/use-toast'
import { delNotification } from '~/server/action'

export default function DelNotification({ aid }: { aid: string }) {
  const [isLoading, setLoading] = useState(false)

  const handleSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      await delNotification(data)
      toast({
        title: `Notification deleted successfully`,
        variant: 'default',
      })
    } catch (err) {
      console.error(err)
      toast({
        title: `Error deleting ${data.get('aid')}`,
        variant: 'destructive',
      })
    }
    setLoading(false)
  }

  return (
    <form action={handleSubmit}>
      <input type="hidden" name="aid" value={aid} />
      <Button size="sm" variant="secondary" disabled={isLoading}>
        {isLoading ? <LoaderCircle className="animate-spin" /> : <p>Delete</p>}
      </Button>
    </form>
  )
}

import { Button } from '@/ui/button'
import { Card, CardContent } from '@/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/ui/table'
import { eq } from 'drizzle-orm'
import { getServerSession } from 'next-auth'
import { delNotification } from '~/server/action'
import { authOptions } from '~/server/auth'
import { db } from '~/server/db'
import { notification, shodanAlert } from '~/server/db/schema'
import AddNotification from './add-notification'

export default async function Component() {
  const session = await getServerSession(authOptions)
  if (!session) return <div>403</div>

  const items = await db
    .select({
      id: shodanAlert.id,
      ip: shodanAlert.ip,
      trigger: shodanAlert.trigger,
      user: notification.userId,
    })
    .from(shodanAlert)
    .leftJoin(notification, eq(shodanAlert.id, notification.alertId))
    .where(eq(notification.userId, session.user.id))

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">IP Addresses</h1>
        <AddNotification />
      </div>
      <Card>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>IP</TableHead>
                  <TableHead>Trigger</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.ip}</TableCell>
                    <TableCell>{item.trigger}</TableCell>
                    <TableCell>
                      <form action={delNotification}>
                        <input type="hidden" name="aid" value={item.id} />
                        <Button size="sm" variant="secondary">
                          Delete
                        </Button>
                      </form>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

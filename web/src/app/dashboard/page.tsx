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
import { db } from '~/server/db'
import { notification, shodanAlert } from '~/server/db/schema'
import { getServerUser } from '~/server/lib'
import AddNotification from './add-notification'
import DelNotification from './del-notification'
import LogoutButton from '~/components/LogoutButton'

export default async function Page() {
  const user = await getServerUser()

  const items = await db
    .select({
      id: shodanAlert.id,
      ip: shodanAlert.ip,
      trigger: shodanAlert.trigger,
      user: notification.userId,
    })
    .from(shodanAlert)
    .leftJoin(notification, eq(shodanAlert.id, notification.alertId))
    .where(eq(notification.userId, user.id))

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Monitored address</h1>
        <AddNotification />
      </div>
      <Card>
        <CardContent>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Dashboard</h2>
            <LogoutButton />
          </div>
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
                      <DelNotification aid={item.id} />
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

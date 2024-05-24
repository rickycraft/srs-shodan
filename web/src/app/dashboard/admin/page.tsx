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
import { notification, shodanAlert, users } from '~/server/db/schema'

export default async function Component() {
  // middleware should check if is admin

  const items = await db
    .select({
      id: shodanAlert.id,
      ip: shodanAlert.ip,
      trigger: shodanAlert.trigger,
      name: users.name,
      email: users.email,
    })
    .from(shodanAlert)
    .innerJoin(notification, eq(shodanAlert.id, notification.alertId))
    .leftJoin(users, eq(notification.userId, users.id))
    .orderBy(shodanAlert.ip, users.name)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">All Monitored address</h1>
        <div />
      </div>
      <Card>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>IP</TableHead>
                  <TableHead>Trigger</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.ip}</TableCell>
                    <TableCell>{item.trigger}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.email}</TableCell>
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

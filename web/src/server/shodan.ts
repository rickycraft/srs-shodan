import { eq } from 'drizzle-orm'
import { db } from './db'
import { shodanAlert } from './db/schema'

const base_url = `https://${process.env.AZURE_FUNC_NAME}.azurewebsites.net/ShodanAPI?code=${process.env.AZURE_FUNC_TOKEN}`
const ip_url = (ip: string) => `${base_url}&ip=${ip}`

type list_alert = { id: string; name: string; ip: string }[]
type alert = { ip: string; aid: string }

export const shodan_get_alert = async (ip: string) => {
  const response = await fetch(ip_url(ip), { method: 'GET' })
  if (response.status !== 200) {
    throw new Error(`Error shodan_get_alert\n${await response.text()}`)
  }
  const json = (await response.json()) as alert
  return json
}

export const shodan_add_alert = async (ip: string) => {
  // check if the alert is in the database
  const alert = await db.query.shodanAlert.findFirst({
    where: (row, { eq }) => eq(row.ip, ip),
  })
  if (alert) return alert.id
  // call the azure function
  const response = await fetch(ip_url(ip), { method: 'POST' })
  if (response.status !== 200) {
    throw new Error(`Error shodan_add_alert\n${await response.text()}`)
  }
  const json = (await response.json()) as alert
  // add the alert to the database
  await db.insert(shodanAlert).values({ ip: json.ip, id: json.aid })

  return json.aid
}

export const shodan_del_alert = async (aid: string) => {
  // check if the alert is in the database
  const alert = await db.query.shodanAlert.findFirst({
    where: (row, { eq }) => eq(row.id, aid),
  })
  if (!alert) throw new Error(`Alert ${aid} does not exist in the database`)
  // call the azure function
  const ip = alert.ip
  const response = await fetch(ip_url(ip), { method: 'DELETE' })
  if (response.status !== 200) {
    throw new Error(`Error shodan_del_alert\n${await response.text()}`)
  }
  // remove the alert from the database
  await db.delete(shodanAlert).where(eq(shodanAlert.ip, ip))
  return alert.id
}

export const shodan_alerts = async () => {
  const response = await fetch(base_url, { method: 'GET' })
  if (response.status !== 200) {
    console.error(await response.text(), response.status)
    return []
  }

  const json = (await response.json()) as list_alert
  return json
}

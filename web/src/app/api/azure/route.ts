import { NextResponse } from 'next/server'

async function handler(_req: Request) {
  try {
    const token = process.env.AZURE_FUNC_TOKEN
    const name = process.env.AZURE_FUNC_NAME
    const response = await fetch(
      `https://${name}.azurewebsites.net/AuthTest?code=${token}`
    )
    if (response.status !== 200) {
      throw new Error('Failed to authenticate with Azure Function')
    }
    const body = await response.text()
    console.log(body)
    return NextResponse.json({ ok: true, body })
  } catch (error) {
    return NextResponse.json(error, { status: 500 })
  }
}

export { handler as GET, handler as POST }

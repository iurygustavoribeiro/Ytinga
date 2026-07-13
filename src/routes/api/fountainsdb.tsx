import db from '@/lib/db'
import { fountainTable } from '@/lib/db/schema'
import { createFileRoute } from '@tanstack/react-router'
import { eq } from 'drizzle-orm'

export const Route = createFileRoute('/api/fountainsdb')({
  component: RouteComponent,
  server: {
    handlers: {
      GET: handleGet,
    },
  },
})

export async function handleGet() {
  const fountains = await db.select().from(fountainTable).where(eq(fountainTable.institution_id, 1)) // preciso criar o cadastro do usuário pra começar a mexer nisso aqui
  return new Response(JSON.stringify(fountains), {
    status: 200,
    headers: {"Content-Type": "application/json"}
  })
}

function RouteComponent() {
  return <div>Hello "/api/fountainsdb"!</div>
}

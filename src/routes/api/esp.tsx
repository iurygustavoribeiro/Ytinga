/*
Data format:
- Temperature (float)
- pH (int)
- turbidity (int)
*/
import { createFileRoute } from '@tanstack/react-router'
import db from '../../lib/db/index';
import { measureTable } from '../../lib/db/schema';

export async function handlePost({request}: {request: Request}) {
  const data = await request.json()

  if (data.api_key != process.env.apikey) {
    return new Response(null, {
    status: 401,
    headers: {"Content-Type": "application/json"}
    })
  }

  const {temperature, turbidity, ph} = data
  
  await db.insert(measureTable).values({ temperature, turbidity, ph });
  //await db.insert(deviceTable).values({id: device_id, working: true, createdAt: new Date()});

  return new Response(null, {
    status: 201,
    headers: {"Content-Type": "application/json"}
  })
}

export const Route = createFileRoute('/api/esp')({
  server: {
    handlers: {
      POST: handlePost,
    },
  },
})

import { createServerFn } from "@tanstack/react-start";
import db from "@/lib/db";
import { fountainTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const queryFountainsByInstitution = createServerFn()
  .handler(async () => {
    const fountains = await db.select().from(fountainTable).where(eq(fountainTable.institution_id, 1))
    return fountains.map(fountain => ({
      id: fountain.id,
      reference: fountain.reference,
    }))
  })
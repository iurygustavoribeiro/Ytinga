import { createServerFn } from "@tanstack/react-start";
import db from "@/lib/db";
import { institutionTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const queryInstitutionsByCity = createServerFn()
  .handler(async () => {
    const institutions = await db.select().from(institutionTable).where(eq(institutionTable.city_id, 1))
    return institutions.map(institution => ({
      id: institution.id,
      name: institution.name,
      address: institution.address,
    }))
  })  
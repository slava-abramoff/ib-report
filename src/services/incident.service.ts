import { eq, sql } from "drizzle-orm";
import { db } from "../db/db";
import { incidents, NewIncident } from "../models/incident.model";

export const incidentService = {
  async getAll(skip = 0, limit = 10) {
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(incidents);

    const data = await db.select().from(incidents).limit(limit).offset(skip);
    return {
      total: count,
      skip,
      limit,
      data,
    };
  },

  create(data: NewIncident) {
    return db.insert(incidents).values(data).run();
  },

  async getById(id: number) {
    const [incident] = await db
      .select()
      .from(incidents)
      .where(eq(incidents.id, id));
    return incident;
  },

  async update(id: number, data: Partial<NewIncident>) {
    const result = await db
      .update(incidents)
      .set(data)
      .where(eq(incidents.id, id))
      .run();
    return result;
  },

  async delete(id: number) {
    const result = await db.delete(incidents).where(eq(incidents.id, id)).run();
    return result;
  },
};

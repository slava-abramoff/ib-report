import { eq, sql } from "drizzle-orm";
import { db } from "../db/db";
import { NewEvent, events } from "../models/event.model";

export const eventService = {
  async getAll(skip = 0, limit = 10) {
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(events);

    const data = await db.select().from(events).limit(limit).offset(skip);

    return {
      total: count,
      skip,
      limit,
      data,
    };
  },

  create(data: NewEvent) {
    return db.insert(events).values(data).run();
  },

  async getById(id: number) {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event;
  },

  async update(id: number, data: Partial<NewEvent>) {
    if (Object.keys(data).length === 0) {
      return { changes: 0 };
    }
    const result = await db
      .update(events)
      .set(data)
      .where(eq(events.id, id))
      .run();
    return result;
  },

  async delete(id: number) {
    const result = await db.delete(events).where(eq(events.id, id)).run();
    return result;
  },
};

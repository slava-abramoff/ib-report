import { eq } from "drizzle-orm";
import { db } from "../db/db";
import { NewEvent, events } from "../models/event.model";

export const eventService = {
  getAll: () => db.select().from(events).all(),

  create: (data: NewEvent) => db.insert(events).values(data).run(),

  async getById(id: number) {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event;
  },

  async update(id: number, data: Partial<NewEvent>) {
    const result = await db.update(events)
      .set(data)
      .where(eq(events.id, id))
      .run();
    return result;
  },

  async delete(id: number) {
    const result = await db.delete(events)
      .where(eq(events.id, id))
      .run();
    return result;
  },
};

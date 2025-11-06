import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { InferModel, sql } from "drizzle-orm";

export const events = sqliteTable("event", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  date: text("date").notNull(),
  number: text("number").notNull().unique(),
  surname: text("surname"),
  address: text("address").notNull(),
  phoneNumber: text("phone_number").notNull(),
  mail: text("mail"),
  happened: text("happened").notNull(),
  happenedCause: text("happened_cause"),
  rootCause: text("root_cause").notNull(),
  affectedComponents: text("affected_components").notNull(),
  businessImpact: text("business_impact").notNull(),
  identifiedVulnerabilities: text("identified_vulnerabilities").notNull(),
  isEventResolved: integer("is_event_resolved", { mode: "boolean" }).notNull(),
  eventDuration: text("event_duration"),

  start: text("start"),
  detect: text("detect"),
  end: text("end"),

  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export type Event = InferModel<typeof events>;
export type NewEvent = InferModel<typeof events, "insert">;

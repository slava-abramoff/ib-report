import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { InferModel } from "drizzle-orm";


export const events = sqliteTable("event", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    dateEvent: text("date-event").notNull(),
    numberEvent: text("number-event").notNull(),
    address: text("address").notNull(),
    phoneNumber: text("phone-number").notNull(),
    mail: text("mail"),
    incidentDescription: text("incident_description").notNull(),
    incidentCause: text("incident_cause").notNull(),
    rootCause: text("root_cause").notNull(),
    affectedComponents: text("affected_components").notNull(),
    businessImpact: text("business_impact").notNull(),
    identifiedVulnerabilities: text("identified_vulnerabilities").notNull(),
    eventStartTime: text("event_start_time").notNull(),        
    eventDetectionTime: text("event_detection_time").notNull(), 
    eventReportTime: text("event_report_time").notNull(),      
    isEventResolved: integer("is_event_resolved", { mode: "boolean" }).notNull(), 
    eventDuration: text("event_duration"), 
})

export type Event = InferModel<typeof events>;
export type NewEvent = InferModel<typeof events, "insert">;
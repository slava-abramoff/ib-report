import { z } from "zod";

export const createEventSchema = z.object({
  dateEvent: z.string().min(5),
  numberEvent: z.string().min(1),
  address: z.string().min(1),
  phoneNumber: z.string().min(1),
  mail: z.string().optional(),
  incidentDescription: z.string().min(1),
  incidentCause: z.string().min(1),
  rootCause: z.string().min(1),
  affectedComponents: z.string().min(1),
  businessImpact: z.string().min(1),
  identifiedVulnerabilities: z.string().min(1),
  eventStartTime: z.string(),
  eventDetectionTime: z.string(),
  eventReportTime: z.string(),
  isEventResolved: z.boolean(),
  eventDuration: z.string().optional(),
});

export type CreateEventDTO = z.infer<typeof createEventSchema>;

import { z } from "zod";

export const createEventSchema = z.object({
  date: z.string().min(5),
  number: z.string().min(1),
  surname: z.string().min(1).max(50),
  address: z.string().min(1),
  phoneNumber: z.string().min(1),
  mail: z.string().optional(),
  happened: z.string().min(1),
  happenedCause: z.string().min(1),
  rootCause: z.string().min(1),
  affectedComponents: z.string().min(1),
  businessImpact: z.string().min(1),
  identifiedVulnerabilities: z.string().min(1),
  isEventResolved: z.boolean(),
  eventDuration: z.string().optional(),
  start: z.string().optional(),
  detect: z.string().optional(),
  end: z.string().optional(),
});

export type CreateEventDTO = z.infer<typeof createEventSchema>;

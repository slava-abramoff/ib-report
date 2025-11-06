import { FastifyInstance } from "fastify";
import { eventService } from "../services/event.service";
import { Event } from "../models/event.model";
import { CreateEventDTO, createEventSchema } from "../dto/create-event.dto";
import { ZodError } from "zod";

export default async function eventRoutes(fastify: FastifyInstance) {
  fastify.get("/events", async () => {
    return eventService.getAll();
  });

  fastify.post<{ Body: CreateEventDTO }>("/events", async (req, reply) => {
    try {
      const parsedBody = createEventSchema.parse(req.body);
      const result = await eventService.create(parsedBody);

      reply.code(201).send({ success: true, id: result.lastInsertRowid })
    } catch (err) {
      if (err instanceof ZodError) {
        reply.code(400).send({err: "Validation error", details: err })
      } else {
        console.error(err);
        reply.code(500).send({ error: "Internal server error" });
      }
    }
  });
}
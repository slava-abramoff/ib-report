import { FastifyInstance } from "fastify";
import { eventService } from "../services/event.service";
import { Event } from "../models/event.model";
import { CreateEventDTO, createEventSchema } from "../dto/create-event.dto";
import { ZodError } from "zod";
import path from "path";
import fs from "fs";
import { generateEventsPDF } from "../utils/pdf-generator";

export default async function eventRoutes(fastify: FastifyInstance) {
  fastify.get("/events", async (req, reply) => {
    try {
      const { skip, limit } = req.query as {
        skip: string;
        limit: string;
      };

      const skipNum = Number(skip) || 0;
      const limitNum = Number(limit) || 10;

      const result = eventService.getAll(skipNum, limitNum);

      reply.code(200).send({ success: true, data: result });
    } catch (err) {
      console.error(err);
    }
  });

  fastify.post<{ Body: CreateEventDTO }>("/events", async (req, reply) => {
    try {
      const parsedBody = createEventSchema.parse(req.body);
      const result = await eventService.create(parsedBody);

      reply.code(201).send({ success: true, id: result.lastInsertRowid });
    } catch (err) {
      if (err instanceof ZodError) {
        reply.code(400).send({ err: "Validation error", details: err });
      } else {
        console.error(err);
        reply.code(500).send({ error: "Internal server error" });
      }
    }
  });

  fastify.get("/events/:id/doc", async (req, reply) => {
    try {
      const { id } = req.params as { id: number };

      if (isNaN(id)) return reply.code(401).send({ error: "Bad request" });

      const event = await eventService.getById(id);
      if (!event) return reply.code(404).send({ error: "Event not found" });

      const outputPath = path.resolve(`./src/tmp/event_doc-${event.number}`);

      generateEventsPDF(event, outputPath);

      await new Promise((resolve) => setTimeout(resolve, 300));

      if (!fs.existsSync(outputPath)) {
        return reply.code(500).send({ error: "Failed to generate PDF" });
      }

      reply.redirect(`/docs/event/${event.number}`);
    } catch (err) {
      console.error(err);
      reply.code(500).send({ error: "Internal server error" });
    }
  });
}

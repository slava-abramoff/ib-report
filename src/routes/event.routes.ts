// routes/event.routes.ts (дополненный вариант)

import { FastifyInstance } from "fastify";
import { eventService } from "../services/event.service";
import { CreateEventDTO, createEventSchema } from "../dto/create-event.dto";
import { ZodError } from "zod";
import path from "path";
import fs from "fs";
import { generateEventsPDF } from "../utils/pdf-generator";

export default async function eventRoutes(fastify: FastifyInstance) {
  const auth = fastify.auth;

  // GET /events — список с пагинацией
  fastify.get("/events", { preHandler: [auth] }, async (req, reply) => {
    try {
      const { skip, limit } = req.query as { skip?: string; limit?: string };
      const skipNum = Number(skip) || 0;
      const limitNum = Number(limit) || 10;
      const result = await eventService.getAll(skipNum, limitNum);
      reply.code(200).send({ success: true, data: result });
    } catch (err) {
      console.error(err);
      reply.code(500).send({ error: "Internal server error" });
    }
  });

  // GET /events/:id — детализация
  fastify.get("/events/:id", { preHandler: [auth] }, async (req, reply) => {
    try {
      const { id } = req.params as { id: string };
      const numId = Number(id);
      if (isNaN(numId)) return reply.code(400).send({ error: "Bad request" });

      const event = await eventService.getById(numId);
      if (!event) return reply.code(404).send({ error: "Event not found" });

      reply.code(200).send({ success: true, data: event });
    } catch (err) {
      console.error(err);
      reply.code(500).send({ error: "Internal server error" });
    }
  });

  // POST /events — создание
  fastify.post<{ Body: CreateEventDTO }>(
    "/events",
    { preHandler: [auth] },
    async (req, reply) => {
      try {
        const parsedBody = createEventSchema.parse(req.body);
        const result = await eventService.create(parsedBody);
        reply.code(201).send({ success: true, id: result.lastInsertRowid });
      } catch (err) {
        if (err instanceof ZodError) {
          reply
            .code(400)
            .send({ error: "Validation error", details: err.errors });
        } else {
          console.error(err);
          reply.code(500).send({ error: "Internal server error" });
        }
      }
    },
  );

  // PUT /events/:id — полное обновление события
  fastify.put<{ Params: { id: string }; Body: Partial<CreateEventDTO> }>(
    "/events/:id",
    { preHandler: [auth] },
    async (req, reply) => {
      try {
        const { id } = req.params;
        const numId = Number(id);
        if (isNaN(numId)) return reply.code(400).send({ error: "Invalid ID" });

        // Проверяем, существует ли событие
        const existingEvent = await eventService.getById(numId);
        if (!existingEvent) {
          return reply.code(404).send({ error: "Event not found" });
        }

        // Опционально: можно добавить валидацию через Zod, если нужно строго
        const result = await eventService.update(numId, req.body);

        reply
          .code(200)
          .send({ success: true, message: "Event updated successfully" });
      } catch (err) {
        console.error("Update error:", err);
        reply.code(500).send({ error: "Internal server error" });
      }
    },
  );

  // DELETE /events/:id — удаление события
  fastify.delete<{ Params: { id: string } }>(
    "/events/:id",
    { preHandler: [auth] },
    async (req, reply) => {
      try {
        const { id } = req.params;
        const numId = Number(id);
        if (isNaN(numId)) return reply.code(400).send({ error: "Invalid ID" });

        const existingEvent = await eventService.getById(numId);
        if (!existingEvent) {
          return reply.code(404).send({ error: "Event not found" });
        }

        await eventService.delete(numId);

        reply
          .code(200)
          .send({ success: true, message: "Event deleted successfully" });
      } catch (err) {
        console.error("Delete error:", err);
        reply.code(500).send({ error: "Internal server error" });
      }
    },
  );

  // GET /events/:id/doc — генерация PDF
  fastify.get("/events/:id/doc", { preHandler: [auth] }, async (req, reply) => {
    try {
      const { id } = req.params as { id: string };
      const numId = Number(id);
      if (isNaN(numId)) return reply.code(400).send({ error: "Bad request" });

      const event = await eventService.getById(numId);
      if (!event) return reply.code(404).send({ error: "Event not found" });

      const outputPath = path.resolve(
        `./src/tmp/event_doc-${event.number}.pdf`,
      );
      await generateEventsPDF(event, outputPath); // лучше сделать async!

      if (!fs.existsSync(outputPath)) {
        return reply.code(500).send({ error: "Failed to generate PDF" });
      }

      reply.redirect(`/docs/event/${event.number}.pdf`);
    } catch (err) {
      console.error(err);
      reply.code(500).send({ error: "Internal server error" });
    }
  });
}

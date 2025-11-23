import { FastifyInstance } from "fastify";
import { incidentService } from "../services/incident.service";
import {
  CreateIncidentDTO,
  createIncidentSchema,
} from "../dto/create-incident.dto";
import { ZodError } from "zod";
import path from "path";
import fs from "fs";
import { generateIncidentsPDF } from "../utils/pdf-generator";

export default async function incidentRoutes(fastify: FastifyInstance) {
  const auth = fastify.auth;

  fastify.get("/incidents", { preHandler: [auth] }, async (req, reply) => {
    try {
      const { skip, limit } = req.query as {
        skip?: string;
        limit?: string;
      };

      const skipNum = Number(skip) || 0;
      const limitNum = Number(limit) || 10;

      const result = await incidentService.getAll(skipNum, limitNum);

      reply.code(200).send({ success: true, data: result });
    } catch (err) {
      console.error(err);
      reply.code(500).send({ error: "Internal server error" });
    }
  });

  fastify.get("/incidents/:id/doc", async (req, reply) => {
    try {
      const { id } = req.params as { id: number };

      if (isNaN(id)) return reply.code(401).send({ error: "Bad request" });

      const incident = await incidentService.getById(id);
      if (!incident)
        return reply.code(404).send({ error: "Incidents not found" });

      const outputPath = path.resolve(
        `./src/tmp/incident_doc-${incident.incidentNumber}`,
      );

      generateIncidentsPDF(incident, outputPath);

      await new Promise((resolve) => setTimeout(resolve, 300));

      if (!fs.existsSync(outputPath)) {
        return reply.code(500).send({ error: "Failed to generate PDF" });
      }

      reply.redirect(`/docs/incident/${incident.incidentNumber}`);
    } catch (err) {
      console.error(err);
      reply.code(500).send({ error: "Internal server error" });
    }
  });

  fastify.post<{ Body: CreateIncidentDTO }>(
    "/incidents",
    { preHandler: [auth] },
    async (req, reply) => {
      try {
        const parsedBody = createIncidentSchema.parse(req.body);
        const result = await incidentService.create(parsedBody);

        reply.code(201).send({ success: true, id: result.lastInsertRowid });
      } catch (err) {
        if (err instanceof ZodError) {
          reply.code(400).send({ error: "Validation error" });
        } else {
          console.error(err);
          reply.code(500).send({ error: "Internal server error" });
        }
      }
    },
  );

  fastify.get("/incidents/:id", async (req, reply) => {
    try {
      const { id } = req.params as { id: string };
      const numId = Number(id);
      if (isNaN(numId)) return reply.code(400).send({ error: "Bad request" });

      const incident = await incidentService.getById(numId);
      if (!incident)
        return reply.code(404).send({ error: "Incident not found" });

      reply.code(200).send({ success: true, data: incident });
    } catch (err) {
      console.error(err);
      reply.code(500).send({ error: "Internal server error" });
    }
  });

  fastify.put<{ Body: Partial<CreateIncidentDTO> }>(
    "/incidents/:id",
    async (req, reply) => {
      try {
        const { id } = req.params as { id: string };
        const numId = Number(id);
        if (isNaN(numId)) return reply.code(400).send({ error: "Bad request" });

        const result = await incidentService.update(numId, req.body);

        reply.code(200).send({ success: true, data: result });
      } catch (err) {
        console.error(err);
        reply.code(500).send({ error: "Internal server error" });
      }
    },
  );

  fastify.delete("/incidents/:id", async (req, reply) => {
    try {
      const { id } = req.params as { id: string };
      const numId = Number(id);
      if (isNaN(numId)) return reply.code(400).send({ error: "Bad request" });

      const result = await incidentService.delete(numId);

      reply.code(200).send({ success: true, data: result });
    } catch (err) {
      console.error(err);
      reply.code(500).send({ error: "Internal server error" });
    }
  });
}

import path from "path";
import fs from "fs";
import { eventService } from "../services/event.service";
import { generateEventsPDF } from "../utils/pdf-generator";
import { FastifyInstance } from "fastify";

export default async function pdfRoutes(fastify: FastifyInstance) {
  fastify.get("/events/:id/pdf", async (req, reply) => {
    try {
      const { id } = req.params as { id: string };

      const event = await eventService.getById(Number(id));
      if (!event) {
        return reply.code(404).send({ error: "Event not found" });
      }

      const outputPath = path.resolve(`./src/tmp/event_${event.numberEvent}.pdf`);

      generateEventsPDF(event, outputPath);

      await new Promise((resolve) => setTimeout(resolve, 300));

      if (!fs.existsSync(outputPath)) {
        return reply.code(500).send({ error: "Failed to generate PDF" });
      }

      reply.header("Content-Type", "application/pdf");
      reply.header("Content-Disposition", `attachment; filename=event_${event.numberEvent}.pdf`);

      const stream = fs.createReadStream(outputPath);
      stream.pipe(reply.raw);

      stream.on("end", () => {
        fs.unlinkSync(outputPath);
      });
    } catch (err) {
      console.error(err);
      reply.code(500).send({ error: "Internal server error" });
    }
  });
}
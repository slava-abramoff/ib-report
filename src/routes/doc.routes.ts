import { FastifyInstance } from "fastify";
import path from "path";
import fs from "fs/promises";

export default async function docRoutes(fastify: FastifyInstance) {
  fastify.get(`/docs/:type/:number`, async (req, reply) => {
    const { type, number } = req.params as {
      type: "event" | "incidient";
      number: string;
    };

    const fileName = `${type}_doc-${number}`;
    const filePath = path.join("./src/tmp", fileName);

    try {
      await fs.access(filePath);

      const fileStream = await fs.open(filePath, "r");
      const stream = fileStream.createReadStream();

      return reply.header("Content-Disposition", "inline").send(stream);
    } catch (err) {
      console.error(err);
    }
  });
}

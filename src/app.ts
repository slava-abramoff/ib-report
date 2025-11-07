import Fastify from "fastify";
import eventRoutes from "./routes/event.routes";
import docRoutes from "./routes/doc.routes";
import fastifyStatic from "@fastify/static";
import path from "path";

const app = Fastify({ logger: true });
app.register(eventRoutes);
app.register(docRoutes);

app.register(fastifyStatic, {
  root: path.join(__dirname, "../static"),
  prefix: "/",
});

app.get("/", (req, reply) => {
  reply.sendFile("index.html");
});

app.listen({ port: 3000 }, (err, address) => {
  if (err) throw err;
  console.log(`Server is started on ${address}`);
});

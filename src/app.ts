import Fastify from "fastify";
import eventRoutes from "./routes/event.routes";
import docRoutes from "./routes/doc.routes";

const app = Fastify({ logger: true });
app.register(eventRoutes);
app.register(docRoutes);

app.listen({ port: 3000 }, (err, address) => {
  if (err) throw err;
  console.log(`Server is started on ${address}`);
});

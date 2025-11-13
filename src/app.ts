import Fastify from "fastify";
import eventRoutes from "./routes/event.routes";
import docRoutes from "./routes/doc.routes";
import fastifyStatic from "@fastify/static";
import path from "path";
import incidentRoutes from "./routes/incident.routes";

const app = Fastify({ logger: true });
app.register(eventRoutes);
app.register(docRoutes);
app.register(incidentRoutes);

app.register(fastifyStatic, {
  root: path.join(__dirname, "../static"),
  prefix: "/",
});

app.get("/", (req, reply) => {
  reply.sendFile("index.html");
});

app.get("/event-table", (req, reply) => {
  reply.sendFile("event-table.html");
});

app.get("/incident-table", (req, reply) => {
  reply.sendFile("incident-table.html");
});

app.get('/event-details/:id', (req, reply) => {
  reply.sendFile("event-details.html")
})


app.listen({ port: 3000 }, (err, address) => {
  if (err) throw err;
  console.log(`Server is started on ${address}`);
});

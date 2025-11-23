import Fastify from "fastify";
import eventRoutes from "./routes/event.routes";
import docRoutes from "./routes/doc.routes";
import fastifyStatic from "@fastify/static";
import path from "path";
import incidentRoutes from "./routes/incident.routes";
import fastifyJwt from "fastify-jwt";
import authRoutes from "./routes/auth.routes";

export const app = Fastify({ logger: true });

app.register(fastifyJwt, {
  secret: "MY_SUPER_SECRET", // потом вынеси в env
});

// проверка токена
app.decorate("auth", async function (req: any, reply: any) {
  try {
    await req.jwtVerify();
  } catch (err) {
    reply.redirect(`/signin`);
  }
});

app.decorate("isAdmin", async function (req: any, reply: any) {
  try {
    await req.jwtVerify();
    if (req.user.role !== "admin") {
      return reply.code(403).send({ error: "Forbidden" });
    }
  } catch (err) {
    return reply.code(401).send({ error: "Unauthorized" });
  }
});

app.register(authRoutes);
app.register(eventRoutes);
app.register(docRoutes);
app.register(incidentRoutes);

app.register(fastifyStatic, {
  root: path.join(__dirname, "../static"),
  prefix: "/",
});

app.get("/signin", (req, reply) => {
  reply.sendFile("login.html");
});

app.get("/form", (req, reply) => {
  reply.sendFile("form.html");
});

app.get("/event-table", (req, reply) => {
  reply.sendFile("event-table.html");
});

app.get("/incident-table", (req, reply) => {
  reply.sendFile("incident-table.html");
});

app.get("/users-table", (req, reply) => {
  reply.sendFile("users-table.html");
});

app.get("/event-details/:id", (req, reply) => {
  reply.sendFile("event-details.html");
});

app.listen({ port: 3000 }, (err, address) => {
  if (err) throw err;
  console.log(`Server is started on ${address}`);
});

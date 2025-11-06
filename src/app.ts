import Fastify from "fastify";
import eventRoutes from "./routes/event.routes";
import pdfRoutes from "./routes/pdf.routes";

const app = Fastify({ logger: true })
app.register(eventRoutes);
app.register(pdfRoutes)

app.listen({ port: 3000 }, (err, address) => {
    if (err) throw err;
    console.log(`Server is started on ${address}`)
})
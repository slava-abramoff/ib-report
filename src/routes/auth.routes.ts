import { FastifyInstance } from "fastify";
import bcrypt from "bcrypt";
import { userService } from "../services/user.service";

export default async function authRoutes(app: FastifyInstance) {
  // === LOGIN ===
  app.post("/login", async (req, reply) => {
    const { login, password } = req.body as any;

    const user = await userService.findUserByUsername(login);
    if (!user) return reply.code(400).send({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return reply.code(400).send({ error: "Invalid credentials" });

    const token = app.jwt.sign(
      {
        id: user.id,
        login: user.login,
        role: user.role,
      },
      { expiresIn: "1h" },
    );

    return { token, role: user.role };
  });

  // === CREATE USER (Admin only) ===
  app.post("/users", async (req, reply) => {
    const { login, password, role } = req.body as any;
    if (!login || !password || !role)
      return reply.code(400).send({ error: "Missing fields" });

    try {
      const newUser = await userService.createUser({ login, password, role });
      reply.code(201).send({ success: true, id: newUser.lastInsertRowid });
    } catch (err: any) {
      reply.code(500).send({ error: err.message });
    }
  });

  // === UPDATE USER (Admin only) ===
  app.put("/users/:id", async (req, reply) => {
    const { id } = req.params as any;
    const data = req.body as any;

    try {
      await userService.updateUser(Number(id), data);
      reply.send({ success: true });
    } catch (err: any) {
      reply.code(500).send({ error: err.message });
    }
  });

  app.get("/users", async (req, reply) => {
    try {
      const { skip, limit } = req.query as {
        skip?: string;
        limit?: string;
      };

      const skipNum = Number(skip) || 0;
      const limitNum = Number(limit) || 10;

      const result = await userService.getAllUsers(skipNum, limitNum);

      reply.code(200).send({ success: true, data: result });
    } catch (err) {
      console.error(err);
      reply.code(500).send({ error: "Internal server error" });
    }
  });

  // === DELETE USER (Admin only) ===
  app.delete("/users/:id", async (req, reply) => {
    const { id } = req.params as any;

    try {
      await userService.deleteUser(Number(id));
      reply.send({ success: true });
    } catch (err: any) {
      reply.code(500).send({ error: err.message });
    }
  });
}

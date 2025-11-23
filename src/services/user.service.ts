import { db } from "../db/db";
import { users, NewUser } from "../models/user.model";
import { eq, sql } from "drizzle-orm";
import bcrypt from "bcrypt";

export const userService = {
  async getAllUsers(skip = 0, limit = 10) {
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users);

    const data = await db.select().from(users).limit(limit).offset(skip);

    return {
      total: count,
      skip,
      limit,
      data,
    };
  },

  async getUserById(id: number) {
    return db.query.users.findFirst({ where: eq(users.id, id) });
  },

  async createUser(data: {
    login: string;
    password: string;
    role: "admin" | "user";
  }) {
    const hashed = await bcrypt.hash(data.password, 10);
    return db.insert(users).values({ ...data, password: hashed });
  },

  async updateUser(
    id: number,
    data: Partial<{ login: string; password: string; role: "admin" | "user" }>,
  ) {
    const updateData: Partial<{
      login: string;
      password: string;
      role: "admin" | "user";
    }> = { ...data };
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }
    return db.update(users).set(updateData).where(eq(users.id, id));
  },

  async deleteUser(id: number) {
    return db.delete(users).where(eq(users.id, id));
  },

  async findUserByUsername(login: string) {
    return db.query.users.findFirst({ where: eq(users.login, login) });
  },
};

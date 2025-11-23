import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { InferModel, sql } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  login: text("login").notNull().unique(),
  password: text("password").notNull(),
  role: text("role", { enum: ["admin", "user"] })
    .notNull()
    .default("user"),
});

export type User = InferModel<typeof users>;
export type NewUser = InferModel<typeof users, "insert">;

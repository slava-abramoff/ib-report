import { drizzle } from "drizzle-orm/better-sqlite3";
import { events } from "../models/event.model";
import Database from "better-sqlite3";

const sqlite = new Database("./src/db/database.sqlite");
export const db = drizzle(sqlite, { schema: { events } });

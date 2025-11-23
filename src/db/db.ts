import { drizzle } from "drizzle-orm/better-sqlite3";
import { events } from "../models/event.model";
import Database from "better-sqlite3";
import { incidents } from "../models/incident.model";
import { users } from "../models/user.model";

const sqlite = new Database("./src/db/database.sqlite");
export const db = drizzle(sqlite, { schema: { events, incidents, users } });

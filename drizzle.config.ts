import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/models",     
  out: "./src/db/migrations", 
  dialect: "sqlite",
  dbCredentials: {
    url: "./src/db/database.sqlite"
  }
});
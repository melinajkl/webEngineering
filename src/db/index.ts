import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";
import "dotenv/config" // 👈 Import your schema definitions

const dbUrl = process.env.DATABASE_URL!;

if (!dbUrl) {
  throw new Error("DATABASE_URL is not defined");
}

export const db = drizzle(
  createClient({
    url: dbUrl,
  }),
  { schema } // 👈 Pass the schema object here
);
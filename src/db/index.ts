import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

const client = createClient({
  url: "file:./src/db/localdb.sqlite", // This is undefined
});

export const db = drizzle(client);
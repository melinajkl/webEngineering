// drizzle.config.ts

// --- Add these lines at the very top ---
import { config } from "dotenv";
config({ path: ".env" });
// If you use .env.local, use: config({ path: '.env.local' });
// ---------------------------------------

import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: "sqlite",
    schema: "./src/server/db/schema.ts",
    out: "./drizzle",

    dbCredentials: {
        url: "./src/server/db/localdb.sqlite",
    },
});
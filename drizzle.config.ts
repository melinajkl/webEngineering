// drizzle.config.ts

// --- Add these lines at the very top ---
import { config } from "dotenv";
config({ path: ".env" });
// If you use .env.local, use: config({ path: '.env.local' });
// ---------------------------------------

import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts", // Example path
  out: "./drizzle", // Example path
  dialect: "sqlite",
  dbCredentials: {
    // This is where Drizzle-Kit gets the URL
    url: process.env.DATABASE_URL!,
  },
  // ... other config
});

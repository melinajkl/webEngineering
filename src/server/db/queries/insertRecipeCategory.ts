import "server-only";
import { db } from "@/server/db";

import { recipeAttributes, recipeCat } from "@/server/db/schema";
import { inArray } from "drizzle-orm";

// Rezeptcategory in die Datenbank eintragen
export async function insertRecipeCategory(
  data: string[],
  recipeId: number
): Promise<void> {
  await db
    .insert(recipeCat)
    .values(
      data.map((recipeCatName) => ({
        name: recipeCatName.trim(),
      }))
    )
    .onConflictDoNothing({ target: recipeCat.name });

  const existing = await db
    .select({ id: recipeCat.id })
    .from(recipeCat)
    .where(inArray(recipeCat.name, data));

  if (existing.length > 0) {
    await db
      .insert(recipeAttributes)
      .values(
        existing.map(({ id }) => ({
          recipeId,
          recipeCat: id,
        }))
      )
      .onConflictDoNothing();
  }
}

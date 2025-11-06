import "server-only";
import { db } from "@/server/db";
import {
  recipe,
  recipeSteps,
  recipeIngredients,
  recipeAttributes,
} from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function deleteRecipeById(id: number): Promise<void> {
  await db.transaction(async (tx) => {
    await tx.delete(recipeSteps).where(eq(recipeSteps.recipeId, id));
    await tx.delete(recipeIngredients).where(eq(recipeIngredients.recipeId, id));
    await tx.delete(recipeAttributes).where(eq(recipeAttributes.recipeId, id));
    await tx.delete(recipe).where(eq(recipe.id, id));
  });
}

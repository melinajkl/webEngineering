import "server-only";
import { db } from "@/server/db";
import { recipe } from "@/server/db/schema";
import { asc } from "drizzle-orm";

export interface RecipeListRow {
  id: number;
  title: string;
}

/**
 * Liefert eine alphabetisch sortierte Liste (id, title) für Dropdown/Select.
 */
export async function getRecipesList(): Promise<RecipeListRow[]> {
  return db
    .select({ id: recipe.id, title: recipe.title })
    .from(recipe)
    .orderBy(asc(recipe.title));
}

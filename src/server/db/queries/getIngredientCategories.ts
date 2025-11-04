// src/db/queries/getIngredientCategories.ts
import "server-only";
import { asc, sql } from "drizzle-orm";
import { db } from "@/server/db";
import { ingredientCat } from "@/server/db/schema";

export type IngredientCategoryRow = { id: number; name: string };

export async function getIngredientCategories(): Promise<
  IngredientCategoryRow[]
> {
  return db
    .select({ id: ingredientCat.id, name: ingredientCat.name })
    .from(ingredientCat)
    .orderBy(asc(ingredientCat.name));
}

export async function countExistingIngredientCategorie(
  data: string
): Promise<{ id: number }[]> {
  return db
    .select({ id: ingredientCat.id })
    .from(ingredientCat)
    .where(sql`lower(${ingredientCat.name}) = ${data}`)
    .limit(1);
}

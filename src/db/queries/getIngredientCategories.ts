// src/db/queries/getIngredientCategories.ts
import "server-only";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { ingredientCat } from "@/db/schema";

export type IngredientCategoryRow = { id: number; name: string };

export async function getIngredientCategories(): Promise<IngredientCategoryRow[]> {
    return  db
        .select({ id: ingredientCat.id, name: ingredientCat.name })
        .from(ingredientCat)
        .orderBy(asc(ingredientCat.name));
}

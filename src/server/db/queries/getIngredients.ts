"use server";

import "server-only";
import { asc } from "drizzle-orm";
import { db } from "@/server/db";
import { ingredients } from "@/server/db/schema";

export type IngredientRow = {
  id: number;
  name: string;
  category: number;
  unitId: number | undefined;
};

export type iIngredientRecipe = {
  id: number;
  name: string;
  unitId: number | undefined;
};

export async function getIngredients(): Promise<IngredientRow[]> {
  return db
    .select({
      id: ingredients.id,
      name: ingredients.name,
      category: ingredients.category,
      unitId: ingredients.unit,
    })
    .from(ingredients)
    .orderBy(asc(ingredients.name));
}

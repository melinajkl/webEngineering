
import "server-only";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { ingredients } from "@/db/schema";

export type IngredientRow = {
    id: number;
    name: string;
    unitId: number;
};

export async function getIngredients(): Promise<IngredientRow[]> {
    const rows = await db
        .select({
            id: ingredients.id,
            name: ingredients.name,
            category: ingredients.category,
            unitId: ingredients.unit,
        })
        .from(ingredients)
        .orderBy(asc(ingredients.name));
    return rows;
}

import "server-only";
import { db } from "@/db";

import {ingredients, recipeIngredients} from "@/db/schema";

import {iDbRecipeCardIngredience} from "@/zodSchemas/ingredientsRecipecard";



//Zutaten in die recipeIngredients Datenbank eintragen.
export async function insertIngredientsForRecipe(data: iDbRecipeCardIngredience [], recipeId: number): Promise<void> {
    await db
        .insert(recipeIngredients)
        .values(
            data.map((items) => ({
                recipeId,
                ingredientId: items.recipeIngredientsId,
                amount: items.quantity,
            }))
        );
}




//Zutaten in die ingredients Datenbank eintragen.

export interface Ingredient {
    name: string;
    categoryId: number;
    unitId: number;
}

export async function createIngredien(data: Ingredient): Promise<number> {
    const [row] = await db
        .insert(ingredients)
        .values({
            name: data.name,
            category: data.categoryId,
            unit: data.unitId,
        })
        .returning({ id: ingredients.id });
    return row.id
}

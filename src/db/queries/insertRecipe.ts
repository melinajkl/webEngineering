import "server-only";
import { db } from "@/db";

import {recipe} from "@/db/schema";
import {iDbRecipe} from "@/zodSchemas/recipe";




export async function insertRecipe(data: iDbRecipe): Promise<number> {
    const [row] = await db
    .insert(recipe)
            .values({
                title: data.title,
                foodCategory: data.foodCategory,
                prepareTime: data.prepareTime,
                cookingTime: data.cookingTime,
                portions: data.portions,
            }).returning({ id: recipe.id });

        return row.id;
}

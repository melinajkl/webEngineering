import "server-only";
import { db } from "@/db";

import {CreateRecipeInput} from "@/actions/create_recipe";
import {recipe} from "@/db/schema";

export interface iDbRecipe {
    title: string,
    foodCategory:number,
    prepareTime: number,
    cookingTime: number,
    portions:number
}

export async function insertRecipe(data: CreateRecipeInput) : Promise<number> {
    const [row] = await db
        .insert(recipe)
        .values({
            title: data.title,
            foodCategory:   data.foodCategory,
            prepareTime: data.prepareTime,
            cookingTime: data.cookingTime,
            portions: data.portions,
        })
        .returning({ id: recipe.id });

    return row.id;
}
"use server";

import "server-only";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import {recipe, recipeIngredients, recipeSteps, ingredients, recipeCat, foodCat} from "@/db/schema";
import { eq } from "drizzle-orm";

const IngredientSchema = z.object({
    name: z.string().min(1),
    quantity: z.coerce.number(),
    unitId: z.coerce.number().int(),
});

const StepSchema = z.object({
    text: z.string().min(1),
});

const RecipeSchema = z.object({
    title: z.string().min(1),
    portions: z.coerce.number().int().min(1).max(64),
    prepareTime: z.coerce.number().int().min(0).max(24 * 60),
    cookingTime: z.coerce.number().int().min(0).max(24 * 60),
    foodCategory: z.coerce.number().int().min(1),
    recipeCategory: z.array(z.string().min(1)).max(20).default([]),
    ingredients: z.array(IngredientSchema).min(1),
    steps: z.array(StepSchema).min(1),
});


export type CreateRecipeInput = z.infer<typeof RecipeSchema>;
export type CreateRecipeResult =
    | { ok: true; message: string }
    | { ok: false; error: string };

export async function createRecipeAction(formData: FormData): Promise<CreateRecipeResult> {
    const raw = formData.get("payload");
    if (typeof raw !== "string") {
        return {ok: false, error: "Payload missing"};
    }

    let parsedRecipe: ReturnType<typeof RecipeSchema.safeParse>;
    try {
        parsedRecipe = RecipeSchema.safeParse(JSON.parse(raw));
    } catch {
        return {ok: false, error: "Payload is not valid JSON"};
    }
    if (!parsedRecipe.success) {
        return {ok: false, error: parsedRecipe.error.issues[0]?.message ?? "Invalid input"};
    }

    //DB operation
    try {
        await db.transaction(async (transfer) => {


            await transfer.insert(recipeCat).values(
                parsedRecipe.data.recipeCategory.map((s) => ({
                    name: s.trim(),
                })),
            ).onConflictDoNothing();

            const [row] = await transfer.insert(recipe).values({
                title: parsedRecipe.data.title,
                foodCategory: parsedRecipe.data.foodCategory,
                prepareTime: parsedRecipe.data.prepareTime,
                cookingTime: parsedRecipe.data.cookingTime,
                portions: parsedRecipe.data.portions
            }).returning({id: recipe.id});

            const recipeId = row.id

            /*const { ingredients } = JSON.parse(raw) as { ingredience: { text: number }[] };
            await transfer
                .insert(recipeIngredients)
                .values({
                    ingredients.map((item, amount) => ({
                        recipeId,                               // FK zum Rezept
                        ingredientId: ,// FK zur INGREDIENTS.id
                        amount: amount
                    }))
            });*/



            const {steps} = JSON.parse(raw) as { steps: { text: string }[] };
            // vorhandene Schritte des Rezepts ersetzen
            await transfer.delete(recipeSteps).where(eq(recipeSteps.recipeId, recipeId));

            await transfer.insert(recipeSteps).values(
                steps.map((s, idx) => ({
                    recipeId,              // FK auf das Rezept (number)
                    stepNumber: idx + 1,   // 1, 2, 3, ...
                    step: s.text.trim(),   // Text des Schritts
                })),
            );



        });
    } catch (e) {}



    // >>> HIER: immer etwas zurückgeben
    return { ok: true, message: `Rezept „${raw.toString()} ${parsedRecipe.data.title} ${parsedRecipe.data.cookingTime}  ${parsedRecipe.data.prepareTime} 
     ${parsedRecipe.data.ingredients}  ${parsedRecipe.data.recipeCategory} ${parsedRecipe.data.steps} ${parsedRecipe.data.portions}" entgegengenommen.` };
}


//„{"title":"Test","portions":2,"prepareTime":15,"cookingTime":30,"foodCategory":1,"recipeCategory":["pasta"],"ingredients":[{"name":"Bier","quantity":0,"unitId":2},{"name":"weizen","quantity":2,"unitId":3}],"steps":[{"text":"asd"}]} Test 30 15 [object Object],[object Object] pasta [object Object] 2" entgegengenommen.

//Rezept „{"title":"kasdjl","portions":2,"prepareTime":15,"cookingTime":30,"difficulty":"easy","foodCategory":["slas"],"ingredients":[{"name":"asödlkqödwlk","quantity":"20"}],"steps":[{"text":"öalskdölaskdpaokdp"}]} kasdjl 30 easy 15 [object Object] slas [object Object] 2" entgegengenommen.
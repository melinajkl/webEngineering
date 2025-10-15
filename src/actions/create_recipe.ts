"use server";

import "server-only";
import { z } from "zod";
import { db } from "@/db";
import {recipe, recipeIngredients, recipeSteps, recipeCat} from "@/db/schema";
import { eq } from "drizzle-orm";

const IngredientSchema = z.object({
    recipeIngredientsId: z.coerce.number().min(0),
    name: z.string().min(1),
    quantity: z.coerce.number().min(1),
    unitId: z.coerce.number().int(),
});

const StepSchema = z.object({
    text: z.string().min(1),
});

const RecipeSchema = z.object({
    title: z.string().min(1, "Titel ist ein Pflichtfeld."),
    portions: z.coerce.number().int().min(1).max(64, "Bitte Feld Portionen ausfüllen."),
    prepareTime: z.coerce.number().int().min(0).max(24 * 60, "Mindestens 1 Minute. Maximal 24H Vorbereitungszeit."),
    cookingTime: z.coerce.number().int().min(0).max(24 * 60, "Mindestens 1 Minute. Maximal 24H Kochzeit."),
    foodCategory: z.coerce.number().int().min(1),
    recipeCategory: z.array(z.string().min(1)).max(20).default([]),
    ingredients: z.array(IngredientSchema).min(1, "Mindestens eine Zutat muss hinzugefügt werden."),
    steps: z.array(StepSchema).min(1, "Mindestens ein Arbeitsschritt muss hinzugefügt werden."),
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
        const msg = parsedRecipe.error.issues
            .map((issue) => `${issue.message}`).join("\n");
        return { ok: false, error: msg };
    }


    //DB operation
    try {
        await db.transaction(async (transfer) => {

            // Rezeptcategory in die Datenbank eintragen
            await transfer.insert(recipeCat).values(
                parsedRecipe.data.recipeCategory.map((s) => ({
                    name: s.trim(),
                })),
            ).onConflictDoNothing();

            //Rezept in die Datenbank eintragen.
            const [row] = await transfer.insert(recipe).values({
                title: parsedRecipe.data.title,
                foodCategory: parsedRecipe.data.foodCategory,
                prepareTime: parsedRecipe.data.prepareTime,
                cookingTime: parsedRecipe.data.cookingTime,
                portions: parsedRecipe.data.portions
            }).returning({id: recipe.id});

            const recipeId = row.id

            //Zutaten in die Datenbank eintragen.
            const { ingredients } = JSON.parse(raw) as { ingredients: { recipeIngredientsId: number, quantity: number, unitId: number }[] };
            await transfer
                .insert(recipeIngredients)
                .values(
                    ingredients.map((ingredient) => ({
                        recipeId,
                        ingredientId: ingredient.recipeIngredientsId,
                        amount: ingredient.quantity,
                    }))
                );


            const {steps} = JSON.parse(raw) as { steps: { text: string }[] };
            // vorhandene Schritte des Rezepts ersetzen
            await transfer.delete(recipeSteps).where(eq(recipeSteps.recipeId, recipeId));

            // Schritte als Map komplett in DB schreiben
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
    return { ok: true, message: `Rezept „${parsedRecipe.data.title}" wurde erfolgreich entgegengenommen.` };
}
//Rezept „{"title":"qwdqdwqwd","portions":2,"prepareTime":15,"cookingTime":30,"foodCategory":1,"recipeCategory":["qwdqwdqwd"],"ingredients":[{"recipeIngredientsId":14,"name":"Rice","quantity":12,"unitId":1},{"recipeIngredientsId":13,"name":"Salmon","quantity":1212,"unitId":1}],"steps":[{"text":"asddasdASDASFASF"},{"text":"WFWAQFEWEAQFEAQF"}]} qwdqdwqwd 30 15 [object Object],[object Object] qwdqwdqwd [object Object],[object Object] 2" entgegengenommen.


//„{"title":"Test","portions":2,"prepareTime":15,"cookingTime":30,"foodCategory":1,"recipeCategory":["pasta"],"ingredients":[{"name":"Bier","quantity":0,"unitId":2},{"name":"weizen","quantity":2,"unitId":3}],"steps":[{"text":"asd"}]} Test 30 15 [object Object],[object Object] pasta [object Object] 2" entgegengenommen.

//Rezept „{"title":"kasdjl","portions":2,"prepareTime":15,"cookingTime":30,"difficulty":"easy","foodCategory":["slas"],"ingredients":[{"name":"asödlkqödwlk","quantity":"20"}],"steps":[{"text":"öalskdölaskdpaokdp"}]} kasdjl 30 easy 15 [object Object] slas [object Object] 2" entgegengenommen.
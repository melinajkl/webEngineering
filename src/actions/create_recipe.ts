"use server";

import "server-only";
import { z } from "zod";
import { db } from "@/db";
import {recipe, recipeIngredients, recipeSteps, recipeCat, recipeAttributes} from "@/db/schema";
import {eq, inArray } from "drizzle-orm";

const IngredientSchema = z.object({
    recipeIngredientsId: z.coerce.number().min(1, "Mindestens eine Zutat muss hinzugefügt werden."),
    name: z.string().min(1),
    quantity: z.coerce.number().min(1, "Mindestens die Menge 1 muss hinzugefügt werden."),
    unitId: z.coerce.number().int().min(1, "Maßeinheit muss ausgewählt werden."),
});

const StepSchema = z.object({
    text: z.string().min(1, "Ein Arbeitsschritt muss mindestens einen Buchstaben enthalten."),
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

const errorMsg = "Something went wrong";

export type CreateRecipeInput = z.infer<typeof RecipeSchema>;
export type CreateRecipeResult =
    | { ok: true; message: string }
    | { ok: false; error: string };

export async function createRecipeAction(formData: FormData): Promise<CreateRecipeResult> {
    const raw = formData.get("payload");

    //Error Handling
    if (typeof raw !== "string") {
        return {ok: false, error: errorMsg};  /// "Payload missing"};
    }
    //Parse Payload
    let parsedRecipe: ReturnType<typeof RecipeSchema.safeParse>;
    try {
        parsedRecipe = RecipeSchema.safeParse(JSON.parse(raw));
    } catch {
        return {ok: false, error: errorMsg }; //"Payload is not valid JSON"};
    }
    if (!parsedRecipe.success) {
        const msg = parsedRecipe.error.issues
            .map((issue) => `${issue.message}`).join("\n");
        return { ok: false, error: msg };
    }


    //DB operation
    try {
        await db.transaction(async (transfer) => {


            //Rezept in die Datenbank eintragen.
            const [rowRecipe] = await transfer.insert(recipe).values({
                title: parsedRecipe.data.title,
                foodCategory: parsedRecipe.data.foodCategory,
                prepareTime: parsedRecipe.data.prepareTime,
                cookingTime: parsedRecipe.data.cookingTime,
                portions: parsedRecipe.data.portions
            }).returning({id: recipe.id});

            const recipeId = rowRecipe.id

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


            // Rezeptcategory in die Datenbank eintragen
            await transfer.insert(recipeCat).values(
                parsedRecipe.data.recipeCategory.map((recipeCatName) => ({
                    name: recipeCatName.trim(),
                })),
            )
                .onConflictDoNothing({target: recipeCat.name});

            const existing = await transfer
                .select({ id: recipeCat.id })
                .from(recipeCat)
                .where(inArray(recipeCat.name, parsedRecipe.data.recipeCategory));

            if (existing.length > 0) {
                await transfer
                    .insert(recipeAttributes)
                    .values(
                        existing.map(({id}) => ({
                            recipeId,
                            recipeCat: id,
                        }))
                    ).onConflictDoNothing();
            }

            const {steps} = JSON.parse(raw) as { steps: { text: string }[] };
            // vorhandene Schritte des Rezepts ersetzen
            await transfer.delete(recipeSteps).where(eq(recipeSteps.recipeId, recipeId));

            // Schritte als Map komplett in DB schreiben
            await transfer.insert(recipeSteps).values(
                steps.map((s, idx) => ({
                    recipeId,              // FK from Recipe number
                    stepNumber: idx + 1,   // Step Number
                    step: s.text.trim(),   // Step Text
                })),
            );



        });
    } catch {
        return {ok: false, error: errorMsg};
    }


    // immer etwas zurückgeben
    return { ok: true, message: `Rezept „${parsedRecipe.data.title}" wurde erfolgreich entgegengenommen.` };
}
"use server";

import "server-only";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { recipe, recipeIngredients, recipeSteps, ingredients } from "@/db/schema";
import { eq } from "drizzle-orm";

const IngredientSchema = z.object({
    name: z.string().min(1),
    quantity: z.string().optional(),
    unitId: z.coerce.number().int().optional(),
});

const StepSchema = z.object({
    text: z.string().min(1),
});

const RecipeSchema = z.object({
    title: z.string().min(1),
    portions: z.coerce.number().int().min(1).max(64).optional(),
    prepareTime: z.coerce.number().int().min(0).max(24 * 60).optional(),
    cookingTime: z.coerce.number().int().min(0).max(24 * 60).optional(),
    difficulty: z.enum(["easy", "medium", "hard"]).default("easy").optional(), /// nicht besprochen also nicht in DB
    foodCategory: z.array(z.string().min(1)).max(20).default([]),
    ingredients: z.array(IngredientSchema).min(1),
    steps: z.array(StepSchema).min(1),
});


export type CreateRecipeInput = z.infer<typeof RecipeSchema>;
export type CreateRecipeResult =
    | { ok: true; id: string; message: string }
    | { ok: false; error: string };

export async function createRecipeAction(formData: FormData): Promise<CreateRecipeResult> {
    const raw = formData.get("payload");
    if (typeof raw !== "string") {
        return { ok: false, error: "Payload missing" };
    }

    let parsed: ReturnType<typeof RecipeSchema.safeParse>;
    try {
        parsed = RecipeSchema.safeParse(JSON.parse(raw));
    } catch {
        return { ok: false, error: "Payload is not valid JSON" };
    }
    if (!parsed.success) {
        return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
    }

    // keine DB-Operationen
    const id = crypto.randomUUID();

    // optional: UI-Refresh (nur wenn du's brauchst)
    // revalidatePath("/", "layout");
    // revalidatePath("/recipes", "page");

    // >>> HIER: immer etwas zurückgeben
    return { ok: true, id, message: `Rezept „${parsed.data.title} ${parsed.data.cookingTime} ${parsed.data.difficulty?.toString} ${parsed.data.prepareTime} 
     ${parsed.data.ingredients}  ${parsed.data.foodCategory} ${parsed.data.steps} ${parsed.data.portions?.toString()}" entgegengenommen.` };
}


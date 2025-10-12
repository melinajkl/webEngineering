"use server";

import "server-only";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { recipe, recipeIngredients, recipeSteps, ingredients } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/** Teil-Schemas */
const IngredientSchema = z.object({
    name: z.string().min(1),
    quantity: z.string().optional(),
    unitId: z.coerce.number().int().optional(),
});

const StepSchema = z.object({
    text: z.string().min(1),
});

/** Hauptschema (wie bei dir) */
export const RecipeSchema = z.object({
    title: z.string().min(1),
    portions: z.coerce.number().int().min(1).max(64).optional(),
    prepareTime: z.coerce.number().int().min(0).max(24 * 60).optional(),
    cookingTime: z.coerce.number().int().min(0).max(24 * 60).optional(),
    difficulty: z.enum(["easy", "medium", "hard"]).default("easy").optional(), // optional, keine DB-Pflicht
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
        return { ok: false, error: parsed.error.errors[0]?.message ?? "Invalid input" };
    }

    // Keine DB-Operationen: nur eine neue ID erzeugen und UI revalidieren
    const id = crypto.randomUUID();

    // Falls deine UI eine Liste/Seite zeigt, die auf die Änderung reagieren soll:
    revalidatePath("/", "layout");
    revalidatePath("/recipes", "page");

    return {
        ok: true,
        id,
        message: `Rezept „${parsed.data.title}“ entgegengenommen (ohne DB-Persistenz).`,
    };
}

"use server";

import "server-only";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { recipes, recipeIngredients, recipeSteps } from "@/db/schema";
import { eq } from "drizzle-orm";

const IngredientSchema = z.object({
    name: z.string().min(1),
    quantity: z.string().optional(),
    //Dropdownmenü für Einheiten
});

const StepSchema = z.object({
    text: z.string().min(1),
});

const RecipeSchema = z.object({
    title: z.string().min(1),
    servings: z.coerce.number().int().min(1).max(64).optional(),
    prepare_time: z.coerce.number().int().min(0).max(24 * 60).optional(),
    cooking_time: z.coerce.number().int().min(0).max(24 * 60).optional(),
    difficulty: z.enum(["easy", "medium", "hard"]).default("easy"),
    foodCategory: z.array(z.string().min(1)).max(20).default([]),
    ingredients: z.array(IngredientSchema).min(1),
    steps: z.array(StepSchema).min(1),
});

/*export type CreateRecipeInput = z.infer<typeof RecipeSchema>;
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

    // Keine DB-Operationen mehr:
    const id = crypto.randomUUID();

    // Optional: UI-Refresh (falls Liste/Seite auf Daten reagiert)
    revalidatePath("/", "layout");
    revalidatePath("/recipes", "page");

    // Du kannst hier auch in ein Log/Telemetry schreiben, wenn gewünscht.
    return { ok: true, id, message: `Rezept „${parsed.data.title}“ entgegengenommen (keine DB geschrieben).` };
}*/

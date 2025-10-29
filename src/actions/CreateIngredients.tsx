/*"use server";

import "server-only";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { ingredients } from "@/db/schema";


//Inputvalidierung
const CreateIngredientSchema = z.object({
    name: z.string().trim().min(1, "Name is required"),
    unitId: z.coerce.number().int().positive().min(1, "A unit of measurement must be selected."),
});

export type CreateIngredientResult =
    | { ok: true; id: number; name: string; unitId: number | null; message?: string }
    | { ok: false; error: string };

export async function createIngredientAction(formData: FormData): Promise<CreateIngredientResult> {
    const name = formData.get("name");
    const unitId = formData.get("unitId");

    const parsed = CreateIngredientSchema.safeParse({ name, unitId });
    if (!parsed.success) {
        return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
    }

    const normalizedName = parsed.data.name;

    // Check for existing by name (avoid relying on UNIQUE constraint presence)
    const existing = await db
        .select({ id: ingredients.id, unitId: ingredients.unit })
        .from(ingredients)
        .where(eq(ingredients.name, normalizedName))
        .limit(1);

    if (existing.length > 0) {
        return {
            ok: true,
            id: existing[0].id,
            name: normalizedName,
            unitId: existing[0].unitId,
            message: "Ingredient already exists.",
        };
    }

    const [row] = await db
        .insert(ingredients)
        .values({
            name: normalizedName,
            unit: parsed.data.unitId,

        })
        .returning({
            id: ingredients.id,
            name: ingredients.name,
            unitId: ingredients.unit,
        });

    // Keep UI fresh
    revalidatePath("/", "layout");

    return { ok: true, id: row.id, name: row.name, unitId: row.unitId , message: "Ingredient added successfully." };
}
*/ //Kann gelöscht werden.
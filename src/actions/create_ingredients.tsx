"use server";

import "server-only";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { ingredients, ingredientCat } from "@/db/schema";
import { sql } from "drizzle-orm";

/**
 * Speichert eine neue Zutat. categoryName ist Freitext:
 * - existiert die Kategorie (case-insensitive), wird sie genutzt
 * - andernfalls wird sie angelegt
 */
const CreateIngredientSchema = z.object({
    name: z.string().trim().min(1, "Name erforderlich"),
    categoryName: z.string().trim().min(1, "Kategorie erforderlich"),
    unitId: z.coerce.number().int().positive(),
});

export type CreateIngredientResult =
    | {
    ok: true;
    id: number;
    name: string;
    unitId: number | null;
    categoryId: number;
    message?: string;
}
    | { ok: false; error: string };

function normalizeLabel(s: string): string {
    return s.trim().replace(/\s+/g, " ");
}

export async function createIngredientAction(formData: FormData): Promise<CreateIngredientResult> {
    const parse = CreateIngredientSchema.safeParse({
        name: formData.get("name"),
        categoryName: formData.get("categoryName"),
        unitId: formData.get("unitId"),
    });

    if (!parse.success) {
        return { ok: false, error: parse.error.issues[0]?.message ?? "Ungültige Eingabe" };
    }

    const name = normalizeLabel(parse.data.name);
    const categoryName = normalizeLabel(parse.data.categoryName);
    const unitId = parse.data.unitId;

    try {
        const result = await db.transaction(async (tx) => {
            // 1) Kategorie finden (case-insensitive) oder anlegen
            const lower = categoryName.toLowerCase();
            const existingCat = await tx
                .select({ id: ingredientCat.id })
                .from(ingredientCat)
                .where(sql`lower(${ingredientCat.name}) = ${lower}`)
                .limit(1);

            let categoryId: number;
            if (existingCat.length > 0) {
                categoryId = existingCat[0]!.id;
            } else {
                // anlegen; falls es parallel angelegt wird, danach erneut lesen
                const inserted = await tx
                    .insert(ingredientCat)
                    .values({ name: categoryName })
                    .returning({ id: ingredientCat.id });
                if (inserted.length > 0) {
                    categoryId = inserted[0]!.id;
                } else {
                    const fallback = await tx
                        .select({ id: ingredientCat.id })
                        .from(ingredientCat)
                        .where(sql`lower(${ingredientCat.name}) = ${lower}`)
                        .limit(1);
                    if (fallback.length === 0) {
                        throw new Error("Kategorie konnte nicht angelegt werden");
                    }
                    categoryId = fallback[0]!.id;
                }
            }

            // 2) Zutat anlegen (wenn gleichnamig schon vorhanden, einfach zurückgeben)
            //   Hinweis: Falls du UNIQUE(name) hast, nutze onConflictDoNothing + Re-Select
            const insertedIng = await tx
                .insert(ingredients)
                .values({ name, category: categoryId, unit: unitId })
                .returning({ id: ingredients.id, unitId: ingredients.unit });

            const id =
                insertedIng[0]?.id ??
                (
                    await tx
                        .select({ id: ingredients.id })
                        .from(ingredients)
                        .where(sql`lower(${ingredients.name}) = ${name.toLowerCase()}`)
                        .limit(1)
                )[0]?.id;

            if (!id) throw new Error("Zutat konnte nicht angelegt werden");

            return {
                id,
                name,
                unitId: insertedIng[0]?.unitId ?? unitId,
                categoryId,
            };
        });

        revalidatePath("/", "layout");

        return {
            ok: true,
            id: result.id,
            name,
            unitId: result.unitId ?? null,
            categoryId: result.categoryId,
            message: "Zutat angelegt",
        };
    } catch (e) {
        console.error(e);
        return { ok: false, error: "DB-Fehler beim Anlegen der Zutat" };
    }
}

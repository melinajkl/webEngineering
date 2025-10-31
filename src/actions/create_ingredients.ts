"use server";

import "server-only";
import { revalidatePath } from "next/cache";


import {CreateIngredientSchemaForRecipe} from "@/zodSchemas/ingredientsForDb";
import {countExistingIngredientCategorie,} from "@/db/queries/getIngredientCategories";
import {createIngredien, Ingredient} from "@/db/queries/insertIngredients";
import {createIngredientCategorie} from "@/db/queries/insertIngredienCategory";

/**
 * Speichert eine neue Zutat. categoryName ist Freitext:
 * - existiert die Kategorie (case-insensitive), wird sie genutzt
 * - andernfalls wird sie angelegt
 */


export type CreateIngredientResult =
    {
    ok: true;
    id: number;
    name: string;
    unitId?: number;
    categoryId: number;
    message: string;
} |  {
    ok: false;
    error: string;
};

function normalizeLabel(s: string): string {
    return s.trim().replace(/\s+/g, " ");
}

const errorMsg = "Something went wrong";

function parseInput (formData: FormData) {
    return CreateIngredientSchemaForRecipe.safeParse({
        name: formData.get("name"),
        categoryName: formData.get("categoryName"),
        unitId: formData.get("unitId"),
    });
}

export async function createIngredientAction(formData: FormData): Promise<CreateIngredientResult> {

    const parse = parseInput(formData);

    if (!parse.success) {
        const msg = parse.error.issues
            .map((issue) => `${issue.message}`).join("\n");
        return { ok: false, error: msg };
    }

    const name = normalizeLabel(parse.data.name);
    const categoryName = normalizeLabel(parse.data.categoryName);
    const unitId = parse.data.unitId;



    let categoryId: number;
    // 1) Kategorie finden (case-insensitive) oder anlegen
    try {

        const lower = categoryName.toLowerCase();
        const existingCat = await countExistingIngredientCategorie(lower)


        if (existingCat.length > 0) {
            categoryId = existingCat[0]!.id;
        } else {
            // anlegen; falls es parallel angelegt wird, danach erneut lesen
            const inserted = await createIngredientCategorie(categoryName)

            if (inserted.length > 0) {
                categoryId = inserted[0]!.id;
            } else {
                const fallback = await countExistingIngredientCategorie(lower)

                if (fallback.length === 0) {
                    throw new Error("Failed to create category.");
                }
                categoryId = fallback[0]!.id;
            }
        }
    }catch (error) {
        return{ ok:false , error: String(error)}
    }


    try {
        // 2) Zutat anlegen (wenn gleichnamig schon vorhanden, einfach zurückgeben)

        const Ingredients : Ingredient ={
            name: name,
            categoryId: categoryId,
            unitId: unitId,
        }
        const ingredienId = await createIngredien(Ingredients)



        revalidatePath("/", "layout");

        return {
            ok: true,
            id: ingredienId,
            name,
            unitId: unitId ?? null,
            categoryId: categoryId,
            message: "Ingredient added successfully",
        };
    } catch (e) {
        console.error(e);
        return { ok: false, error: errorMsg}; // "DB-Fehler beim Anlegen der Zutat" };
    }
}

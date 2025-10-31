import "server-only";
import { db } from "@/db";
import {iDbRecipe} from "@/zodSchemas/recipe";
import {eq} from "drizzle-orm";
import {recipeSteps} from "@/db/schema";
import {iDbSteps} from "@/zodSchemas/step";


export async function deleteStep(data: iDbSteps[], recipeId: number): Promise<void> {
    // vorhandene Schritte des Rezepts löschen
    await db
        .delete(recipeSteps)
        .where(
            eq(recipeSteps.recipeId, recipeId)
        );
}


export async function insertSteps(data: iDbSteps[], recipeId: number): Promise<void> {

    // Schritte als Map komplett in DB schreiben
    await db
        .insert(recipeSteps)
        .values(
            data.map((s, idx) => ({
                recipeId,
                stepNumber: idx + 1,
                step: s.text.trim(),
            }))
        )
}
"use server";

import { getRecipeIngredientsWithIdById } from "@/server/db/queries/getRecipeIngredients";

export async function getRecipeIngredientsWithIdAction(id: number) {
  try {
    const ingredients = await getRecipeIngredientsWithIdById(id);
    return { success: true, data: ingredients };
  } catch (error) {
    console.error("Failed to fetch recipe ingredients:", error);
    return { success: false, error: "Failed to fetch ingredients" };
  }
}

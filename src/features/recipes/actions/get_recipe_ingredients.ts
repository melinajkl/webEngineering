"use server";

import { getRecipeIngredientsById, getRecipeIngredientsWithUnitIdById } from "@/server/db/queries/getRecipeIngredients";

export async function getRecipeIngredientsAction(id: number) {
  try {
    const ingredients = await getRecipeIngredientsById(id);
    return { success: true, data: ingredients };
  } catch (error) {
    console.error("Failed to fetch recipe ingredients:", error);
    return { success: false, error: "Failed to fetch ingredients" };
  }
}

export async function getRecipeIngredientsWithUnitIdAction(id: number) {
  try {
    const ingredients = await getRecipeIngredientsWithUnitIdById(id);
    return { success: true, data: ingredients };
  } catch (error) {
    console.error("Failed to fetch recipe ingredients:", error);
    return { success: false, error: "Failed to fetch ingredients" };
  }
}
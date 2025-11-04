"use server";

import { getRecipeStepsById } from "@/server/db/queries/getRecipes";

export async function getRecipeStepsAction(id: number) {
  try {
    const ingredients = await getRecipeStepsById(id);
    return { success: true, data: ingredients };
  } catch (error) {
    console.error("Failed to fetch recipe ingredients:", error);
    return { success: false, error: "Failed to fetch ingredients" };
  }
}

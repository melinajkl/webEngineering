"use server";

import { deleteRecipeById } from "@/server/db/queries/deleteRecipes";
import { revalidatePath } from "next/cache";

export async function deleteRecipeAction(id: number) {
  try {
    const res = await deleteRecipeById(id);
    revalidatePath("/recipes", "layout");
    return { success: true, data: res};
  } catch (error) {
    console.error("Failed to delete recipe", error);
    return { success: false, error: "Failed to delete recipe" };
  }
}

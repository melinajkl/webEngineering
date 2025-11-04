"use server";

import "server-only";

import { insertRecipe } from "@/server/db/queries/insertRecipe";
import {
  CreateRecipeRowSchema,
  RecipeSchema,
} from "@/shared/validation/recipe";
import { iDbRecipeCardIngredience } from "@/shared/validation/ingredientsRecipecard";
import { insertIngredientsForRecipe } from "@/server/db/queries/insertIngredients";
import { insertRecipeCategory } from "@/server/db/queries/insertRecipeCategory";
import { deleteStep, insertSteps } from "@/server/db/queries/insertSteps";
import { iDbSteps } from "@/shared/validation/step";
import { revalidatePath } from "next/cache";

export type CreateRecipeResult =
  | { ok: true; message: string }
  | { ok: false; error: string };

export async function createRecipeAction(
  formData: FormData
): Promise<CreateRecipeResult> {
  const raw = formData.get("payload");

  //Error Handling
  if (typeof raw !== "string") {
    return { ok: false, error: "There ar no Inputs" }; /// "Payload missing"};
  }
  //Parse Payload
  let parsedRecipe: ReturnType<typeof RecipeSchema.safeParse>;
  try {
    parsedRecipe = RecipeSchema.safeParse(JSON.parse(raw));
  } catch {
    return { ok: false, error: "There ar no Inputs" }; //"Payload is not valid JSON"};
  }
  if (!parsedRecipe.success) {
    const msg = parsedRecipe.error.issues
      .map((issue) => `${issue.message}`)
      .join("\n");
    return { ok: false, error: msg };
  }

  let recipeId: number;

  try {
    recipeId = await insertRecipe(
      CreateRecipeRowSchema.parse(parsedRecipe.data)
    );
  } catch (e) {
    return { ok: false, error: String(e) };
  }

  try {
    const { ingredients } = JSON.parse(raw) as {
      ingredients: iDbRecipeCardIngredience[];
    };
    await insertIngredientsForRecipe(ingredients, recipeId);
  } catch (e) {
    return { ok: false, error: String(e) };
  }

  try {
    await insertRecipeCategory(parsedRecipe.data.recipeCategory, recipeId);
  } catch (e) {
    return { ok: false, error: String(e) };
  }

  try {
    const { steps } = JSON.parse(raw) as { steps: iDbSteps[] };
    await deleteStep(steps, recipeId);
    await insertSteps(steps, recipeId);
  } catch (e) {
    return { ok: false, error: String(e) };
  }
  revalidatePath("/", "layout");

  return {
    ok: true,
    message: `Recipe “${parsedRecipe.data.title}” successfully created.`,
  };
}

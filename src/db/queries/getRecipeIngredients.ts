import { db } from "@/db";
import { recipeIngredients, ingredients, unit } from "@/db/schema";
import { eq } from "drizzle-orm";

interface RecipeIngredients {
  recipeId: number;
  ingredients: Array<{
    amount: number;
    unit: string | null;
    ingredientname: string | null;
  }>;
}

export async function getRecipeIngredientsById(
  id: number
): Promise<RecipeIngredients> {
  const ingredientsList = await db
    .select({
      amount: recipeIngredients.amount,
      ingredientname: ingredients.name, // Map to `ingredientname`
      unit: unit.shortForm,
    })
    .from(recipeIngredients)
    .leftJoin(ingredients, eq(recipeIngredients.ingredientId, ingredients.id))
    .leftJoin(unit, eq(ingredients.unit, unit.id))
    .where(eq(recipeIngredients.recipeId, id));

  return {
    recipeId: id,
    ingredients: ingredientsList, // Return the array directly
  };
}

/*
export async function getRecipeStepsById(id_: number): Promise<RecipeSteps> {
  const steps = await db.select( {
    stepnumber: recipeSteps.stepNumber,
    description: recipeSteps.step,
})
.from(recipeSteps)
.where(eq(recipeSteps.recipeId, id_))
.orderBy(recipeSteps.stepNumber)

return {
  recipeId: id_,
  steps
}
} */

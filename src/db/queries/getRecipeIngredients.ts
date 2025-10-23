import { db } from "@/db";
import { recipeIngredients, ingredients, unit } from "@/db/schema";
import { eq } from "drizzle-orm";

interface RecipeIngredients {
  recipeId: number;
  ingredients: Array<{
    amount: number;
    unit: string;
    ingredientname: string;
  }>;
}

export async function getRecipeIngredientsById(
  id: number
): Promise<RecipeIngredients> {
  const ingredientsList = await db
    .select({
      amount: recipeIngredients.amount,
      ingredientname: ingredients.name,
      unit: unit.shortForm,
    })
    .from(recipeIngredients)
    .innerJoin(ingredients, eq(recipeIngredients.ingredientId, ingredients.id))
    .innerJoin(unit, eq(ingredients.unit, unit.id))
    .where(eq(recipeIngredients.recipeId, id));

  return {
    recipeId: id,
    ingredients: ingredientsList,
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

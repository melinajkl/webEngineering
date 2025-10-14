import { db } from "@/db";
import {
  recipe,
  foodCat,
  recipeIngredients,
  ingredients,
  recipeAttributes,
  recipeCat,
  recipeSteps,
} from "@/db/schema";
import { eq } from "drizzle-orm";

// Get all recipes with their attributes
export async function getRecipesWithAttributes() {
  const recipes = await db
    .select({
      id: recipe.id,
      title: recipe.title,
      prepareTime: recipe.prepareTime,
      cookingTime: recipe.cookingTime,
      portions: recipe.portions,
      foodCategory: {
        id: foodCat.id,
        name: foodCat.name,
      },
    })
    .from(recipe)
    .leftJoin(foodCat, eq(recipe.foodCategory, foodCat.id));

  // For each recipe, fetch attributes
  const recipesWithAttributes = await Promise.all(
    recipes.map(async (r) => {
      const attrs = await db
        .select({
          id: recipeCat.id,
          name: recipeCat.name,
        })
        .from(recipeAttributes)
        .leftJoin(
          recipeCat,
          eq(recipeAttributes.recipeCat, recipeCat.id)
        )
        .where(eq(recipeAttributes.recipeId, r.id));

      return {
        ...r,
        attributes: attrs,
      };
    })
  );

  return recipesWithAttributes;
}

// Get all recipes with all details (ingredients, attributes, steps)
export async function getRecipesWithDetails() {
  const recipes = await db
    .select({
      id: recipe.id,
      title: recipe.title,
      prepareTime: recipe.prepareTime,
      cookingTime: recipe.cookingTime,
      portions: recipe.portions,
      foodCategory: {
        id: foodCat.id,
        name: foodCat.name,
      },
    })
    .from(recipe)
    .leftJoin(foodCat, eq(recipe.foodCategory, foodCat.id));

  const recipesWithDetails = await Promise.all(
    recipes.map(async (r) => {
      const recipeIngs = await db
        .select({
          id: ingredients.id,
          name: ingredients.name,
          amount: recipeIngredients.amount,
        })
        .from(recipeIngredients)
        .leftJoin(
          ingredients,
          eq(recipeIngredients.ingredientId, ingredients.id)
        )
        .where(eq(recipeIngredients.recipeId, r.id));

      const attrs = await db
        .select({
          id: recipeCat.id,
          name: recipeCat.name,
        })
        .from(recipeAttributes)
        .leftJoin(
          recipeCat,
          eq(recipeAttributes.recipeCat, recipeCat.id)
        )
        .where(eq(recipeAttributes.recipeId, r.id));

      const steps = await db
        .select({
          id: recipeSteps.id,
          stepNumber: recipeSteps.stepNumber,
          step: recipeSteps.step,
        })
        .from(recipeSteps)
        .where(eq(recipeSteps.recipeId, r.id))
        .orderBy(recipeSteps.stepNumber);

      return {
        ...r,
        ingredients: recipeIngs,
        attributes: attrs,
        steps: steps,
      };
    })
  );

  return recipesWithDetails;
}

// Get a single recipe with food category and attributes
export async function getRecipeWithDetails(recipeId: number) {
  const r = await db
    .select({
      id: recipe.id,
      title: recipe.title,
      prepareTime: recipe.prepareTime,
      cookingTime: recipe.cookingTime,
      portions: recipe.portions,
      foodCategory: {
        id: foodCat.id,
        name: foodCat.name,
      },
    })
    .from(recipe)
    .leftJoin(foodCat, eq(recipe.foodCategory, foodCat.id))
    .where(eq(recipe.id, recipeId))
    .then((rows) => rows[0]);

  if (!r) return null;

  const recipeIngs = await db
    .select({
      id: ingredients.id,
      name: ingredients.name,
      amount: recipeIngredients.amount,
    })
    .from(recipeIngredients)
    .leftJoin(
      ingredients,
      eq(recipeIngredients.ingredientId, ingredients.id)
    )
    .where(eq(recipeIngredients.recipeId, recipeId));

  const attrs = await db
    .select({
      id: recipeCat.id,
      name: recipeCat.name,
    })
    .from(recipeAttributes)
    .leftJoin(recipeCat, eq(recipeAttributes.recipeCat, recipeCat.id))
    .where(eq(recipeAttributes.recipeId, recipeId));

  const steps = await db
    .select({
      id: recipeSteps.id,
      stepNumber: recipeSteps.stepNumber,
      step: recipeSteps.step,
    })
    .from(recipeSteps)
    .where(eq(recipeSteps.recipeId, recipeId))
    .orderBy(recipeSteps.stepNumber);

  return {
    ...r,
    ingredients: recipeIngs,
    attributes: attrs,
    steps: steps,
  };
}

// Get only recipe with food category and attributes (no ingredients or steps)
export async function getRecipeWithFoodCatAndAttributes(recipeId: number) {
  const r = await db
    .select({
      id: recipe.id,
      title: recipe.title,
      prepareTime: recipe.prepareTime,
      cookingTime: recipe.cookingTime,
      portions: recipe.portions,
      foodCategory: {
        id: foodCat.id,
        name: foodCat.name,
      },
    })
    .from(recipe)
    .leftJoin(foodCat, eq(recipe.foodCategory, foodCat.id))
    .where(eq(recipe.id, recipeId))
    .then((rows) => rows[0]);

  if (!r) return null;

  const attrs = await db
    .select({
      id: recipeCat.id,
      name: recipeCat.name,
    })
    .from(recipeAttributes)
    .leftJoin(recipeCat, eq(recipeAttributes.recipeCat, recipeCat.id))
    .where(eq(recipeAttributes.recipeId, recipeId));

  return {
    ...r,
    attributes: attrs,
  };
}
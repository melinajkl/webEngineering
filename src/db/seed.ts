import "dotenv/config"
import { db } from "@/db"; // adjust path to your Drizzle instance
import {
  foodCat,
  recipeCat,
  ingredientCat,
  unit,
  recipe,
  ingredients,
  recipeIngredients,
  recipeAttributes,
  recipeSteps,
  shoppingList,
  calendar,
} from "./schema"; // adjust path to your schema

async function seed() {
  console.log("🌱 Starting database seed...");

  // --- CATEGORIES ---
  await db.insert(foodCat).values([
    { id: 1, name: "Breakfast" },
    { id: 2, name: "Lunch" },
    { id: 3, name: "Dinner" },
    { id: 4, name: "Dessert" },
    { id: 5, name: "Snack" },
  ]);

  await db.insert(recipeCat).values([
    { id: 1, name: "Vegetarian" },
    { id: 2, name: "Vegan" },
    { id: 3, name: "Gluten-Free" },
    { id: 4, name: "Quick & Easy" },
    { id: 5, name: "Healthy" },
  ]);

  await db.insert(ingredientCat).values([
    { id: 1, name: "Dairy" },
    { id: 2, name: "Vegetables" },
    { id: 3, name: "Fruits" },
    { id: 4, name: "Grains" },
    { id: 5, name: "Proteins" },
    { id: 6, name: "Oils & Condiments" },
  ]);

  await db.insert(unit).values([
    { id: 1, name: "gram", shortForm: "g" },
    { id: 2, name: "milliliter", shortForm: "ml" },
    { id: 3, name: "cup", shortForm: "cup" },
    { id: 4, name: "tablespoon", shortForm: "tbsp" },
    { id: 5, name: "teaspoon", shortForm: "tsp" },
    { id: 6, name: "piece", shortForm: "pc" },
  ]);

  // --- INGREDIENTS ---
  await db.insert(ingredients).values([
    { id: 1, name: "Eggs", category: 1, unit: 6 },
    { id: 2, name: "Milk", category: 1, unit: 2 },
    { id: 3, name: "Tomato", category: 2, unit: 6 },
    { id: 4, name: "Onion", category: 2, unit: 6 },
    { id: 5, name: "Garlic", category: 2, unit: 6 },
    { id: 6, name: "Chicken Breast", category: 5, unit: 1 },
    { id: 7, name: "Olive Oil", category: 6, unit: 2 },
    { id: 8, name: "Pasta", category: 4, unit: 1 },
    { id: 9, name: "Cheese", category: 1, unit: 1 },
    { id: 10, name: "Salt", category: 6, unit: 5 },
  ]);

  // --- RECIPES ---
  await db.insert(recipe).values([
    {
      id: 1,
      title: "Scrambled Eggs",
      prepareTime: 5,
      cookingTime: 5,
      portions: 2,
      foodCategory: 1,
    },
    {
      id: 2,
      title: "Pasta Carbonara",
      prepareTime: 10,
      cookingTime: 15,
      portions: 4,
      foodCategory: 3,
    },
    {
      id: 3,
      title: "Tomato Salad",
      prepareTime: 10,
      cookingTime: 0,
      portions: 3,
      foodCategory: 2,
    },
  ]);

  // --- RECIPE INGREDIENTS ---
  await db.insert(recipeIngredients).values([
    { recipeId: 1, ingredientId: 1, amount: 3 },
    { recipeId: 1, ingredientId: 2, amount: 100 },
    { recipeId: 1, ingredientId: 10, amount: 1 },
    { recipeId: 2, ingredientId: 8, amount: 400 },
    { recipeId: 2, ingredientId: 1, amount: 4 },
    { recipeId: 2, ingredientId: 9, amount: 200 },
    { recipeId: 3, ingredientId: 3, amount: 500 },
    { recipeId: 3, ingredientId: 7, amount: 50 },
    { recipeId: 3, ingredientId: 10, amount: 2 },
  ]);

  // --- RECIPE ATTRIBUTES ---
  await db.insert(recipeAttributes).values([
    { recipeId: 1, recipeCat: 1 },
    { recipeId: 1, recipeCat: 4 },
    { recipeId: 2, recipeCat: 4 },
    { recipeId: 3, recipeCat: 1 },
    { recipeId: 3, recipeCat: 5 },
  ]);

  // --- RECIPE STEPS ---
  await db.insert(recipeSteps).values([
    { id: 1, recipeId: 1, stepNumber: 1, step: "Crack eggs into a bowl" },
    { id: 2, recipeId: 1, stepNumber: 2, step: "Beat eggs with salt" },
    {
      id: 3,
      recipeId: 1,
      stepNumber: 3,
      step: "Cook in buttered pan on medium heat",
    },
    { id: 4, recipeId: 2, stepNumber: 1, step: "Boil pasta in salted water" },
    { id: 5, recipeId: 2, stepNumber: 2, step: "Mix eggs and cheese" },
    {
      id: 6,
      recipeId: 2,
      stepNumber: 3,
      step: "Combine pasta with egg mixture off heat",
    },
    { id: 7, recipeId: 3, stepNumber: 1, step: "Slice tomatoes" },
    {
      id: 8,
      recipeId: 3,
      stepNumber: 2,
      step: "Drizzle with olive oil and salt",
    },
  ]);

  // --- SHOPPING LIST ---
  await db.insert(shoppingList).values([
    {
      id: 1,
      ingredientId: 1,
      amount: 12,
      unitId: 6,
      checked: false,
      dateOfUse: Date.now(),
    },
    {
      id: 2,
      ingredientId: 6,
      amount: 500,
      unitId: 1,
      checked: false,
      dateOfUse: Date.now(),
    },
    {
      id: 3,
      ingredientId: 3,
      amount: 1000,
      unitId: 1,
      checked: true,
      dateOfUse: Date.now(),
    },
  ]);

  // --- CALENDAR ---
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  await db.insert(calendar).values([
    { date: today.getTime(), daytime: 1, recipe_id: 1 }, // Breakfast: Scrambled Eggs
    { date: today.getTime(), daytime: 3, recipe_id: 2 }, // Dinner: Pasta Carbonara
    { date: tomorrow.getTime(), daytime: 1, recipe_id: 3 }, // Tomorrow Lunch: Tomato Salad
  ]);

  console.log("✅ Database seeded successfully!");
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});

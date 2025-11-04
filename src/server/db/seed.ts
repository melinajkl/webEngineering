import { db } from "@/server/db";
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
} from "./schema";

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
    { id: 11, name: "Bell Pepper", category: 2, unit: 6 },
    { id: 12, name: "Broccoli", category: 2, unit: 6 },
    { id: 13, name: "Salmon", category: 5, unit: 1 },
    { id: 14, name: "Rice", category: 4, unit: 1 },
    { id: 15, name: "Spinach", category: 2, unit: 6 },
    { id: 16, name: "Mushroom", category: 2, unit: 6 },
    { id: 17, name: "Lemon", category: 3, unit: 6 },
    { id: 18, name: "Honey", category: 6, unit: 4 },
    { id: 19, name: "Chickpea", category: 5, unit: 1 },
    { id: 20, name: "Avocado", category: 3, unit: 6 },
  ]);

  // --- RECIPES (16+) ---
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
    {
      id: 4,
      title: "Grilled Chicken with Broccoli",
      prepareTime: 15,
      cookingTime: 25,
      portions: 4,
      foodCategory: 3,
    },
    {
      id: 5,
      title: "Vegetable Stir Fry",
      prepareTime: 10,
      cookingTime: 12,
      portions: 3,
      foodCategory: 2,
    },
    {
      id: 6,
      title: "Garlic Shrimp Pasta",
      prepareTime: 10,
      cookingTime: 15,
      portions: 4,
      foodCategory: 3,
    },
    {
      id: 7,
      title: "Caprese Salad",
      prepareTime: 10,
      cookingTime: 0,
      portions: 2,
      foodCategory: 2,
    },
    {
      id: 8,
      title: "Mushroom Risotto",
      prepareTime: 15,
      cookingTime: 30,
      portions: 4,
      foodCategory: 3,
    },
    {
      id: 9,
      title: "Lemon Baked Salmon",
      prepareTime: 10,
      cookingTime: 20,
      portions: 3,
      foodCategory: 3,
    },
    {
      id: 10,
      title: "Spinach and Cheese Omelette",
      prepareTime: 5,
      cookingTime: 8,
      portions: 2,
      foodCategory: 1,
    },
    {
      id: 11,
      title: "Chickpea Buddha Bowl",
      prepareTime: 15,
      cookingTime: 0,
      portions: 2,
      foodCategory: 2,
    },
    {
      id: 12,
      title: "Honey Garlic Chicken",
      prepareTime: 10,
      cookingTime: 25,
      portions: 4,
      foodCategory: 3,
    },
    {
      id: 13,
      title: "Avocado Toast",
      prepareTime: 5,
      cookingTime: 3,
      portions: 1,
      foodCategory: 1,
    },
    {
      id: 14,
      title: "Vegetable Soup",
      prepareTime: 15,
      cookingTime: 30,
      portions: 4,
      foodCategory: 2,
    },
    {
      id: 15,
      title: "Stuffed Bell Peppers",
      prepareTime: 20,
      cookingTime: 30,
      portions: 4,
      foodCategory: 3,
    },
    {
      id: 16,
      title: "Greek Salad",
      prepareTime: 10,
      cookingTime: 0,
      portions: 3,
      foodCategory: 2,
    },
    {
      id: 17,
      title: "Garlic Butter Rice",
      prepareTime: 5,
      cookingTime: 20,
      portions: 4,
      foodCategory: 3,
    },
  ]);

  // --- RECIPE INGREDIENTS ---
  await db.insert(recipeIngredients).values([
    // Scrambled Eggs
    { recipeId: 1, ingredientId: 1, amount: 3 },
    { recipeId: 1, ingredientId: 2, amount: 100 },
    { recipeId: 1, ingredientId: 10, amount: 1 },
    // Pasta Carbonara
    { recipeId: 2, ingredientId: 8, amount: 400 },
    { recipeId: 2, ingredientId: 1, amount: 4 },
    { recipeId: 2, ingredientId: 9, amount: 200 },
    // Tomato Salad
    { recipeId: 3, ingredientId: 3, amount: 500 },
    { recipeId: 3, ingredientId: 7, amount: 50 },
    { recipeId: 3, ingredientId: 10, amount: 2 },
    // Grilled Chicken with Broccoli
    { recipeId: 4, ingredientId: 6, amount: 500 },
    { recipeId: 4, ingredientId: 12, amount: 400 },
    { recipeId: 4, ingredientId: 7, amount: 30 },
    // Vegetable Stir Fry
    { recipeId: 5, ingredientId: 11, amount: 200 },
    { recipeId: 5, ingredientId: 4, amount: 150 },
    { recipeId: 5, ingredientId: 5, amount: 30 },
    // Garlic Shrimp Pasta
    { recipeId: 6, ingredientId: 8, amount: 350 },
    { recipeId: 6, ingredientId: 5, amount: 50 },
    { recipeId: 6, ingredientId: 7, amount: 40 },
    // Caprese Salad
    { recipeId: 7, ingredientId: 3, amount: 400 },
    { recipeId: 7, ingredientId: 9, amount: 200 },
    { recipeId: 7, ingredientId: 7, amount: 30 },
    // Mushroom Risotto
    { recipeId: 8, ingredientId: 14, amount: 300 },
    { recipeId: 8, ingredientId: 16, amount: 250 },
    { recipeId: 8, ingredientId: 2, amount: 500 },
    // Lemon Baked Salmon
    { recipeId: 9, ingredientId: 13, amount: 400 },
    { recipeId: 9, ingredientId: 17, amount: 100 },
    { recipeId: 9, ingredientId: 7, amount: 30 },
    // Spinach and Cheese Omelette
    { recipeId: 10, ingredientId: 1, amount: 3 },
    { recipeId: 10, ingredientId: 15, amount: 100 },
    { recipeId: 10, ingredientId: 9, amount: 100 },
    // Chickpea Buddha Bowl
    { recipeId: 11, ingredientId: 19, amount: 200 },
    { recipeId: 11, ingredientId: 15, amount: 150 },
    { recipeId: 11, ingredientId: 20, amount: 100 },
    // Honey Garlic Chicken
    { recipeId: 12, ingredientId: 6, amount: 600 },
    { recipeId: 12, ingredientId: 18, amount: 60 },
    { recipeId: 12, ingredientId: 5, amount: 40 },
    // Avocado Toast
    { recipeId: 13, ingredientId: 20, amount: 100 },
    { recipeId: 13, ingredientId: 17, amount: 50 },
    { recipeId: 13, ingredientId: 10, amount: 1 },
    // Vegetable Soup
    { recipeId: 14, ingredientId: 3, amount: 300 },
    { recipeId: 14, ingredientId: 4, amount: 200 },
    { recipeId: 14, ingredientId: 5, amount: 50 },
    // Stuffed Bell Peppers
    { recipeId: 15, ingredientId: 11, amount: 400 },
    { recipeId: 15, ingredientId: 14, amount: 200 },
    { recipeId: 15, ingredientId: 4, amount: 100 },
    // Greek Salad
    { recipeId: 16, ingredientId: 3, amount: 300 },
    { recipeId: 16, ingredientId: 11, amount: 200 },
    { recipeId: 16, ingredientId: 9, amount: 150 },
    // Garlic Butter Rice
    { recipeId: 17, ingredientId: 14, amount: 400 },
    { recipeId: 17, ingredientId: 5, amount: 60 },
    { recipeId: 17, ingredientId: 7, amount: 50 },
  ]);

  // --- RECIPE ATTRIBUTES ---
  await db.insert(recipeAttributes).values([
    { recipeId: 1, recipeCat: 1 },
    { recipeId: 1, recipeCat: 4 },
    { recipeId: 2, recipeCat: 4 },
    { recipeId: 3, recipeCat: 1 },
    { recipeId: 3, recipeCat: 5 },
    { recipeId: 4, recipeCat: 4 },
    { recipeId: 4, recipeCat: 5 },
    { recipeId: 5, recipeCat: 1 },
    { recipeId: 5, recipeCat: 4 },
    { recipeId: 6, recipeCat: 4 },
    { recipeId: 7, recipeCat: 1 },
    { recipeId: 7, recipeCat: 5 },
    { recipeId: 8, recipeCat: 1 },
    { recipeId: 9, recipeCat: 5 },
    { recipeId: 9, recipeCat: 4 },
    { recipeId: 10, recipeCat: 1 },
    { recipeId: 10, recipeCat: 4 },
    { recipeId: 11, recipeCat: 2 },
    { recipeId: 11, recipeCat: 5 },
    { recipeId: 12, recipeCat: 4 },
    { recipeId: 13, recipeCat: 1 },
    { recipeId: 13, recipeCat: 4 },
    { recipeId: 14, recipeCat: 1 },
    { recipeId: 14, recipeCat: 5 },
    { recipeId: 15, recipeCat: 1 },
    { recipeId: 16, recipeCat: 1 },
    { recipeId: 16, recipeCat: 5 },
    { recipeId: 17, recipeCat: 1 },
    { recipeId: 17, recipeCat: 4 },
  ]);

  // --- RECIPE STEPS (sample for new recipes) ---
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
    { date: today.getTime(), daytime: 1, recipe_id: 1 },
    { date: today.getTime(), daytime: 3, recipe_id: 2 },
    { date: tomorrow.getTime(), daytime: 1, recipe_id: 3 },
  ]);

  console.log("✅ Database seeded successfully!");
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});

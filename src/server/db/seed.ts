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
} from "./schema";
import { eq } from "drizzle-orm";

export async function runSeed() {
  console.log("🌱 Starting database seed...");

  // --- CATEGORY MASTER DATA ---
  const foodCats = [
    "Breakfast",
    "Lunch",
    "Dinner",
    "Dessert",
    "Snack",
    "Drink",
  ];
  const recipeCats = [
    "Vegetarian",
    "Vegan",
    "Gluten-Free",
    "High Protein",
    "Quick & Easy",
    "One-Pot",
    "30-Minute",
  ];
  const ingredientCats = [
    "Vegetable",
    "Fruit",
    "Grain",
    "Dairy",
    "Protein",
    "Spices",
    "Oil",
    "Herb",
    "Legume",
    "Bakery",
    "Condiment",
    "Sweetener",
    "Beverage",
  ];
  const units = [
    { name: "Gram", shortForm: "g" },
    { name: "Milliliter", shortForm: "ml" },
    { name: "Piece", shortForm: "pc" },
    { name: "Teaspoon", shortForm: "tsp" },
    { name: "Tablespoon", shortForm: "tbsp" },
    { name: "Cup", shortForm: "cup" },
  ];

  // --- INSERT MASTER DATA ---
  await db
    .insert(foodCat)
    .values(foodCats.map((n) => ({ name: n })))
    .onConflictDoNothing();
  await db
    .insert(recipeCat)
    .values(recipeCats.map((n) => ({ name: n })))
    .onConflictDoNothing();
  await db
    .insert(ingredientCat)
    .values(ingredientCats.map((n) => ({ name: n })))
    .onConflictDoNothing();
  await db.insert(unit).values(units).onConflictDoNothing();

  // --- FETCH IDs ---
  const [foodRows, recipeCatRows, ingCatRows, unitRows] = await Promise.all([
    db.select().from(foodCat),
    db.select().from(recipeCat),
    db.select().from(ingredientCat),
    db.select().from(unit),
  ]);

  const foodId = Object.fromEntries(foodRows.map((r) => [r.name, r.id]));
  const rcatId = Object.fromEntries(recipeCatRows.map((r) => [r.name, r.id]));
  const icatId = Object.fromEntries(ingCatRows.map((r) => [r.name, r.id]));
  const unitId = Object.fromEntries(unitRows.map((r) => [r.shortForm, r.id]));

  // --- INGREDIENTS CATALOG ---
  const catalog = [
    ["Egg", "Protein", "pc"],
    ["Milk", "Dairy", "ml"],
    ["Flour", "Grain", "g"],
    ["Sugar", "Sweetener", "g"],
    ["Butter", "Dairy", "g"],
    ["Salt", "Spices", "tsp"],
    ["Pepper", "Spices", "tsp"],
    ["Olive Oil", "Oil", "tbsp"],
    ["Garlic", "Vegetable", "pc"],
    ["Onion", "Vegetable", "pc"],
    ["Tomato", "Vegetable", "pc"],
    ["Cucumber", "Vegetable", "pc"],
    ["Lettuce", "Vegetable", "pc"],
    ["Lemon", "Fruit", "pc"],
    ["Banana", "Fruit", "pc"],
    ["Apple", "Fruit", "pc"],
    ["Chicken Breast", "Protein", "g"],
    ["Beef Mince", "Protein", "g"],
    ["Rice", "Grain", "g"],
    ["Pasta", "Grain", "g"],
    ["Parmesan", "Dairy", "g"],
    ["Cheddar", "Dairy", "g"],
    ["Mozzarella", "Dairy", "g"],
    ["Basil", "Herb", "tbsp"],
    ["Parsley", "Herb", "tbsp"],
    ["Cumin", "Spices", "tsp"],
    ["Paprika", "Spices", "tsp"],
    ["Curry Powder", "Spices", "tsp"],
    ["Coconut Milk", "Dairy", "ml"],
    ["Chickpeas", "Legume", "g"],
    ["Lentils (red)", "Legume", "g"],
    ["Kidney Beans", "Legume", "g"],
    ["Avocado", "Fruit", "pc"],
    ["Bread Roll", "Bakery", "pc"],
    ["Tortilla", "Bakery", "pc"],
    ["Oats", "Grain", "g"],
    ["Honey", "Sweetener", "tbsp"],
    ["Yogurt", "Dairy", "ml"],
    ["Spinach", "Vegetable", "g"],
    ["Bell Pepper", "Vegetable", "pc"],
    ["Carrot", "Vegetable", "pc"],
    ["Mushroom", "Vegetable", "g"],
    ["Soy Sauce", "Condiment", "tbsp"],
    ["Pesto", "Condiment", "tbsp"],
  ];

  await db
    .insert(ingredients)
    .values(
      catalog.map(([name, cat, unitShort]) => ({
        name,
        category: icatId[cat],
        unit: unitId[unitShort],
      }))
    )
    .onConflictDoNothing();

  const allIngredients = await db.select().from(ingredients);
  const ingId = Object.fromEntries(allIngredients.map((i) => [i.name, i.id]));

  // --- SAMPLE RECIPE ---
  const [recipeEntry] = await db
    .insert(recipe)
    .values({
      title: "Pancakes",
      prepareTime: 10,
      cookingTime: 15,
      portions: 4,
      foodCategory: foodId["Breakfast"],
    })
    .onConflictDoNothing()
    .returning({ id: recipe.id });

  const recipeId =
    recipeEntry?.id ??
    (
      await db
        .select({ id: recipe.id })
        .from(recipe)
        .where(eq(recipe.title, "Pancakes"))
    )[0].id;

  // --- RELATIONS ---
  await db
    .insert(recipeIngredients)
    .values([
      { recipeId, ingredientId: ingId["Flour"], amount: 150 },
      { recipeId, ingredientId: ingId["Milk"], amount: 200 },
      { recipeId, ingredientId: ingId["Egg"], amount: 2 },
      { recipeId, ingredientId: ingId["Sugar"], amount: 30 },
      { recipeId, ingredientId: ingId["Butter"], amount: 20 },
    ])
    .onConflictDoNothing();

  await db
    .insert(recipeAttributes)
    .values([{ recipeId, recipeCat: rcatId["Vegetarian"] }])
    .onConflictDoNothing();

  await db
    .insert(recipeSteps)
    .values([
      { recipeId, stepNumber: 1, step: "Whisk eggs, milk and sugar." },
      { recipeId, stepNumber: 2, step: "Add flour and mix until smooth." },
      {
        recipeId,
        stepNumber: 3,
        step: "Melt butter in pan and fry until golden.",
      },
    ])
    .onConflictDoNothing();

  // --- SHOPPING LIST DEMO ENTRY ---
  await db
    .insert(shoppingList)
    .values({
      ingredientId: ingId["Milk"],
      dateOfUse: Date.now(),
      amount: 500,
      unitId: unitId["ml"],
      checked: false,
    })
    .onConflictDoNothing();

  console.log("✅ Seed finished successfully.");
}

// Optional auto-run if you execute directly
if (require.main === module) {
  runSeed().catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  });
}

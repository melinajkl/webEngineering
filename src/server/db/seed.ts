// src/server/db/seed.ts
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

export async function runSeed() {
  console.log("🌱 Seeding...");

  // ---------- MASTER DATA ----------
  const FOOD = ["Breakfast", "Lunch", "Dinner", "Dessert", "Snack", "Drink"];
  const RCATS = [
    "Vegetarian",
    "Vegan",
    "Gluten-Free",
    "High Protein",
    "Quick & Easy",
    "One-Pot",
    "30-Minute",
  ];
  const ICATS = [
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
  const UNITS = [
    { name: "Gram", shortForm: "g" },
    { name: "Milliliter", shortForm: "ml" },
    { name: "Piece", shortForm: "pc" },
    { name: "Teaspoon", shortForm: "tsp" },
    { name: "Tablespoon", shortForm: "tbsp" },
    { name: "Cup", shortForm: "cup" },
  ];

  await db
    .insert(foodCat)
    .values(FOOD.map((name) => ({ name })))
    .onConflictDoNothing();
  await db
    .insert(recipeCat)
    .values(RCATS.map((name) => ({ name })))
    .onConflictDoNothing();
  await db
    .insert(ingredientCat)
    .values(ICATS.map((name) => ({ name })))
    .onConflictDoNothing();
  await db.insert(unit).values(UNITS).onConflictDoNothing();

  const [foodRows, rcatRows, icatRows, unitRows] = await Promise.all([
    db.select().from(foodCat),
    db.select().from(recipeCat),
    db.select().from(ingredientCat),
    db.select().from(unit),
  ]);

  const foodId: Record<string, number> = Object.fromEntries(
    foodRows.map((r) => [r.name, r.id])
  );
  const rcatId: Record<string, number> = Object.fromEntries(
    rcatRows.map((r) => [r.name, r.id])
  );
  const icatId: Record<string, number> = Object.fromEntries(
    icatRows.map((r) => [r.name, r.id])
  );
  const unitId: Record<string, number> = Object.fromEntries(
    unitRows.map((r) => [r.shortForm, r.id])
  );

  // ---------- INGREDIENT CATALOG ----------
  const CATALOG: Array<[string, string, string]> = [
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
    ["Tomato Sauce", "Condiment", "ml"],
    ["Canned Tomatoes", "Condiment", "g"],
    ["Parmesan", "Dairy", "g"],
    ["Cheddar", "Dairy", "g"],
    ["Mozzarella", "Dairy", "g"],
    ["Basil", "Herb", "tbsp"],
    ["Parsley", "Herb", "tbsp"],
    ["Coriander", "Herb", "tbsp"],
    ["Cumin", "Spices", "tsp"],
    ["Paprika", "Spices", "tsp"],
    ["Chili Flakes", "Spices", "tsp"],
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
    ["Baking Powder", "Bakery", "tsp"],
    ["Vanilla", "Condiment", "tsp"],
    ["Maple Syrup", "Sweetener", "tbsp"],
    ["Water", "Beverage", "ml"],
    ["Plant Milk", "Beverage", "ml"],
    ["Egg Noodles", "Grain", "g"],
    ["Tuna (canned)", "Protein", "g"],
    ["Feta", "Dairy", "g"],
    ["Corn", "Vegetable", "g"],
    ["Green Peas", "Vegetable", "g"],
    ["Ginger", "Spices", "tsp"],
    ["Lime", "Fruit", "pc"],
  ];

  await db
    .insert(ingredients)
    .values(
      CATALOG.map(([name, cat, u]) => ({
        name,
        category: icatId[cat],
        unit: unitId[u],
      }))
    )
    .onConflictDoNothing();

  const allIngs = await db.select().from(ingredients);
  const ingId: Record<string, number> = Object.fromEntries(
    allIngs.map((i) => [i.name, i.id])
  );

  // ---------- 20+ RECIPES ----------
  type R = {
    title: string;
    prep: number;
    cook: number;
    portions: number;
    food: string;
    attrs: string[];
    items: { name: string; amount: number }[];
    steps: string[];
  };

  const RECIPES: R[] = [
    {
      title: "Pancakes",
      prep: 10,
      cook: 15,
      portions: 4,
      food: "Breakfast",
      attrs: ["Vegetarian", "Quick & Easy"],
      items: [
        { name: "Flour", amount: 150 },
        { name: "Milk", amount: 200 },
        { name: "Egg", amount: 2 },
        { name: "Sugar", amount: 30 },
        { name: "Butter", amount: 20 },
        { name: "Baking Powder", amount: 2 },
      ],
      steps: [
        "Whisk eggs, milk, sugar.",
        "Add flour and baking powder; whisk smooth.",
        "Pan-fry with butter until golden.",
      ],
    },
    {
      title: "Spaghetti Bolognese",
      prep: 15,
      cook: 40,
      portions: 4,
      food: "Dinner",
      attrs: ["High Protein"],
      items: [
        { name: "Pasta", amount: 350 },
        { name: "Beef Mince", amount: 400 },
        { name: "Onion", amount: 1 },
        { name: "Garlic", amount: 2 },
        { name: "Canned Tomatoes", amount: 400 },
        { name: "Tomato Sauce", amount: 200 },
        { name: "Olive Oil", amount: 2 },
        { name: "Basil", amount: 1 },
        { name: "Salt", amount: 1 },
        { name: "Pepper", amount: 1 },
      ],
      steps: [
        "Sauté onion/garlic in oil.",
        "Brown beef; add tomatoes; simmer 25–30 min.",
        "Cook pasta; combine and season.",
      ],
    },
    {
      title: "Tomato Soup",
      prep: 10,
      cook: 25,
      portions: 4,
      food: "Lunch",
      attrs: ["Vegetarian", "30-Minute"],
      items: [
        { name: "Onion", amount: 1 },
        { name: "Garlic", amount: 1 },
        { name: "Olive Oil", amount: 1 },
        { name: "Canned Tomatoes", amount: 800 },
        { name: "Water", amount: 300 },
        { name: "Basil", amount: 1 },
        { name: "Salt", amount: 1 },
        { name: "Pepper", amount: 1 },
      ],
      steps: [
        "Sauté aromatics.",
        "Simmer with tomatoes and water.",
        "Blend smooth; season.",
      ],
    },
    {
      title: "Caesar Salad (Veggie)",
      prep: 15,
      cook: 0,
      portions: 2,
      food: "Lunch",
      attrs: ["Vegetarian", "Quick & Easy"],
      items: [
        { name: "Lettuce", amount: 1 },
        { name: "Parmesan", amount: 40 },
        { name: "Bread Roll", amount: 1 },
        { name: "Olive Oil", amount: 1 },
        { name: "Yogurt", amount: 80 },
        { name: "Lemon", amount: 1 },
        { name: "Garlic", amount: 1 },
        { name: "Salt", amount: 1 },
        { name: "Pepper", amount: 1 },
      ],
      steps: [
        "Toast croutons.",
        "Mix yogurt-lemon dressing.",
        "Toss lettuce, croutons, parmesan.",
      ],
    },
    {
      title: "Veggie Stir-Fry",
      prep: 10,
      cook: 10,
      portions: 2,
      food: "Dinner",
      attrs: ["Vegan", "30-Minute", "One-Pot"],
      items: [
        { name: "Bell Pepper", amount: 1 },
        { name: "Carrot", amount: 1 },
        { name: "Mushroom", amount: 150 },
        { name: "Spinach", amount: 100 },
        { name: "Soy Sauce", amount: 2 },
        { name: "Olive Oil", amount: 1 },
        { name: "Garlic", amount: 1 },
        { name: "Ginger", amount: 1 },
      ],
      steps: [
        "Stir-fry veg hot.",
        "Finish with soy sauce.",
        "Serve with rice.",
      ],
    },
    {
      title: "Omelette",
      prep: 5,
      cook: 5,
      portions: 1,
      food: "Breakfast",
      attrs: ["Vegetarian", "Quick & Easy", "30-Minute"],
      items: [
        { name: "Egg", amount: 3 },
        { name: "Butter", amount: 10 },
        { name: "Salt", amount: 1 },
        { name: "Pepper", amount: 1 },
        { name: "Cheddar", amount: 30 },
        { name: "Parsley", amount: 1 },
      ],
      steps: [
        "Beat eggs.",
        "Cook gently in butter.",
        "Melt cheese; fold; garnish.",
      ],
    },
    {
      title: "Chili con Carne",
      prep: 15,
      cook: 45,
      portions: 4,
      food: "Dinner",
      attrs: ["High Protein", "One-Pot"],
      items: [
        { name: "Beef Mince", amount: 500 },
        { name: "Onion", amount: 1 },
        { name: "Garlic", amount: 2 },
        { name: "Kidney Beans", amount: 240 },
        { name: "Canned Tomatoes", amount: 400 },
        { name: "Paprika", amount: 2 },
        { name: "Cumin", amount: 1 },
        { name: "Chili Flakes", amount: 1 },
        { name: "Salt", amount: 1 },
        { name: "Olive Oil", amount: 1 },
      ],
      steps: [
        "Brown beef.",
        "Simmer with beans and spices.",
        "Adjust seasoning.",
      ],
    },
    {
      title: "Guacamole",
      prep: 10,
      cook: 0,
      portions: 2,
      food: "Snack",
      attrs: ["Vegan", "Gluten-Free", "Quick & Easy"],
      items: [
        { name: "Avocado", amount: 2 },
        { name: "Lime", amount: 1 },
        { name: "Onion", amount: 1 },
        { name: "Salt", amount: 1 },
        { name: "Coriander", amount: 1 },
      ],
      steps: [
        "Mash avocado.",
        "Stir in lime, onion, coriander.",
        "Salt to taste.",
      ],
    },
    {
      title: "Greek Salad",
      prep: 10,
      cook: 0,
      portions: 2,
      food: "Lunch",
      attrs: ["Vegetarian", "Gluten-Free", "Quick & Easy"],
      items: [
        { name: "Tomato", amount: 2 },
        { name: "Cucumber", amount: 1 },
        { name: "Onion", amount: 1 },
        { name: "Feta", amount: 120 },
        { name: "Olive Oil", amount: 2 },
        { name: "Lemon", amount: 1 },
        { name: "Salt", amount: 1 },
        { name: "Pepper", amount: 1 },
        { name: "Basil", amount: 1 },
      ],
      steps: ["Chop veg.", "Dress with oil & lemon.", "Add feta; season."],
    },
    {
      title: "Pesto Pasta",
      prep: 5,
      cook: 12,
      portions: 2,
      food: "Dinner",
      attrs: ["Vegetarian", "30-Minute"],
      items: [
        { name: "Pasta", amount: 250 },
        { name: "Pesto", amount: 3 },
        { name: "Parmesan", amount: 30 },
        { name: "Salt", amount: 1 },
      ],
      steps: ["Cook pasta.", "Toss with pesto.", "Top with parmesan."],
    },
    {
      title: "Banana Bread",
      prep: 15,
      cook: 55,
      portions: 10,
      food: "Dessert",
      attrs: ["Vegetarian"],
      items: [
        { name: "Banana", amount: 3 },
        { name: "Flour", amount: 250 },
        { name: "Sugar", amount: 120 },
        { name: "Butter", amount: 80 },
        { name: "Egg", amount: 2 },
        { name: "Baking Powder", amount: 2 },
        { name: "Vanilla", amount: 1 },
        { name: "Salt", amount: 1 },
      ],
      steps: ["Mix wet.", "Fold in dry.", "Bake 50–60 min @175°C."],
    },
    {
      title: "Shakshuka",
      prep: 10,
      cook: 20,
      portions: 2,
      food: "Breakfast",
      attrs: ["Vegetarian", "One-Pot"],
      items: [
        { name: "Onion", amount: 1 },
        { name: "Garlic", amount: 2 },
        { name: "Bell Pepper", amount: 1 },
        { name: "Canned Tomatoes", amount: 400 },
        { name: "Paprika", amount: 2 },
        { name: "Cumin", amount: 1 },
        { name: "Egg", amount: 4 },
        { name: "Olive Oil", amount: 1 },
        { name: "Parsley", amount: 1 },
        { name: "Salt", amount: 1 },
        { name: "Pepper", amount: 1 },
      ],
      steps: ["Cook base.", "Simmer sauce.", "Poach eggs in sauce."],
    },
    {
      title: "Chicken Curry",
      prep: 15,
      cook: 25,
      portions: 3,
      food: "Dinner",
      attrs: ["High Protein", "30-Minute"],
      items: [
        { name: "Chicken Breast", amount: 400 },
        { name: "Onion", amount: 1 },
        { name: "Garlic", amount: 2 },
        { name: "Curry Powder", amount: 2 },
        { name: "Coconut Milk", amount: 300 },
        { name: "Olive Oil", amount: 1 },
        { name: "Salt", amount: 1 },
        { name: "Pepper", amount: 1 },
      ],
      steps: [
        "Sauté aromatics with curry.",
        "Add chicken.",
        "Simmer with coconut milk.",
      ],
    },
    {
      title: "Fried Rice",
      prep: 10,
      cook: 10,
      portions: 2,
      food: "Dinner",
      attrs: ["Quick & Easy", "One-Pot"],
      items: [
        { name: "Rice", amount: 300 },
        { name: "Egg", amount: 2 },
        { name: "Green Peas", amount: 100 },
        { name: "Carrot", amount: 1 },
        { name: "Onion", amount: 1 },
        { name: "Soy Sauce", amount: 2 },
        { name: "Olive Oil", amount: 1 },
      ],
      steps: ["Scramble eggs.", "Stir-fry veg & rice.", "Season with soy."],
    },
    {
      title: "Red Lentil Soup",
      prep: 10,
      cook: 25,
      portions: 4,
      food: "Lunch",
      attrs: ["Vegan", "Gluten-Free", "One-Pot"],
      items: [
        { name: "Onion", amount: 1 },
        { name: "Garlic", amount: 2 },
        { name: "Lentils (red)", amount: 250 },
        { name: "Cumin", amount: 1 },
        { name: "Paprika", amount: 1 },
        { name: "Water", amount: 1000 },
        { name: "Salt", amount: 1 },
        { name: "Olive Oil", amount: 1 },
      ],
      steps: [
        "Sauté.",
        "Simmer until soft.",
        "Season; blend partly if desired.",
      ],
    },
    {
      title: "Tacos (Beef)",
      prep: 10,
      cook: 12,
      portions: 3,
      food: "Dinner",
      attrs: ["30-Minute"],
      items: [
        { name: "Beef Mince", amount: 350 },
        { name: "Onion", amount: 1 },
        { name: "Cumin", amount: 1 },
        { name: "Paprika", amount: 1 },
        { name: "Chili Flakes", amount: 1 },
        { name: "Tortilla", amount: 6 },
        { name: "Lettuce", amount: 1 },
        { name: "Tomato", amount: 2 },
        { name: "Cheddar", amount: 60 },
      ],
      steps: [
        "Cook beef with spices.",
        "Warm tortillas.",
        "Assemble with toppings.",
      ],
    },
    {
      title: "Classic Burger",
      prep: 10,
      cook: 10,
      portions: 2,
      food: "Dinner",
      attrs: ["High Protein", "30-Minute"],
      items: [
        { name: "Beef Mince", amount: 300 },
        { name: "Bread Roll", amount: 2 },
        { name: "Lettuce", amount: 1 },
        { name: "Tomato", amount: 1 },
        { name: "Onion", amount: 1 },
        { name: "Cheddar", amount: 40 },
        { name: "Salt", amount: 1 },
        { name: "Pepper", amount: 1 },
        { name: "Olive Oil", amount: 1 },
      ],
      steps: ["Form & season patties.", "Sear; melt cheese.", "Assemble buns."],
    },
    {
      title: "Pizza Margherita",
      prep: 20,
      cook: 12,
      portions: 2,
      food: "Dinner",
      attrs: ["Vegetarian"],
      items: [
        { name: "Flour", amount: 250 },
        { name: "Water", amount: 150 },
        { name: "Olive Oil", amount: 1 },
        { name: "Salt", amount: 1 },
        { name: "Tomato Sauce", amount: 150 },
        { name: "Mozzarella", amount: 150 },
        { name: "Basil", amount: 1 },
      ],
      steps: [
        "Make quick dough.",
        "Top & bake very hot.",
        "Finish with basil.",
      ],
    },
    {
      title: "Oatmeal Bowl",
      prep: 2,
      cook: 5,
      portions: 1,
      food: "Breakfast",
      attrs: ["Vegetarian", "Quick & Easy"],
      items: [
        { name: "Oats", amount: 60 },
        { name: "Milk", amount: 200 },
        { name: "Apple", amount: 1 },
        { name: "Honey", amount: 1 },
      ],
      steps: ["Cook oats in milk.", "Top with apple & honey."],
    },
    {
      title: "Smoothie Bowl",
      prep: 5,
      cook: 0,
      portions: 1,
      food: "Breakfast",
      attrs: ["Vegetarian", "Gluten-Free", "Quick & Easy"],
      items: [
        { name: "Banana", amount: 1 },
        { name: "Yogurt", amount: 150 },
        { name: "Plant Milk", amount: 100 },
        { name: "Oats", amount: 20 },
        { name: "Honey", amount: 1 },
      ],
      steps: ["Blend all.", "Pour into bowl; drizzle honey."],
    },
    {
      title: "Tuna Pasta",
      prep: 5,
      cook: 12,
      portions: 2,
      food: "Dinner",
      attrs: ["30-Minute", "High Protein"],
      items: [
        { name: "Pasta", amount: 250 },
        { name: "Tuna (canned)", amount: 160 },
        { name: "Olive Oil", amount: 2 },
        { name: "Garlic", amount: 1 },
        { name: "Parsley", amount: 1 },
        { name: "Lemon", amount: 1 },
        { name: "Salt", amount: 1 },
        { name: "Pepper", amount: 1 },
      ],
      steps: [
        "Cook pasta.",
        "Warm tuna with garlic.",
        "Toss; finish with lemon & parsley.",
      ],
    },
    {
      title: "Chickpea Curry",
      prep: 10,
      cook: 20,
      portions: 3,
      food: "Dinner",
      attrs: ["Vegan", "Gluten-Free", "30-Minute"],
      items: [
        { name: "Onion", amount: 1 },
        { name: "Garlic", amount: 2 },
        { name: "Curry Powder", amount: 2 },
        { name: "Chickpeas", amount: 240 },
        { name: "Coconut Milk", amount: 300 },
        { name: "Olive Oil", amount: 1 },
        { name: "Salt", amount: 1 },
      ],
      steps: [
        "Sauté aromatics with curry.",
        "Add chickpeas & coconut milk.",
        "Simmer; season.",
      ],
    },
    {
      title: "Tomato Tuna Salad",
      prep: 7,
      cook: 0,
      portions: 2,
      food: "Lunch",
      attrs: ["High Protein", "Quick & Easy", "Gluten-Free"],
      items: [
        { name: "Tuna (canned)", amount: 160 },
        { name: "Tomato", amount: 2 },
        { name: "Cucumber", amount: 1 },
        { name: "Onion", amount: 1 },
        { name: "Olive Oil", amount: 1 },
        { name: "Lemon", amount: 1 },
        { name: "Salt", amount: 1 },
        { name: "Pepper", amount: 1 },
      ],
      steps: [
        "Flake tuna; dice veg.",
        "Dress with oil & lemon.",
        "Season; toss.",
      ],
    },
  ];

  // ---------- INSERT RECIPES ----------
  const existingRecipes = await db.select().from(recipe);
  const getExistingId = (title: string) =>
    existingRecipes.find((r) => r.title === title)?.id;

  for (const r of RECIPES) {
    const inserted = await db
      .insert(recipe)
      .values({
        title: r.title,
        prepareTime: r.prep,
        cookingTime: r.cook,
        portions: r.portions,
        foodCategory: foodId[r.food],
      })
      .onConflictDoNothing()
      .returning({ id: recipe.id });

    const recipeIdVal = inserted[0]?.id ?? getExistingId(r.title);
    if (!recipeIdVal) continue; // should not happen, but safe-guard

    // Attributes
    if (r.attrs?.length) {
      await db
        .insert(recipeAttributes)
        .values(
          r.attrs.map((a) => ({ recipeId: recipeIdVal, recipeCat: rcatId[a] }))
        )
        .onConflictDoNothing();
    }

    // Ingredients (skip unknowns)
    const usable = r.items.filter((it) => ingId[it.name]);
    if (usable.length) {
      await db
        .insert(recipeIngredients)
        .values(
          usable.map((it) => ({
            recipeId: recipeIdVal,
            ingredientId: ingId[it.name],
            amount: Math.round(it.amount),
          }))
        )
        .onConflictDoNothing();
    }

    // Steps
    if (r.steps?.length) {
      await db
        .insert(recipeSteps)
        .values(
          r.steps.map((s, i) => ({
            recipeId: recipeIdVal,
            stepNumber: i + 1,
            step: s,
          }))
        )
        .onConflictDoNothing();
    }
  }

  console.log("✅ Seed finished: master data + 20+ recipes.");
}

// auto-run when executed directly (optional)
if (typeof require !== "undefined" && require.main === module) {
  runSeed().catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  });
}

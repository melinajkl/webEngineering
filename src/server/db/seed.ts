import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { eq, inArray } from "drizzle-orm";
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
} from "./schema"; // <-- adjust if needed

const sqlite = new Database("localdb.sqlite");
const db = drizzle(sqlite);

async function seed() {
  console.log("🌱 Seeding…");

  // ---------- MASTER DATA ----------
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
    "Nut/Seed",
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

  await db
    .insert(foodCat)
    .values(foodCats.map((name) => ({ name })))
    .onConflictDoNothing();
  await db
    .insert(recipeCat)
    .values(recipeCats.map((name) => ({ name })))
    .onConflictDoNothing();
  await db
    .insert(ingredientCat)
    .values(ingredientCats.map((name) => ({ name })))
    .onConflictDoNothing();
  await db.insert(unit).values(units).onConflictDoNothing();

  // fetch ids → build maps
  const [foodCatRows, recipeCatRows, ingCatRows, unitRows] = await Promise.all([
    db.select().from(foodCat),
    db.select().from(recipeCat),
    db.select().from(ingredientCat),
    db.select().from(unit),
  ]);

  const foodCatId = Object.fromEntries(foodCatRows.map((r) => [r.name, r.id]));
  const recipeCatId = Object.fromEntries(
    recipeCatRows.map((r) => [r.name, r.id])
  );
  const ingCatId = Object.fromEntries(ingCatRows.map((r) => [r.name, r.id]));
  const unitId = Object.fromEntries(unitRows.map((r) => [r.shortForm, r.id]));

  // ---------- INGREDIENTS CATALOG ----------
  // Default "unit" = typical storage unit for the ingredient.
  const ING = [
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
    ["Coconut Milk", "Dairy", "ml"], // treat as dairy-ish
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
    ["Milk (plant)", "Beverage", "ml"],
    ["Egg Noodles", "Grain", "g"],
    ["Tuna (canned)", "Protein", "g"],
    ["Feta", "Dairy", "g"],
    ["Corn", "Vegetable", "g"],
    ["Green Peas", "Vegetable", "g"],
    ["Ginger", "Spices", "tsp"],
    ["Lime", "Fruit", "pc"],
  ] as const;

  await db
    .insert(ingredients)
    .values(
      ING.map(([name, cat, u]) => ({
        name,
        category: ingCatId[cat],
        unit: unitId[u],
      }))
    )
    .onConflictDoNothing();

  // read back ingredient ids
  const allIngs = await db.select().from(ingredients);
  const ingId = Object.fromEntries(allIngs.map((i) => [i.name, i.id]));

  // ---------- RECIPES (20+) ----------
  type R = {
    title: string;
    prep: number;
    cook: number;
    portions: number;
    foodCategory: keyof typeof foodCatId;
    attributes: (keyof typeof recipeCatId)[];
    items: { name: keyof typeof ingId; amount: number }[];
    steps: string[];
  };

  const RECIPES: R[] = [
    {
      title: "Pancakes",
      prep: 10,
      cook: 15,
      portions: 4,
      foodCategory: "Breakfast",
      attributes: ["Vegetarian", "Quick & Easy"],
      items: [
        { name: "Flour", amount: 150 },
        { name: "Milk", amount: 200 },
        { name: "Egg", amount: 2 },
        { name: "Sugar", amount: 30 },
        { name: "Butter", amount: 20 },
        { name: "Baking Powder", amount: 2 },
        { name: "Salt", amount: 0 }, // pinch (keep as 0; unit comes from ingredient default)
      ],
      steps: [
        "Whisk eggs, milk, and sugar.",
        "Add flour, baking powder, and pinch of salt; whisk smooth.",
        "Butter pan; cook pancakes golden on both sides.",
      ],
    },
    {
      title: "Spaghetti Bolognese",
      prep: 15,
      cook: 40,
      portions: 4,
      foodCategory: "Dinner",
      attributes: ["High Protein"],
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
        "Sauté onion and garlic in olive oil.",
        "Brown beef; add tomatoes and sauce; simmer 25–30 min.",
        "Boil pasta al dente; combine and season.",
      ],
    },
    {
      title: "Tomato Soup",
      prep: 10,
      cook: 25,
      portions: 4,
      foodCategory: "Lunch",
      attributes: ["Vegetarian", "30-Minute"],
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
        "Sauté onion/garlic in oil.",
        "Add tomatoes and water; simmer 15 min.",
        "Blend smooth; season and serve.",
      ],
    },
    {
      title: "Caesar Salad (Veggie)",
      prep: 15,
      cook: 0,
      portions: 2,
      foodCategory: "Lunch",
      attributes: ["Vegetarian", "Quick & Easy"],
      items: [
        { name: "Lettuce", amount: 1 },
        { name: "Parmesan", amount: 40 },
        { name: "Bread Roll", amount: 1 },
        { name: "Olive Oil", amount: 1 },
        { name: "Yogurt", amount: 80 },
        { name: "Lemon", amount: 0 },
        { name: "Garlic", amount: 1 },
        { name: "Salt", amount: 1 },
        { name: "Pepper", amount: 1 },
      ],
      steps: [
        "Toast bread cubes with olive oil for croutons.",
        "Whisk yogurt, lemon juice, minced garlic, salt, pepper.",
        "Toss lettuce, dressing, croutons; shave parmesan.",
      ],
    },
    {
      title: "Veggie Stir-Fry",
      prep: 10,
      cook: 10,
      portions: 2,
      foodCategory: "Dinner",
      attributes: ["Vegan", "30-Minute", "One-Pot"],
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
        "Heat oil; fry garlic/ginger briefly.",
        "Add vegetables; stir-fry 5–6 min.",
        "Finish with soy sauce; serve with rice.",
      ],
    },
    {
      title: "Omelette",
      prep: 5,
      cook: 5,
      portions: 1,
      foodCategory: "Breakfast",
      attributes: ["Vegetarian", "Quick & Easy", "30-Minute"],
      items: [
        { name: "Egg", amount: 3 },
        { name: "Butter", amount: 10 },
        { name: "Salt", amount: 1 },
        { name: "Pepper", amount: 1 },
        { name: "Cheddar", amount: 30 },
        { name: "Parsley", amount: 1 },
      ],
      steps: [
        "Beat eggs with salt/pepper.",
        "Melt butter; add eggs; gently stir.",
        "Add cheese, fold, top with parsley.",
      ],
    },
    {
      title: "Chili con Carne",
      prep: 15,
      cook: 45,
      portions: 4,
      foodCategory: "Dinner",
      attributes: ["High Protein", "One-Pot"],
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
        "Sauté onion/garlic; brown beef.",
        "Add tomatoes, beans, spices; simmer 30–35 min.",
        "Adjust heat and seasoning.",
      ],
    },
    {
      title: "Guacamole",
      prep: 10,
      cook: 0,
      portions: 2,
      foodCategory: "Snack",
      attributes: ["Vegan", "Gluten-Free", "Quick & Easy"],
      items: [
        { name: "Avocado", amount: 2 },
        { name: "Lime", amount: 1 },
        { name: "Onion", amount: 0.5 as any }, // half; stored as pc – fine to round when displaying
        { name: "Salt", amount: 1 },
        { name: "Coriander", amount: 1 },
      ],
      steps: [
        "Mash avocado.",
        "Stir in lime juice, finely diced onion, coriander, salt.",
        "Serve immediately.",
      ],
    },
    {
      title: "Greek Salad",
      prep: 10,
      cook: 0,
      portions: 2,
      foodCategory: "Lunch",
      attributes: ["Vegetarian", "Gluten-Free", "Quick & Easy"],
      items: [
        { name: "Tomato", amount: 2 },
        { name: "Cucumber", amount: 1 },
        { name: "Onion", amount: 0.5 as any },
        { name: "Feta", amount: 120 },
        { name: "Olive Oil", amount: 2 },
        { name: "Lemon", amount: 0 },
        { name: "Salt", amount: 1 },
        { name: "Pepper", amount: 1 },
        { name: "Basil", amount: 1 },
      ],
      steps: [
        "Chop veg and feta.",
        "Dress with olive oil and lemon juice.",
        "Season and toss with basil.",
      ],
    },
    {
      title: "Pesto Pasta",
      prep: 5,
      cook: 12,
      portions: 2,
      foodCategory: "Dinner",
      attributes: ["Vegetarian", "30-Minute"],
      items: [
        { name: "Pasta", amount: 250 },
        { name: "Pesto", amount: 3 },
        { name: "Parmesan", amount: 30 },
        { name: "Salt", amount: 1 },
      ],
      steps: [
        "Cook pasta al dente in salted water.",
        "Reserve some pasta water; toss with pesto.",
        "Top with parmesan.",
      ],
    },
    {
      title: "Banana Bread",
      prep: 15,
      cook: 55,
      portions: 10,
      foodCategory: "Dessert",
      attributes: ["Vegetarian"],
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
      steps: [
        "Mash bananas; mix with melted butter, sugar, eggs, vanilla.",
        "Fold in flour, baking powder, salt.",
        "Bake 50–60 min at 175°C.",
      ],
    },
    {
      title: "Shakshuka",
      prep: 10,
      cook: 20,
      portions: 2,
      foodCategory: "Breakfast",
      attributes: ["Vegetarian", "One-Pot"],
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
      steps: [
        "Cook onion/pepper/garlic with spices.",
        "Add tomatoes; simmer to thicken.",
        "Make wells; crack eggs; cover until set.",
      ],
    },
    {
      title: "Chicken Curry",
      prep: 15,
      cook: 25,
      portions: 3,
      foodCategory: "Dinner",
      attributes: ["High Protein", "30-Minute"],
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
        "Sauté onion/garlic; add curry powder.",
        "Add chicken; brown lightly.",
        "Pour coconut milk; simmer 12–15 min.",
      ],
    },
    {
      title: "Fried Rice",
      prep: 10,
      cook: 10,
      portions: 2,
      foodCategory: "Dinner",
      attributes: ["Quick & Easy", "One-Pot"],
      items: [
        { name: "Rice", amount: 300 },
        { name: "Egg", amount: 2 },
        { name: "Green Peas", amount: 100 },
        { name: "Carrot", amount: 1 },
        { name: "Onion", amount: 0.5 as any },
        { name: "Soy Sauce", amount: 2 },
        { name: "Olive Oil", amount: 1 },
      ],
      steps: [
        "Scramble eggs; set aside.",
        "Stir-fry onion, carrot, peas; add rice.",
        "Season with soy sauce; fold in eggs.",
      ],
    },
    {
      title: "Red Lentil Soup",
      prep: 10,
      cook: 25,
      portions: 4,
      foodCategory: "Lunch",
      attributes: ["Vegan", "Gluten-Free", "One-Pot"],
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
        "Sauté onion/garlic in oil.",
        "Add lentils, spices, water; simmer 20–25 min.",
        "Blend partly if desired; season.",
      ],
    },
    {
      title: "Tacos (Beef)",
      prep: 10,
      cook: 12,
      portions: 3,
      foodCategory: "Dinner",
      attributes: ["30-Minute"],
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
        "Cook onion; brown beef; add spices.",
        "Warm tortillas.",
        "Assemble with lettuce, tomato, cheese.",
      ],
    },
    {
      title: "Classic Burger",
      prep: 10,
      cook: 10,
      portions: 2,
      foodCategory: "Dinner",
      attributes: ["High Protein", "30-Minute"],
      items: [
        { name: "Beef Mince", amount: 300 },
        { name: "Bread Roll", amount: 2 },
        { name: "Lettuce", amount: 1 },
        { name: "Tomato", amount: 1 },
        { name: "Onion", amount: 0.5 as any },
        { name: "Cheddar", amount: 40 },
        { name: "Salt", amount: 1 },
        { name: "Pepper", amount: 1 },
        { name: "Olive Oil", amount: 1 },
      ],
      steps: [
        "Form patties; season with salt/pepper.",
        "Pan-sear to desired doneness; melt cheese.",
        "Assemble in toasted rolls with toppings.",
      ],
    },
    {
      title: "Pizza Margherita",
      prep: 20,
      cook: 12,
      portions: 2,
      foodCategory: "Dinner",
      attributes: ["Vegetarian"],
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
        "Make quick dough (flour, water, oil, salt); rest 10–15 min.",
        "Shape; top with sauce and mozzarella.",
        "Bake very hot until blistered; finish with basil.",
      ],
    },
    {
      title: "Oatmeal Bowl",
      prep: 2,
      cook: 5,
      portions: 1,
      foodCategory: "Breakfast",
      attributes: ["Vegetarian", "Quick & Easy"],
      items: [
        { name: "Oats", amount: 60 },
        { name: "Milk", amount: 200 },
        { name: "Apple", amount: 1 },
        { name: "Honey", amount: 1 },
        { name: "Cinnamon" as any, amount: 0 }, // not in catalog; skipping dose by using honey only
      ],
      steps: [
        "Simmer oats in milk 3–5 min.",
        "Top with diced apple and honey.",
      ],
    },
    {
      title: "Smoothie Bowl",
      prep: 5,
      cook: 0,
      portions: 1,
      foodCategory: "Breakfast",
      attributes: ["Vegetarian", "Gluten-Free", "Quick & Easy"],
      items: [
        { name: "Banana", amount: 1 },
        { name: "Yogurt", amount: 150 },
        { name: "Milk (plant)", amount: 100 },
        { name: "Oats", amount: 20 },
        { name: "Honey", amount: 1 },
      ],
      steps: [
        "Blend banana, yogurt, plant milk, oats.",
        "Pour into bowl; drizzle honey.",
      ],
    },
    {
      title: "Tuna Pasta",
      prep: 5,
      cook: 12,
      portions: 2,
      foodCategory: "Dinner",
      attributes: ["30-Minute", "High Protein"],
      items: [
        { name: "Pasta", amount: 250 },
        { name: "Tuna (canned)", amount: 160 },
        { name: "Olive Oil", amount: 2 },
        { name: "Garlic", amount: 1 },
        { name: "Parsley", amount: 1 },
        { name: "Lemon", amount: 0 },
        { name: "Salt", amount: 1 },
        { name: "Pepper", amount: 1 },
      ],
      steps: [
        "Cook pasta; reserve some water.",
        "Warm tuna with garlic in oil.",
        "Toss with pasta, parsley, lemon juice.",
      ],
    },
    {
      title: "Chickpea Curry",
      prep: 10,
      cook: 20,
      portions: 3,
      foodCategory: "Dinner",
      attributes: ["Vegan", "Gluten-Free", "30-Minute"],
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
        "Sauté onion/garlic with curry powder.",
        "Add chickpeas and coconut milk; simmer 12–15 min.",
        "Season and serve with rice.",
      ],
    },
    {
      title: "Simple Tomato Tuna Salad",
      prep: 7,
      cook: 0,
      portions: 2,
      foodCategory: "Lunch",
      attributes: ["High Protein", "Quick & Easy", "Gluten-Free"],
      items: [
        { name: "Tuna (canned)", amount: 160 },
        { name: "Tomato", amount: 2 },
        { name: "Cucumber", amount: 1 },
        { name: "Onion", amount: 0.5 as any },
        { name: "Olive Oil", amount: 1 },
        { name: "Lemon", amount: 0 },
        { name: "Salt", amount: 1 },
        { name: "Pepper", amount: 1 },
      ],
      steps: [
        "Flake tuna; dice vegetables.",
        "Dress with olive oil and lemon juice.",
        "Season and toss.",
      ],
    },
  ];

  // ---------- INSERT RECIPES ----------
  for (const r of RECIPES) {
    const [rec] = await db
      .insert(recipe)
      .values({
        title: r.title,
        prepareTime: r.prep,
        cookingTime: r.cook,
        portions: r.portions,
        foodCategory: foodCatId[r.foodCategory],
      })
      .onConflictDoNothing()
      .returning({ id: recipe.id });

    // If conflict (already exists), fetch its id
    const recipeIdVal =
      rec?.id ??
      (
        await db
          .select({ id: recipe.id })
          .from(recipe)
          .where(eq(recipe.title, r.title))
      )[0].id;

    // Attributes
    if (r.attributes?.length) {
      await db
        .insert(recipeAttributes)
        .values(
          r.attributes.map((a) => ({
            recipeId: recipeIdVal,
            recipeCat: recipeCatId[a],
          }))
        )
        .onConflictDoNothing();
    }

    // Ingredients (skip ones not in catalog)
    const usableItems = r.items.filter((it) => ingId[it.name as string]);
    await db
      .insert(recipeIngredients)
      .values(
        usableItems.map((it) => ({
          recipeId: recipeIdVal,
          ingredientId: ingId[it.name as string],
          amount: Math.round(it.amount as number),
        }))
      )
      .onConflictDoNothing();

    // Steps
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

  console.log("✅ Done. Inserted base data and 20+ recipes.");
}

seed().catch((e) => {
  console.error("❌ Seed failed:", e);
  process.exit(1);
});

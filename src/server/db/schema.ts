import { sql } from "drizzle-orm";
import { sqliteTable, integer, text, real, primaryKey } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

// --- CATEGORY TABLES ---

export const foodCat = sqliteTable("FOOD_CAT", {
  id: integer("id").primaryKey({autoIncrement: true}),
  name: text("name").notNull(),
});

export const recipeCat = sqliteTable("RECIPE_CAT", {
  id: integer("id").primaryKey({autoIncrement: true}),
  name: text("name").notNull().unique(),
});

export const ingredientCat = sqliteTable("INGREDIENT_CAT", {
  id: integer("id").primaryKey({ autoIncrement: true}),
  name: text("name").notNull().unique(),
});

export const unit = sqliteTable("UNIT", {
  id: integer("id").primaryKey({autoIncrement: true}),
  name: text("name").notNull(),
  shortForm: text("short_form").notNull(),
});

// --- MAIN TABLES ---

export const recipe = sqliteTable("RECIPE", {
  id: integer("id").primaryKey({ autoIncrement: true}),
  title: text("title").notNull(),
  prepareTime: integer("prepare_time").notNull(),
  cookingTime: integer("cooking_time").notNull(),
  portions: integer("portions").notNull(),
  foodCategory: integer("food_category").references(() => foodCat.id).notNull(),
});

export const ingredients = sqliteTable("INGREDIENTS", {
  id: integer("id").primaryKey( {autoIncrement: true}),
  name: text("name").notNull(),
  category: integer("category").references(() => ingredientCat.id).notNull(),
  unit: integer("unit").references(() => unit.id).notNull(),
});

// --- RELATION TABLES ---

export const recipeIngredients = sqliteTable(
  "RECIPE_INGREDIENTS",
  {
    recipeId: integer("recipe_id").references(() => recipe.id),
    ingredientId: integer("ingredient_id").references(() => ingredients.id),
    amount: integer("amount").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.recipeId, table.ingredientId] }),
  }),
);

export const recipeAttributes = sqliteTable(
  "RECIPE_ATTRIBUTES",
  {
    recipeId: integer("recipe_id").references(() => recipe.id),
    recipeCat: integer("recipe_cat").references(() => recipeCat.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.recipeId, table.recipeCat] }),
  }),
);

// --- STEP TABLE ---

export const recipeSteps = sqliteTable("RECIPE_STEPS", {
  id: integer("id").primaryKey({ autoIncrement: true}),
  recipeId: integer("recipe_id").references(() => recipe.id).notNull(),
  stepNumber: integer("step_number").notNull(),
  step: text("step").notNull(),
});

// --- SHOPPING LIST TABLE ---

export const shoppingList = sqliteTable("SHOPPING_LIST", {
  id: integer("id").primaryKey({autoIncrement : true}),
  ingredientId: integer("ingredient_id").references(() => ingredients.id).notNull(),
  dateOfUse: real("date_of_use").notNull(),
  amount: integer("amount").notNull(),
  unitId: integer("unitId").references(() => unit.id).notNull(),
  checked: integer("checked", { mode: "boolean" }).notNull(),
});

// --- RELATIONS (optional, for Drizzle ORM) ---

export const recipeRelations = relations(recipe, ({ many, one }) => ({
  steps: many(recipeSteps),
  ingredients: many(recipeIngredients),
  attributes: many(recipeAttributes),
  category: one(foodCat, {
    fields: [recipe.foodCategory],
    references: [foodCat.id],
  }),
}));

export const ingredientRelations = relations(ingredients, ({ one, many }) => ({
  category: one(ingredientCat, {
    fields: [ingredients.category],
    references: [ingredientCat.id],
  }),
  unit: one(unit, {
    fields: [ingredients.unit],
    references: [unit.id],
  }),
  recipeLinks: many(recipeIngredients),
}));

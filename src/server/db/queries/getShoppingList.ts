import { asc, eq } from "drizzle-orm";
import { db } from "@/server/db";
import {
  ingredients,
  shoppingList,
  unit,
  ingredientCat,
} from "@/server/db/schema";

export type shoppingListRow = {
  id: number;
  ingredientId: number;
  ingredientName: string | null;
  category: string | null;
  dateOfUse: number | null; // ✅ Kann auch null sein
  amount: number;
  unitName: string | null;
  unitId: number;
  checked: boolean;
};

export async function getShoppingList(): Promise<shoppingListRow[]> {
  const rows = await db
    .select({
      id: shoppingList.id,
      ingredientId: shoppingList.ingredientId,
      ingredientName: ingredients.name,
      category: ingredientCat.name,
      dateOfUse: shoppingList.dateOfUse,
      amount: shoppingList.amount,
      unitId: shoppingList.unitId,
      unitName: unit.name,
      checked: shoppingList.checked,
    })
    .from(shoppingList)
    .leftJoin(ingredients, eq(shoppingList.ingredientId, ingredients.id))
    .leftJoin(ingredientCat, eq(ingredients.category, ingredientCat.id))
    .leftJoin(unit, eq(shoppingList.unitId, unit.id))
    // ✅ Keine where-Klausel = alle Einträge werden angezeigt
    .orderBy(asc(ingredientCat.name), asc(shoppingList.dateOfUse));

  return rows;
}

export async function getIngredients() {
  return await db.select().from(ingredients);
}

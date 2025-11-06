"use server";
import { insertShoppingListItems } from "@/server/db/queries/insertShoppingListItems";

type ShoppingListItem = {
  ingredientId: number;
  amount: number;
  unitId: number;
};

export async function createShoppingListItems(items: ShoppingListItem[]) {
  // Example logic
  const i = await insertShoppingListItems(items);
  return { success: true };
}

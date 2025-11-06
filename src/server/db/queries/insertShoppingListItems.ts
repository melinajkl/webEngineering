import "server-only";
import { db } from "@/server/db";
import { shoppingList } from "@/server/db/schema";

interface ShoppingListItem {
  ingredientId: number;
  amount: number;
  unitId: number;
}

export async function insertShoppingListItem(
  item: ShoppingListItem
): Promise<number> {
  const [row] = await db
    .insert(shoppingList)
    .values({
      ingredientId: item.ingredientId,
      amount: item.amount,
      unitId: item.unitId,
      checked: false
    })  
    .returning({ id: shoppingList.id }); // ✅ return correct ID

  return row.id;
}

export async function insertShoppingListItems(
  items: ShoppingListItem[]
): Promise<number[]> {
  const rows = await db
    .insert(shoppingList)
    .values(
      items.map((item) => ({
        ingredientId: item.ingredientId,
        amount: item.amount,
        unitId: item.unitId, 
        checked: false
      }))
    )
    .returning({ id: shoppingList.id }); // ✅ return correct IDs

  return rows.map((row) => row.id);
}
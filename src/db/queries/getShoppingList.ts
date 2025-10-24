import { asc, eq, gte, lte, and } from "drizzle-orm";
import { db } from "@/db";
import { ingredients, shoppingList, unit } from "@/db/schema";

export type shoppingListRow= {
    id: number;
    ingredientId: number;
    ingredientName: string | null;
    dateOfUse: number;
    amount: number;
    unitName: string | null;
    unitId: number;
    checked: boolean;
};

export async function getShoppingList(): Promise<shoppingListRow[]> {
    const now = new Date();
    const in7Days = new Date();
    in7Days.setDate(now.getDate() + 7);
    
    const rows = await db
        .select({
            id: shoppingList.id,
            ingredientId: shoppingList.ingredientId,
            ingredientName: ingredients.name,
            dateOfUse: shoppingList.dateOfUse,
            amount: shoppingList.amount,
            unitId: shoppingList.unitId,
            unitName: unit.name,
            checked: shoppingList.checked,
        })
        .from(shoppingList)
        .leftJoin(ingredients, eq(shoppingList.ingredientId, ingredients.id))
        .leftJoin(unit, eq(shoppingList.unitId, unit.id))
        .orderBy(asc(shoppingList.dateOfUse));
    return rows.map(item => ({
    ...item,
    isUpcoming: item.dateOfUse >= now.getTime() && item.dateOfUse <= in7Days.getTime()
  }));
}

export async function getIngredients() {
    return await db.select().from(ingredients);
}

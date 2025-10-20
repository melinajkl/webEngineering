import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { ingredients, shoppingList } from "@/db/schema";

export type shoppingListRow= {
    id: number;
    ingredientId: number;
    ingredientName: string | null;
    dateOfUse: number;
    amount: number;
    unitId: number;
    checked: boolean;
};

export async function getShoppingList(): Promise<shoppingListRow[]> {
    const rows = await db
        .select({
            id: shoppingList.id,
            ingredientId: shoppingList.ingredientId,
            ingredientName: ingredients.name,
            dateOfUse: shoppingList.dateOfUse,
            amount: shoppingList.amount,
            unitId: shoppingList.unitId,
            checked: shoppingList.checked,
        })
        .from(shoppingList)
        .leftJoin(ingredients, eq(shoppingList.ingredientId, ingredients.id))
        .orderBy(asc(ingredients.category));
    return rows;
}

export async function getIngredients() {
    return await db.select().from(ingredients);
}

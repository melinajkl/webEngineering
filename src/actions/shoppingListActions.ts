"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { shoppingList } from "@/db/schema";
import { eq } from "drizzle-orm";

// Item abhaken/aufheben (Toggle)
export async function toggleShoppingListItem(id: number): Promise<void> {
    const item = await db
        .select({ checked: shoppingList.checked })
        .from(shoppingList)
        .where(eq(shoppingList.id, id))
        .limit(1);
   
    if (item.length > 0) {
        await db
            .update(shoppingList)
            .set({ checked: !item[0].checked })
            .where(eq(shoppingList.id, id));
    }
    
    revalidatePath("/shopping");
}

// Item als "checked" markieren
export async function checkShoppingListItem(id: number): Promise<void> {
    await db
        .update(shoppingList)
        .set({ checked: true })
        .where(eq(shoppingList.id, id));
    
    revalidatePath("/shopping");
}

// Item als "unchecked" markieren
export async function uncheckShoppingListItem(id: number): Promise<void> {
    await db
        .update(shoppingList)
        .set({ checked: false })
        .where(eq(shoppingList.id, id));
    
    revalidatePath("/shopping");
}

// Item löschen
export async function deleteShoppingListItem(id: number): Promise<void> {
    await db
        .delete(shoppingList)
        .where(eq(shoppingList.id, id));
    
    revalidatePath("/shopping");
}

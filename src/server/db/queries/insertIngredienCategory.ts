import { db } from "@/server/db";
import { ingredientCat } from "@/server/db/schema";

export async function createIngredientCategorie(
  data: string
): Promise<{ id: number }[]> {
  return db
    .insert(ingredientCat)
    .values({ name: data })
    .returning({ id: ingredientCat.id });
}

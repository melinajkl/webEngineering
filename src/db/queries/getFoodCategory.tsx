import "server-only";
import { db } from "@/db";
import { foodCat } from "@/db/schema";
import { asc } from "drizzle-orm";

export type FoodCategoryRow = {
    id: number;
    name: string;
};

export async function getFoodCategory(): Promise<FoodCategoryRow[]> {
    const rows = await db
        .select({
            id: foodCat.id,
            name: foodCat.name,
        })
        .from(foodCat)
        .orderBy(asc(foodCat.id));
    return rows;
}
"use server";

import "server-only";
import {and, asc, gte, lte} from "drizzle-orm";
import {db} from "@/server/db";
import { calendar } from "@/server/db/schema";

export type CalenderItems  = {
    date: number;
    daytime: number;
    recipeId: number;
};

export async function getCalendarItems(startDate: number, endDate: number): Promise<CalenderItems[]> {
    return db
        .select({
            date: calendar.date,
            daytime: calendar.daytime,
            recipeId: calendar.recipe_id,
        })
        .from(calendar)
        .where(and(
            gte(calendar.date, startDate),
            lte(calendar.date, endDate),
        ))
        .orderBy(asc(calendar.date));
}

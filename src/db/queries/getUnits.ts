import "server-only";
import { db } from "@/db";
import { unit } from "@/db/schema";
import { asc } from "drizzle-orm";

export type UnitRow = {
    id: number;
    name: string;
    shortForm: string | null;
};

export async function getUnits(): Promise<UnitRow[]> {
    return db
        .select({
            id: unit.id,
            name: unit.name,
            shortForm: unit.shortForm,
        })
        .from(unit)
        .orderBy(asc(unit.name));
}
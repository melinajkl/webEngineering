// app/api/recipe/[id]/ingredients/route.ts (not steps!)
import { getRecipeIngredientsById } from "@/db/queries/getRecipeIngredients";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const ingredients = await getRecipeIngredientsById(Number(id));
  return NextResponse.json( ingredients );
}

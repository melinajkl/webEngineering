// app/api/recipe/[id]/steps/route.ts
import { getRecipeStepsById } from "@/db/queries/getRecipes";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { steps } = await getRecipeStepsById(Number(id));
  return NextResponse.json({ steps });
}

import { db } from "@/db";
import { recipe, foodCat, recipeAttributes, recipeCat, recipeSteps } from "@/db/schema";
import { eq, desc, inArray } from "drizzle-orm";

interface GetRecipesParams {
  page: number;
  pageSize: number;
}

interface RecipeWithAttributes {
  id: number;
  title: string;
  prepareTime: number;
  cookingTime: number;
  portions: number;
  foodCategory: {
    id: number;
    name: string | null;
  } | null;
  attributes: Array<{
    id: number;
    name: string;
  }>;
}

interface RecipeSteps {
  recipeId: number,
  steps: Array<{
    stepnumber: number;
    description: string;
  }>;
}

export async function getRecipesWithAttributes({
  page,
  pageSize,
}: GetRecipesParams) {
  const offset = (page - 1) * pageSize;

  // Get total count
  const [{ count }] = await db
    .select({ count: db.$count(recipe) })
    .from(recipe);

  // First, get paginated recipe IDs only
  const paginatedRecipeIds = await db
    .select({ id: recipe.id })
    .from(recipe)
    .orderBy(desc(recipe.id))
    .limit(pageSize)
    .offset(offset);

  // If no recipes found, return early
  if (paginatedRecipeIds.length === 0) {
    return {
      recipes: [],
      totalCount: count,
    };
  }

  const recipeIds = paginatedRecipeIds.map((r) => r.id);

  // Fetch full data for these specific recipes with joins
  const data = await db
    .select({
      // Recipe fields
      recipeId: recipe.id,
      title: recipe.title,
      prepareTime: recipe.prepareTime,
      cookingTime: recipe.cookingTime,
      portions: recipe.portions,
      // Food category fields
      foodCategoryId: foodCat.id,
      foodCategoryName: foodCat.name,
      // Recipe attributes fields
      attrId: recipeCat.id,
      attrName: recipeCat.name,
    })
    .from(recipe)
    .leftJoin(foodCat, eq(recipe.foodCategory, foodCat.id))
    .leftJoin(recipeAttributes, eq(recipe.id, recipeAttributes.recipeId))
    .leftJoin(recipeCat, eq(recipeAttributes.recipeCat, recipeCat.id))
    .where(inArray(recipe.id, recipeIds))
    .orderBy(desc(recipe.id));

  // Transform flat result set into nested structure
  const recipeMap = new Map<number, RecipeWithAttributes>();

  data.forEach((row) => {
    const id = row.recipeId;

    if (!recipeMap.has(id)) {
      recipeMap.set(id, {
        id,
        title: row.title,
        prepareTime: row.prepareTime,
        cookingTime: row.cookingTime,
        portions: row.portions,
        foodCategory: row.foodCategoryId
          ? {
              id: row.foodCategoryId,
              name: row.foodCategoryName,
            }
          : null,
        attributes: [],
      });
    }

    // Add attribute if it exists and has a name
    if (row.attrId && row.attrName) {
      const recipeRecord = recipeMap.get(id)!;
      // Avoid duplicates
      if (!recipeRecord.attributes.some((attr) => attr.id === row.attrId)) {
        recipeRecord.attributes.push({
          id: row.attrId,
          name: row.attrName,
        });
      }
    }
  });

  const recipes = Array.from(recipeMap.values());

  return {
    recipes,
    totalCount: count,
  };
}

export async function getRecipeStepsById(id_: number): Promise<RecipeSteps> {
  const steps = await db.select( {
    stepnumber: recipeSteps.stepNumber,
    description: recipeSteps.step,
})
.from(recipeSteps)
.where(eq(recipeSteps.recipeId, id_))
.orderBy(recipeSteps.stepNumber)

return {
  recipeId: id_,
  steps
}
}
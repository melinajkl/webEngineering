"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { IconClock, IconChefHat } from "@tabler/icons-react";
import { useState } from "react";
import { RecipeDetailModal } from "@/features/recipes/ui/recipe_detail_modal";
import { getRecipeIngredientsAction, getRecipeIngredientsWithUnitIdAction } from "@/features/recipes/actions/get_recipe_ingredients";
import { getRecipeStepsAction } from "@/features/recipes/actions/get_recipe_steps";
import QuantityInput from "./quantity_input";
import { Plus } from "lucide-react";

interface Recipe {
  id: number;
  title: string;
  prepareTime: number;
  cookingTime: number;
  portions: number;
  foodCategory: { id: number; name: string | null } | null;
  attributes: Array<{ id: number; name: string | null }>;
}

/** Shapes */
type DetailIngredient = {
  ingredientname: string;
  amount: number;
  unit: string; // display label
};

type SelectIngredient = {
  ingredientId: number;
  ingredientname: string;
  amount: number;
  unitId: number;
  unit: string; // optional display label
};

export function RecipeCard({
  recipe,
  createAction,
}: {
  recipe: Recipe;
  createAction: (items: Array<{ ingredientId: number; amount: number; unitId: number }>) => Promise<void>;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ingedientsSelectionOpen, setIngredientsSelectionOpen] =
    useState(false);

  const [recipeDetails, setRecipeDetails] = useState<{
    steps: Array<{ stepnumber: number; description: string }>;
    ingredients: DetailIngredient[];
  } | null>(null);

  const [selectionIngredients, setSelectionIngredients] = useState<
    SelectIngredient[] | null
  >(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const [stepsResult, ingredientsResult] = await Promise.all([
        getRecipeStepsAction(recipe.id),
        getRecipeIngredientsAction(recipe.id),
      ]);

      if (!stepsResult?.success || !ingredientsResult?.success) {
        throw new Error("Failed to load recipe details!");
      }

      const steps = Array.isArray(stepsResult.data?.steps)
        ? stepsResult.data.steps
        : [];
      const ingredients: DetailIngredient[] = Array.isArray(
        ingredientsResult.data?.ingredients
      )
        ? ingredientsResult.data.ingredients
            .filter((ing) => ing.ingredientname && ing.unit)
            .map((ing) => ({
              ingredientname: ing.ingredientname,
              amount: ing.amount,
              unit: ing.unit, // keep display label
            }))
        : [];

      setRecipeDetails({ steps, ingredients });
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
      setError("Failed to load recipe details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddClick = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const result = await getRecipeIngredientsWithUnitIdAction(recipe.id);
      if (!result?.success)
        throw new Error("Failed to load ingredients for shopping list.");

      const ingredients: SelectIngredient[] = Array.isArray(
        result.data?.ingredients
      )
        ? result.data.ingredients
            .filter(
              (ing) => ing.ingredientname && ing.unitId && ing.ingredientId
            )
            .map((ing) => ({
              ingredientId: ing.ingredientId,
              ingredientname: ing.ingredientname,
              amount: ing.amount,
              unitId: ing.unitId,
              unit: ing.unit,
            }))
        : [];

      setSelectionIngredients(ingredients);
      setIngredientsSelectionOpen(true);
      setIsModalOpen(false); // ensure only one modal at a time
    } catch (err) {
      console.error(err);
      setError("Failed to load ingredients for shopping list.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card
        className="hover:shadow-lg transition-shadow cursor-pointer"
        onClick={handleClick}
      >
        <CardHeader className="flex justify-between">
          <CardTitle className="text-xl">{recipe.title}</CardTitle>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              void handleAddClick();
            }}
            className="inline-flex items-center gap-1 rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Add</span>
          </button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <IconClock className="w-4 h-4" />
                <span>Prep: {recipe.prepareTime}m</span>
              </div>
              <div className="flex items-center gap-1">
                <IconChefHat className="w-4 h-4" />
                <span>Cook: {recipe.cookingTime}m</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {recipe.foodCategory?.name && (
                <Badge key={recipe.foodCategory.id} variant="secondary">
                  {recipe.foodCategory.name}
                </Badge>
              )}
              {recipe.attributes
                .filter((attr) => attr.id && attr.name)
                .map((attr) => (
                  <Badge key={attr.id} variant="outline">
                    {attr.name}
                  </Badge>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detail modal */}
      {recipeDetails && (
        <RecipeDetailModal
          recipe={{
            ...recipe,
            steps: recipeDetails.steps,
            ingredients: recipeDetails.ingredients, // DetailIngredient[]
          }}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {/* Quantity selection modal */}
      {selectionIngredients && (
        <QuantityInput
          title={recipe.title}
          isOpen={ingedientsSelectionOpen}
          onClose={() => setIngredientsSelectionOpen(false)}
          ingredients={selectionIngredients} // SelectIngredient[]
          createAction={createAction}
        />
      )}

      {/* Loading / Error overlays */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50">
          <p className="text-white">Loading...</p>
        </div>
      )}
      {error && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <p className="text-red-500">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

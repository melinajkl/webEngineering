"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconClock, IconChefHat } from "@tabler/icons-react";
import { useState } from "react";
import { RecipeDetailModal } from "@/components/RecipeDetailModal";
import { getRecipeIngredientsAction } from "@/actions/get_recipe_ingredients";
import { getRecipeStepsAction } from "@/actions/get_recipe_steps";

interface Recipe {
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
    name: string | null;
  }>;
}

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recipeDetails, setRecipeDetails] = useState<{
    steps: Array<{ stepnumber: number; description: string }>;
    ingredients: Array<{
      ingredientname: string;
      amount: number;
      unit: string;
    }>;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch both using actions in parallel
      const [stepsResult, ingredientsResult] = await Promise.all([
        getRecipeStepsAction(recipe.id),
        getRecipeIngredientsAction(recipe.id),
      ]);

      // Validate both results
      if (!stepsResult?.success || !ingredientsResult?.success) {
        throw new Error("Failed to load recipe details!");
      }
        console.log("IngredientsResult: ", ingredientsResult)
      // Ensure data is an array
      const steps = Array.isArray(stepsResult.data?.steps) ? stepsResult.data.steps : [];
      const ingredients = Array.isArray(ingredientsResult.data?.ingredients)
        ? ingredientsResult.data.ingredients.filter(
            (ing) => ing.ingredientname && ing.unit
          )
        : [];

      console.log("Steps:", steps);
      console.log("Ingredients:", ingredients);

      // Update state all at once
      setRecipeDetails({ steps, ingredients });
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
      setError("Failed to load recipe details. Please try again.");
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
        <CardHeader>
          <CardTitle className="text-xl">{recipe.title}</CardTitle>
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

      {/* Render the modal only if we have details */}
      {recipeDetails && (
        <RecipeDetailModal
          recipe={{
            ...recipe,
            steps: recipeDetails.steps,
            ingredients: recipeDetails.ingredients,
          }}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {/* Show loading or error state */}
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

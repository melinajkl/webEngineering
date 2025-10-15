"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconClock, IconChefHat } from "@tabler/icons-react";
import { useState } from "react";
import { RecipeDetailModal } from "@/components/RecipeDetailModal"; // Make sure this exists

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
  const [steps, setSteps] = useState<
    Array<{ stepnumber: number; description: string }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/recipe/${recipe.id}/steps`);
      if (!response.ok) {
        throw new Error("Failed to fetch recipe steps");
      }
      const { steps } = await response.json();
      setSteps(steps);
      setIsModalOpen(true);
    } catch (err) {
      setError("Failed to load recipe steps. Please try again.");
      console.error(err);
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

      {/* Render the modal */}
      <RecipeDetailModal
        recipe={{ ...recipe, steps }}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Show loading or error state */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20">
          <p className="text-white">Loading...</p>
        </div>
      )}
      {error && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20">
          <p className="text-red-500">{error}</p>
        </div>
      )}
    </>
  );
}

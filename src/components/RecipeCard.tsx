"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconClock, IconChefHat } from "@tabler/icons-react";

interface Recipe {
  id: number;
  title: string;
  prepareTime: number;
  cookingTime: number;
  portions: number;
  foodCategory: {
    id: number;
    name: string;
  } | null;
  attributes: Array<{
    id: number | null;
    name: string | null;
  }>;
}

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
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
            {recipe.foodCategory ? (
              <Badge key={recipe.foodCategory.id} variant="default">
                {recipe.foodCategory.name}
              </Badge>
            ) : null}

            {recipe.attributes
              .filter((attr) => attr.id && attr.name)
              .map((attr) => (
                <Badge key={attr.id} variant="secondary">
                  {attr.name}
                </Badge>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

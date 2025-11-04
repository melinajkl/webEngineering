"use client";

import * as React from "react";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import RecipeForm from "@/features/recipes/ui/NewRecipePopup";
import type { UnitRow } from "@/server/db/queries/getUnits";
import type { FoodCategoryRow } from "@/server/db/queries/getFoodCategory";
import type { IngredientRow } from "@/server/db/queries/getIngredients";
import type { IngredientCategoryRow } from "@/server/db/queries/getIngredientCategories";
import type { CreateIngredientResult } from "@/features/recipes/actions/create_ingredients";

type Props = {
  label: string;
  action: (
    fd: FormData
  ) => Promise<{ ok: boolean; id?: string; message?: string; error?: string }>;
  unitsPromise: Promise<UnitRow[]>;
  foodCategoryPromise: Promise<FoodCategoryRow[]>;
  ingredientsPromise: Promise<IngredientRow[]>;
  ingredientCategoriesPromise: Promise<IngredientCategoryRow[]>;
  createIngredientAction: (fd: FormData) => Promise<CreateIngredientResult>;
};

export default function RecipeFormDialogButton(props: Props) {
  const [open, setOpen] = useState(false);
  const {
    label = "Add recipe",
    action,
    unitsPromise,
    foodCategoryPromise,
    ingredientsPromise,
    ingredientCategoriesPromise,
    createIngredientAction,
  } = props;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 size-4" />
          {label}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-3xl w-full max-h-[calc(100vh-2rem)] ">
        <DialogHeader className="invisible">
          <DialogTitle>New Recipe</DialogTitle>
        </DialogHeader>

        <div className="mt-2 w-full max-h-[calc(100vh-8rem)] overflow-auto max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl">
          <RecipeForm
            action={action}
            unitsPromise={unitsPromise}
            foodCategoryPromise={foodCategoryPromise}
            ingredientsPromise={ingredientsPromise}
            //ingredientCategoriesPromise={ingredientCategoriesPromise}
            createIngredientAction={createIngredientAction}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

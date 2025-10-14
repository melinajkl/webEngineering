"use client";

import * as React from "react";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import RecipeForm from "@/components/NewRecipePopup";
import type { UnitRow } from "@/db/queries/getUnits";
import type { FoodCategoryRow } from "@/db/queries/getFoodCategory";
import type { IngredientRow } from "@/db/queries/getIngredients";
import type { IngredientCategoryRow } from "@/db/queries/getIngredientCategories";
import type { CreateIngredientResult } from "@/actions/create_ingredients";

type Props = {
    label?: string;
    action: (fd: FormData) => Promise<{ ok: boolean; id?: string; message?: string; error?: string }>;
    unitsPromise: Promise<UnitRow[]>;
    foodCategoryPromise: Promise<FoodCategoryRow[]>;
    ingredientsPromise: Promise<IngredientRow[]>;
    ingredientCategoriesPromise: Promise<IngredientCategoryRow[]>;
    createIngredientAction: (fd: FormData) => Promise<CreateIngredientResult>;
};

export default function RecipeFormDialogButton(props: Props) {
    const [open, setOpen] = useState(false);
    const {
        label = "Rezept erstellen",
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

            <DialogContent className="sm:max-w-3xl">
                <DialogHeader className="invisible">
                    <DialogTitle>Neues Rezept</DialogTitle>
                </DialogHeader>

                <div className="mt-2">
                    <RecipeForm
                        action={action}
                        unitsPromise={unitsPromise}
                        foodCategoryPromise={foodCategoryPromise}
                        ingredientsPromise={ingredientsPromise}
                        ingredientCategoriesPromise={ingredientCategoriesPromise}
                        createIngredientAction={createIngredientAction}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}

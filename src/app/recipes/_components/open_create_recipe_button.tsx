
import RecipeFormDialogButton from "./recipe_form_dialog_button";
import { getUnits } from "@/db/queries/getUnits";
import { getFoodCategory } from "@/db/queries/getFoodCategory";
import { getIngredients } from "@/db/queries/getIngredients";
import { getIngredientCategories } from "@/db/queries/getIngredientCategories";
import { createRecipeAction } from "@/actions/create_recipe";
import { createIngredientAction } from "@/actions/create_ingredients";

export default function OpenCreateRecipeButton({ label }: { label?: string }) {
    const unitsPromise = getUnits();
    const foodCategoryPromise = getFoodCategory();
    const ingredientsPromise = getIngredients();
    const ingredientCategoriesPromise = getIngredientCategories();

    return (
        <RecipeFormDialogButton
            label={label}
            action={createRecipeAction}
            unitsPromise={unitsPromise}
            foodCategoryPromise={foodCategoryPromise}
            ingredientsPromise={ingredientsPromise}
            ingredientCategoriesPromise={ingredientCategoriesPromise}
            createIngredientAction={createIngredientAction}
        />
    );
}

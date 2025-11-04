import RecipeFormDialogButton from "@/features/recipes/ui/recipe_form_dialog_button";
import { getUnits } from "@/server/db/queries/getUnits";
import { getFoodCategory } from "@/server/db/queries/getFoodCategory";
import { getIngredients } from "@/server/db/queries/getIngredients";
import { getIngredientCategories } from "@/server/db/queries/getIngredientCategories";
import { createRecipeAction } from "@/features/recipes/actions/create_recipe";
import { createIngredientAction } from "@/features/recipes/actions/create_ingredients";

export default function OpenCreateRecipeButton({ label }: { label: string }) {
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

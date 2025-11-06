"use client";

import DeleteRecipeDialogButton from "@/features/recipes/ui/delete_recipe_dialog_button";
import { deleteRecipeAction } from "@/features/recipes/actions/delete_recipe";

export default function OpenDeleteRecipeButton({
  label = "Delete recipe",
}: {
  label?: string;
}) {
  return <DeleteRecipeDialogButton label={label} action={deleteRecipeAction} />;
}

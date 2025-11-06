import DeleteRecipeDialogButton from "@/features/recipes/ui/delete_recipe_dialog_button";
import { getRecipesList } from "@/server/db/queries/getRecipesList";
import { deleteRecipeAction } from "@/features/recipes/actions/delete_recipe";

/**
 * Server-Wrapper, um die Rezepte (Server-Fetch) als Promise zu liefern
 * und die Server Action an den Client-Dialog zu binden.
 */
export default async function OpenDeleteRecipeButton({ label }: { label: string }) {
  const recipesPromise = getRecipesList();
  return (
    <DeleteRecipeDialogButton
      label={label}
      recipesPromise={recipesPromise}
      action={deleteRecipeAction}
    />
  );
}

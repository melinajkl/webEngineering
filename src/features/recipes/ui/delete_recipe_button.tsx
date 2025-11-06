import { Button } from "@/shared/ui/button";
import { Trash2 } from "lucide-react";
import { deleteRecipeAction } from "../actions/delete_recipe_action";

interface DeleteRecipeButtonProps {
  recipeId: number;
}

export default function DeleteRecipeButton({
  recipeId
}: DeleteRecipeButtonProps) {
  async function handleDelete() {
    try {
      console.log("Deleting recipe:", recipeId);
      await deleteRecipeAction(recipeId);
    } catch (err) {
      console.error("Failed to delete recipe:", err);
    }
  }

  return (
    <Button
      onClick={(e) => {
        e.stopPropagation(); // prevent parent card click
        handleDelete();
      }}
      variant="secondary"
      size="icon"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}

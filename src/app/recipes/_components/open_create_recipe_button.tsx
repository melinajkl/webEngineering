// kein "use client" hier – Server Component!
import { getUnits } from "@/db/queries/getUnits";
import { createRecipeAction } from "@/actions/create_recipe";
import RecipeFormDialogButton from "./recipe_form_dialog_button";

export default function OpenCreateRecipeButton({ label }: { label?: string }) {
    const unitsPromise = getUnits(); // Server-Fetch
    return (
        <RecipeFormDialogButton
            label={label}
            action={createRecipeAction}   // <-- hier wird deine Import-Zeile verwendet
            unitsPromise={unitsPromise}
        />
    );
}

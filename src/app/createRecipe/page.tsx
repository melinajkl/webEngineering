import RecipeCard from "@/components/RecipeCard";
//import { createRecipeAction } from "@/actions/create_recipe";
import { getUnits } from "@/db/queries/getUnits";
import {createRecipeAction} from "@/actions/create_recipe";

export default function Page() {
    const unitsPromise = getUnits();
  return (
      <>
            <div className="mx-auto max-w-3xl p-6">
                <RecipeCard action={createRecipeAction} unitsPromise ={unitsPromise} />
            </div>

      </>
          );

}
//<RecipeCard action={createRecipeAction} />
import RecipeCard from "@/components/RecipeCard";
//import { createRecipeAction } from "@/actions/create_recipe";
import { getUnits } from "@/db/queries/getUnits";

export default function Page() {
    const unitsPromise = getUnits();
  return (
      <>
            <div className="mx-auto max-w-3xl p-6">
                <RecipeCard unitsPromise ={unitsPromise} />
            </div>

      </>
          );

}
//<RecipeCard action={createRecipeAction} />
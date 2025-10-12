import RecipeCard from "@/components/RecipeCard";
//import { createRecipeAction } from "@/actions/create_recipe";

export default function Page() {
  return (
      <>
            <div className="mx-auto max-w-3xl p-6">
                <RecipeCard />
            </div>

      </>
          );

}
//<RecipeCard action={createRecipeAction} />
import { getRecipesWithAttributes } from "@/db/queries/getRecipes";
import { RecipeCard } from "@/components/RecipeCard";

export default async function RecipeOverview() {
  const recipes = await getRecipesWithAttributes();

  return (
    <div className="bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {recipes.length === 0 ? (
          <p className="text-gray-500 text-center">No recipes found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

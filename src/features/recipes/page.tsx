import { NavigationBar } from "@/features/shoppinglist/ui/NavigationBar";
import RecipeOverview from "@/features/recipes/ui/RecipeOverview";
import OpenCreateRecipeButton from "@/features/recipes/ui/open_create_recipe_button";

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default function Page({ searchParams }: PageProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <NavigationBar />
      <div className="bg-gray-50 p-8">
        <div className="container grid-cols-3 overflow-auto p-3 max-w-7xl mx-auto">
          <OpenCreateRecipeButton label="Add recipe" />
        </div>
        <div className="flex-1 overflow-auto">
          <RecipeOverview searchParams={searchParams} />
        </div>
      </div>
    </div>
  );
}

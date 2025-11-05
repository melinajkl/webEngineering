import { NavigationBar } from "@/features/shoppinglist/ui/navigation_bar";
import RecipeOverview from "@/features/recipes/ui/recipe_overview";
import OpenCreateRecipeButton from "@/features/recipes/ui/open_create_recipe_button";
import { HeaderContainer } from "./ui/container";

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default function Page({ searchParams }: PageProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <NavigationBar />
      <div className="bg-gray-50 p-8">
        <div className="container grid-cols-3 overflow-auto p-3 max-w-7xl mx-auto">
          
        </div>
        <div className="flex-1 overflow-auto">
          <RecipeOverview searchParams={searchParams} />
        </div>
      </div>
    </div>
  );
}
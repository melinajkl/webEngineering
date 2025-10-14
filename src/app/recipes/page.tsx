import { NavigationBar } from "@/components/NavigationBar";
import RecipeOverview from "@/components/RecipeOverview";

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavigationBar />
      <div className="flex-1 overflow-auto">
        <RecipeOverview />
      </div>
    </div>
  );
}

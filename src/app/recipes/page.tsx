import { NavigationBar } from "@/components/NavigationBar";
import RecipeOverview from "@/components/RecipeOverview";

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default function Page({ searchParams }: PageProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <NavigationBar />
      <div className="flex-1 overflow-auto">
        <RecipeOverview searchParams={searchParams} />
      </div>
    </div>
  );
}

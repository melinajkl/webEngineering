import { NavigationBar } from "@/components/NavigationBar";
import OpenCreateRecipeButton from "./_components/open_create_recipe_button";

export default function Page() {
  return (
      <>
          <NavigationBar />
          <main className="container mx-auto grid min-h-[80vh] place-items-center p-6">
              <OpenCreateRecipeButton label="Rezept erstellen" />
          </main>
      </>
          );

}

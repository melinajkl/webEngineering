import { NavigationBar } from "@/features/shoppinglist/ui/NavigationBar";
import { ShoppingList } from "@/features/shoppinglist/ui/ShoppingList";
import { getShoppingList } from "@/server/db/queries/getShoppingList";

export default async function Page() {
  const initialItems = await getShoppingList(); // Server-seitig geladen

  return (
    <div className="flex flex-col min-h-screen">
      <NavigationBar />
      <div className="flex-1 overflow-auto">
        <ShoppingList initialItems={initialItems} />{" "}
        {/* Props an Client Component */}
      </div>
    </div>
  );
}

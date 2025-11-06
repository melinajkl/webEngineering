import { NavigationBar } from "@/features/shoppinglist/ui/navigation_bar";
import { ShoppingList } from "@/features/shoppinglist/ui/shopping_list";
import { getShoppingList } from "@/server/db/queries/getShoppingList";

export default async function Page() {
  const initialItems = await getShoppingList(); // Server-seitig geladen

  return (
    <div className="flex flex-col min-h-screen">
      <NavigationBar />
      <div className="flex-1 overflow-auto bg-gray-50">
        <ShoppingList initialItems={initialItems} />{" "}
        {/* Props an Client Component */}
      </div>
    </div>
  );
}

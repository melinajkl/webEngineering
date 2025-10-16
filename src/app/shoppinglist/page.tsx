import { NavigationBar } from "@/components/NavigationBar";
import { ShoppingList } from "@/components/ShoppingList";
import { getShoppingList } from "@/db/queries/getShoppingList";

export default async function Page() {
  const initialItems = await getShoppingList(); // Server-seitig geladen

  return (
    <div className="flex flex-col min-h-screen">
      <NavigationBar />
      <div className="flex-1 overflow-auto">
        <ShoppingList initialItems={initialItems} /> {/* Props an Client Component */}
      </div>
    </div>
  );
}

"use client"
import { useState } from "react";
import { ShoppingItem } from "@/features/shoppinglist/ui/shopping_item";
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { shoppingListRow } from "@/server/db/queries/getShoppingList";
import {
  toggleShoppingListItem,
  deleteShoppingListItem,
} from "@/features/shoppinglist/actions/shopping_list_actions";

type Filter = "all" | "active" | "done";

interface ShoppingListProps {
  initialItems: shoppingListRow[];
}

export function ShoppingList({ initialItems }: ShoppingListProps) {
  const [items, setItems] = useState(initialItems);
  const [filter, setFilter] = useState<Filter>("all");

  const handleToggle = async (id: number) => {
    try {
      await toggleShoppingListItem(id);
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, checked: !item.checked } : item
        )
      );
    } catch (error) {
      console.error("Error toggling item:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteShoppingListItem(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  // Filterlogik
  const filteredItems = items.filter((i) => {
    if (filter === "active") return !i.checked;
    if (filter === "done") return i.checked;
    return true;
  });

  // Gruppieren nach Kategorie
  const groupedByCategory = filteredItems.reduce(
    (groups, item) => {
      const category = item.category ?? "Andere";
      if (!groups[category]) groups[category] = [];
      groups[category].push(item);
      return groups;
    },
    {} as Record<string, shoppingListRow[]>
  );

  // Hilfsfunktion für "isUpcoming"
  const isUpcoming = (dateOfUse: number | null | undefined) => {
    if (!dateOfUse) return false;
    const today = new Date().getTime();
    return dateOfUse > today;
  };

  return (
    <Card className="w-full max-w-lg mx-auto mt-8 p-4 space-y-4">
      <h2 className="text-xl font-semibold text-center">Your Shopping List</h2>

      {/* Filter Buttons */}
      <div className="flex justify-center gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
        >
          All
        </Button>
        <Button
          variant={filter === "active" ? "default" : "outline"}
          onClick={() => setFilter("active")}
        >
          Active
        </Button>
        <Button
          variant={filter === "done" ? "default" : "outline"}
          onClick={() => setFilter("done")}
        >
          Done
        </Button>
      </div>

      {/* Einkaufsliste nach Kategorien */}
      <CardContent className="flex flex-col gap-4">
        {Object.entries(groupedByCategory).map(([category, categoryItems]) => (
          <div key={category}>
            <h3 className="text-lg font-semibold mt-4 mb-2 border-b pb-1">
              🗂️ {category}
            </h3>
            {categoryItems.map((item) => {
              const itemName = `${item.ingredientName ?? `Ingredient ${item.ingredientId}`} (${item.amount} ${item.unitName ?? ""})`;
              const upcoming = isUpcoming(item.dateOfUse);

              return (
                <div
                  key={item.id}
                  className={upcoming ? "text-green-600 font-medium" : ""}
                >
                  <ShoppingItem
                    item={{
                      id: item.id.toString(),
                      name: itemName,
                      done: item.checked,
                    }}
                    onToggle={() => handleToggle(item.id)}
                    onDelete={() => handleDelete(item.id)}
                  />
                </div>
              );
            })}
          </div>
        ))}

        {/* Falls keine Items vorhanden */}
        {filteredItems.length === 0 && (
          <p className="text-center text-muted-foreground">No items yet.</p>
        )}
      </CardContent>
    </Card>
  );
}

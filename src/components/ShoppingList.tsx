"use client";

import { useState } from "react";
import { ShoppingItem } from "./ShoppingItem";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { shoppingListRow } from "@/db/queries/getShoppingList";
import { getShoppingList } from "@/db/queries/getShoppingList";
import { 
  toggleShoppingListItem, 
  deleteShoppingListItem 
} from "@/actions/shoppingListActions";
import { useRouter } from "next/navigation";

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

  const now = new Date();
  const in7Days = new Date();
  in7Days.setDate(now.getDate() + 7);

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

      {/* Item-Liste */}
      <CardContent className="flex flex-col gap-2">
        {filteredItems.length === 0 ? (
          <p className="text-center text-muted-foreground">No items yet.</p>
        ) : (
          filteredItems.map((item) => {
            // ✅ Prüfen, ob der Artikel in den nächsten 7 Tagen verwendet wird
            const isUpcoming =
              item.dateOfUse >= now.getTime() &&
              item.dateOfUse <= in7Days.getTime();

            return (
              <ShoppingItem
                key={item.id}
                item={{
                  id: item.id.toString(),
                  name: (
                    <span
                      className={
                        isUpcoming ? "text-green-600 font-medium" : ""
                      }
                    >
                      {item.ingredientName
                        ? `${item.ingredientName} (${item.amount} ${
                            item.unitName ?? ""
                          })`
                        : `Ingredient ${item.ingredientId}`}
                    </span>
                  ) as unknown as string, // 👈 Typkonvertierung nötig, da ShoppingItem `string` erwartet
                  done: item.checked,
                }}
                onToggle={() => handleToggle(item.id)}
                onDelete={() => handleDelete(item.id)}
              />
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
"use client";
import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";

interface QuantityItem {
  ingredientname: string;
  amount: number;
  unit: string;
  unitId: number;
  ingredientId: number;
}

interface QuantityProps {
  title: string;
  ingredients: QuantityItem[];
  isOpen: boolean;
  onClose: () => void;
  // server action (or API proxy) passed in by the parent
  createAction: (
    items: Array<{ ingredientId: number; amount: number; unitId: number }>
  ) => Promise<void>;
}

export default function QuantityInput({
  title,
  ingredients,
  isOpen,
  onClose,
  createAction, // ✅ use the passed-in action
}: QuantityProps) {
  const [checkedIngredients, setCheckedIngredients] = useState<
    Array<{ ingredientId: number; amount: number }>
  >([]);
  const [pending, setPending] = useState(false);

  const handleCheck = (
    checked: boolean,
    ingredientId: number,
    amount: number
  ) => {
    setCheckedIngredients((prev) => {
      if (checked) {
        if (prev.some((i) => i.ingredientId === ingredientId)) return prev;
        return [...prev, { ingredientId, amount }];
      }
      return prev.filter((i) => i.ingredientId !== ingredientId);
    });
  };

  const isSelected = (ingredientId: number) =>
    checkedIngredients.some((i) => i.ingredientId === ingredientId);

  const handleSave = async () => {
    try {
      setPending(true);
      const payload = checkedIngredients.map((sel) => {
        const src = ingredients.find(
          (ing) => ing.ingredientId === sel.ingredientId
        );
        if (!src) throw new Error("Ingredient not found for selection.");
        return {
          ingredientId: sel.ingredientId,
          amount: sel.amount,
          unitId: src.unitId,
        };
      });

      await createAction(payload); // ✅ call the prop action
      onClose();
    } catch (err) {
      console.error("Failed to add shopping list items:", err);
      // optionally show a toast here
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-3xl p-6 max-h-[90vh] overflow-y-auto"
        aria-description="Select ingredients to put on shopping list"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {title} Selection
          </DialogTitle>
        </DialogHeader>

        {ingredients && ingredients.length > 0 ? (
          <div className="flex flex-col gap-6 m-6">
            {ingredients.map((ingredient) => {
              const checkboxId = `ingredient-${ingredient.ingredientId}`;
              return (
                <div
                  key={ingredient.ingredientId}
                  className="flex items-center justify-between"
                >
                  <div className="flex gap-4 items-center">
                    <Checkbox
                      id={checkboxId}
                      checked={isSelected(ingredient.ingredientId)}
                      onCheckedChange={(c) =>
                        handleCheck(
                          Boolean(c),
                          ingredient.ingredientId,
                          ingredient.amount
                        )
                      }
                    />
                    <label htmlFor={checkboxId}>
                      {ingredient.ingredientname}
                    </label>
                  </div>
                  <span className="text-gray-500 text-sm">
                    {ingredient.amount} {ingredient.unit}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 mt-6">No ingredients found.</p>
        )}

        <Button
          className="mt-6 self-end"
          onClick={handleSave}
          disabled={checkedIngredients.length === 0 || pending}
        >
          {pending ? "Adding..." : "Add to Shopping List"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

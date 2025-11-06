import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Badge } from "@/shared/ui/badge";
import { IconChefHat, IconClock, IconUser } from "@tabler/icons-react";
import { IngredientsTable } from "@/features/recipes/ui/ingredients_table";

interface QuantityProps {
    title: string;
    ingredients: Array<{
      ingredientname: string;
      amount: number;
      unit: string;
  }>;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuantityInput({
title,
  ingredients,
  isOpen,
  onClose,
}: QuantityProps) {
  console.log("Modal received ingredients:", ingredients);
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {title} Selection
          </DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

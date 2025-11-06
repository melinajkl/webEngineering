import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";

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
  var checkedIngredients: Array<{ id: number; amount: number }> = [];
  const handleSave = () => {};

  const handleCheck = (checked: boolean) => {
    console.log("Checkbox checked:", checked);
    if (checked) {
      // Add to checkedIngredients
      
    } else {
      // Remove from checkedIngredients
    }
  };

  console.log("input modal received ingredients:", ingredients);
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
            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex gap-4 items-center">
                  <Checkbox id="ingredient.id" onCheckedChange={handleCheck} />
                  <label>{ingredient.ingredientname}</label>
                </div>
                <span className="text-gray-500 text-sm">
                  {ingredient.amount} {ingredient.unit}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 mt-6">No ingredients found.</p>
        )}

        <Button className="mt-6 justify-right" onClick={handleSave}>
          Add to Shopping List
        </Button>
      </DialogContent>
    </Dialog>
  );
}

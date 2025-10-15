"use client"; // This is a Client Component

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RecipeDetailModalProps {
  recipe: {
    id: number;
    title: string;
    prepareTime: number;
    cookingTime: number;
    portions: number;
    foodCategory: { id: number; name: string| null } | null;
    attributes: Array<{ id: number; name: string | null}>;
    steps: Array<{ stepnumber: number; description: string }>;
  };
  isOpen: boolean;
  onClose: () => void;
}

export function RecipeDetailModal({
  recipe,
  isOpen,
  onClose,
}: RecipeDetailModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {recipe.title}
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <p>
              <strong>Prep Time:</strong> {recipe.prepareTime} mins
            </p>
            <p>
              <strong>Cook Time:</strong> {recipe.cookingTime} mins
            </p>
            <p>
              <strong>Portions:</strong> {recipe.portions}
            </p>
            {recipe.foodCategory?.name && (
              <p>
                <strong>Category:</strong> {recipe.foodCategory.name}
              </p>
            )}
          </div>
          <div>
            <h3 className="font-semibold mb-2">Attributes:</h3>
            <ul className="list-disc pl-5">
              {recipe.attributes.map((attr) => (
                <li key={attr.id}>{attr.name}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Steps:</h3>
          <ol className="list-decimal pl-5 space-y-2">
            {recipe.steps.map((step) => (
              <li key={step.stepnumber}>{step.description}</li>
            ))}
          </ol>
        </div>
      </DialogContent>
    </Dialog>
  );
}

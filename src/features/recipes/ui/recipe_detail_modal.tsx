import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Badge } from "@/shared/ui/badge";
import { IconChefHat, IconClock, IconUser } from "@tabler/icons-react";
import { IngredientsTable } from "@/features/recipes/ui/ingredients_table";

interface RecipeDetailModalProps {
  recipe: {
    id: number;
    title: string;
    prepareTime: number;
    cookingTime: number;
    portions: number;
    foodCategory: { id: number; name: string | null } | null;
    attributes: Array<{ id: number; name: string | null }>;
    steps: Array<{ stepnumber: number; description: string }>;
    ingredients: Array<{
      ingredientname: string;
      amount: number;
      unit: string;
    }>;
  };
  isOpen: boolean;
  onClose: () => void;
}

export function RecipeDetailModal({
  recipe,
  isOpen,
  onClose,
}: RecipeDetailModalProps) {
  console.log("Modal received ingredients:", recipe.ingredients);
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {recipe.title}
          </DialogTitle>
        </DialogHeader>

        {/* Attributes and info */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-4">
          <div className="space-y-4">
            <div className="flex gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <IconClock className="w-4 h-4" />
                <span>Prep: {recipe.prepareTime}m</span>
              </div>
              <div className="flex items-center gap-1">
                <IconChefHat className="w-4 h-4" />
                <span>Cook: {recipe.cookingTime}m</span>
              </div>
              <div className="flex items-center gap-1">
                <IconUser className="w-4 h-4" />
                <span>Servings: {recipe.portions}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {recipe.foodCategory?.name && (
                <Badge key={recipe.foodCategory.id} variant="secondary">
                  {recipe.foodCategory.name}
                </Badge>
              )}
              {recipe.attributes
                .filter((attr) => attr.id && attr.name)
                .map((attr) => (
                  <Badge key={attr.id} variant="outline">
                    {attr.name}
                  </Badge>
                ))}
            </div>
          </div>
        </div>

        {/* Ingredients */}

        {/* In RecipeDetailModal */}
        {recipe.ingredients && recipe.ingredients.length > 0 ? (
          <div className="mt-2">
            <h3 className="text-sm px-2 text-muted-foreground mb-3">
              Ingredients
            </h3>
            <IngredientsTable ingredients={recipe.ingredients} />
          </div>
        ) : (
          <p className="text-gray-500 mt-6">No ingredients found.</p>
        )}

        {/* Steps */}
        {recipe.steps && recipe.steps.length > 0 ? (
          <div className="mt-1">
            <h3 className="text-sm px-2 text-muted-foreground mb-3">
              Instructions
            </h3>
            <div className="pt-3 space-y-2">
              {recipe.steps.map((step) => (
                <div
                  key={step.stepnumber}
                  className="flex gap-2 hover:bg-gray-50 -mx-2 px-2 py-1 rounded transition-colors"
                >
                  <span className="text-gray-400 font-medium min-w-6">
                    {step.stepnumber}.
                  </span>
                  <span className="text-gray-700">{step.description}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 mt-6">No steps found.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}

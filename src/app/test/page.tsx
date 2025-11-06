"use client";

import OpenDeleteRecipeButton from "@/features/recipes/ui/open_delete_recipe_button";

export default function TestPage() {
  return (
    <div className="p-10 flex flex-col gap-4">
      <h1 className="text-xl font-bold">Button-Test</h1>
      <OpenDeleteRecipeButton />
    </div>
  );
}

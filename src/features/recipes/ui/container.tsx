"use client"

import OpenCreateRecipeButton from "./open_create_recipe_button"
import DeleteRecipeWrapper from "@/features/recipes/ui/delete_recipe_wrapper";

export const HeaderContainer = () => {
return (
<div className="flex gap-">
    <OpenCreateRecipeButton label="Add recipe" />
    <DeleteRecipeWrapper />
</div>)
}
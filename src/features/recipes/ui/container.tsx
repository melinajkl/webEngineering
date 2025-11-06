"use client"

import OpenCreateRecipeButton from "./open_create_recipe_button"
import OpenDeleteRecipeButton from "./open_delete_recipe_button"

export const HeaderContainer = () => {
return (
<div className="flex flex-row justify-between items-center gap-6">
    <OpenCreateRecipeButton label="Add recipe" />
    <OpenDeleteRecipeButton label="Delete recipe" />
</div>)
}
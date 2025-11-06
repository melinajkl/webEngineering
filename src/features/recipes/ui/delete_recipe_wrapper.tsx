import dynamic from "next/dynamic";

const OpenDeleteRecipeButton = dynamic(
  () => import("@/features/recipes/ui/open_delete_recipe_button"),
  { ssr: false } // verhindert SSR, erzwingt Client-Side Render
);

export default function DeleteRecipeWrapper() {
  return <OpenDeleteRecipeButton />;
}

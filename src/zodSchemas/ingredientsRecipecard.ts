import {z} from "zod";


export const IngredientRecipeCardSchema = z.object({
    recipeIngredientsId: z.coerce.number().min(1, "At least one ingredient must be added."),
    name: z.string().min(1),
    quantity: z.coerce.number().min(1, "Quantity must be at least 1."),
    unitId: z.coerce.number().int().min(1, "A unit of measurement must be selected."),
});


const CreateIngredienceRecipeCardRowSchema = IngredientRecipeCardSchema.pick({
    recipeIngredientsId: true,
    quantity: true,
    unitId: true,
});

export type iDbRecipeCardIngredience = z.infer<typeof CreateIngredienceRecipeCardRowSchema>;
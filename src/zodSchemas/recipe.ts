import {z} from "zod";

import {IngredientRecipeCardSchema} from "@/zodSchemas/ingredientsRecipecard";
import {StepSchema} from "@/zodSchemas/step";


export const RecipeSchema = z.object({
    title: z.string().min(1, "Title is a required field."),
    portions: z.coerce.number().int().min(1).max(64, "Please fill out the portions field."),
    prepareTime: z.coerce.number().int().min(1, "Minimum 1 minute preparation time.").max(24 * 60, "Maximum 24 hours preparation time."),
    cookingTime: z.coerce.number().int().min(1, "Minimum 1 minute cooking time.").max(24 * 60, "Maximum 24 hours cooking time."),
    foodCategory: z.coerce.number().int().min(1),
    recipeCategory: z.array(z.string().min(1)).max(20).default([]),
    ingredients: z.array(IngredientRecipeCardSchema).min(1, "At least one ingredient must be added."),
    steps: z.array(StepSchema).min(1, "At least one step must be added."),
});

export const CreateRecipeRowSchema = RecipeSchema.pick({
    title: true,
    foodCategory: true,
    prepareTime: true,
    cookingTime: true,
    portions: true,
});

export type iDbRecipe = z.infer<typeof CreateRecipeRowSchema>;
import "server-only";
import {z} from "zod";


export const CreateIngredientSchemaForRecipe = z.object({
    name: z.string().trim().min(1, "Name is required"),
    categoryName: z.string().trim().min(1, "Category is required"),
    unitId: z.coerce.number().int().positive().min(1, "A unit of measurement must be selected."),
});


export type iDbIngredienceForRecipe = z.infer<typeof CreateIngredientSchemaForRecipe>;

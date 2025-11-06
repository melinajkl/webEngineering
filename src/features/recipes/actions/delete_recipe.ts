"use server";

import "server-only";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { deleteRecipeById } from "@/server/db/queries/deleteRecipes";

const DeleteRecipeSchema = z.object({
  id: z.coerce.number().int().min(1, "Invalid recipe id."),
});

export async function deleteRecipeAction(fd: FormData | { id: number }) {
  const idValue = fd instanceof FormData ? fd.get("id") : fd.id;
  const parsed = DeleteRecipeSchema.safeParse({ id: idValue });

  if (!parsed.success) {
    const msg =
      parsed.error.flatten().formErrors.join(", ") || "Invalid recipe id.";
    return { ok: false, error: msg };
  }

  await deleteRecipeById(parsed.data.id);

  // ggf. auf eure Liste/Seite anpassen (z. B. "/recipes")
  revalidatePath("/", "layout");

  return { ok: true, message: `Recipe ${parsed.data.id} deleted.` };
}

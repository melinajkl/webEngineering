"use server";

import "server-only";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { deleteRecipeById } from "@/server/db/queries/deleteRecipes";

const DeleteRecipeSchema = z.object({
  id: z.coerce.number().int().min(1, "Invalid recipe id."),
});

/**
 * Server Action zum Löschen eines Rezepts über FormData oder Objekt.
 * Revalidiert die Root/Layout-Route, um Übersichten zu aktualisieren.
 */
export async function deleteRecipeAction(fd: FormData | { id: number }) {
  const idValue = fd instanceof FormData ? fd.get("id") : fd.id;
  const parsed = DeleteRecipeSchema.safeParse({ id: idValue });

  if (!parsed.success) {
    const msg =
      parsed.error.flatten().formErrors.join(", ") || "Invalid recipe id.";
    return { ok: false, error: msg };
  }

  await deleteRecipeById(parsed.data.id);

  // Passe den Pfad an eure Datenansicht an (Root/Layout ist oft passend wie beim Add)
  revalidatePath("/", "layout");

  return { ok: true, message: `Recipe ${parsed.data.id} deleted.` };
}

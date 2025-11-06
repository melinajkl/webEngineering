"use client";

import * as React from "react";
import { use, useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import type { RecipeListRow } from "@/server/db/queries/getRecipesList";

type ActionResult = { ok: boolean; message?: string; error?: string };

type Props = {
  label: string;
  recipesPromise: Promise<RecipeListRow[]>;
  action: (fd: FormData) => Promise<ActionResult>;
};

/**
 * Öffnet einen Dialog mit Dropdown aller Rezepte, bestätigt Löschung über Submit.
 * Erwartet einen Promise für die Rezepte (Server-Fetch) und eine Server Action.
 */
export default function DeleteRecipeDialogButton({
  label,
  recipesPromise,
  action,
}: Props) {
  // recipesPromise stammt aus einem Server-Wrapper
  const recipes = use(recipesPromise);

  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const res = await action(formData);
      if (!res.ok) {
        setError(res.error ?? "Delete failed.");
        return;
      }
      // nach Erfolg schließen & zurücksetzen
      setOpen(false);
      setSelectedId(null);
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <Trash2 className="mr-2 size-4" />
          {label}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md w-full">
        <DialogHeader>
          <DialogTitle>Delete Recipe</DialogTitle>
        </DialogHeader>

        <form action={onSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Select recipe</label>
            <Select
              value={selectedId?.toString() ?? ""}
              onValueChange={(v) => setSelectedId(Number(v))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a recipe..." />
              </SelectTrigger>
              <SelectContent>
                {recipes.map((r) => (
                  <SelectItem key={r.id} value={String(r.id)}>
                    {r.title} (#{r.id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <input type="hidden" name="id" value={selectedId ?? ""} />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={!selectedId || isPending}
            >
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

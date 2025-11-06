"use client";

import * as React from "react";
import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";

type ActionResult = { ok: boolean; message?: string; error?: string };

export default function DeleteRecipeDialogButton({
  label = "Delete recipe",
  action,
}: {
  label?: string;
  action: (fd: FormData) => Promise<ActionResult>;
}) {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const isValid = /^\d+$/.test(id) && Number(id) > 0;

  const onSubmit = (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const res = await action(formData);
      if (!res.ok) {
        setError(res.error ?? "Delete failed.");
        return;
      }
      setOpen(false);
      setId("");
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
          <DialogTitle>Delete Recipe by ID</DialogTitle>
        </DialogHeader>

        <form action={onSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium" htmlFor="recipe-id">
              Recipe ID
            </label>
            <Input
              id="recipe-id"
              inputMode="numeric"
              pattern="\d*"
              maxLength={9}
              placeholder="z. B. 42"
              value={id}
              onChange={(e) => setId(e.target.value.replace(/[^\d]/g, ""))}
            />
          </div>

          <input type="hidden" name="id" value={id} />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={!isValid || isPending}
              aria-disabled={!isValid || isPending}
              title={!isValid ? "Bitte eine gültige ID eingeben" : undefined}
            >
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// src/app/recipes/_components/recipe_form_dialog_button.tsx
"use client";

import * as React from "react";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import RecipeForm from "@/components/RecipeCard";

type Props = {
    label?: string;
    // Server Action wird vom Server-Wrapper durchgereicht
    action: (fd: FormData) => Promise<{ ok: boolean; id?: string; message?: string; error?: string }>;
    // Promise kommt vom Server-Wrapper; RecipeForm ruft `use(unitsPromise)`
    unitsPromise: Promise<unknown>;
};

export default function RecipeFormDialogButton({ label = "Rezept erstellen", action, unitsPromise }: Props) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 size-4" />
                    {label}
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Neues Rezept</DialogTitle>
                </DialogHeader>

                {/* Deine bestehende Karte/Form als Overlay-Inhalt */}
                <div className="mt-2">
                    <RecipeForm action={action} unitsPromise={unitsPromise} />
                </div>
            </DialogContent>
        </Dialog>
    );
}

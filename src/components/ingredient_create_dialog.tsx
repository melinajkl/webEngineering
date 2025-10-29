"use client";

import * as React from "react";
import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { UnitRow } from "@/db/queries/getUnits";
import type { IngredientRow } from "@/db/queries/getIngredients";

type Props = {
    units: UnitRow[];
    action: (fd: FormData) => Promise<{
        ok: boolean;
        id?: number;
        name?: string;
        unitId?: number;
        categoryId?: number;
        message?: string;
        error?: string;
    }>;
    onCreated: (row: Omit<IngredientRow, "category">) => void;
};

export default function IngredientCreateDialog({ units, action, onCreated }: Props) {
    const [open, setOpen] = useState(false);
    const [pending, setPending] = useState(false);

    const [name, setName] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [unitId, setUnitId] = useState<number | undefined>(undefined);

    const [error, setError] = useState<string | null>(null);

    const canSubmit = name.trim().length > 0 && categoryName.trim().length > 0 && !pending;

    const submit = async () => {
        setPending(true);
        setError(null);

        const fd = new FormData();
        fd.set("name", name.trim());
        fd.set("categoryName", categoryName.trim());
        if (unitId != null) fd.set("unitId", String(unitId));

        const res = await action(fd);
        setPending(false);

        if (!res.ok || !res.id) {
            setError(res.error ?? "Failed to create");
            return;
        }

        onCreated({
            id: res.id,
            name: res.name ?? name.trim(),
            unitId: res.unitId,
        });

        // reset + close
        setName("");
        setCategoryName("");
        setUnitId(undefined);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Plus className="mr-2 size-4" />
                    New Ingredient
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add ingredient</DialogTitle>
                </DialogHeader>

                <div className="grid gap-3">
                    <div className="grid gap-2">
                        <Label htmlFor="ing_name">Name</Label>
                        <Input
                            id="ing_name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Tomato"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="ing_category">Category</Label>
                        <Input
                            id="ing_category"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            placeholder="e.g. Vegetable"
                        />
                        <p className="text-xs text-muted-foreground">
                            New categories are created automatically.
                        </p>
                    </div>

                    <div className="grid gap-2">
                        <Label>Standard Unit (optional)</Label>
                        <Select
                            value={unitId != null ? String(unitId) : undefined}
                            onValueChange={(v) => setUnitId(v ? Number(v) : undefined)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="choose Unit" />
                            </SelectTrigger>
                            <SelectContent>
                                {units.length === 0 ? (
                                    <SelectItem disabled value="__no_units__">No units available</SelectItem>
                                ) : (
                                    units.map((u) => (
                                        <SelectItem key={u.id} value={String(u.id)}>
                                            {u.shortForm ? `${u.name} (${u.shortForm})` : u.name}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    {error ? <p className="text-sm text-destructive">{error}</p> : null}
                </div>

                <DialogFooter className="mt-2">
                    <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button type="button" onClick={submit} disabled={!canSubmit}>
                        {pending ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Plus className="mr-2 size-4" />}
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

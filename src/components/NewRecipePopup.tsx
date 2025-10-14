"use client";

import { use, useState, useTransition } from "react";
import type { CreateRecipeInput } from "@/actions/create_recipe";
import type { UnitRow } from "@/db/queries/getUnits";
import type { FoodCategoryRow } from "@/db/queries/getFoodCategory";
import type { IngredientRow } from "@/db/queries/getIngredients";
import type { CreateIngredientResult } from "@/actions/create_ingredients";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, Trash2 } from "lucide-react";

import IngredientCreateDialog from "@/app/recipes/_components/ingredient_create_dialog";

type Props = {
    action: (fd: FormData) => Promise<{ ok: boolean; id?: string; message?: string; error?: string }>;
    unitsPromise: Promise<UnitRow[]>;
    foodCategoryPromise: Promise<FoodCategoryRow[]>;
    ingredientsPromise: Promise<IngredientRow[]>;
    createIngredientAction: (fd: FormData) => Promise<CreateIngredientResult>;
};

type Ingredient = NonNullable<CreateRecipeInput["ingredients"]>[number];
type Step = NonNullable<CreateRecipeInput["steps"]>[number];

export default function RecipeForm({
                                       action,
                                       unitsPromise,
                                       foodCategoryPromise,
                                       ingredientsPromise,
                                       createIngredientAction,
                                   }: Props) {
    const [title, setTitle] = useState("");
    const [portions, setPortions] = useState<number>(2);
    const [prepareTime, setPrepareTime] = useState<number>(15);
    const [cookingTime, setCookingTime] = useState<number>(30);

    // selected food category (id from DB)
    const [foodCategoryId, setFoodCategoryId] = useState<number>(1);

    // CSV tags for recipe categories
    const [recipeCategory, setRecipeCategory] = useState<string>("");

    // ingredients for this recipe (UI rows)
    const [ingredients, setIngredients] = useState<Ingredient[]>([
        { name: "", quantity: 0, unitId: 1 },
    ]);
    const [steps, setSteps] = useState<Step[]>([{ text: "" }]);

    // Resolve server-provided data
    const units = use(unitsPromise);
    const foodCats = use(foodCategoryPromise);
    const initialIngredientOptions = use(ingredientsPromise);

    // keep a local list so we can push new items from the dialog instantly
    const [ingredientOptions, setIngredientOptions] =
        useState<IngredientRow[]>(initialIngredientOptions);

    const [message, setMessage] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    // helpers
    const addIngredient = () =>
        setIngredients((arr) => [...arr, { name: "", quantity: 0, unitId: 1 }]);

    const removeIngredient = (i: number) =>
        setIngredients((arr) => arr.filter((_, idx) => idx !== i));

    const updateIngredient = (i: number, patch: Partial<Ingredient>) =>
        setIngredients((arr) => arr.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));

    const onSelectIngredient = (i: number, value: string) => {
        // find selected ingredient to optionally copy its default unit
        const row = ingredientOptions.find((opt) => opt.name === value);
        updateIngredient(i, {
            name: value,
            unitId: row?.unitId ?? ingredients[i]?.unitId,
        });
    };

    const addStep = () => setSteps((arr) => [...arr, { text: "" }]);
    const removeStep = (i: number) => setSteps((arr) => arr.filter((_, idx) => idx !== i));
    const updateStep = (i: number, text: string) =>
        setSteps((arr) => arr.map((it, idx) => (idx === i ? { text } : it)));

    return (
        <form
            className="grid gap-6"
            action={(fd) => {
                const payload: CreateRecipeInput = {
                    title,
                    portions,
                    prepareTime,
                    cookingTime,
                    foodCategory: foodCategoryId,
                    recipeCategory: recipeCategory
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean),
                    ingredients: ingredients
                        .map((i) => ({ ...i, name: i.name.trim() }))
                        .filter((i) => i.name.length > 0),
                    steps: steps.map((s) => ({ text: s.text.trim() })).filter((s) => s.text.length > 0),
                };
                fd.set("payload", JSON.stringify(payload));
                startTransition(async () => {
                    const res = await action(fd);
                    setMessage(res.ok ? res.message ?? "Gespeichert." : `Fehler: ${res.error ?? "unbekannt"}`);
                    if (res.ok) {
                        // reset
                        setTitle("");
                        setPortions(4);
                        setPrepareTime(15);
                        setCookingTime(30);
                        setFoodCategoryId(1);
                        setRecipeCategory("");
                        setIngredients([{ name: "", quantity: 0, unitId: 1 }]);
                        setSteps([{ text: "" }]);
                    }
                });
            }}
        >
            <Card className="rounded-2xl shadow-sm">
                <CardHeader>
                    <CardTitle className="text-xl">Rezept</CardTitle>
                </CardHeader>

                <CardContent className="grid gap-6">
                    {/* Titel */}
                    <div className="grid gap-2">
                        <Label htmlFor="title">Titel</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="z. B. Spaghetti Carbonara"
                        />
                    </div>

                    {/* Portionen / Zeiten */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="grid gap-2">
                            <Label htmlFor="portions">Portionen</Label>
                            <Input
                                id="portions"
                                type="number"
                                min={1}
                                max={64}
                                value={Number.isFinite(portions) ? portions : ""}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    setPortions(v === "" ? 1 : Number(v));
                                }}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="prep">Vorbereitung (Min.)</Label>
                            <Input
                                id="prep"
                                type="number"
                                min={0}
                                value={Number.isFinite(prepareTime) ? prepareTime : ""}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    setPrepareTime(v === "" ? 0 : Number(v));
                                }}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="cook">Kochen/Backen (Min.)</Label>
                            <Input
                                id="cook"
                                type="number"
                                min={0}
                                value={Number.isFinite(cookingTime) ? cookingTime : ""}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    setCookingTime(v === "" ? 0 : Number(v));
                                }}
                            />
                        </div>
                    </div>

                    {/* Kategorie + Tags */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="grid gap-2">
                            <Label>Essenskategorie</Label>
                            <Select
                                value={foodCategoryId != null ? String(foodCategoryId) : undefined}
                                onValueChange={(v) => setFoodCategoryId(v ? Number(v) : 1)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="wählen" />
                                </SelectTrigger>
                                <SelectContent>
                                    {foodCats.map((c) => (
                                        <SelectItem key={c.id} value={String(c.id)}>
                                            {c.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="col-span-2 grid gap-2">
                            <Label htmlFor="food_category">Tags (Komma-getrennt)</Label>
                            <Input
                                id="food_category"
                                value={recipeCategory}
                                onChange={(e) => setRecipeCategory(e.target.value)}
                                placeholder="z. B. pasta, italienisch"
                            />
                        </div>
                    </div>

                    {/* Zutaten */}
                    <div className="grid gap-3">
                        <div className="flex items-center justify-between">
                            <Label>Zutaten</Label>
                            <div className="flex items-center gap-2">
                                {/* Neue Zutat (opens popup) — with free-text category upsert */}
                                <IngredientCreateDialog
                                    units={units}
                                    action={createIngredientAction}
                                    onCreated={(row) => {
                                        setIngredientOptions((prev) => {
                                            if (prev.some((p) => p.id === row.id || p.name === row.name)) return prev;
                                            return [...prev, row].sort((a, b) => a.name.localeCompare(b.name));
                                        });
                                    }}
                                />
                                {/* + Zutat hinzufügen (adds a row) */}
                                <Button type="button" variant="secondary" onClick={addIngredient}>
                                    <Plus className="mr-2 size-4" /> Zutat hinzufügen
                                </Button>
                            </div>
                        </div>

                        {ingredients.map((ing, i) => (
                            <div key={i} className="grid grid-cols-1 gap-2 md:grid-cols-11">
                                {/* Ingredient NAME as dropdown */}
                                <div className="md:col-span-6">
                                    <Select
                                        value={ing.name || undefined}
                                        onValueChange={(v) => onSelectIngredient(i, v)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Zutat wählen" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {ingredientOptions.map((opt) => (
                                                <SelectItem key={opt.id} value={opt.name}>
                                                    {opt.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Quantity */}
                                <Input
                                    className="md:col-span-2"
                                    placeholder="Menge"
                                    value={ing.quantity ?? ""}
                                    onChange={(e) => updateIngredient(i, { quantity: Number(e.target.value) })}
                                />

                                {/* Unit dropdown */}
                                <div className="md:col-span-2">
                                    <Select
                                        value={ing.unitId != null ? String(ing.unitId) : undefined}
                                        onValueChange={(v) => updateIngredient(i, { unitId: v ? Number(v) : undefined })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Einheit" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {units.map((u) => (
                                                <SelectItem key={u.id} value={String(u.id)}>
                                                    {u.shortForm ? `${u.name} (${u.shortForm})` : u.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="md:col-span-1 flex gap-1">
                                    <Button type="button" variant="destructive" onClick={() => removeIngredient(i)}>
                                        <Trash2 className="size-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Schritte */}
                    <div className="grid gap-3">
                        <div className="flex items-center justify-between">
                            <Label>Schritte</Label>
                            <Button type="button" variant="secondary" onClick={addStep}>
                                <Plus className="mr-2 size-4" /> Schritt hinzufügen
                            </Button>
                        </div>
                        {steps.map((s, i) => (
                            <div key={i} className="flex items-start gap-2">
                                <Textarea
                                    placeholder={`Schritt ${i + 1}`}
                                    value={s.text}
                                    onChange={(e) => updateStep(i, e.target.value)}
                                    rows={2}
                                />
                                <Button type="button" variant="destructive" onClick={() => removeStep(i)}>
                                    <Trash2 className="size-4" />
                                </Button>
                            </div>
                        ))}
                    </div>

                    <div>
                        <Button type="submit" disabled={isPending} className="w-full">
                            {isPending ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
                            Rezept speichern
                        </Button>
                        {message && <p className="mt-2 text-sm text-muted-foreground">{message}</p>}
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}

"use client";

// oben ergänzen



import {use, useState, useTransition} from "react";
import type { CreateRecipeInput } from "@/actions/create_recipe";
import type { UnitRow } from "@/db/queries/getUnits";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Trash2 } from "lucide-react";


type Props = {
    action: (fd: FormData) => Promise<{ ok: boolean; id?: string; message?: string; error?: string }>;
    unitsPromise: Promise<UnitRow[]>
};


type Ingredient = NonNullable<CreateRecipeInput["ingredients"]>[number];
type Step = NonNullable<CreateRecipeInput["steps"]>[number];

export default function RecipeForm({ action, unitsPromise }: Props) {
    const [title, setTitle] = useState("");
    const [portions, setPortions] = useState<number | undefined>(2);
    const [prepareTime, setPrepareTime] = useState<number | undefined>(15);
    const [cookingTime, setCookingTime] = useState<number | undefined>(30);
    const [difficulty, setDifficulty] = useState<CreateRecipeInput["difficulty"]>("easy");
    const [foodCategory, setFoodCategory] = useState<string>(""); // komma-separiert im UI

    const [ingredients, setIngredients] = useState<Ingredient[]>([{ name: "", quantity: "" }]);

    const units = use(unitsPromise);


        const [steps, setSteps] = useState<Step[]>([{ text: "" }]);

    const [message, setMessage] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const addIngredient = () => setIngredients((arr) => [...arr, { name: "", quantity: "", unit: "" }]);
    const removeIngredient = (i: number) => setIngredients((arr) => arr.filter((_, idx) => idx !== i));
    const updateIngredient = (i: number, patch: Partial<Ingredient>) =>
        setIngredients((arr) => arr.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));

    const addStep = () => setSteps((arr) => [...arr, { text: "" }]);
    const removeStep = (i: number) => setSteps((arr) => arr.filter((_, idx) => idx !== i));
    const updateStep = (i: number, text: string) => setSteps((arr) => arr.map((it, idx) => (idx === i ? { text } : it)));

    return (
        <form
            className="grid gap-6"
            action={(fd) => {
                const payload = {
                    title,
                    portions,
                    prepareTime,
                    cookingTime,
                    difficulty, // optional im Schema, darf fehlen – wir schicken ihn trotzdem
                    foodCategory: foodCategory
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean),
                    ingredients: ingredients
                        .map((i) => ({ ...i, name: i.name.trim() }))
                        .filter((i) => i.name.length > 0),
                    steps: steps
                        .map((s) => ({ text: s.text.trim() }))
                        .filter((s) => s.text.length > 0),
                } satisfies CreateRecipeInput;
                fd.set("payload", JSON.stringify(payload));
                startTransition(async () => {
                    const res = await action(fd);
                    setMessage(res.ok ? res.message ?? "Gespeichert." : `Fehler: ${res.error ?? "unbekannt"}`);
                    if (res.ok) {
                        // Minimal reset
                        setTitle("");
                        setPortions(4);
                        setPrepareTime(15);
                        setCookingTime(30);+
                        setDifficulty("easy");
                        setFoodCategory("");
                        setIngredients([{ name: "", quantity: ""}]);
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
                    <div className="grid gap-2">
                        <Label htmlFor="title">Titel*</Label>
                        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="z. B. Spaghetti Carbonara" />
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="grid gap-2">
                            <Label htmlFor="portions">Portionen</Label>
                            <Input
                                id="portions"
                                type="number"
                                min={1}
                                max={64}
                                value={portions ?? ""}
                                onChange={(e) => setPortions(e.target.value ? Number(e.target.value) : undefined)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="prep">Vorbereitung (Min.)</Label>
                            <Input
                                id="prep"
                                type="number"
                                min={0}
                                value={prepareTime ?? ""}
                                onChange={(e) => setPrepareTime(e.target.value ? Number(e.target.value) : undefined)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="cook">Kochen/Backen (Min.)</Label>
                            <Input
                                id="cook"
                                type="number"
                                min={0}
                                value={cookingTime ?? ""}
                                onChange={(e) => setCookingTime(e.target.value ? Number(e.target.value) : undefined)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="grid gap-2">
                            <Label>Schwierigkeit</Label>
                            <Select value={difficulty} onValueChange={(v) => setDifficulty(v as typeof difficulty)}>
                                <SelectTrigger><SelectValue placeholder="wählen" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="easy">Leicht</SelectItem>
                                    <SelectItem value="medium">Mittel</SelectItem>
                                    <SelectItem value="hard">Schwer</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="col-span-2 grid gap-2">
                            <Label htmlFor="foodCategory">Essenskategorie (Komma-getrennt)</Label>
                            <Input id="food_category" value={foodCategory} onChange={(e) => setFoodCategory(e.target.value)} placeholder="z. B. pasta, italienisch" />
                        </div>
                    </div>

                    {/* Zutaten */}
                    <div className="grid gap-3">
                        <div className="flex items-center justify-between">
                            <Label>Zutaten*</Label>
                            <Button type="button" variant="secondary" onClick={addIngredient}>
                                <Plus className="mr-2 size-4" /> Zutat hinzufügen
                            </Button>
                        </div>
                        {ingredients.map((ing, i) => (
                            <div key={i} className="grid grid-cols-1 gap-2 md:grid-cols-11">
                                <Input
                                    className="md:col-span-6"
                                    placeholder="Name*"
                                    value={ing.name}
                                    onChange={(e) => updateIngredient(i, { name: e.target.value })}
                                />
                                <Input
                                    className="md:col-span-2"
                                    placeholder="Menge"
                                    value={ing.quantity ?? ""}
                                    onChange={(e) => updateIngredient(i, { quantity: e.target.value })}
                                />
                                {/* unit als Dropdown */}
                                <div className="md:col-span-2">
                                    <Select value={ingredients[i].unitId != null ? String(ingredients[i].unitId) : ""}
                                            onValueChange={(v) => updateIngredient(i, { unitId: v ? Number(v) : undefined })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Einheit" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {units.map((u) => {
                                                const value = u.shortForm ?? String(u.id);
                                                const label = u.shortForm ? `${u.name} ${u.shortForm}` : u.name;
                                                return (
                                                    <SelectItem key={u.id} value={value}>
                                                        {label}
                                                    </SelectItem>
                                                );
                                            })}
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
                            <Label>Schritte*</Label>
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

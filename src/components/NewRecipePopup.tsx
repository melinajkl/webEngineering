"use client";

import {use, useState, useTransition} from "react";

import type {CreateIngredientResult} from "@/actions/create_ingredients";
import type {iRecipeSchema, createRecipeIngredienceSchema, createRecipeStepSchema } from "@/zodSchemas/recipe";

// import actions
import type {UnitRow} from "@/db/queries/getUnits";
import type {FoodCategoryRow} from "@/db/queries/getFoodCategory";
import type {IngredientRow} from "@/db/queries/getIngredients";


// UI-Bausteine
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Loader2, Plus, Trash2} from "lucide-react";

// Import Dialog zum "Neue Zutat" anlegen
import IngredientCreateDialog from "@/components/ingredient_create_dialog";
import {iIngredientRecipe} from "@/db/queries/getIngredients";

type Props = {
    //Server Action zum Speichern des Formulars
    action: (fd: FormData) => Promise<{ ok: boolean; id?: string; message?: string; error?: string }>;

    //DB Abfragen mit Server-Komponenten
    unitsPromise: Promise<UnitRow[]>;
    foodCategoryPromise: Promise<FoodCategoryRow[]>;
    ingredientsPromise: Promise<IngredientRow[]>;

    //Server Action zum Anlegen einer neuen Zutat
    createIngredientAction: (fd: FormData) => Promise<CreateIngredientResult>;
};

// Zutaten und Steps aus zod RecipeMaske in Array
type Ingredient = NonNullable<createRecipeIngredienceSchema["ingredients"]>[number];
type Step = NonNullable<createRecipeStepSchema["steps"]>[number];


export default function RecipeForm({
                                       action,
                                       unitsPromise,
                                       foodCategoryPromise,
                                       ingredientsPromise,
                                       createIngredientAction,
                                   }: Props) {

    // Initialwerte aus den Promise
    const initialUnits = use(unitsPromise);
    const initialFoodCats = use(foodCategoryPromise);
    const initialIngredientOptions = use(ingredientsPromise);

    //Initialwerte Formularwerte für den Browser
    const [title, setTitle] = useState("");
    const [portions, setPortions] = useState<number>(2);
    const [prepareTime, setPrepareTime] = useState<number>(15);
    const [cookingTime, setCookingTime] = useState<number>(30);
    const [foodCategoryId, setFoodCategoryId] = useState<number>(1);
    const [recipeCategory, setRecipeCategory] = useState<string>("");

    // ingredients for this recipe (UI rows)
    const [ingredients, setIngredients] = useState<Ingredient[]>([{
        recipeIngredientsId: 0,
        name: "",
        quantity: 0,
        unitId: 0
    },]);
    const [steps, setSteps] = useState<Step[]>([{text: ""}]);

    // Lokale liste der Initialingredients für aktualisierung der UI nach neuanlage
    const [ingredientOptions, setIngredientOptions] = useState<iIngredientRecipe[]>(initialIngredientOptions);

    const [message, setMessage] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    // Neue leere Zutatenzeile einfügen
    const addIngredient = () => setIngredients((arr) => [...arr, {
        recipeIngredientsId: 0,
        name: "",
        quantity: 0,
        unitId: 0
    }]);
    // Zeile an Position "index" löschen
        function removeIngredient(index: number) {
            setIngredients((prev) => prev.filter((_, i) => i !== index));
        }

    // Zeile an Position "index" teilweise aktualisieren
        function updateIngredient(index: number, patch: Partial<Ingredient>) {
            setIngredients((prev) => {
                const next = [...prev];
                next[index] = { ...next[index], ...patch };
                return next;
            });
        }
    //Auswahl einer Zutat
    const onSelectIngredient = (rowIndex: number, idString: string) => {
        const id = Number(idString);
        const row = ingredientOptions.find((opt) => opt.id === id);
        const nextUnitId = row?.unitId;
        updateIngredient(rowIndex, {
            recipeIngredientsId: id,
            name: row?.name,
            unitId: nextUnitId,
        });
    };

    //Neuen leeren Schritt anhängen
    function addStep() {
        setSteps([...steps, { text: "" }]);
    }
    //Schritt entfernen
    function removeStep(index: number) {
        const next = [...steps];
        next.splice(index, 1);
        setSteps(next);
    }
    //Überschreibt den aktuellen Schritt an index Nr
    function updateStep(index: number, text: string) {
        const next = [...steps];
        next[index] = { ...next[index], text };
        setSteps(next);
    }
    return (
        <form
            className="grid gap-6 "
            action={(fd) => {
                const payload: iRecipeSchema = {
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
                        .map((i) => ({...i, name: i.name, recipeIngredientsId: i.recipeIngredientsId}))
                        .filter((i) => i.name.length > 0),
                    steps: steps.map((s) => ({text: s.text.trim()})).filter((s) => s.text.length > 0),
                };
                fd.set("payload", JSON.stringify(payload));
                startTransition(async () => {
                    const res = await action(fd);
                    setMessage(res.ok ? res.message ?? "Saved." : `${res.error ?? "unknown"}`);
                    if (res.ok) {
                        // reset
                        setTitle("");
                        setPortions(4);
                        setPrepareTime(15);
                        setCookingTime(30);
                        setFoodCategoryId(1);
                        setRecipeCategory("");
                        setIngredients([{recipeIngredientsId: 0, name: "", quantity: 0, unitId: 1}]);
                        setSteps([{text: ""}]);
                    }
                });
            }}
        >
            <Card
                className="rounded-2xl shadow-sm max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl">
                <CardHeader>
                    <CardTitle className="text-xl">New Recipe</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6">
                    {/* Titel */}
                    <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Spaghetti Carbonara"
                        />
                    </div>

                    {/* Portionen / Zeiten */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="grid gap-2">
                            <Label htmlFor="portions">Portions</Label>
                            <Input
                                id="portions"
                                type="number"
                                min={1}
                                max={15}
                                value={Number.isFinite(portions) ? portions : ""}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    setPortions(v === "" ? 1 : Number(v));
                                }}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="prep">Prep time (min)</Label>
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
                            <Label htmlFor="cook">Cook/Bake time (min)</Label>
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
                            <Label>Meal category</Label>
                            <Select
                                value={String(foodCategoryId)}
                                onValueChange={(v) => setFoodCategoryId(v ? Number(v) : 1)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="choose"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {initialFoodCats.map((c) => (
                                        <SelectItem key={c.id} value={String(c.id)}>
                                            {c.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="col-span-2 grid gap-2">
                            <Label htmlFor="food_category">Tags (separated by commas)</Label>
                            <Input
                                id="food_category"
                                value={recipeCategory}
                                onChange={(e) => setRecipeCategory(e.target.value)}
                                placeholder="e.g. pasta, itnein vor dem mergealien"
                            />
                        </div>
                    </div>

                    {/* Zutaten */}
                    <div className="grid gap-3">
                        <div className="flex items-center justify-between">
                            <Label>Ingredients</Label>
                            <div className="flex items-center gap-2 ">
                                { /* New Ingredien */ }
                                <IngredientCreateDialog
                                    units={initialUnits}
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
                                    <Plus className="mr-2 size-4"/> Add ingredient
                                </Button>
                            </div>
                        </div>

                        {ingredients.map((ing, i) => (
                            <div key={i} className="grid grid-cols-1 gap-2 md:grid-cols-11">
                                {/* Ingredient NAME as dropdown */}
                                <div className="md:col-span-6">
                                    <Select
                                        value={ing.recipeIngredientsId ? String(ing.recipeIngredientsId) : undefined}
                                        onValueChange={(idStr) => onSelectIngredient(i, idStr)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="choose ingredients"/>
                                        </SelectTrigger>
                                        <SelectContent position="popper" className="max-h-64">
                                            {ingredientOptions.map((opt) => (
                                                <SelectItem key={opt.id} value={String(opt.id)}>
                                                    {opt.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                </div>

                                {/* Quantity */}
                                <Input
                                    className="md:col-span-2"
                                    placeholder="Quantity"
                                    inputMode="numeric"
                                    value={ing.quantity ?? ""}
                                    onChange={(e) =>
                                        {
                                            const v = e.currentTarget.value;
                                            if (!/^\d*$/.test(v)) return;
                                            updateIngredient(i, { quantity: v === "" ? undefined : Number(v) })
                                        }
                                    }
                                />

                                {/* Unit dropdown */}
                                <div className="md:col-span-2">
                                    <Select
                                        value={ing.unitId != null ? String(ing.unitId) : undefined}
                                        onValueChange={(v) => updateIngredient(i, {unitId: v ? Number(v) : undefined})}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Unit"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {initialUnits.map((unitRow) => (
                                                <SelectItem key={unitRow.id} value={String(unitRow.id)}>
                                                    {unitRow.shortForm ? `${unitRow.name} (${unitRow.shortForm})` : unitRow.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="md:col-span-1 flex gap-1">
                                    <Button type="button" variant="destructive" onClick={() => removeIngredient(i)}>
                                        <Trash2 className="size-4"/>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Schritte */}
                    <div className="grid gap-3">
                        <div className="flex items-center justify-between">
                            <Label>Steps</Label>
                            <Button type="button" variant="secondary" onClick={addStep}>
                                <Plus className="mr-2 size-4"/> Add Step
                            </Button>
                        </div>
                        {steps.map((s, i) => (
                            <div key={i} className="flex items-start gap-2">
                                <Textarea
                                    placeholder={`Step ${i + 1}`}
                                    value={s.text}
                                    onChange={(e) => updateStep(i, e.target.value)}
                                    rows={2}
                                />
                                <Button type="button" variant="destructive" onClick={() => removeStep(i)}>
                                    <Trash2 className="size-4"/>
                                </Button>
                            </div>
                        ))}
                    </div>

                    <div>
                        <Button type="submit" disabled={isPending} className="w-full">
                            {isPending ? <Loader2 className="mr-2 size-4 animate-spin"/> : null}
                            Save Recipe
                        </Button>
                        {message && <p className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">{message}</p>}
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}

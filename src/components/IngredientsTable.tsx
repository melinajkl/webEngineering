import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface tableProps {

  ingredients: Array<{ ingredientname: string; amount: number; unit: string }>;
}

export function IngredientsTable(props: tableProps) {
  console.log("props in IngredientsTable:", props);
  console.log("typeof props.ingredients:", typeof props.ingredients);
  console.log("Array.isArray:", Array.isArray(props.ingredients));

  const ingredients = props.ingredients;

  // Safety check
  if (!ingredients || !Array.isArray(ingredients)) {
    console.error("ingredients is not an array:", ingredients);
    return (
      <div className="text-red-500 p-4">Error: Invalid ingredients data</div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-32" colSpan={2}>
            Amount
          </TableHead>
          <TableHead>Ingredient</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ingredients.length > 0 ? (
          ingredients.map((ingredient, index) => (
            <TableRow key={`${ingredient.ingredientname}-${index}`}>
              <TableCell className="w-20 font-medium text-right">
                {ingredient.amount}
              </TableCell>
              <TableCell className="w-12 text-left">
                {ingredient.unit}
              </TableCell>
              <TableCell>{ingredient.ingredientname}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={3} className="text-center text-gray-500">
              No ingredients available
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

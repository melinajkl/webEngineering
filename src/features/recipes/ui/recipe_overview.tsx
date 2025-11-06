import { getRecipesWithAttributes } from "@/server/db/queries/getRecipes";
import { RecipeCard } from "@/features/recipes/ui/recipe_card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/ui/pagination";
import { createShoppingListItems } from "../actions/create_shopping_list_items";
import { AwardIcon } from "lucide-react";

interface RecipeOverviewProps {
  searchParams?: { page?: string }; // ✅ no Promise here
}

const PAGE_SIZE = 12;

export default async function RecipeOverview({
  searchParams,
}: RecipeOverviewProps) {
  searchParams = await searchParams; // in case it's a Promise
  const currentPageRaw = searchParams?.page ?? "1";
  let currentPage = parseInt(currentPageRaw, 10); // ✅ radix 10

  if (Number.isNaN(currentPage) || currentPage < 1) currentPage = 1;

  const { recipes, totalCount } = await getRecipesWithAttributes({
    page: currentPage,
    pageSize: PAGE_SIZE,
  });

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE)); // avoid 0
  if (currentPage > totalPages) currentPage = totalPages;

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        if (!pages.includes(i)) pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  return (
    <div className="bg-gray-50 p-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {recipes.length === 0 ? (
          <p className="text-gray-500 text-center py-12">No recipes found.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  createAction={createShoppingListItems as unknown as (items: { ingredientId: number; amount: number; unitId: number; }[]) => Promise<void>} // ✅ pass server action from server component (cast to expected type)
                />
              ))}
            </div>

            <div className="mt-12 flex justify-center">
              <Pagination>
                <PaginationContent>
                  {hasPrevPage && (
                    <PaginationItem>
                      <PaginationPrevious href={`?page=${currentPage - 1}`} />
                    </PaginationItem>
                  )}

                  {pageNumbers.map((page, idx) => (
                    <PaginationItem key={`${page}-${idx}`}>
                      {page === "..." ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          href={`?page=${page}`}
                          isActive={page === currentPage}
                        >
                          {page}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}

                  {hasNextPage && (
                    <PaginationItem>
                      <PaginationNext href={`?page=${currentPage + 1}`} />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

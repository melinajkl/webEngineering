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

interface RecipeOverviewProps {
  searchParams: Promise<{ page?: string }>;
}

const PAGE_SIZE = 12;

export default async function RecipeOverview({
  searchParams,
}: RecipeOverviewProps) {
  const params = await searchParams;
  let currentPage = parseInt(params?.page || "1", 9);

  // Validate page number
  if (isNaN(currentPage) || currentPage < 1) {
    currentPage = 1;
  }

  const { recipes, totalCount } = await getRecipesWithAttributes({
    page: currentPage,
    pageSize: PAGE_SIZE,
  });

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  // Redirect to last page if current page exceeds total pages
  if (currentPage > totalPages && totalPages > 0) {
    currentPage = totalPages;
  }

  // Generate page numbers to display (e.g., 1 2 3 ... 10)
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

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
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>

            {/* shadcn Pagination */}
            <div className="mt-12 flex justify-center">
              <Pagination>
                <PaginationContent>
                  {/* Previous Button */}
                  {hasPrevPage && (
                    <PaginationItem>
                      <PaginationPrevious href={`?page=${currentPage - 1}`} />
                    </PaginationItem>
                  )}

                  {/* Page Numbers */}
                  {pageNumbers.map((page, index) => (
                    <PaginationItem key={index}>
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

                  {/* Next Button */}
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

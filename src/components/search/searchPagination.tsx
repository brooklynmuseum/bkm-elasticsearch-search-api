'use client';

import type { ApiSearchResponse } from '@/types';

export function SearchPagination({ searchResults }: { searchResults: ApiSearchResponse | null }) {
  if (!searchResults?.metadata?.total) {
    return <div className="italic text-sm text-muted-foreground">No results found.</div>;
  }

  return (
    <div className="italic text-sm text-muted-foreground">
      {searchResults?.metadata?.total} results.
      {searchResults?.metadata?.pages &&
        searchResults?.metadata?.pageNumber &&
        ` Page ${searchResults?.metadata?.pageNumber} of ${searchResults?.metadata?.pages}.`}
    </div>
  );
}

'use client';

import type { ApiSearchResponseMetadata } from '@/types';

export function SearchPagination({
  total,
  pages,
  pageNumber,
}: {
  total?: number;
  pages?: number;
  pageNumber?: number;
}) {
  if (!total) {
    return <div className="italic text-sm text-muted-foreground">No results found.</div>;
  }

  return (
    <div className="italic text-sm text-muted-foreground">
      {total} results.
      {pages && pageNumber && ` Page ${pageNumber} of ${pages}.`}
    </div>
  );
}

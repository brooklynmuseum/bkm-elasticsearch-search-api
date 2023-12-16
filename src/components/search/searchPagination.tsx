'use client';

import type { ApiSearchResponseMetadata } from '@/types';

export function SearchPagination({ metadata }: { metadata: ApiSearchResponseMetadata }) {
  if (!metadata || !metadata.total) {
    return <div className="italic text-sm text-muted-foreground">No results found.</div>;
  }

  return (
    <div className="italic text-sm text-muted-foreground">
      {metadata.total} results
      {metadata.pages && ` in ${metadata.pages} pages`}
    </div>
  );
}

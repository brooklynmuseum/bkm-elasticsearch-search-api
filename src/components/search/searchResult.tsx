'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import type { ElasticsearchDocument } from '@/types';

export function SearchResult({ result }: { result: ElasticsearchDocument }) {
  return (
    <Link href={result.url || ''} passHref>
      <Card className="cursor-pointer transition-all hover:bg-accent hover:text-accent-foreground">
        <div className="flex items-center justify-between p-4">
          <div>
            <CardTitle className="text-base">{result.title}</CardTitle>
            <CardDescription className="uppercase font-semibold">{result.type}</CardDescription>
          </div>
          {result.imageUrl && (
            <Image
              className="w-12 h-12 rounded-lg object-cover"
              src={result.imageUrl}
              alt={result.title || 'result image'}
              width={48}
              height={48}
            />
          )}
        </div>
        {result.description && (
          <CardContent className="px-4 pb-4 text-sm">{result.description}</CardContent>
        )}
      </Card>
    </Link>
  );
}

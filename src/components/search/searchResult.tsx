'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { ElasticsearchDocument } from '@/types';

export function SearchResult({ result }: { result: ElasticsearchDocument }) {
  return (
    <Card className="cursor-pointer transition-all hover:bg-accent hover:text-accent-foreground">
      <CardHeader className="p-4">
        <CardTitle className="text-base">{result.title}</CardTitle>
        <CardDescription className="uppercase font-semibold">{result.type}</CardDescription>
      </CardHeader>
      {result.description && (
        <CardContent className="px-4 pb-4 text-sm">{result.description}</CardContent>
      )}
      {result.url && (
        <CardFooter>
          <Link href={result.url} passHref>
            Link
          </Link>
        </CardFooter>
      )}
    </Card>
  );
}

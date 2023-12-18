'use client';

import { Card, CardTitle } from '@/components/ui/card';
import type { AggOption } from '@/types';

export function AggOptionResult({ result }: { result: AggOption }) {
  return (
    <Card className="cursor-pointer transition-all hover:bg-accent hover:text-accent-foreground">
      <CardTitle className="text-base p-4">
        {result.key}
        <span className="text-muted-foreground">{result.doc_count}</span>
      </CardTitle>
    </Card>
  );
}

'use client';

import { Card, CardTitle } from '@/components/ui/card';
import type { AggOption } from '@/types';

export function AggOptionResult({ result }: { result: AggOption }) {
  return (
    <Card className="cursor-pointer transition-all hover:bg-accent hover:text-accent-foreground">
      <CardTitle className="text-base p-4">
        <div className="flex items-center content-end">
          <div className="flex-grow">{result.key}</div>
          <div className="text-muted-foreground">{result.doc_count}</div>
        </div>
      </CardTitle>
    </Card>
  );
}

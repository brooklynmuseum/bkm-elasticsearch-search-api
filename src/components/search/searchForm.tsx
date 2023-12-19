'use client';

import { useState, Key } from 'react';
import { SearchResult } from './searchResult';
import { AggOptionResult } from './aggOptionResult';
import { SearchPagination } from './searchPagination';
import { SearchAsYouTypeForm } from './searchAsYouTypeForm';
import { AggOptionsForm } from './aggOptionsForm';
import { FacetedSearchForm } from './facetedSearchForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Code2Icon, ListIcon, MessageCircleWarningIcon } from 'lucide-react';
import type { ApiSearchResponse, ElasticsearchDocument, AggOption } from '@/types';

export function SearchForm() {
  const [url, setUrl] = useState('');
  const [searchResults, setSearchResults] = useState<ApiSearchResponse | null>(null);
  const [error, setError] = useState('');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {error && (
        <div className="flex flex-col gap-4 col-span-2">
          <Alert variant="destructive">
            <MessageCircleWarningIcon className="h-5 w-5" />
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}
      <div className="flex flex-col gap-4">
        <div className="mb-4">
          <SearchAsYouTypeForm
            setSearchResults={setSearchResults}
            setUrl={setUrl}
            setError={setError}
          />
        </div>
        <div className="mb-4">
          <AggOptionsForm setSearchResults={setSearchResults} setUrl={setUrl} setError={setError} />
        </div>
        <div className="mb-4">
          <FacetedSearchForm
            setSearchResults={setSearchResults}
            setUrl={setUrl}
            setError={setError}
          />
        </div>
      </div>
      <div className="">
        <Tabs defaultValue="results">
          <TabsList className="mb-4 flex items-center justify-center">
            <TabsTrigger value="results" className="w-full">
              <ListIcon className="w-5 h-5 mr-2" />
              Results
            </TabsTrigger>
            <TabsTrigger value="inspect" className="w-full">
              <Code2Icon className="w-5 h-5 mr-2" />
              Inspect
            </TabsTrigger>
          </TabsList>
          <TabsContent value="results">
            <div className="mb-4">
              <SearchPagination searchResults={searchResults} />
            </div>
            {searchResults && searchResults.data?.length > 0 && (
              <div className="grid grid-cols-1 gap-2">
                {searchResults.data.map((result: ElasticsearchDocument | AggOption, i: Key) =>
                  'key' in result ? (
                    <AggOptionResult key={i} result={result as AggOption} />
                  ) : (
                    <SearchResult key={i} result={result as ElasticsearchDocument} />
                  ),
                )}
              </div>
            )}
          </TabsContent>
          <TabsContent value="inspect">
            <div className="flex flex-col gap-4 overflow-auto">
              <SearchPagination searchResults={searchResults} />
              <pre className="rounded-md bg-neutral-950 p-4 overflow-x-auto overflow-y-auto font-mono text-sm text-white">
                <code>{url}</code>
              </pre>
              <pre className="h-[80vh] rounded-md bg-neutral-950 p-4 overflow-x-auto overflow-y-auto font-mono text-sm text-white">
                <code>{JSON.stringify(searchResults, null, 2)}</code>
              </pre>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

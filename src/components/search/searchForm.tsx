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
    <div className="grid grid-cols-1 md:grid-cols-12 md:h-screen">
      {error && (
        <div className="flex flex-col gap-4 col-span-1 md:col-span-12 p-4">
          <Alert variant="destructive">
            <MessageCircleWarningIcon className="h-5 w-5" />
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}
      {/* Left pane */}
      <div className="bg-neutral-50 md:col-span-6 lg:col-span-4 xl:col-span-3 flex flex-col gap-2 p-4 overflow-auto md:pb-12">
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
      {/* Right pane */}
      <div className="md:col-span-6 lg:col-span-8 xl:col-span-9 overflow-auto p-4 md:pb-12">
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
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2">
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
            <div className="flex flex-col gap-4">
              <SearchPagination searchResults={searchResults} />
              <pre className="rounded-md bg-neutral-950 p-4 overflow-x-auto font-mono text-sm text-white">
                <code>{url}</code>
              </pre>
              <pre className="rounded-md bg-neutral-950 p-4 overflow-x-auto font-mono text-sm text-white">
                <code>{JSON.stringify(searchResults, null, 2)}</code>
              </pre>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect, ChangeEvent, Key } from 'react';
import { SearchResult } from './searchResult';
import { SearchPagination } from './searchPagination';
import { useDebounce } from '@/lib/debounce';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  SearchIcon,
  Code2Icon,
  ListIcon,
  MessageCircleWarningIcon,
  XIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react';
import type {
  ApiSearchResponse,
  ApiSearchResponseMetadata,
  ElasticsearchDocument,
  AggOption,
} from '@/types';
import { aggFields } from '@/lib/elasticsearch/config/indexSettings';

export function SearchForm() {
  const [searchAsYouType, setSearchAsYouType] = useState('');
  const [formState, setFormState] = useState({
    searchAsYouType: '',
    searchQuery: '',
    pageNumber: 1,
    aggFieldValues: {} as Record<string, string>,
  });
  const [url, setUrl] = useState('');
  const [searchResults, setSearchResults] = useState<ApiSearchResponse | null>(null);
  const [metadata, setMetadata] = useState<ApiSearchResponseMetadata>({});
  const [error, setError] = useState('');

  const debouncedSuggest = useDebounce(() => {
    const myQuery = searchAsYouType?.trim();
    setSearchResults(null);
    if (myQuery?.length < 3) {
      return;
    }
    if (myQuery) {
      const currentUrl = `/api/searchAsYouType?query=${myQuery}`;
      setUrl(currentUrl);

      fetch(currentUrl)
        .then((res) => res.json())
        .then((data) => {
          setMetadata(data.metadata);
          setSearchResults(data);
        })
        .catch((error) => {
          console.error('Error fetching search results:', error);
          setError(error?.message);
          setSearchResults(null);
        });
    }
  }, 50);

  const onSearchAsYouTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchAsYouType(e.target.value);
    debouncedSuggest();
  };

  const fetchSearchResults = async (querystring?: string) => {
    const currentUrl = querystring ? `/api/search?${querystring}` : '/api/search';
    setUrl(currentUrl);
    setSearchResults(null);
    try {
      const response = await fetch(currentUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data = await response.json();
      if (data?.metadata) {
        setMetadata(data.metadata);
      }
      setSearchResults(data);
    } catch (error: any) {
      console.error('Error fetching search results:', error);
      setError(error?.message);
      setSearchResults(null);
    }
  };

  const debouncedSearch = useDebounce(() => {
    executeSearch();
  }, 300);

  const executeSearch = async () => {
    const queryParams = new URLSearchParams();
    if (formState.searchQuery) {
      queryParams.append('query', formState.searchQuery);
    }
    queryParams.append('page', formState.pageNumber.toString());
    for (const field of aggFields) {
      const value = formState.aggFieldValues[field];
      if (value && value !== '-1') {
        queryParams.append(field, value);
      }
    }
    await fetchSearchResults(queryParams.toString());
  };

  useEffect(() => {
    debouncedSearch();
  }, [debouncedSearch, formState]);

  const handleSearchQueryInputChange = (value: string) => {
    const newSearch = {
      searchAsYouType: '',
      searchQuery: value,
      pageNumber: 1,
      aggFieldValues: {} as Record<string, string>,
    };
    setFormState(newSearch);
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormState({ ...formState, aggFieldValues: { ...formState.aggFieldValues, [field]: value } });
  };

  const handlePageChange = (newPageNumber: number) => {
    setFormState({ ...formState, pageNumber: newPageNumber });
  };

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
          <h2 className="text-lg font-bold mb-4">Search as you type</h2>
          <Input
            type="search"
            id="searchAsYouType"
            placeholder="Type here..."
            onChange={onSearchAsYouTypeChange}
            value={searchAsYouType}
            autoComplete="off"
          />
        </div>
        <h2 className="text-lg font-bold">Faceted Search</h2>
        <div className="grid items-center gap-1.5">
          <Label htmlFor="searchQuery">Search Query</Label>
          <Input
            id="searchQuery"
            className=""
            value={formState.searchQuery}
            onChange={(e) => handleSearchQueryInputChange(e.target.value)}
          />
        </div>

        {searchResults &&
          aggFields?.map(
            (field) =>
              searchResults.options?.[field]?.length > 0 && (
                <div key={field} className="grid items-center gap-1.5">
                  <Label htmlFor="docType">{field}</Label>
                  <div className="flex items-center gap-x-2">
                    <Select
                      value={formState.aggFieldValues[field]}
                      onValueChange={(value) => handleSelectChange(field, value)}
                    >
                      <SelectTrigger className="">
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="-1">All</SelectItem>
                        {searchResults.options[field].map((agg: AggOption) => (
                          <SelectItem key={agg.key} value={agg.key}>
                            {agg.key}
                            <span className="text-muted-foreground ml-2">{agg.doc_count}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ),
          )}

        <div className="flex items-center gap-x-2">
          <Button
            disabled={formState.pageNumber <= 1}
            className="w-full"
            variant="secondary"
            onClick={() => handlePageChange(formState.pageNumber - 1)}
          >
            <ChevronLeftIcon className="w-5 h-5 mr-2" />
            <span className="hidden sm:inline-block">Previous</span>
          </Button>
          <Button
            disabled={metadata.pages !== undefined && formState.pageNumber >= metadata.pages}
            className="w-full"
            variant="secondary"
            onClick={() => handlePageChange(formState.pageNumber + 1)}
          >
            <span className="hidden sm:inline-block">Next</span>
            <ChevronRightIcon className="w-5 h-5 ml-2" />
          </Button>
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
              <SearchPagination
                total={metadata.total}
                pages={metadata.pages}
                pageNumber={formState.pageNumber}
              />
            </div>
            {searchResults && searchResults.data?.length > 0 && (
              <div className="grid grid-cols-1 gap-2">
                {searchResults.data.map((result: ElasticsearchDocument, i: Key) => (
                  <SearchResult key={i} result={result} />
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="inspect">
            <div className="flex flex-col gap-4 overflow-auto">
              <SearchPagination
                total={metadata.total}
                pages={metadata.pages}
                pageNumber={formState.pageNumber}
              />
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

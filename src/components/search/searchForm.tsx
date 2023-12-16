'use client';

import { useState, FormEvent, ChangeEvent, KeyboardEvent } from 'react';
import { SearchResult } from './searchResult';
import { useDebounce } from '@/lib/debounce';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
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
import { SearchIcon, Code2Icon, ListIcon, MessageCircleWarningIcon } from 'lucide-react';
import type { ApiSearchResponse, ApiSearchResponseMetadata, ElasticsearchDocument } from '@/types';

export function SearchForm() {
  const [searchAsYouType, setSearchAsYouType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [docType, setDocType] = useState('');
  const [url, setUrl] = useState('');
  const [searchResults, setSearchResults] = useState<ApiSearchResponse | null>(null);
  const [metadata, setMetadata] = useState<ApiSearchResponseMetadata>({});
  const [error, setError] = useState('');

  const docTypes = ['collectionObject', 'collectionArtist', 'exhibition', 'page', 'product'];

  const debouncedSuggest = useDebounce(() => {
    const myQuery = searchAsYouType?.trim();
    setSearchResults(null);
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

  // Function to fetch the API endpoint
  const fetchSearchResults = async () => {
    const queryParams = new URLSearchParams();
    setUrl('');
    setSearchResults(null);
    if (searchQuery) {
      queryParams.append('query', searchQuery);
    }
    if (docType && docType !== '-1') {
      queryParams.append('type', docType);
    }
    const currentUrl = `/api/search?${queryParams}`;
    setUrl(currentUrl);

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
      setSearchResults(data); // Pretty print JSON
    } catch (error: any) {
      console.error('Error fetching search results:', error);
      setError(error?.message);
      setSearchResults(null);
    }
  };

  // Event handler for the search button
  const handleSearchClick = () => {
    fetchSearchResults();
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      fetchSearchResults();
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
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
        <div>
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
        <h2 className="text-lg font-bold">Regular Search</h2>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="searchQuery">Search Query</Label>
          <Input
            id="searchQuery"
            className=""
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="docType">Type</Label>
          <Select value={docType} onValueChange={(value) => setDocType(value)}>
            <SelectTrigger className="">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="-1">All Types</SelectItem>
              {docTypes.map((docType) => (
                <SelectItem key={docType} value={docType}>
                  {docType}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleSearchClick}>
          <SearchIcon className="w-5 h-5 mr-2" />
          Search
        </Button>
      </div>
      <div className="">
        <Tabs defaultValue="inspect">
          <TabsList className="mb-4">
            <TabsTrigger value="results">
              <ListIcon className="w-5 h-5 mr-2" />
              Results
            </TabsTrigger>
            <TabsTrigger value="inspect">
              <Code2Icon className="w-5 h-5 mr-2" />
              Inspect
            </TabsTrigger>
          </TabsList>
          <TabsContent value="results">
            {searchResults && searchResults.data?.length > 0 && (
              <div className="grid grid-cols-1 gap-2">
                {searchResults.data.map((result: ElasticsearchDocument) => (
                  <SearchResult key={result._id} result={result} />
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="inspect">
            <div className="flex flex-col gap-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="url">URL</Label>
                <Input id="url" className="bg-muted" value={url} readOnly />
              </div>
              {metadata?.total ? (
                <div className="italic text-sm text-muted-foreground">
                  {metadata.total} results
                  {metadata.pages && ` in ${metadata.pages} pages`}
                </div>
              ) : (
                <div className="italic text-sm text-muted-foreground">No results found.</div>
              )}
              <Textarea
                className="h-[80vh] bg-muted"
                value={searchResults ? JSON.stringify(searchResults, null, 2) : ''}
                readOnly // Making this textarea read-only since it's for displaying results
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
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
import { SearchIcon } from 'lucide-react';

export function SearchForm() {
  const [searchAsYouType, setSearchAsYouType] = useState('');
  const [searchAsYouTypeResults, setSearchAsYouTypeResults] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [docType, setDocType] = useState('');
  const [url, setUrl] = useState('');
  const [searchResults, setSearchResults] = useState('');
  const [metadata, setMetadata] = useState({});

  const docTypes = ['collectionObject', 'collectionArtist', 'exhibition', 'page', 'product'];

  const debouncedSuggest = useDebounce(() => {
    const myQuery = searchAsYouType?.trim();
    setSearchResults('');
    setSearchResults('');
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
          setSearchResults(JSON.stringify(data, null, 2));
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
    setSearchResults('');
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
      const data = await response.json();

      if (data?.metadata) {
        setMetadata(data.metadata);
      }

      setSearchResults(JSON.stringify(data, null, 2)); // Pretty print JSON
    } catch (error) {
      console.error('Error fetching search results:', error);
      setSearchResults(JSON.stringify(error, null, 2));
    }
  };

  // Event handler for the search button
  const handleSearchClick = () => {
    fetchSearchResults();
  };

  const handleKeyPress = (event: FormEvent) => {
    if (event.key === 'Enter') {
      fetchSearchResults();
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-2xl font-bold">Playground</h1>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-lg font-bold">Search as you type</h2>
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
            <Select
              id="docType"
              className=""
              value={docType}
              onValueChange={(value) => setDocType(value)}
            >
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
        <div className="flex flex-col gap-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="url">URL</Label>
            <Input id="url" className="" value={url} />
          </div>
          {metadata?.count ? (
            <div className="italic text-sm text-muted-foreground">
              {metadata.count} results
              {metadata.pages && ` in ${metadata.pages} pages`}
            </div>
          ) : (
            <div className="italic text-sm text-muted-foreground">No results found.</div>
          )}
          <Textarea
            className="h-80 md:h-screen"
            value={searchResults}
            readOnly // Making this textarea read-only since it's for displaying results
          />
        </div>
      </div>
    </>
  );
}

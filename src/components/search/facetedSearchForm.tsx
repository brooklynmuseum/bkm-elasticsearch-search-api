'use client';

import { useEffect, useState, FC } from 'react';
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
import { useDebounce } from '@/lib/debounce';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import type { ApiSearchResponse, AggOption } from '@/types';
import { aggFields } from '@/lib/elasticsearch/config/indexSettings';

type FacetedSearchFormProps = {
  setSearchResults: (results: ApiSearchResponse | null) => void;
  setUrl: (url: string) => void;
  setError: (error: string) => void;
};

export const FacetedSearchForm: FC<FacetedSearchFormProps> = ({
  setSearchResults,
  setUrl,
  setError,
}) => {
  const [searchResults, setSearchResultsLocal] = useState<ApiSearchResponse | null>(null);
  const [formState, setFormState] = useState({
    searchQuery: '',
    pageNumber: 1,
    aggFieldValues: {} as Record<string, string>,
    size: '24',
  });

  const debouncedSearch = useDebounce(() => {
    executeSearch();
  }, 300);

  const executeSearch = async () => {
    const queryParams = new URLSearchParams();
    if (formState.searchQuery) {
      queryParams.append('query', formState.searchQuery);
    }
    queryParams.append('page', formState.pageNumber.toString());
    queryParams.append('size', formState.size);

    aggFields.forEach((field) => {
      const value = formState.aggFieldValues[field];
      if (value && value !== '-1') {
        queryParams.append(field, value);
      }
    });

    const currentUrl = `/api/search?${queryParams.toString()}`;
    setUrl(currentUrl);

    try {
      const response = await fetch(currentUrl);
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data = await response.json();
      console.log('yyy', data);
      setSearchResultsLocal(data);
      setSearchResults(data);
    } catch (error: any) {
      console.error('Error fetching search results:', error);
      setError(error?.message);
      setSearchResultsLocal(null);
      setSearchResults(null);
    }
  };

  useEffect(() => {
    const defaultSearch = async () => {
      try {
        const defaultUrl = `/api/search`;
        setUrl(defaultUrl);
        const response = await fetch(defaultUrl);
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        const data = await response.json();
        console.log('yyy', data);
        setSearchResultsLocal(data);
        setSearchResults(data);
      } catch (error: any) {
        setError(error?.message);
        setSearchResultsLocal(null);
        setSearchResults(null);
      }
    };
    defaultSearch();
  }, [setError, setSearchResultsLocal, setSearchResults, setUrl]);

  const handleSearchQueryInputChange = (value: string) => {
    setFormState({ ...formState, searchQuery: value, pageNumber: 1 });
    debouncedSearch();
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormState({
      ...formState,
      aggFieldValues: { ...formState.aggFieldValues, [field]: value },
      pageNumber: 1,
    });
    debouncedSearch();
  };

  const handlePageChange = (newPageNumber: number) => {
    setFormState({ ...formState, pageNumber: newPageNumber });
    debouncedSearch();
  };

  const handleSizeChange = (value: string) => {
    setFormState({ ...formState, size: value, pageNumber: 1 });
    debouncedSearch();
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-bold">Faceted Search</h2>
      <div className="grid items-center gap-1.5">
        <Label htmlFor="searchQuery">Search Query</Label>
        <Input
          id="searchQuery"
          value={formState.searchQuery}
          onChange={(e) => handleSearchQueryInputChange(e.target.value)}
        />
      </div>

      {searchResults &&
        aggFields.map(
          (field) =>
            searchResults.options?.[field]?.length > 0 && (
              <div key={field} className="grid items-center gap-1.5">
                <Label htmlFor={field}>{field}</Label>
                <Select
                  value={formState.aggFieldValues[field]}
                  onValueChange={(value) => handleSelectChange(field, value)}
                >
                  <SelectTrigger>
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
            ),
        )}

      <div className="flex items-center gap-x-2">
        <Select value={formState.size} onValueChange={(value) => handleSizeChange(value)}>
          <SelectTrigger>
            <SelectValue placeholder="" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="12">12</SelectItem>
            <SelectItem value="24">24</SelectItem>
            <SelectItem value="48">48</SelectItem>
          </SelectContent>
        </Select>
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
          disabled={
            searchResults?.metadata?.pages !== undefined &&
            formState.pageNumber >= searchResults?.metadata?.pages
          }
          className="w-full"
          variant="secondary"
          onClick={() => handlePageChange(formState.pageNumber + 1)}
        >
          <span className="hidden sm:inline-block">Next</span>
          <ChevronRightIcon className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};
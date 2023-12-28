'use client';

import { useState, ChangeEvent, FC } from 'react';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/lib/debounce';
import type { ApiSearchResponse } from '@/types';

type SearchAsYouTypeFormProps = {
  setSearchResults: (results: ApiSearchResponse | null) => void;
  setUrl: (url: string) => void;
  setError: (error: string) => void;
};

export const SearchAsYouTypeForm: FC<SearchAsYouTypeFormProps> = ({
  setSearchResults,
  setUrl,
  setError,
}) => {
  const [searchAsYouType, setSearchAsYouType] = useState('');

  const debouncedSuggest = useDebounce(() => {
    const myQuery = searchAsYouType?.trim();
    setSearchResults(null);
    if (myQuery?.length < 2) {
      return;
    }
    if (myQuery) {
      const currentUrl = `/api/searchAsYouType?query=${myQuery}`;
      setUrl(currentUrl);

      fetch(currentUrl)
        .then((res) => res.json())
        .then((data) => {
          setSearchResults(data);
        })
        .catch((error) => {
          console.error('Error fetching search-as-you-type results:', error);
          setError(error?.message);
          setSearchResults(null);
        });
    }
  }, 50);

  const onSearchAsYouTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchAsYouType(e.target.value);
    debouncedSuggest();
  };

  return (
    <>
      <h2 className="text-lg font-bold mb-2">Search as you type</h2>
      <Input
        type="search"
        id="searchAsYouType"
        placeholder="Type here..."
        onChange={onSearchAsYouTypeChange}
        value={searchAsYouType}
        autoComplete="off"
      />
    </>
  );
};

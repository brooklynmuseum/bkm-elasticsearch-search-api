'use client';

import { useState, ChangeEvent, FC, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import type { ApiSearchResponse, ElasticsearchDocument } from '@/types';

type SearchAsYouTypeFormProps = {
  setSearchResults: (results: ApiSearchResponse | null) => void;
  setUrl: (url: string) => void;
  setError: (error: string) => void;
};

export const SearchAsYouTypeStreamForm: FC<SearchAsYouTypeFormProps> = ({
  setSearchResults,
  setUrl,
  setError,
}) => {
  const [searchAsYouType, setSearchAsYouType] = useState('');

  const fetchStreamingResults = async (query: string) => {
    setSearchResults(null);
    setUrl(`/api/searchAsYouTypeStream?query=${query}`);

    try {
      const response = await fetch(`/api/searchAsYouTypeStream?query=${query}`);
      const reader = response.body?.getReader();
      let done,
        value,
        resultString = '';

      if (!reader) {
        throw new Error('No reader');
      }

      while (({ done, value } = await reader.read()) && !done) {
        resultString += new TextDecoder().decode(value);
      }

      const results: ElasticsearchDocument[] = JSON.parse(resultString);
      setSearchResults({ data: results });
    } catch (error: any) {
      console.error('Error fetching streaming search-as-you-type results:', error);
      setError(error?.message);
      setSearchResults(null);
    }
  };

  const onSearchAsYouTypeChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.trim();
    setSearchAsYouType(query);
    if (query.length >= 2) {
      await fetchStreamingResults(query);
    }
  };

  return (
    <>
      <h2 className="text-lg font-bold mb-2">Search as you type (Streaming)</h2>
      <Input
        type="search"
        id="searchAsYouTypeStream"
        placeholder="Type here..."
        onChange={onSearchAsYouTypeChange}
        value={searchAsYouType}
        autoComplete="off"
      />
    </>
  );
};

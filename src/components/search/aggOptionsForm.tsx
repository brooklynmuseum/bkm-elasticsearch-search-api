'use client';

import { useState, ChangeEvent, FC } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/lib/debounce';
import { aggFields } from '@/lib/elasticsearch/config/indexSettings';
import type { ApiSearchResponse } from '@/types';

type AggOptionsFormProps = {
  setSearchResults: (results: ApiSearchResponse | null) => void;
  setUrl: (url: string) => void;
  setError: (error: string) => void;
};

export const AggOptionsForm: FC<AggOptionsFormProps> = ({ setSearchResults, setUrl, setError }) => {
  const [optionsQuery, setOptionsQuery] = useState('');
  const [optionsField, setOptionsField] = useState('primaryConstituent.name');

  const debouncedOptions = useDebounce(() => {
    const myQuery = optionsQuery?.trim();
    setSearchResults(null);
    if (myQuery?.length < 2) {
      return;
    }
    if (myQuery) {
      const currentUrl = `/api/options?field=${optionsField}&query=${myQuery}`;
      setUrl(currentUrl);

      fetch(currentUrl)
        .then((res) => res.json())
        .then((data) => {
          setSearchResults(data);
        })
        .catch((error) => {
          console.error('Error fetching options:', error);
          setError(error?.message);
          setSearchResults(null);
        });
    }
  }, 50);

  const onOptionsQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOptionsQuery(e.target.value);
    debouncedOptions();
  };

  return (
    <div className="">
      <h2 className="text-lg font-bold mb-4">Aggregations Options</h2>
      <div className="grid grid-cols-2 items-center gap-x-2">
        <Input
          type="search"
          id="options"
          placeholder="Type here..."
          onChange={onOptionsQueryChange}
          value={optionsQuery}
          autoComplete="off"
        />
        <Select value={optionsField} onValueChange={setOptionsField}>
          <SelectTrigger>
            <SelectValue placeholder="" />
          </SelectTrigger>
          <SelectContent>
            {aggFields.map((field: string) => (
              <SelectItem key={field} value={field}>
                {field}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

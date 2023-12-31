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
import { Switch } from '@/components/ui/switch';
import { DatePickerWithRange } from './datePickerWithRange';
import { useDebounce } from '@/lib/debounce';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import type { ApiSearchResponse, AggOption } from '@/types';
import { aggFields } from '@/lib/elasticsearch/config/indexSettings';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { allTopSearchQuerySets } from './topSearches2023';

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
    startDate: '',
    endDate: '',
    startYear: '',
    endYear: '',
    language: '',
    visible: false,
    publicAccess: false,
    hasImage: false,
    isNow: false,
    rawSource: false,
  });
  const [tempSearchQuery, setTempSearchQuery] = useState<string>('');

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
    if (formState.visible === true) {
      queryParams.append('visible', 'true');
    }
    if (formState.publicAccess === true) {
      queryParams.append('publicAccess', 'true');
    }
    if (formState.hasImage === true) {
      queryParams.append('hasImage', 'true');
    }
    if (formState.isNow === true) {
      queryParams.append('isNow', 'true');
    }
    if (formState.startDate && formState.endDate) {
      queryParams.append('startDate', formState.startDate);
      queryParams.append('endDate', formState.endDate);
    }
    if (formState.rawSource === true) {
      queryParams.append('rawSource', 'true');
    }
    if (formState.startYear) {
      queryParams.append('startYear', formState.startYear);
    }
    if (formState.endYear) {
      queryParams.append('endYear', formState.endYear);
    }
    if (formState.language) {
      queryParams.append('language', formState.language);
    }

    const currentUrl = `/api/search?${queryParams.toString()}`;
    setUrl(currentUrl);

    try {
      const response = await fetch(currentUrl);
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data = await response.json();
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
    if (value === '-1') return;
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

  const handleDateRangeChange = (newDateRange: DateRange | undefined) => {
    if (newDateRange?.from && newDateRange?.to) {
      console.log(
        'newDateRange',
        format(newDateRange.from, 'yyyy-MM-dd'),
        format(newDateRange.to, 'yyyy-MM-dd'),
      );
      setFormState({
        ...formState,
        startDate: format(newDateRange.from, 'yyyy-MM-dd'),
        endDate: format(newDateRange.to, 'yyyy-MM-dd'),
        pageNumber: 1,
      });
    } else {
      setFormState({
        ...formState,
        startDate: '',
        endDate: '',
        pageNumber: 1,
      });
    }
    debouncedSearch();
  };

  const handleFormValueChange = (field: string, value: string | boolean) => {
    setFormState({ ...formState, [field]: value, pageNumber: 1 });
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
    <div className="flex flex-col gap-2">
      <h2 className="text-lg font-bold">Faceted Search</h2>
      <div className="">
        <Input
          id="searchQuery"
          value={formState.searchQuery}
          placeholder="Type here..."
          onChange={(e) => handleSearchQueryInputChange(e.target.value)}
        />
      </div>

      <div className="bg-neutral-200 p-3 rounded-md flex flex-col gap-1.5">
        <Label className="text-sm leading-none mb-2">Test Top Search Queries for 2023</Label>
        {allTopSearchQuerySets.map((querySet) => (
          <div className="" key={querySet.name}>
            <Select
              value={tempSearchQuery}
              onValueChange={(value) => handleSearchQueryInputChange(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={querySet.name} />
              </SelectTrigger>
              <SelectContent>
                {querySet.queries.map((value: string) => (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>

      {searchResults &&
        aggFields.map(
          (field) =>
            searchResults.options &&
            searchResults.options?.[field]?.length > 0 && (
              <div key={field} className="">
                <Select
                  value={formState.aggFieldValues[field]}
                  onValueChange={(value) => handleSelectChange(field, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={`All ${field}`} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="-1">All {field}</SelectItem>
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

      <div className="">
        <DatePickerWithRange id="dateRange" onDateChange={handleDateRangeChange} />
      </div>

      <div className="flex items-center gap-x-4">
        <div className="">
          <Input
            id="startYear"
            placeholder="Start Year"
            value={formState.startYear}
            onChange={(e) => handleFormValueChange('startYear', e.target.value)}
          />
        </div>
        <div className="">
          <Input
            id="endYear"
            placeholder="End Year"
            value={formState.endYear}
            onChange={(e) => handleFormValueChange('endYear', e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="flex items-center gap-x-2">
          <Switch
            id="visible"
            onCheckedChange={(checked) => handleFormValueChange('visible', checked)}
            checked={formState.visible}
            aria-labelledby={'label-visible'}
          />
          <Label
            htmlFor="visible"
            id={'label-visible'}
            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            On View
          </Label>
        </div>
        <div className="flex items-center gap-x-2">
          <Switch
            id="publicAccess"
            onCheckedChange={(checked) => handleFormValueChange('publicAccess', checked)}
            checked={formState.publicAccess}
            aria-labelledby={'label-publicAccess'}
          />
          <Label
            htmlFor="publicAccess"
            id={'label-publicAccess'}
            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Public Access
          </Label>
        </div>
        <div className="flex items-center gap-x-2">
          <Switch
            id="hasImage"
            onCheckedChange={(checked) => handleFormValueChange('hasImage', checked)}
            checked={formState.hasImage}
            aria-labelledby={'label-hasImage'}
          />
          <Label
            htmlFor="hasImage"
            id={'label-hasImage'}
            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Has Image
          </Label>
        </div>
        <div className="flex items-center gap-x-2">
          <Switch
            id="isNow"
            onCheckedChange={(checked) => handleFormValueChange('isNow', checked)}
            checked={formState.isNow}
            aria-labelledby={'label-isNow'}
          />
          <Label
            htmlFor="isNow"
            id={'label-isNow'}
            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            What&apos;s on Now?
          </Label>
        </div>
        <div className="flex items-center gap-x-2">
          <Switch
            id="rawSource"
            onCheckedChange={(checked) => handleFormValueChange('rawSource', checked)}
            checked={formState.rawSource}
            aria-labelledby={'label-rawSource'}
          />
          <Label
            htmlFor="rawSource"
            id={'label-rawSource'}
            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Include Raw Source
          </Label>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-y-2 gap-x-4">
        <Select
          value={formState.language}
          onValueChange={(value) => handleFormValueChange('language', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en-US">English</SelectItem>
            <SelectItem value="es-US">Spanish</SelectItem>
          </SelectContent>
        </Select>
        <Select value={formState.size} onValueChange={(value) => handleSizeChange(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Results per page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="12">12</SelectItem>
            <SelectItem value="24">24</SelectItem>
            <SelectItem value="48">48</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-y-2 gap-x-4">
        <Button
          disabled={formState.pageNumber <= 1}
          className="w-full"
          variant="default"
          onClick={() => handlePageChange(formState.pageNumber - 1)}
        >
          <ChevronLeftIcon className="w-5 h-5 mr-2" />
          <span className="">Previous</span>
        </Button>
        <Button
          disabled={
            searchResults?.metadata?.pages !== undefined &&
            formState.pageNumber >= searchResults?.metadata?.pages
          }
          className="w-full"
          variant="default"
          onClick={() => handlePageChange(formState.pageNumber + 1)}
        >
          <span className="">Next</span>
          <ChevronRightIcon className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};

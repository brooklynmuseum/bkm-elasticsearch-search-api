import { SearchForm } from '@/components/search/searchForm';
import { Separator } from '@/components/ui/separator';

export default function Page() {
  return (
    <div className="rounded-[0.5rem] border bg-background shadow">
      <div className="container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
        <h2 className="text-lg font-semibold">Playground</h2>
      </div>
      <Separator />
      <div className="container py-4">
        <SearchForm />
      </div>
    </div>
  );
}

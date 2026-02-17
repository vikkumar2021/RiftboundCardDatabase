import { CardGrid } from '@/components/CardGrid';
import { FilterSidebar } from '@/components/FilterSidebar';
import { SearchBar } from '@/components/SearchBar';

export default function CardsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Card Database</h1>
        <SearchBar />
      </div>

      <div className="flex gap-8">
        <aside className="w-64 flex-shrink-0">
          <FilterSidebar />
        </aside>

        <main className="flex-1">
          <CardGrid />
        </main>
      </div>
    </div>
  );
}

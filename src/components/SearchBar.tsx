import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
  currentQuery: string;
}

const SearchBar = ({ isOpen, onClose, onSearch, currentQuery }: SearchBarProps) => {
  const [query, setQuery] = useState(currentQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20">
      <div className="bg-background w-full max-w-2xl mx-4 rounded-lg shadow-lg animate-fade-in">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search movies by title, genre, or category..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 text-lg"
              autoFocus
            />
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              Search
            </Button>
            {query && (
              <Button type="button" variant="outline" onClick={handleClear}>
                Clear
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;
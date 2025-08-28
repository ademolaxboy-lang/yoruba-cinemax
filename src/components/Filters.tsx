import { FilterCategory, SortOption } from '@/types/movie';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FiltersProps {
  category: FilterCategory;
  onCategoryChange: (category: FilterCategory) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  releaseYear: string;
  onYearChange: (year: string) => void;
  availableYears: string[];
}

const Filters = ({
  category,
  onCategoryChange,
  sortBy,
  onSortChange,
  releaseYear,
  onYearChange,
  availableYears
}: FiltersProps) => {
  const categories: { value: FilterCategory; label: string }[] = [
    { value: 'all', label: 'All Categories' },
    { value: 'drama', label: 'Drama' },
    { value: 'comedy', label: 'Comedy' },
    { value: 'action', label: 'Action' },
    { value: 'romance', label: 'Romance' },
    { value: 'thriller', label: 'Thriller' }
  ];

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'popularity', label: 'Most Popular' }
  ];

  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-4 mb-6">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-foreground">Category:</span>
          <Select value={category} onValueChange={onCategoryChange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-foreground">Sort by:</span>
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-foreground">Year:</span>
          <Select value={releaseYear} onValueChange={onYearChange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {availableYears.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default Filters;
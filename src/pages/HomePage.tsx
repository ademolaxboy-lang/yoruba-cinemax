import { useState, useEffect, useMemo } from 'react';
import { Movie, FilterCategory, SortOption } from '@/types/movie';
import { getMovies, searchMovies } from '@/utils/supabase-storage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MovieCard from '@/components/MovieCard';
import Filters from '@/components/Filters';
import Pagination from '@/components/Pagination';
import SearchBar from '@/components/SearchBar';

import { useIsMobile } from '@/hooks/use-mobile';

const MOVIES_PER_PAGE = 8;

const HomePage = () => {
  
  const [movies, setMovies] = useState<Movie[]>([]);
  const [category, setCategory] = useState<FilterCategory>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [releaseYear, setReleaseYear] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const loadedMovies = await getMovies();
        setMovies(loadedMovies);
      } catch (error) {
        console.error('Error loading movies:', error);
      }
    };
    loadMovies();
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setIsSearchOpen(false);
    try {
      const results = await searchMovies(query);
      setMovies(results);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error searching movies:', error);
    }
  };


  const availableYears = useMemo(() => {
    const years = [...new Set(movies.map(movie => movie.releaseDate))].sort((a, b) => b.localeCompare(a));
    return years;
  }, [movies]);

  const filteredAndSortedMovies = useMemo(() => {
    let filtered = movies;

    // Filter by category
    if (category !== 'all') {
      filtered = filtered.filter(movie => movie.category.toLowerCase() === category);
    }

    // Filter by year
    if (releaseYear !== 'all') {
      filtered = filtered.filter(movie => movie.releaseDate === releaseYear);
    }

    // Sort movies
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'rating':
          return b.rating - a.rating;
        case 'popularity':
          return b.popularity - a.popularity;
        default:
          return 0;
      }
    });

    return filtered;
  }, [movies, category, sortBy, releaseYear]);

  const paginatedMovies = useMemo(() => {
    const startIndex = (currentPage - 1) * MOVIES_PER_PAGE;
    return filteredAndSortedMovies.slice(startIndex, startIndex + MOVIES_PER_PAGE);
  }, [filteredAndSortedMovies, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedMovies.length / MOVIES_PER_PAGE);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [category, sortBy, releaseYear]);


  return (
    <div className="min-h-screen bg-background">
      <Header onSearchOpen={() => setIsSearchOpen(true)} />
      <SearchBar 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSearch={handleSearch}
        currentQuery={searchQuery}
      />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center py-12 fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-gradient mb-4 animate-shine">
              Yoruba Cinemax
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Nigeria's Premier Yoruba Movie Destination
            </p>
          </div>

          {/* Filters */}
          <div className="slide-up">
            <Filters
              category={category}
              onCategoryChange={setCategory}
              sortBy={sortBy}
              onSortChange={setSortBy}
              releaseYear={releaseYear}
              onYearChange={setReleaseYear}
              availableYears={availableYears}
            />
          </div>

          {/* Movies Grid */}
          {paginatedMovies.length > 0 ? (
            <>
              <div className={`grid gap-6 slide-up ${
                isMobile 
                  ? 'grid-cols-2' 
                  : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
              }`}>
                {paginatedMovies.map((movie, index) => (
                  <div 
                    key={movie.id} 
                    className="fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <MovieCard movie={movie} />
                  </div>
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-2xl font-medium text-muted-foreground mb-4">
                No movies found
              </h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or check back later for new movies.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Movie } from '@/types/movie';
import { getMovies, searchMovies } from '@/utils/storage';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchExpanded]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const movies = getMovies();
      const results = searchMovies(movies, searchQuery);
      setSearchResults(results);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchQuery]);

  const handleSearchToggle = () => {
    if (isSearchExpanded) {
      setIsSearchExpanded(false);
      setSearchQuery('');
      setShowResults(false);
    } else {
      setIsSearchExpanded(true);
    }
  };

  const handleSearchClick = (movieId: string) => {
    setIsSearchExpanded(false);
    setSearchQuery('');
    setShowResults(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-gradient hover:scale-105 transition-transform">
            Yoruba Cinemax
          </Link>

          <div className="relative">
            <div className="flex items-center">
              {isSearchExpanded ? (
                <div className="flex items-center space-x-2 search-expanded">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for movies..."
                    className="w-64 px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  />
                  <button
                    onClick={handleSearchToggle}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <X size={20} className="text-muted-foreground" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleSearchToggle}
                  className="p-2 hover:bg-muted rounded-lg transition-colors animate-glow"
                >
                  <Search size={20} className="text-muted-foreground" />
                </button>
              )}
            </div>

            {/* Search Results Dropdown */}
            {showResults && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-card border border-border rounded-lg shadow-lg max-h-80 overflow-y-auto z-50">
                {searchResults.length > 0 ? (
                  <div className="p-2">
                    {searchResults.slice(0, 5).map((movie) => (
                      <Link
                        key={movie.id}
                        to={`/movie/${movie.id}`}
                        onClick={() => handleSearchClick(movie.id)}
                        className="flex items-center space-x-3 p-2 hover:bg-muted rounded-lg transition-colors"
                      >
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          className="w-12 h-16 object-cover rounded"
                        />
                        <div>
                          <h4 className="font-medium text-foreground">{movie.title}</h4>
                          <p className="text-sm text-muted-foreground">{movie.category} • {movie.releaseDate}</p>
                        </div>
                      </Link>
                    ))}
                    {searchResults.length > 5 && (
                      <p className="text-center text-sm text-muted-foreground py-2">
                        +{searchResults.length - 5} more results
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    No movie found based on your search.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
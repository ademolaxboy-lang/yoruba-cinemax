import { Movie } from '@/types/movie';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  return (
    <Link to={`/movie/${movie.id}`} className="block">
      <div className="card-premium rounded-lg overflow-hidden group">
        <div className="relative overflow-hidden">
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Rating badge */}
          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center space-x-1">
            <Star size={12} className="text-secondary fill-current" />
            <span className="text-white text-xs font-medium">{movie.rating}</span>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2">
            {movie.title}
          </h3>
          <p className="text-muted-foreground text-sm mt-1 capitalize">
            {movie.category}
          </p>
          <p className="text-muted-foreground text-xs mt-1">
            {movie.releaseDate}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
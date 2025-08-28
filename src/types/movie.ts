export interface Movie {
  id: string;
  title: string;
  poster: string;
  downloadLink: string;
  genre: string;
  releaseDate: string;
  stars: string[];
  runtime: string;
  rating: number;
  category: string;
  description?: string;
  popularity: number;
  createdAt: string;
}

export interface Comment {
  id: string;
  movieId: string;
  name: string;
  comment: string;
  timestamp: string;
}

export interface WebsiteSettings {
  name: string;
  tagline: string;
  adminPassword: string;
  contactEmail: string;
  advertiseEmail: string;
  copyrightYear: number;
  facebookUrl: string;
  twitterUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
}

export type SortOption = 'newest' | 'oldest' | 'rating' | 'popularity';
export type FilterCategory = 'all' | 'drama' | 'comedy' | 'action' | 'romance' | 'thriller';
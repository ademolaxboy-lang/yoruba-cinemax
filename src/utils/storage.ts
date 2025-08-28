import { Movie, Comment, WebsiteSettings } from '@/types/movie';

const STORAGE_KEYS = {
  MOVIES: 'yoruba-cinemax-movies',
  COMMENTS: 'yoruba-cinemax-comments',
  SETTINGS: 'yoruba-cinemax-settings',
  ADMIN_AUTH: 'yoruba-cinemax-admin-auth'
};

// Default settings
const DEFAULT_SETTINGS: WebsiteSettings = {
  name: 'Yoruba Cinemax',
  tagline: 'Nigeria\'s Premier Yoruba Movie Destination',
  adminPassword: 'Ademola5569'
};

// Movie storage functions
export const getMovies = (): Movie[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.MOVIES);
  return stored ? JSON.parse(stored) : [];
};

export const saveMovie = (movie: Movie): void => {
  const movies = getMovies();
  const existingIndex = movies.findIndex(m => m.id === movie.id);
  
  if (existingIndex !== -1) {
    movies[existingIndex] = movie;
  } else {
    movies.push(movie);
  }
  
  localStorage.setItem(STORAGE_KEYS.MOVIES, JSON.stringify(movies));
};

export const deleteMovie = (movieId: string): void => {
  const movies = getMovies().filter(movie => movie.id !== movieId);
  localStorage.setItem(STORAGE_KEYS.MOVIES, JSON.stringify(movies));
  
  // Also delete related comments
  const comments = getComments().filter(comment => comment.movieId !== movieId);
  localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
};

// Comment storage functions
export const getComments = (): Comment[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.COMMENTS);
  return stored ? JSON.parse(stored) : [];
};

export const getCommentsForMovie = (movieId: string): Comment[] => {
  return getComments().filter(comment => comment.movieId === movieId);
};

export const saveComment = (comment: Comment): void => {
  const comments = getComments();
  comments.push(comment);
  localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
};

export const deleteComment = (commentId: string): void => {
  const comments = getComments().filter(comment => comment.id !== commentId);
  localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
};

// Settings storage functions
export const getSettings = (): WebsiteSettings => {
  const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
};

export const saveSettings = (settings: WebsiteSettings): void => {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
};

// Admin authentication
export const isAdminAuthenticated = (): boolean => {
  const auth = localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH);
  if (!auth) return false;
  
  const authData = JSON.parse(auth);
  const now = new Date().getTime();
  
  // Session expires after 24 hours
  return authData.timestamp > now - (24 * 60 * 60 * 1000);
};

export const setAdminAuthenticated = (): void => {
  const authData = {
    authenticated: true,
    timestamp: new Date().getTime()
  };
  localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, JSON.stringify(authData));
};

export const clearAdminAuthentication = (): void => {
  localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
};

// Utility functions
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const searchMovies = (movies: Movie[], query: string): Movie[] => {
  if (!query.trim()) return movies;
  
  const searchTerm = query.toLowerCase();
  return movies.filter(movie => 
    movie.title.toLowerCase().includes(searchTerm) ||
    movie.genre.toLowerCase().includes(searchTerm) ||
    movie.category.toLowerCase().includes(searchTerm) ||
    movie.stars.some(star => star.toLowerCase().includes(searchTerm))
  );
};
import { supabase } from '@/integrations/supabase/client';
import { Movie, Comment, WebsiteSettings } from '@/types/movie';

// Movie functions
export const getMovies = async (): Promise<Movie[]> => {
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
  
  return data.map(movie => ({
    id: movie.id,
    title: movie.title,
    poster: movie.poster,
    downloadLink: movie.download_link,
    genre: movie.genre,
    releaseDate: movie.release_date,
    stars: movie.stars,
    runtime: movie.runtime,
    rating: movie.rating,
    category: movie.category,
    description: movie.description,
    popularity: movie.popularity,
    createdAt: movie.created_at
  }));
};

export const saveMovie = async (movie: Movie): Promise<void> => {
  const movieData = {
    id: movie.id,
    title: movie.title,
    poster: movie.poster,
    download_link: movie.downloadLink,
    genre: movie.genre,
    release_date: movie.releaseDate,
    stars: movie.stars,
    runtime: movie.runtime,
    rating: movie.rating,
    category: movie.category,
    description: movie.description,
    popularity: movie.popularity
  };

  const { error } = await supabase
    .from('movies')
    .upsert(movieData);
  
  if (error) {
    console.error('Error saving movie:', error);
    throw new Error('Failed to save movie');
  }
};

export const deleteMovie = async (movieId: string): Promise<void> => {
  const { error } = await supabase
    .from('movies')
    .delete()
    .eq('id', movieId);
  
  if (error) {
    console.error('Error deleting movie:', error);
    throw new Error('Failed to delete movie');
  }
};

export const searchMovies = async (query: string): Promise<Movie[]> => {
  if (!query.trim()) return getMovies();
  
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .or(`title.ilike.%${query}%,genre.ilike.%${query}%,category.ilike.%${query}%`)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error searching movies:', error);
    return [];
  }
  
  return data.map(movie => ({
    id: movie.id,
    title: movie.title,
    poster: movie.poster,
    downloadLink: movie.download_link,
    genre: movie.genre,
    releaseDate: movie.release_date,
    stars: movie.stars,
    runtime: movie.runtime,
    rating: movie.rating,
    category: movie.category,
    description: movie.description,
    popularity: movie.popularity,
    createdAt: movie.created_at
  }));
};

// Comment functions
export const getComments = async (): Promise<Comment[]> => {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
  
  return data.map(comment => ({
    id: comment.id,
    movieId: comment.movie_id,
    name: comment.name,
    comment: comment.comment,
    timestamp: comment.created_at
  }));
};

export const getCommentsForMovie = async (movieId: string): Promise<Comment[]> => {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('movie_id', movieId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching movie comments:', error);
    return [];
  }
  
  return data.map(comment => ({
    id: comment.id,
    movieId: comment.movie_id,
    name: comment.name,
    comment: comment.comment,
    timestamp: comment.created_at
  }));
};

export const saveComment = async (comment: Comment): Promise<void> => {
  const { error } = await supabase
    .from('comments')
    .insert({
      id: comment.id,
      movie_id: comment.movieId,
      name: comment.name,
      comment: comment.comment
    });
  
  if (error) {
    console.error('Error saving comment:', error);
    throw new Error('Failed to save comment');
  }
};

export const deleteComment = async (commentId: string): Promise<void> => {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId);
  
  if (error) {
    console.error('Error deleting comment:', error);
    throw new Error('Failed to delete comment');
  }
};

// Settings functions
export const getSettings = async (): Promise<WebsiteSettings> => {
  const { data, error } = await supabase
    .from('website_settings')
    .select('*')
    .limit(1);
  
  if (error || !data || data.length === 0) {
    console.error('Error fetching settings:', error);
    return {
      name: 'Yoruba Cinemax',
      tagline: 'Nigeria\'s Premier Yoruba Movie Destination',
      adminPassword: 'Ademola5569',
      contactEmail: 'contact@yorubacinemax.com',
      advertiseEmail: 'advertise@yorubacinemax.com',
      copyrightYear: 2025,
      facebookUrl: '',
      twitterUrl: '',
      instagramUrl: '',
      youtubeUrl: ''
    };
  }
  
  const settings = data[0];
  return {
    name: settings.name,
    tagline: settings.tagline,
    adminPassword: settings.admin_password,
    contactEmail: settings.contact_email,
    advertiseEmail: settings.advertise_email,
    copyrightYear: settings.copyright_year,
    facebookUrl: settings.facebook_url || '',
    twitterUrl: settings.twitter_url || '',
    instagramUrl: settings.instagram_url || '',
    youtubeUrl: settings.youtube_url || ''
  };
};

export const saveSettings = async (settings: WebsiteSettings): Promise<void> => {
  const { error } = await supabase
    .from('website_settings')
    .update({
      name: settings.name,
      tagline: settings.tagline,
      admin_password: settings.adminPassword,
      contact_email: settings.contactEmail,
      advertise_email: settings.advertiseEmail,
      copyright_year: settings.copyrightYear,
      facebook_url: settings.facebookUrl,
      twitter_url: settings.twitterUrl,
      instagram_url: settings.instagramUrl,
      youtube_url: settings.youtubeUrl
    })
    .eq('id', (await supabase.from('website_settings').select('id').limit(1)).data?.[0]?.id);
  
  if (error) {
    console.error('Error saving settings:', error);
    throw new Error('Failed to save settings');
  }
};

// Utility functions
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Admin authentication
export const isAdminAuthenticated = (): boolean => {
  const auth = localStorage.getItem('yoruba-cinemax-admin-auth');
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
  localStorage.setItem('yoruba-cinemax-admin-auth', JSON.stringify(authData));
};

export const clearAdminAuthentication = (): void => {
  localStorage.removeItem('yoruba-cinemax-admin-auth');
};
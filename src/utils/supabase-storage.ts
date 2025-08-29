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

export const saveMovie = async (movie: Movie, adminPassword: string): Promise<void> => {
  try {
    if (movie.id && movie.createdAt) {
      // Update existing movie
      const { error } = await supabase.rpc('update_movie', {
        p_id: movie.id,
        p_title: movie.title,
        p_poster: movie.poster,
        p_download_link: movie.downloadLink,
        p_genre: movie.genre,
        p_release_date: movie.releaseDate,
        p_stars: movie.stars,
        p_runtime: movie.runtime,
        p_rating: movie.rating,
        p_category: movie.category,
        p_description: movie.description || '',
        p_popularity: movie.popularity,
        p_admin_password: adminPassword
      });
      
      if (error) {
        console.error('Error updating movie:', error);
        throw new Error('Failed to update movie');
      }
    } else {
      // Add new movie
      const { error } = await supabase.rpc('add_movie', {
        p_title: movie.title,
        p_poster: movie.poster,
        p_download_link: movie.downloadLink,
        p_genre: movie.genre,
        p_release_date: movie.releaseDate,
        p_stars: movie.stars,
        p_runtime: movie.runtime,
        p_rating: movie.rating,
        p_category: movie.category,
        p_description: movie.description || '',
        p_popularity: movie.popularity,
        p_admin_password: adminPassword
      });
      
      if (error) {
        console.error('Error adding movie:', error);
        throw new Error('Failed to add movie');
      }
    }
  } catch (error) {
    console.error('Error saving movie:', error);
    throw new Error('Failed to save movie');
  }
};

export const deleteMovie = async (movieId: string, adminPassword: string): Promise<void> => {
  const { error } = await supabase.rpc('delete_movie', {
    p_id: movieId,
    p_admin_password: adminPassword
  });
  
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

export const deleteComment = async (commentId: string, adminPassword: string): Promise<void> => {
  const { error } = await supabase.rpc('delete_comment', {
    p_id: commentId,
    p_admin_password: adminPassword
  });
  
  if (error) {
    console.error('Error deleting comment:', error);
    throw new Error('Failed to delete comment');
  }
};

// Settings functions - Use secure public function that doesn't expose admin password
export const getSettings = async (): Promise<WebsiteSettings> => {
  const { data, error } = await supabase.rpc('get_public_settings');
  
  if (error || !data || data.length === 0) {
    console.error('Error fetching settings:', error);
    return {
      name: 'Yoruba Cinemax',
      tagline: 'Nigeria\'s Premier Yoruba Movie Destination',
      adminPassword: '', // Never expose this in public API
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
    adminPassword: '', // Never expose this in public API
    contactEmail: settings.contact_email,
    advertiseEmail: settings.advertise_email,
    copyrightYear: settings.copyright_year,
    facebookUrl: settings.facebook_url || '',
    twitterUrl: settings.twitter_url || '',
    instagramUrl: settings.instagram_url || '',
    youtubeUrl: settings.youtube_url || ''
  };
};

// Admin-only function to get settings with password (used for verification only)
export const verifyAdminPassword = async (password: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('website_settings')
      .select('admin_password')
      .limit(1);
    
    if (error || !data || data.length === 0) {
      return false;
    }
    
    return data[0].admin_password === password;
  } catch (error) {
    console.error('Error verifying admin password:', error);
    return false;
  }
};

export const saveSettings = async (settings: WebsiteSettings, currentAdminPassword: string): Promise<void> => {
  const { error } = await supabase.rpc('update_website_settings', {
    p_name: settings.name,
    p_tagline: settings.tagline,
    p_admin_password: settings.adminPassword,
    p_contact_email: settings.contactEmail,
    p_advertise_email: settings.advertiseEmail,
    p_copyright_year: settings.copyrightYear,
    p_facebook_url: settings.facebookUrl || '',
    p_twitter_url: settings.twitterUrl || '',
    p_instagram_url: settings.instagramUrl || '',
    p_youtube_url: settings.youtubeUrl || '',
    p_current_admin_password: currentAdminPassword
  });
  
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

// Secure admin password storage in session (never in localStorage for security)
export const setAdminPassword = (password: string): void => {
  sessionStorage.setItem('yoruba-cinemax-admin-session', password);
};

export const getAdminPassword = (): string | null => {
  return sessionStorage.getItem('yoruba-cinemax-admin-session');
};

export const clearAdminPassword = (): void => {
  sessionStorage.removeItem('yoruba-cinemax-admin-session');
};
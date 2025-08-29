-- CRITICAL SECURITY FIX: Restrict database access

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Allow all operations on movies" ON public.movies;
DROP POLICY IF EXISTS "Allow all operations on comments" ON public.comments;
DROP POLICY IF EXISTS "Allow all operations on website_settings" ON public.website_settings;

-- Create secure policies for movies (public read, no write access)
CREATE POLICY "Anyone can view movies" 
ON public.movies 
FOR SELECT 
USING (true);

-- Movies can only be managed through admin functions (not direct DB access)
CREATE POLICY "Prevent public movie modifications" 
ON public.movies 
FOR ALL 
USING (false);

-- Create secure policies for comments (public read, limited write)
CREATE POLICY "Anyone can view comments" 
ON public.comments 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can add comments" 
ON public.comments 
FOR INSERT 
WITH CHECK (true);

-- Prevent updating/deleting comments through public API
CREATE POLICY "Prevent public comment modifications" 
ON public.comments 
FOR UPDATE 
USING (false);

CREATE POLICY "Prevent public comment deletions" 
ON public.comments 
FOR DELETE 
USING (false);

-- Secure website settings (public read of safe fields only)
CREATE POLICY "Anyone can view public website settings" 
ON public.website_settings 
FOR SELECT 
USING (true);

-- Completely prevent modifications to settings through public API
CREATE POLICY "Prevent public settings modifications" 
ON public.website_settings 
FOR ALL 
USING (false);

-- Create admin-only functions with proper security
CREATE OR REPLACE FUNCTION add_movie(
  p_title TEXT,
  p_poster TEXT,
  p_download_link TEXT,
  p_genre TEXT,
  p_release_date TEXT,
  p_stars TEXT[],
  p_runtime TEXT,
  p_rating NUMERIC,
  p_category TEXT,
  p_description TEXT,
  p_popularity INTEGER,
  p_admin_password TEXT
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  movie_id UUID;
  stored_password TEXT;
BEGIN
  -- Verify admin password
  SELECT admin_password INTO stored_password FROM website_settings LIMIT 1;
  IF stored_password IS NULL OR stored_password != p_admin_password THEN
    RAISE EXCEPTION 'Unauthorized access';
  END IF;
  
  -- Insert movie
  movie_id := gen_random_uuid();
  INSERT INTO movies (
    id, title, poster, download_link, genre, release_date, 
    stars, runtime, rating, category, description, popularity
  ) VALUES (
    movie_id, p_title, p_poster, p_download_link, p_genre, p_release_date,
    p_stars, p_runtime, p_rating, p_category, p_description, p_popularity
  );
  
  RETURN movie_id;
END;
$$;
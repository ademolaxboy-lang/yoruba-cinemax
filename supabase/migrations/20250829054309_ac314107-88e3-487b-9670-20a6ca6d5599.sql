-- Add remaining admin functions with secure search_path
CREATE OR REPLACE FUNCTION update_movie(
  p_id UUID,
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
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  stored_password TEXT;
BEGIN
  -- Verify admin password
  SELECT admin_password INTO stored_password FROM website_settings LIMIT 1;
  IF stored_password IS NULL OR stored_password != p_admin_password THEN
    RAISE EXCEPTION 'Unauthorized access';
  END IF;
  
  -- Update movie
  UPDATE movies SET
    title = p_title,
    poster = p_poster,
    download_link = p_download_link,
    genre = p_genre,
    release_date = p_release_date,
    stars = p_stars,
    runtime = p_runtime,
    rating = p_rating,
    category = p_category,
    description = p_description,
    popularity = p_popularity,
    updated_at = now()
  WHERE id = p_id;
END;
$$;

CREATE OR REPLACE FUNCTION delete_movie(
  p_id UUID,
  p_admin_password TEXT
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  stored_password TEXT;
BEGIN
  -- Verify admin password
  SELECT admin_password INTO stored_password FROM website_settings LIMIT 1;
  IF stored_password IS NULL OR stored_password != p_admin_password THEN
    RAISE EXCEPTION 'Unauthorized access';
  END IF;
  
  -- Delete related comments first
  DELETE FROM comments WHERE movie_id = p_id;
  
  -- Delete movie
  DELETE FROM movies WHERE id = p_id;
END;
$$;

CREATE OR REPLACE FUNCTION delete_comment(
  p_id UUID,
  p_admin_password TEXT
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  stored_password TEXT;
BEGIN
  -- Verify admin password
  SELECT admin_password INTO stored_password FROM website_settings LIMIT 1;
  IF stored_password IS NULL OR stored_password != p_admin_password THEN
    RAISE EXCEPTION 'Unauthorized access';
  END IF;
  
  -- Delete comment
  DELETE FROM comments WHERE id = p_id;
END;
$$;

CREATE OR REPLACE FUNCTION update_website_settings(
  p_name TEXT,
  p_tagline TEXT,
  p_admin_password TEXT,
  p_contact_email TEXT,
  p_advertise_email TEXT,
  p_copyright_year INTEGER,
  p_facebook_url TEXT,
  p_twitter_url TEXT,
  p_instagram_url TEXT,
  p_youtube_url TEXT,
  p_current_admin_password TEXT
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  stored_password TEXT;
  settings_id UUID;
BEGIN
  -- Verify current admin password
  SELECT admin_password, id INTO stored_password, settings_id FROM website_settings LIMIT 1;
  IF stored_password IS NULL OR stored_password != p_current_admin_password THEN
    RAISE EXCEPTION 'Unauthorized access';
  END IF;
  
  -- Update settings
  UPDATE website_settings SET
    name = p_name,
    tagline = p_tagline,
    admin_password = p_admin_password,
    contact_email = p_contact_email,
    advertise_email = p_advertise_email,
    copyright_year = p_copyright_year,
    facebook_url = p_facebook_url,
    twitter_url = p_twitter_url,
    instagram_url = p_instagram_url,
    youtube_url = p_youtube_url,
    updated_at = now()
  WHERE id = settings_id;
END;
$$;

-- Create function to get public settings (without admin password)
CREATE OR REPLACE FUNCTION get_public_settings()
RETURNS TABLE(
  name TEXT,
  tagline TEXT,
  contact_email TEXT,
  advertise_email TEXT,
  copyright_year INTEGER,
  facebook_url TEXT,
  twitter_url TEXT,
  instagram_url TEXT,
  youtube_url TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ws.name,
    ws.tagline,
    ws.contact_email,
    ws.advertise_email,
    ws.copyright_year,
    ws.facebook_url,
    ws.twitter_url,
    ws.instagram_url,
    ws.youtube_url
  FROM website_settings ws
  LIMIT 1;
END;
$$;

-- Fix search_path for existing functions
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
SET search_path = public
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

-- Fix the existing update function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;
-- Create movies table
CREATE TABLE public.movies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  poster TEXT NOT NULL,
  download_link TEXT NOT NULL,
  genre TEXT NOT NULL,
  release_date TEXT NOT NULL,
  stars TEXT[] NOT NULL DEFAULT '{}',
  runtime TEXT NOT NULL,
  rating DECIMAL(2,1) NOT NULL DEFAULT 0.0,
  category TEXT NOT NULL,
  description TEXT,
  popularity INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create comments table
CREATE TABLE public.comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  movie_id UUID NOT NULL REFERENCES public.movies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create website settings table
CREATE TABLE public.website_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Yoruba Cinemax',
  tagline TEXT NOT NULL DEFAULT 'Nigeria''s Premier Yoruba Movie Destination',
  admin_password TEXT NOT NULL DEFAULT 'Ademola5569',
  contact_email TEXT NOT NULL DEFAULT 'contact@yorubacinemax.com',
  advertise_email TEXT NOT NULL DEFAULT 'advertise@yorubacinemax.com',
  copyright_year INTEGER NOT NULL DEFAULT 2025,
  facebook_url TEXT DEFAULT '',
  twitter_url TEXT DEFAULT '',
  instagram_url TEXT DEFAULT '',
  youtube_url TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default settings
INSERT INTO public.website_settings (name, tagline, admin_password) 
VALUES ('Yoruba Cinemax', 'Nigeria''s Premier Yoruba Movie Destination', 'Ademola5569');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_movies_updated_at
  BEFORE UPDATE ON public.movies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_website_settings_updated_at
  BEFORE UPDATE ON public.website_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_movies_category ON public.movies(category);
CREATE INDEX idx_movies_genre ON public.movies(genre);
CREATE INDEX idx_movies_release_date ON public.movies(release_date);
CREATE INDEX idx_movies_rating ON public.movies(rating);
CREATE INDEX idx_movies_popularity ON public.movies(popularity);
CREATE INDEX idx_movies_created_at ON public.movies(created_at);
CREATE INDEX idx_comments_movie_id ON public.comments(movie_id);
CREATE INDEX idx_movies_title_search ON public.movies USING gin(to_tsvector('english', title));

-- Enable Row Level Security (but allow all operations since no user login required)
ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;

-- Create policies that allow all operations (no authentication required)
CREATE POLICY "Allow all operations on movies" ON public.movies FOR ALL USING (true);
CREATE POLICY "Allow all operations on comments" ON public.comments FOR ALL USING (true);
CREATE POLICY "Allow all operations on website_settings" ON public.website_settings FOR ALL USING (true);
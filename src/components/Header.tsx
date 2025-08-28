import { useState, useRef, useEffect } from 'react';
import { Search, X, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { Movie, WebsiteSettings } from '@/types/movie';
import { getMovies, searchMovies, getSettings } from '@/utils/supabase-storage';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onSearchOpen?: () => void;
}

const Header = ({ onSearchOpen }: HeaderProps) => {
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const websiteSettings = await getSettings();
        setSettings(websiteSettings);
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    loadSettings();
  }, []);

  const handleSearchClick = () => {
    if (onSearchOpen) {
      onSearchOpen();
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-bold text-gradient hover:scale-105 transition-transform">
              {settings?.name || 'Yoruba Cinemax'}
            </Link>
            
            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
              <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link to="/advertise" className="text-muted-foreground hover:text-foreground transition-colors">
                Advertise
              </Link>
              <Link to="/dmca" className="text-muted-foreground hover:text-foreground transition-colors">
                DMCA
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {/* Social Media Icons */}
            <div className="hidden md:flex items-center gap-2">
              {settings?.facebookUrl && (
                <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" 
                   className="p-2 hover:bg-muted rounded-lg transition-colors">
                  <Facebook size={18} className="text-muted-foreground hover:text-foreground" />
                </a>
              )}
              {settings?.twitterUrl && (
                <a href={settings.twitterUrl} target="_blank" rel="noopener noreferrer"
                   className="p-2 hover:bg-muted rounded-lg transition-colors">
                  <Twitter size={18} className="text-muted-foreground hover:text-foreground" />
                </a>
              )}
              {settings?.instagramUrl && (
                <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer"
                   className="p-2 hover:bg-muted rounded-lg transition-colors">
                  <Instagram size={18} className="text-muted-foreground hover:text-foreground" />
                </a>
              )}
              {settings?.youtubeUrl && (
                <a href={settings.youtubeUrl} target="_blank" rel="noopener noreferrer"
                   className="p-2 hover:bg-muted rounded-lg transition-colors">
                  <Youtube size={18} className="text-muted-foreground hover:text-foreground" />
                </a>
              )}
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearchClick}
              className="p-2 hover:bg-muted rounded-lg transition-colors animate-glow"
            >
              <Search size={20} className="text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
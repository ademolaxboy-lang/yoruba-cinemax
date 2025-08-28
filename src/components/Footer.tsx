import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { getSettings } from '@/utils/supabase-storage';
import { WebsiteSettings } from '@/types/movie';

const Footer = () => {
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

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gradient">
              {settings?.name || 'Yoruba Cinemax'}
            </h3>
            <p className="text-muted-foreground">
              {settings?.tagline || 'Nigeria\'s Premier Yoruba Movie Destination'}
            </p>
            
            {/* Social Media Links */}
            <div className="flex items-center gap-3">
              {settings?.facebookUrl && (
                <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" 
                   className="p-2 hover:bg-muted rounded-lg transition-colors">
                  <Facebook size={20} className="text-muted-foreground hover:text-primary" />
                </a>
              )}
              {settings?.twitterUrl && (
                <a href={settings.twitterUrl} target="_blank" rel="noopener noreferrer"
                   className="p-2 hover:bg-muted rounded-lg transition-colors">
                  <Twitter size={20} className="text-muted-foreground hover:text-primary" />
                </a>
              )}
              {settings?.instagramUrl && (
                <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer"
                   className="p-2 hover:bg-muted rounded-lg transition-colors">
                  <Instagram size={20} className="text-muted-foreground hover:text-primary" />
                </a>
              )}
              {settings?.youtubeUrl && (
                <a href={settings.youtubeUrl} target="_blank" rel="noopener noreferrer"
                   className="p-2 hover:bg-muted rounded-lg transition-colors">
                  <Youtube size={20} className="text-muted-foreground hover:text-primary" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
                  Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-semibold">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/dmca" className="text-muted-foreground hover:text-foreground transition-colors">
                  DMCA Removal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold">Contact</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/advertise" className="text-muted-foreground hover:text-foreground transition-colors">
                  Advertise With Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground">
            © {settings?.copyrightYear || 2025} {settings?.name || 'Yoruba Cinemax'}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
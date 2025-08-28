import { useState, useEffect } from 'react';
import { WebsiteSettings } from '@/types/movie';
import { getSettings, saveSettings } from '@/utils/supabase-storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

const SettingsForm = () => {
  const [settings, setSettings] = useState<WebsiteSettings>({
    name: '',
    tagline: '',
    adminPassword: '',
    contactEmail: '',
    advertiseEmail: '',
    copyrightYear: 2025,
    facebookUrl: '',
    twitterUrl: '',
    instagramUrl: '',
    youtubeUrl: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const currentSettings = await getSettings();
        setSettings(currentSettings);
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    loadSettings();
  }, []);

  const handleInputChange = (field: keyof WebsiteSettings, value: string | number) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await saveSettings(settings);
      toast({ title: "Settings updated successfully!" });
    } catch (error) {
      toast({ title: "Failed to update settings", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card-premium rounded-lg p-6">
      <h2 className="text-xl font-bold text-foreground mb-6">Website Settings</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="websiteName">Website Name</Label>
          <Input
            id="websiteName"
            value={settings.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Yoruba Cinemax"
          />
        </div>

        <div>
          <Label htmlFor="tagline">Tagline</Label>
          <Input
            id="tagline"
            value={settings.tagline}
            onChange={(e) => handleInputChange('tagline', e.target.value)}
            placeholder="Nigeria's Premier Yoruba Movie Destination"
          />
        </div>

        <div>
          <Label htmlFor="adminPassword">Admin Password</Label>
          <Input
            id="adminPassword"
            type="password"
            value={settings.adminPassword}
            onChange={(e) => handleInputChange('adminPassword', e.target.value)}
            placeholder="Enter new admin password"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Leave blank to keep current password
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="contactEmail">Contact Email</Label>
            <Input
              id="contactEmail"
              type="email"
              value={settings.contactEmail}
              onChange={(e) => handleInputChange('contactEmail', e.target.value)}
              placeholder="contact@yorubacinemax.com"
            />
          </div>
          <div>
            <Label htmlFor="advertiseEmail">Advertise Email</Label>
            <Input
              id="advertiseEmail"
              type="email"
              value={settings.advertiseEmail}
              onChange={(e) => handleInputChange('advertiseEmail', e.target.value)}
              placeholder="advertise@yorubacinemax.com"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="copyrightYear">Copyright Year</Label>
          <Input
            id="copyrightYear"
            type="number"
            value={settings.copyrightYear}
            onChange={(e) => handleInputChange('copyrightYear', parseInt(e.target.value) || 2025)}
            placeholder="2025"
          />
        </div>

        <div>
          <Label className="text-base font-semibold">Social Media Links</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <Label htmlFor="facebookUrl">Facebook URL</Label>
              <Input
                id="facebookUrl"
                type="url"
                value={settings.facebookUrl}
                onChange={(e) => handleInputChange('facebookUrl', e.target.value)}
                placeholder="https://facebook.com/yorubacinemax"
              />
            </div>
            <div>
              <Label htmlFor="twitterUrl">Twitter URL</Label>
              <Input
                id="twitterUrl"
                type="url"
                value={settings.twitterUrl}
                onChange={(e) => handleInputChange('twitterUrl', e.target.value)}
                placeholder="https://twitter.com/yorubacinemax"
              />
            </div>
            <div>
              <Label htmlFor="instagramUrl">Instagram URL</Label>
              <Input
                id="instagramUrl"
                type="url"
                value={settings.instagramUrl}
                onChange={(e) => handleInputChange('instagramUrl', e.target.value)}
                placeholder="https://instagram.com/yorubacinemax"
              />
            </div>
            <div>
              <Label htmlFor="youtubeUrl">YouTube URL</Label>
              <Input
                id="youtubeUrl"
                type="url"
                value={settings.youtubeUrl}
                onChange={(e) => handleInputChange('youtubeUrl', e.target.value)}
                placeholder="https://youtube.com/yorubacinemax"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SettingsForm;
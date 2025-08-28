import { useState, useEffect } from 'react';
import { WebsiteSettings } from '@/types/movie';
import { getSettings, saveSettings } from '@/utils/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

const SettingsForm = () => {
  const [settings, setSettings] = useState<WebsiteSettings>({
    name: '',
    tagline: '',
    adminPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const currentSettings = getSettings();
    setSettings(currentSettings);
  }, []);

  const handleInputChange = (field: keyof WebsiteSettings, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      saveSettings(settings);
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
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, Users, Eye, Target } from 'lucide-react';
import { getSettings } from '@/utils/supabase-storage';
import { WebsiteSettings } from '@/types/movie';

const AdvertiseWithUs = () => {
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    budget: '',
    adType: '',
    message: ''
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoLink = `mailto:${settings?.advertiseEmail || 'advertise@yorubacinemax.com'}?subject=Advertising Inquiry from ${formData.company || formData.name}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\nCompany: ${formData.company}\nBudget Range: ${formData.budget}\nAd Type: ${formData.adType}\n\nMessage:\n${formData.message}`)}`;
    window.location.href = mailtoLink;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="text-center py-12 fade-in">
              <h1 className="text-4xl md:text-6xl font-bold text-gradient mb-4">
                Advertise With Us
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Reach thousands of Yoruba movie enthusiasts with targeted advertising
              </p>
            </div>

            {/* Stats Section */}
            <div className="grid md:grid-cols-4 gap-6 mb-12">
              <div className="bg-card p-6 rounded-lg border text-center">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">50K+</h3>
                <p className="text-muted-foreground">Monthly Visitors</p>
              </div>
              <div className="bg-card p-6 rounded-lg border text-center">
                <Eye className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">200K+</h3>
                <p className="text-muted-foreground">Page Views</p>
              </div>
              <div className="bg-card p-6 rounded-lg border text-center">
                <Target className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">95%</h3>
                <p className="text-muted-foreground">Yoruba Audience</p>
              </div>
              <div className="bg-card p-6 rounded-lg border text-center">
                <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">30%</h3>
                <p className="text-muted-foreground">Growth Rate</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              {/* Advertising Options */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-6">Advertising Opportunities</h2>
                  <p className="text-muted-foreground mb-8">
                    We offer various advertising formats to help you reach your target audience effectively.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="bg-card p-6 rounded-lg border">
                    <h3 className="text-lg font-semibold mb-2">Banner Advertisements</h3>
                    <p className="text-muted-foreground mb-4">
                      Display ads prominently on our homepage and movie pages
                    </p>
                    <ul className="list-disc pl-6 text-sm text-muted-foreground">
                      <li>High visibility placement</li>
                      <li>Multiple size options</li>
                      <li>Responsive design</li>
                    </ul>
                  </div>

                  <div className="bg-card p-6 rounded-lg border">
                    <h3 className="text-lg font-semibold mb-2">Sponsored Content</h3>
                    <p className="text-muted-foreground mb-4">
                      Feature your brand through sponsored movie reviews and articles
                    </p>
                    <ul className="list-disc pl-6 text-sm text-muted-foreground">
                      <li>Native advertising</li>
                      <li>Brand integration</li>
                      <li>Social media promotion</li>
                    </ul>
                  </div>

                  <div className="bg-card p-6 rounded-lg border">
                    <h3 className="text-lg font-semibold mb-2">Newsletter Sponsorship</h3>
                    <p className="text-muted-foreground mb-4">
                      Reach our subscribers directly through email marketing
                    </p>
                    <ul className="list-disc pl-6 text-sm text-muted-foreground">
                      <li>Direct audience engagement</li>
                      <li>High open rates</li>
                      <li>Targeted messaging</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-card p-8 rounded-lg border">
                <h2 className="text-2xl font-bold mb-6">Get Started Today</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Name *</label>
                      <Input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email *</label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Company</label>
                    <Input
                      type="text"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Budget Range</label>
                      <Select value={formData.budget} onValueChange={(value) => handleInputChange('budget', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select budget range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="under-1000">Under $1,000</SelectItem>
                          <SelectItem value="1000-5000">$1,000 - $5,000</SelectItem>
                          <SelectItem value="5000-10000">$5,000 - $10,000</SelectItem>
                          <SelectItem value="over-10000">Over $10,000</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Ad Type</label>
                      <Select value={formData.adType} onValueChange={(value) => handleInputChange('adType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select ad type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="banner">Banner Ads</SelectItem>
                          <SelectItem value="sponsored">Sponsored Content</SelectItem>
                          <SelectItem value="newsletter">Newsletter</SelectItem>
                          <SelectItem value="custom">Custom Package</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Message</label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      rows={4}
                      placeholder="Tell us about your advertising goals..."
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Send Inquiry
                  </Button>
                </form>

                <div className="mt-6 pt-6 border-t">
                  <p className="text-sm text-muted-foreground">
                    For immediate assistance, contact us at:{' '}
                    <span className="font-medium">{settings?.advertiseEmail || 'advertise@yorubacinemax.com'}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdvertiseWithUs;
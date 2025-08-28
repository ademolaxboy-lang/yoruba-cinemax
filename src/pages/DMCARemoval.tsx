import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, FileText, Send } from 'lucide-react';
import { useState } from 'react';

const DMCARemoval = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    copyrightWork: '',
    infringingUrl: '',
    description: '',
    declaration: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailBody = `
DMCA Takedown Notice

Copyright Owner Information:
Name: ${formData.name}
Email: ${formData.email}
Organization: ${formData.organization}

Copyrighted Work:
${formData.copyrightWork}

Infringing Material URL:
${formData.infringingUrl}

Description of Infringement:
${formData.description}

Declaration: ${formData.declaration ? 'I declare that the information provided is accurate and I am authorized to act on behalf of the copyright owner.' : 'NOT AGREED'}

Date: ${new Date().toLocaleDateString()}
    `;

    const mailtoLink = `mailto:dmca@yorubacinemax.com?subject=DMCA Takedown Notice&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoLink;
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center py-12 fade-in">
              <AlertTriangle className="h-16 w-16 text-primary mx-auto mb-4" />
              <h1 className="text-4xl md:text-6xl font-bold text-gradient mb-4">
                DMCA Removal
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Submit a copyright infringement notice
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              {/* Information */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-6">Copyright Protection</h2>
                  <p className="text-muted-foreground mb-6">
                    Yoruba Cinemax respects the intellectual property rights of others and expects our users to do the same. If you believe that your copyrighted work has been copied in a way that constitutes copyright infringement, please provide us with the following information.
                  </p>
                </div>

                <div className="bg-card p-6 rounded-lg border">
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="h-6 w-6 text-primary" />
                    <h3 className="text-lg font-semibold">Required Information</h3>
                  </div>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li>• Your contact information (name, email, organization)</li>
                    <li>• Description of the copyrighted work that you claim has been infringed</li>
                    <li>• URL or location of the infringing material on our website</li>
                    <li>• A statement that you have a good faith belief that the disputed use is not authorized</li>
                    <li>• A statement that the information in the notification is accurate</li>
                    <li>• Your physical or electronic signature</li>
                  </ul>
                </div>

                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                    <h4 className="font-semibold text-amber-800 dark:text-amber-200">Important Notice</h4>
                  </div>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Filing a false DMCA notice may result in legal consequences. Please ensure that you have the legal authority to file this complaint and that all information provided is accurate.
                  </p>
                </div>
              </div>

              {/* DMCA Form */}
              <div className="bg-card p-8 rounded-lg border">
                <div className="flex items-center gap-3 mb-6">
                  <Send className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold">Submit DMCA Notice</h2>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name *</label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address *</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Organization/Company</label>
                    <Input
                      type="text"
                      value={formData.organization}
                      onChange={(e) => handleInputChange('organization', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description of Copyrighted Work *</label>
                    <Textarea
                      value={formData.copyrightWork}
                      onChange={(e) => handleInputChange('copyrightWork', e.target.value)}
                      rows={3}
                      placeholder="Describe the original copyrighted work that you claim has been infringed..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">URL of Infringing Material *</label>
                    <Input
                      type="url"
                      value={formData.infringingUrl}
                      onChange={(e) => handleInputChange('infringingUrl', e.target.value)}
                      placeholder="https://yorubacinemax.com/movie/..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Additional Information</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={4}
                      placeholder="Provide any additional details about the infringement..."
                    />
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="declaration"
                      checked={formData.declaration}
                      onChange={(e) => handleInputChange('declaration', e.target.checked)}
                      className="mt-1"
                      required
                    />
                    <label htmlFor="declaration" className="text-sm text-muted-foreground">
                      I declare under penalty of perjury that the information in this notification is accurate and that I am the copyright owner or am authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.
                    </label>
                  </div>

                  <Button type="submit" className="w-full" disabled={!formData.declaration}>
                    Submit DMCA Notice
                  </Button>
                </form>

                <div className="mt-6 pt-6 border-t">
                  <p className="text-xs text-muted-foreground">
                    Your notice will be reviewed within 24-48 hours. We will contact you if additional information is needed.
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

export default DMCARemoval;
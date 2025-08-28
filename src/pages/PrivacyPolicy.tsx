import Header from '@/components/Header';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center py-12 fade-in">
              <h1 className="text-4xl md:text-6xl font-bold text-gradient mb-4">
                Privacy Policy
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                How we collect, use, and protect your information
              </p>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <div className="bg-card p-8 rounded-lg border space-y-8">
                <section>
                  <h2 className="text-2xl font-bold mb-4">Information We Collect</h2>
                  <p className="text-muted-foreground mb-4">
                    When you use Yoruba Cinemax, we may collect the following types of information:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Personal information you provide when contacting us</li>
                    <li>Usage data and analytics to improve our services</li>
                    <li>Comments and feedback you submit on our platform</li>
                    <li>Technical information about your device and browser</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">How We Use Your Information</h2>
                  <p className="text-muted-foreground mb-4">
                    We use the information we collect to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Provide and maintain our movie streaming service</li>
                    <li>Respond to your inquiries and customer support requests</li>
                    <li>Improve our website functionality and user experience</li>
                    <li>Send you updates about new movies and features (with your consent)</li>
                    <li>Analyze usage patterns to enhance our content offerings</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">Information Sharing</h2>
                  <p className="text-muted-foreground mb-4">
                    We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>When required by law or legal process</li>
                    <li>To protect the rights, property, or safety of our users</li>
                    <li>With trusted service providers who assist in operating our website</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">Data Security</h2>
                  <p className="text-muted-foreground">
                    We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">Cookies</h2>
                  <p className="text-muted-foreground">
                    Our website may use cookies to enhance your browsing experience. You can choose to disable cookies through your browser settings, but this may affect some functionality of our site.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">Your Rights</h2>
                  <p className="text-muted-foreground mb-4">
                    You have the right to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Access and update your personal information</li>
                    <li>Request deletion of your data</li>
                    <li>Opt-out of marketing communications</li>
                    <li>File a complaint with relevant authorities</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">Changes to This Policy</h2>
                  <p className="text-muted-foreground">
                    We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
                  <p className="text-muted-foreground">
                    If you have any questions about this Privacy Policy, please contact us at contact@yorubacinemax.com.
                  </p>
                </section>

                <div className="pt-8 border-t">
                  <p className="text-sm text-muted-foreground">
                    Last Updated: January 2025
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

export default PrivacyPolicy;
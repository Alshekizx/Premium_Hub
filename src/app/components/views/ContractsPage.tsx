'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { HeroSection } from '../heroSection';
import { Card, CardContent } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Loader2 } from 'lucide-react';

export function ContractsPage() {
  const [terms, setTerms] = useState<string>('');
  const [privacy, setPrivacy] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const termsRef = doc(db, 'contracts', 'terms');
        const privacyRef = doc(db, 'contracts', 'privacy');

        const [termsSnap, privacySnap] = await Promise.all([
          getDoc(termsRef),
          getDoc(privacyRef),
        ]);

        if (termsSnap.exists()) setTerms(termsSnap.data().content || '');
        if (privacySnap.exists()) setPrivacy(privacySnap.data().content || '');
      } catch (error) {
        console.error('Error fetching contracts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, []);

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <HeroSection
        title="Legal Agreements"
        subtitle="Review our Terms & Conditions and Privacy Policy"
      />

      <section className="py-16 bg-[var(--background)]">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="shadow-md border border-[var(--border)] bg-[var(--card)]">
            <CardContent className="p-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Loader2 className="animate-spin h-8 w-8 text-[var(--primary)] mb-4" />
                  <p className="text-[var(--muted-foreground)]">Loading contracts...</p>
                </div>
              ) : (
                <Tabs defaultValue="terms">
                  <TabsList className="flex justify-center mb-8 bg-[var(--muted)]/20 rounded-lg">
                    <TabsTrigger
                      value="terms"
                      className="px-6 py-2 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-[var(--primary-foreground)] rounded-md transition-colors"
                    >
                      Terms & Conditions
                    </TabsTrigger>
                    <TabsTrigger
                      value="privacy"
                      className="px-6 py-2 data-[state=active]:bg-[var(--primary)] data-[state=active]:text-[var(--primary-foreground)] rounded-md transition-colors"
                    >
                      Privacy Policy
                    </TabsTrigger>
                  </TabsList>

                  {/* Terms & Conditions */}
                  <TabsContent value="terms">
                    <div
                      className="prose max-w-none text-[var(--foreground)] leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: terms || '<p>No terms available.</p>' }}
                    />
                  </TabsContent>

                  {/* Privacy Policy */}
                  <TabsContent value="privacy">
                    <div
                      className="prose max-w-none text-[var(--foreground)] leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: privacy || '<p>No privacy policy available.</p>' }}
                    />
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

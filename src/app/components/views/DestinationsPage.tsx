'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../../firebase'; 
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { MapPin, Star, Search } from 'lucide-react';
import { HeroSection } from '../heroSection';

interface Destination {
  id: string;
  name: string;
  region: string;
  image: string;
  rating: number;
  description: string;
  category: string;
  includes: string[];
}

interface DestinationsPageProps {
  onNavigate: (page: string) => void;
}

export function DestinationsPage({ onNavigate }: DestinationsPageProps) {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'destinations'));
        const destinationsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Destination[];

        setDestinations(destinationsData);
      } catch (error) {
        console.error('Error fetching destinations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  const filteredDestinations = destinations.filter(dest => {
    const matchesSearch =
      dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion === 'all' || dest.region === selectedRegion;
    const matchesCategory = selectedCategory === 'all' || dest.category === selectedCategory;
    return matchesSearch && matchesRegion && matchesCategory;
  });

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <HeroSection
        title="Explore Destinations"
        subtitle="Discover amazing places around the world with our curated travel packages"
      />

      {/* Search & Filters */}
      <section className="py-12 bg-[var(--card)] border-b border-[var(--border)]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div className="relative md:col-span-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[var(--muted-foreground)]" />
              <Input
                placeholder="Search destinations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[var(--input-background)] text-[var(--foreground)]"
              />
            </div>

            {/* Region Filter */}
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className="bg-[var(--input-background)] text-[var(--foreground)] border-[var(--border)]">
                <SelectValue placeholder="Select Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value="Europe">Europe</SelectItem>
                <SelectItem value="Asia">Asia</SelectItem>
                <SelectItem value="Middle East">Middle East</SelectItem>
                <SelectItem value="Americas">Americas</SelectItem>
                <SelectItem value="Africa">Africa</SelectItem>
              </SelectContent>
            </Select>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="bg-[var(--input-background)] text-[var(--foreground)] border-[var(--border)]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Beach">Beach</SelectItem>
                <SelectItem value="Cultural">Cultural</SelectItem>
                <SelectItem value="Adventure">Adventure</SelectItem>
                <SelectItem value="Luxury">Luxury</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-20 bg-[var(--lighter-background)]">
        <div className="container mx-auto px-4">
          {loading ? (
            <p className="text-center text-[var(--muted-foreground)] text-lg">Loading destinations...</p>
          ) : filteredDestinations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[var(--muted-foreground)] text-xl">
                No destinations found matching your criteria.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedRegion('all');
                  setSelectedCategory('all');
                }}
                className="mt-4 border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)]"
                variant="outline"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDestinations.map((destination) => (
                <Card
                  key={destination.id}
                  className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group bg-[var(--card)] border border-[var(--border)]"
                >
                  <div className="relative h-64 overflow-hidden">
                    <ImageWithFallback
                      src={destination.image}
                      alt={destination.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <Badge className="absolute top-4 left-4 bg-[var(--primary)] text-[var(--primary-foreground)]">
                      {destination.category}
                    </Badge>
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <MapPin className="h-4 w-4 text-[var(--muted-foreground)]" />
                          <h3 className="text-xl text-[var(--foreground)]">{destination.name}</h3>
                        </div>
                        <p className="text-sm text-[var(--muted-foreground)] mb-2">{destination.region}</p>
                        <p className="text-[var(--foreground)]/80 mb-4">{destination.description}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {destination.includes?.map((item, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs border-[var(--border)] text-[var(--foreground)]/70"
                        >
                          {item}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-[var(--accent)] text-[var(--accent)]" />
                        <span className="text-[var(--foreground)]">{destination.rating}</span>
                      </div>
                    </div>

                    <Button
                      onClick={() => onNavigate('book')}
                      className="w-full mt-4 text-white bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] hover:from-[var(--secondary)] hover:to-[var(--primary)] animate-gradient-x"
                    >
                      Book Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[var(--card)] border-t border-[var(--border)]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl mb-4 text-[var(--foreground)]">
            Can&apos;t Find What You&apos;re Looking For?
          </h2>
          <p className="text-[var(--muted-foreground)] mb-8 max-w-2xl mx-auto">
            Our travel experts can create a custom package tailored to your preferences
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => onNavigate('contact')}
              className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] hover:from-[var(--secondary)] hover:to-[var(--primary)] text-[var(--primary-foreground)] animate-gradient-x"
            >
              Contact Us
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={() => onNavigate('book')}
              className="border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
            >
              Request Custom Package
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

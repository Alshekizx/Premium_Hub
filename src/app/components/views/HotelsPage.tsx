import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { MapPin, Star, Wifi, Coffee, Utensils, Dumbbell, Car, Search,  LucideIcon  } from 'lucide-react';
import { useState } from 'react';
import { HeroSection } from '../heroSection';

interface HotelsPageProps {
  onNavigate: (page: string) => void;
}

const hotels = [
  {
    id: 1,
    name: 'Le Grand Paris Hotel',
    location: 'Paris, France',
    image: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMGxvYmJ5fGVufDF8fHx8MTc2MTQ2MzAwM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    price: '$259',
    rating: 4.9,
    reviews: 324,
    category: 'Luxury',
    amenities: ['Wifi', 'Restaurant', 'Gym', 'Parking'],
    description: 'Elegant 5-star hotel in the heart of Paris with stunning city views'
  },
  {
    id: 2,
    name: 'Bali Beach Resort',
    location: 'Seminyak, Bali',
    image: 'https://images.unsplash.com/photo-1702743599501-a821d0b38b66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGJlYWNoJTIwcGFyYWRpc2V8ZW58MXx8fHwxNzYxNDc2OTUxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    price: '$189',
    rating: 4.8,
    reviews: 256,
    category: 'Beach',
    amenities: ['Wifi', 'Restaurant', 'Beach Access', 'Spa'],
    description: 'Beachfront paradise with infinity pool and spa facilities'
  },
  {
    id: 3,
    name: 'Tokyo Business Hotel',
    location: 'Shibuya, Tokyo',
    image: 'https://images.unsplash.com/photo-1645343709881-465be60137a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b2t5byUyMGNpdHklMjBuaWdodHxlbnwxfHx8fDE3NjE0OTY0MzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    price: '$179',
    rating: 4.7,
    reviews: 189,
    category: 'Business',
    amenities: ['Wifi', 'Business Center', 'Gym', 'Restaurant'],
    description: 'Modern hotel perfect for business travelers in central Tokyo'
  },
  {
    id: 4,
    name: 'Santorini Luxury Suites',
    location: 'Oia, Santorini',
    image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW50b3JpbmklMjBncmVlY2V8ZW58MXx8fHwxNzYxNDE2NzMwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    price: '$399',
    rating: 5.0,
    reviews: 412,
    category: 'Luxury',
    amenities: ['Wifi', 'Pool', 'Restaurant', 'Spa'],
    description: 'Exclusive suites with breathtaking caldera views and infinity pools'
  },
  {
    id: 5,
    name: 'Dubai Marina Tower Hotel',
    location: 'Dubai Marina, UAE',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkdWJhaSUyMHNreWxpbmV8ZW58MXx8fHwxNzYxNDE5OTI5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    price: '$299',
    rating: 4.9,
    reviews: 567,
    category: 'Luxury',
    amenities: ['Wifi', 'Pool', 'Gym', 'Restaurant', 'Spa'],
    description: 'Ultra-modern hotel with stunning marina and skyline views'
  },
  {
    id: 6,
    name: 'Paris Budget Inn',
    location: 'Montmartre, Paris',
    image: 'https://images.unsplash.com/photo-1431274172761-fca41d930114?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJpcyUyMGVpZmZlbCUyMHRvd2VyfGVufDF8fHx8MTc2MTQyMjQwMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    price: '$89',
    rating: 4.5,
    reviews: 143,
    category: 'Budget',
    amenities: ['Wifi', 'Breakfast'],
    description: 'Cozy and affordable accommodation in charming Montmartre'
  }
];

const amenityIcons: Record<string, LucideIcon> = {
  Wifi,
  Restaurant: Utensils,
  Gym: Dumbbell,
  Parking: Car,
  "Beach Access": MapPin,
  Spa: Star,
  Pool: Star,
  "Business Center": Coffee,
  Breakfast: Coffee,
};

export function HotelsPage({ onNavigate }: HotelsPageProps) {
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');
  const [category, setCategory] = useState('all');

  const filteredHotels = hotels.filter(hotel => {
    const matchesCategory = category === 'all' || hotel.category === category;
    const matchesDestination = destination === '' || 
                               hotel.location.toLowerCase().includes(destination.toLowerCase());
    return matchesCategory && matchesDestination;
  });

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <HeroSection
              title="Hotel Reservations"
              subtitle="Find and book the perfect accommodation for your stay"
            />
    

          {/* Search Section */}
          <section className="py-12 bg-[var(--card)] border-b border-[var(--border)] transition-colors duration-300">
            <div className="container mx-auto px-4">
              <Card className="max-w-5xl mx-auto bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)]">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="destination" className="text-[var(--foreground)]">Destination</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
                        <Input
                          id="destination"
                          placeholder="Where are you going?"
                          value={destination}
                          onChange={(e) => setDestination(e.target.value)}
                          className="pl-10 bg-[var(--input-background)] border-[var(--border)] text-[var(--foreground)]"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="checkin" className="text-[var(--foreground)]">Check In</Label>
                      <Input
                        id="checkin"
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="bg-[var(--input-background)] border-[var(--border)] text-[var(--foreground)]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="checkout" className="text-[var(--foreground)]">Check Out</Label>
                      <Input
                        id="checkout"
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="bg-[var(--input-background)] border-[var(--border)] text-[var(--foreground)]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="guests" className="text-[var(--foreground)]">Guests</Label>
                      <Input
                        id="guests"
                        type="number"
                        min="1"
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                        className="bg-[var(--input-background)] border-[var(--border)] text-[var(--foreground)]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>&nbsp;</Label>
                      <Button className="w-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] hover:opacity-90 text-[var(--primary-foreground)]">
                        <Search className="h-4 w-4 mr-2" />
                        Search
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Filter Section */}
          <section className="py-8 bg-[var(--lighter-background)] border-b border-[var(--border)] transition-colors duration-300">
            <div className="container mx-auto px-4">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between max-w-5xl mx-auto">
                <div>
                  <p className="text-[var(--muted-foreground)]">
                    Showing <span className="font-semibold text-[var(--foreground)]">{filteredHotels.length}</span> hotels
                  </p>
                </div>
                <div className="flex gap-4">
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="w-[180px] bg-[var(--input-background)] border-[var(--border)] text-[var(--foreground)]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--card)] text-[var(--foreground)] border-[var(--border)]">
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Luxury">Luxury</SelectItem>
                      <SelectItem value="Beach">Beach</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="Budget">Budget</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </section>

          {/* Hotels Grid */}
          <section className="py-20 bg-[var(--lighter-background)] transition-colors duration-300">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {filteredHotels.map((hotel) => (
                  <Card key={hotel.id} className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)]">
                    <div className="relative h-56 overflow-hidden">
                      <ImageWithFallback
                        src={hotel.image}
                        alt={hotel.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <Badge className="absolute top-4 right-4 bg-[var(--accent)] text-[var(--accent-foreground)] border border-[var(--border)] shadow">
                        {hotel.category}
                      </Badge>
                    </div>

                    <CardContent className="p-6">
                      <div className="mb-3">
                        <h3 className="text-xl mb-1 text-[var(--foreground)]">{hotel.name}</h3>
                        <div className="flex items-center gap-1 text-sm text-[var(--muted-foreground)]">
                          <MapPin className="h-3 w-3" />
                          <span>{hotel.location}</span>
                        </div>
                      </div>

                      <p className="text-[var(--muted-foreground)] text-sm mb-4">{hotel.description}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {hotel.amenities.slice(0, 4).map((amenity, index) => {
                          const Icon = amenityIcons[amenity] || Star;
                          return (
                            <div key={index} className="flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
                              <Icon className="h-3 w-3" />
                              <span>{amenity}</span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-[var(--accent)]" />
                            <span>{hotel.rating}</span>
                          </div>
                          <span className="text-sm text-[var(--muted-foreground)]">({hotel.reviews} reviews)</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-[var(--muted-foreground)]">From</div>
                          <div className="text-2xl text-[var(--primary)] font-semibold">{hotel.price}</div>
                          <div className="text-xs text-[var(--muted-foreground)]">per night</div>
                        </div>
                      </div>

                      <Button 
                        onClick={() => onNavigate('book')}
                        className="w-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] hover:opacity-90 text-[var(--primary-foreground)]"
                      >
                        Reserve Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredHotels.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-[var(--muted-foreground)] text-xl">No hotels found matching your criteria.</p>
                  <Button 
                    onClick={() => {
                      setDestination('');
                      setCategory('all');
                    }}
                    className="mt-4 border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)]"
                    variant="outline"
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </section>


      {/* Features Section */}
<section className="py-16 bg-[var(--lighter-background)] transition-colors duration-500">
  <div className="container mx-auto px-4">
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl mb-4 text-[var(--foreground)]">
        Why Book With Us?
      </h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
      {[
        {
          title: "Best Price Guarantee",
          text: "We'll match or beat any competitive price",
        },
        {
          title: "Verified Hotels",
          text: "All properties are personally inspected",
        },
        {
          title: "24/7 Support",
          text: "Customer service available anytime",
        },
      ].map(({ title, text }, i) => (
        <div key={i} className="text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md"
            style={{
              background: "linear-gradient(135deg, var(--primary), var(--secondary))",
            }}
          >
            <Star className="h-8 w-8 text-[var(--accent)]" />
          </div>
          <h3 className="text-xl mb-2 text-[var(--foreground)]">{title}</h3>
          <p className="text-[var(--muted-foreground)]">{text}</p>
        </div>
      ))}
    </div>
  </div>
</section>

{/* CTA Section */}
<section
  className="py-16 text-center text-[var(--primary-foreground)] transition-all duration-500"
  style={{
    background: "linear-gradient(135deg, var(--primary), var(--secondary))",
  }}
>
  <div className="container mx-auto px-4">
    <h2 className="text-3xl md:text-4xl mb-4">
      Need Help Finding the Perfect Hotel?
    </h2>
    <p className="text-xl mb-8 max-w-2xl mx-auto text-[var(--primary-foreground)]/90">
      Our travel experts can help you find the best accommodation for your needs
    </p>
    <Button
      size="lg"
      onClick={() => onNavigate("contact")}
      className="bg-[var(--accent)] text-[var(--accent-foreground)] hover:opacity-90 text-lg px-8 transition-all"
    >
      Contact Our Experts
    </Button>
  </div>
</section>

    </div>
  );
}

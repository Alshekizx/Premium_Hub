//file: app/page.tsx
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Plane, Hotel, FileText, Calendar, MapPin, Star, Quote, CheckCircle } from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const services = [
    {
      icon: Plane,
      title: 'Flight Bookings',
      description: 'Local and international flights at competitive prices',
      page: 'services'
    },
    {
      icon: FileText,
      title: 'Visa Applications',
      description: 'Expert assistance with visa processing',
      page: 'visa'
    },
    {
      icon: Hotel,
      title: 'Hotel Reservations',
      description: 'Handpicked hotels worldwide',
      page: 'hotels'
    },
    {
      icon: Calendar,
      title: 'Event Spaces',
      description: 'Perfect venues for your special occasions',
      page: 'services'
    }
  ];

  const featuredDestinations = [
    {
      id: 1,
      name: 'Paris, France',
      image: 'https://images.unsplash.com/photo-1431274172761-fca41d930114?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJpcyUyMGVpZmZlbCUyMHRvd2VyfGVufDF8fHx8MTc2MTQyMjQwMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      rating: 4.9
    },
    {
      id: 2,
      name: 'Dubai, UAE',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkdWJhaSUyMHNreWxpbmV8ZW58MXx8fHwxNzYxNDE5OTI5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      rating: 4.8
    },
    {
      id: 3,
      name: 'Bali, Indonesia',
      image: 'https://images.unsplash.com/photo-1704253411612-e4deb715dcd8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWxpJTIwdGVtcGxlfGVufDF8fHx8MTc2MTQ3OTc4Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      rating: 4.9
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Mitchell',
      location: 'New York, USA',
      text: 'Majik Travels made our visa application process so smooth! Their team was professional and got our visas approved quickly.',
      initials: 'SM'
    },
    {
      name: 'James Chen',
      location: 'Singapore',
      text: 'Booked our honeymoon through Majik Travels. The hotels were stunning and the entire trip was perfectly organized!',
      initials: 'JC'
    },
    {
      name: 'Aisha Patel',
      location: 'London, UK',
      text: 'Great service for corporate event bookings. They found us the perfect venue and handled all arrangements professionally.',
      initials: 'AP'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
          <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center">
          {/* Background Image + Gradient Overlay */}
          <div className="absolute inset-0">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1698047637300-fbd2c3a8ab8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhaXJwbGFuZSUyMHRyYXZlbCUyMGRlcGFydHVyZXxlbnwxfHx8fDE3NjE0OTcxMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Travel departure"
              className="w-full h-full object-cover"
            />
            {/* Overlay using theme colors */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-secondary/80" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 container mx-auto px-4 text-center">
            <Badge className="mb-6 bg-white/20 backdrop-blur-sm text-white border-white/30">
              ✨ Your Trusted Travel Partner
            </Badge>

            <h1 className="text-white text-5xl md:text-7xl mb-6 max-w-4xl mx-auto">
              Experience the{" "}
              <span className="bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
                Magic
              </span>{" "}
              of Travel
            </h1>

            <p className="text-white/90 text-xl md:text-2xl mb-12 max-w-2xl mx-auto">
              From flight bookings to visa applications, we handle everything so you can
              focus on making memories
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => onNavigate("book")}
                className="bg-primary hover:bg-secondary text-white text-lg px-8 shadow-lg hover:shadow-xl transition-all"
              >
                Book Your Journey
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => onNavigate("destinations")}
                className="border border-white/40 text-gray-700 hover:bg-white/10 text-lg px-8 backdrop-blur-sm"
              >
                Explore Destinations
              </Button>
            </div>
          </div>
        </section>


      {/* Services Overview */}
        <section className="py-20 bg-[var(--lighter-background)] text-foreground">
          <div className="container mx-auto px-4">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-semibold mb-4 text-primary">
                Our Services
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Comprehensive travel solutions tailored to your needs
              </p>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <Card
                    key={index}
                    className="hover:shadow-lg transition-all cursor-pointer group border border-border hover:border-primary/40 bg-card"
                    onClick={() => onNavigate(service.page)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <Icon className="h-8 w-8 text-primary group-hover:text-secondary transition-colors" />
                      </div>
                      <h3 className="text-xl mb-2 font-medium text-foreground">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground">{service.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* CTA Button */}
            <div className="text-center mt-12">
              <Button
                onClick={() => onNavigate("services")}
                variant="outline"
                size="lg"
                className="border-primary text-primary hover:bg-primary/10 hover:text-primary-foreground transition-all"
              >
                View All Services
              </Button>
            </div>
          </div>
        </section>

      {/* Featured Destinations */}
      <section className="py-20 bg-[var(--background)]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl mb-4 text-[var(--foreground)]">Featured Destinations</h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
              Discover our handpicked selection of amazing destinations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {featuredDestinations.map((destination) => (
              <Card 
                key={destination.id} 
                className="overflow-hidden hover:shadow-xl border border-[var(--border)] hover:border-[var(--primary)] transition-all cursor-pointer group rounded-xl bg-[var(--card)] text-[var(--card-foreground)]"
              >
                <div className="relative h-64 overflow-hidden rounded-t-xl">
                  <ImageWithFallback
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>

                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-[var(--primary)]" />
                      <h3 className="text-xl font-semibold">{destination.name}</h3>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-[var(--accent)] text-[var(--accent)]" />
                      <span className="text-[var(--secondary)] font-medium">{destination.rating}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              onClick={() => onNavigate('destinations')}
              size="lg"
              className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] hover:from-[var(--secondary)] hover:to-[var(--primary)] text-[var(--primary-foreground)] px-8 py-4 rounded-full shadow-lg transition-all duration-300"
            >
              Explore All Destinations
            </Button>
          </div>
        </div>
      </section>


      {/* Why Choose Us */}
      <section className="py-20 bg-[var(--card)] text-[var(--foreground)] transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl mb-4 text-[var(--primary)]">
              Why Choose Dêo Travel Agency?
            </h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
              We go beyond just booking flights. we create seamless, stress-free travel experiences. 
              Our mission is to make every journey memorable, affordable, and perfectly tailored to your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { title: "Best Price Guarantee", desc: "We match or beat any competitive price you find" },
              { title: "Expert Support", desc: "24/7 customer service to assist you anytime" },
              { title: "Trusted Partners", desc: "We work with verified airlines, hotels, and services" },
              { title: "Fast Visa Processing", desc: "Streamlined visa applications with high approval rates" },
              { title: "Flexible Booking", desc: "Easy modifications and cancellation policies" },
              { title: "Secure Payments", desc: "All transactions are encrypted and secure" },
            ].map((item, index) => (
              <div key={index} className="flex gap-4 items-start bg-[var(--background)] p-6 rounded-xl shadow-sm hover:shadow-md border border-[var(--border)] transition-all duration-300">
                <CheckCircle className="h-6 w-6 text-[var(--primary)] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl mb-2 text-[var(--foreground)]">{item.title}</h3>
                  <p className="text-[var(--muted-foreground)]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-[var(--lighter-background)] text-[var(--foreground)] transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl mb-4 text-[var(--primary)]">
              What Our Clients Say
            </h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
              Real experiences from our satisfied travelers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index} 
                className="hover:shadow-lg transition-shadow bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)]"
              >
                <CardContent className="p-6">
                  <Quote className="h-8 w-8 text-[var(--primary)] mb-4" />
                  <p className="text-[var(--muted-foreground)] mb-6">{testimonial.text}</p>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-[var(--primary)] text-[var(--primary-foreground)]">
                        {testimonial.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-[var(--foreground)]">{testimonial.name}</div>
                      <div className="text-sm text-[var(--muted-foreground)]">{testimonial.location}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>


      {/* CTA Section */}
        <section className="py-20 text-white bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] dark:from-[var(--secondary)] dark:to-[var(--primary)]">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl mb-6 text-[var(--primary-foreground)]">
              Ready to Start Your Adventure?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-[var(--accent-foreground)]/90">
              Let us help you plan the perfect trip. Book now and experience the magic!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => onNavigate('book')}
                className="bg-[var(--card)] text-[var(--primary)] hover:bg-[var(--muted)] text-lg px-8 transition-colors"
              >
                Book Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => onNavigate('contact')}
                className="bg-[var(--card-foreground)]/10 backdrop-blur-sm text-[var(--card)] border-[var(--card)]/30 hover:bg-[var(--card-foreground)]/20 text-lg px-8 transition-colors"
              >
                Contact Us
              </Button>
            </div>
          </div>
        </section>

    </div>
  );
}
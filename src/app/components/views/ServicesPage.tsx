import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Plane, 
  Hotel, 
  FileText, 
  Calendar, 
  Globe, 
  Shield, 
  HeadphonesIcon, 
  CreditCard,
  MapPin,
  Users,
  CheckCircle
} from 'lucide-react';
import { HeroSection } from '../heroSection';

interface ServicesPageProps {
  onNavigate: (page: string) => void;
}

export function ServicesPage({ onNavigate }: ServicesPageProps) {
  const mainServices = [
    {
      icon: Plane,
      title: 'Flight Bookings',
      description: 'Local and International Flights',
      details: [
        'Competitive pricing on all airlines',
        'Round-trip and one-way bookings',
        'Multi-city itineraries',
        'Flexible date options',
        'Group bookings available'
      ],
      image: 'https://images.unsplash.com/photo-1698047637300-fbd2c3a8ab8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhaXJwbGFuZSUyMHRyYXZlbCUyMGRlcGFydHVyZXxlbnwxfHx8fDE3NjE0OTcxMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      action: 'book'
    },
    {
      icon: FileText,
      title: 'Visa Applications',
      description: 'Fast & Reliable Visa Processing',
      details: [
        'Tourist and business visas',
        'Document preparation assistance',
        'Application tracking',
        'High approval rates',
        'Express processing available'
      ],
      image: 'https://images.unsplash.com/photo-1655722725332-9925c96dd627?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXNzcG9ydCUyMHZpc2ElMjBzdGFtcHN8ZW58MXx8fHwxNzYxNDk3MTIzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      action: 'visa'
    },
    {
      icon: Hotel,
      title: 'Hotel Reservations',
      description: 'Handpicked Accommodations Worldwide',
      details: [
        'Verified hotels and resorts',
        'Best price guarantee',
        'Luxury to budget options',
        'Special packages and deals',
        'Free cancellation on select bookings'
      ],
      image: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMGxvYmJ5fGVufDF8fHx8MTc2MTQ2MzAwM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      action: 'hotels'
    },
    {
      icon: Calendar,
      title: 'Event Space Bookings',
      description: 'Perfect Venues for Every Occasion',
      details: [
        'Corporate events and conferences',
        'Weddings and celebrations',
        'Destination events',
        'Venue sourcing and recommendations',
        'Event planning support'
      ],
      image: 'https://images.unsplash.com/photo-1759519238029-689e99c6d19e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldmVudCUyMHZlbnVlJTIwYmFsbHJvb218ZW58MXx8fHwxNzYxNDk3MTIzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      action: 'book'
    }
  ];

  const additionalServices = [
    {
      icon: Globe,
      title: 'Tour Packages',
      description: 'Curated experiences with local guides and authentic cultural immersion'
    },
    {
      icon: Shield,
      title: 'Travel Insurance',
      description: 'Comprehensive coverage to protect you throughout your journey'
    },
    {
      icon: HeadphonesIcon,
      title: '24/7 Support',
      description: 'Round-the-clock customer service for any travel emergencies'
    },
    {
      icon: CreditCard,
      title: 'Flexible Payments',
      description: 'Multiple payment options with installment plans available'
    },
    {
      icon: MapPin,
      title: 'Airport Transfers',
      description: 'Reliable transportation to and from airports worldwide'
    },
    {
      icon: Users,
      title: 'Group Travel',
      description: 'Special rates and packages for families and large groups'
    }
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <HeroSection
        title="Our Services"
        subtitle="Comprehensive travel solutions to make your journey seamless and memorable"
      />

      {/* Main Services */}
      <section className="py-20 bg-[var(--card)]">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-[var(--muted)] text-[var(--foreground)] border-[var(--border)]">
              Core Services
            </Badge>
            <h2 className="text-4xl md:text-5xl mb-4 text-[var(--foreground)]">
              What We Offer
            </h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
              Everything you need for your travel, all in one place
            </p>
          </div>

          {/* Service Blocks */}
          <div className="space-y-16">
            {mainServices.map((service, index) => {
              const Icon = service.icon;
              const isEven = index % 2 === 0;

              return (
                <div
                  key={index}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${
                    isEven ? '' : 'lg:grid-flow-dense'
                  }`}
                >
                  {/* Image Card */}
                  <div className={isEven ? '' : 'lg:col-start-2'}>
                    <Card className="h-full bg-[var(--card)] border border-[var(--border)] shadow-md">
                      <div className="h-80 overflow-hidden rounded-lg">
                        <ImageWithFallback
                          src={service.image}
                          alt={service.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </Card>
                  </div>

                  {/* Text & Details */}
                  <div className={isEven ? '' : 'lg:col-start-1 lg:row-start-1'}>
                    <div className="w-16 h-16 bg-gradient-to-br from-[var(--primary)]/10 to-[var(--secondary)]/10 rounded-2xl flex items-center justify-center mb-6">
                      <Icon className="h-8 w-8 text-[var(--primary)]" />
                    </div>

                    <h3 className="text-3xl mb-2 text-[var(--foreground)]">
                      {service.title}
                    </h3>
                    <p className="text-xl text-[var(--muted-foreground)] mb-6">
                      {service.description}
                    </p>

                    <ul className="space-y-3 mb-8">
                      {service.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-[var(--primary)] flex-shrink-0 mt-0.5" />
                          <span className="text-[var(--foreground)]">{detail}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      onClick={() => onNavigate(service.action)}
                      className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] hover:from-[var(--secondary)] hover:to-[var(--primary)] text-[var(--primary-foreground)] animate-gradient-x"
                    >
                      Get Started
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* Additional Services */}
      <section className="py-20 bg-[var(--lighter-background)] transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-[var(--muted)] text-[var(--foreground)] border-[var(--border)]">
              Additional Services
            </Badge>
            <h2 className="text-4xl md:text-5xl mb-4 text-[var(--foreground)]">
              More Ways We Can Help
            </h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
              Enhancing your travel experience with complementary services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {additionalServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-shadow bg-[var(--card)] border border-[var(--border)]"
                >
                  <CardContent className="p-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-[var(--primary)]/10 to-[var(--secondary)]/10 rounded-xl flex items-center justify-center mb-4">
                      <Icon className="h-7 w-7 text-[var(--primary)]" />
                    </div>
                    <h3 className="text-xl mb-2 text-[var(--foreground)]">{service.title}</h3>
                    <p className="text-[var(--muted-foreground)]">{service.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-[var(--background)] transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl mb-4 text-[var(--foreground)]">How It Works</h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
              Simple steps to book your perfect trip
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { step: 1, title: 'Choose Service', text: 'Select from our range of travel services' },
              { step: 2, title: 'Submit Details', text: 'Provide your travel requirements' },
              { step: 3, title: 'Get Quote', text: 'Receive a customized package quote' },
              { step: 4, title: 'Book & Travel', text: 'Confirm and start your journey' },
            ].map(({ step, title, text }) => (
              <div key={step} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--primary-foreground)] text-2xl animate-gradient-x shadow-md">
                  {step}
                </div>
                <h3 className="text-xl mb-2 text-[var(--foreground)]">{title}</h3>
                <p className="text-[var(--muted-foreground)]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] dark:from-[var(--secondary)] dark:to-[var(--primary)] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-white/90">
            Let our experts help you plan the perfect trip
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

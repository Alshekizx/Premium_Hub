import { Card, CardContent } from './ui/card';
import { Plane, Hotel, Car, Compass, Shield, HeadphonesIcon } from 'lucide-react';

const services = [
  {
    icon: Plane,
    title: 'Flight Booking',
    description: 'Book flights to anywhere in the world with competitive prices and flexible options'
  },
  {
    icon: Hotel,
    title: 'Hotel Reservations',
    description: 'Choose from thousands of verified hotels and accommodations worldwide'
  },
  {
    icon: Car,
    title: 'Car Rentals',
    description: 'Rent a car for your trip with our trusted partners and explore freely'
  },
  {
    icon: Compass,
    title: 'Tour Packages',
    description: 'Curated tour packages with local guides for an authentic experience'
  },
  {
    icon: Shield,
    title: 'Travel Insurance',
    description: 'Comprehensive travel insurance to protect you throughout your journey'
  },
  {
    icon: HeadphonesIcon,
    title: '24/7 Support',
    description: 'Round-the-clock customer support to assist you anytime, anywhere'
  }
];

export function Services() {
  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl mb-4">Our Services</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Everything you need for a perfect trip, all in one place
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl mb-2">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

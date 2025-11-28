import { Car, Home, Users, Award, Target, Heart, TrendingUp, Shield } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback'; 

export default function AboutPage() {
  const values = [
    {
      icon: Target,
      title: 'Mission Driven',
      description: 'To provide exceptional service and premium selections in both automotive and real estate markets.',
    },
    {
      icon: Heart,
      title: 'Customer First',
      description: 'Your satisfaction is our priority. We go above and beyond to exceed expectations.',
    },
    {
      icon: Shield,
      title: 'Trust & Integrity',
      description: 'Built on transparency, honesty, and ethical business practices in every transaction.',
    },
    {
      icon: TrendingUp,
      title: 'Innovation',
      description: 'Leveraging cutting-edge technology to deliver a seamless, modern experience.',
    },
  ];

  const stats = [
    { value: '15+', label: 'Years Experience' },
    { value: '10K+', label: 'Happy Clients' },
    { value: '1,700+', label: 'Properties & Vehicles' },
    { value: '25+', label: 'Industry Awards' },
  ];

  
    


  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/85 to-gray-900/90 z-10" />
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1630283017802-785b7aff9aac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzYzMzk2MjI0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="About Us"
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl text-white mb-6">About PremierHub</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Where automotive excellence meets exceptional real estate. 
            Your trusted partner for life&apos;s most important acquisitions.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl text-gray-900 mb-6">Our Story</h2>
              <p className="text-lg text-gray-700 mb-4">
                Founded in 2009, PremierHub was born from a simple yet powerful vision: to revolutionize 
                the way people acquire their most significant assets—vehicles and homes.
              </p>
              <p className="text-lg text-gray-700 mb-4">
                We recognized that the traditional buying and renting experience in both automotive 
                and real estate industries needed a fresh, customer-centric approach. By combining 
                these two essential markets under one roof, we created a unique platform that saves 
                our clients time, money, and stress.
              </p>
              <p className="text-lg text-gray-700">
                Today, we&apos;re proud to serve thousands of satisfied customers, offering premium 
                selections, transparent processes, and personalized service that sets new industry standards.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-8 rounded-2xl text-white">
                  <Car className="w-12 h-12 mb-4" />
                  <h3 className="text-2xl mb-2">Premium Cars</h3>
                  <p className="text-blue-100">Luxury vehicles curated for excellence</p>
                </div>
                <div className="bg-gradient-to-br from-amber-600 to-amber-700 p-8 rounded-2xl text-white">
                  <Home className="w-12 h-12 mb-4" />
                  <h3 className="text-2xl mb-2">Exceptional Homes</h3>
                  <p className="text-amber-100">Properties that define luxury living</p>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-8 rounded-2xl text-white">
                  <Users className="w-12 h-12 mb-4" />
                  <h3 className="text-2xl mb-2">Expert Team</h3>
                  <p className="text-purple-100">Professionals dedicated to your success</p>
                </div>
                <div className="bg-gradient-to-br from-green-600 to-green-700 p-8 rounded-2xl text-white">
                  <Award className="w-12 h-12 mb-4" />
                  <h3 className="text-2xl mb-2">Award Winning</h3>
                  <p className="text-green-100">Industry recognition and excellence</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-amber-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-5xl md:text-6xl text-white mb-2">{stat.value}</div>
                <div className="text-xl text-white/90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl hover:shadow-xl transition-shadow">
                <div className="inline-flex p-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


    </div>
  );
}

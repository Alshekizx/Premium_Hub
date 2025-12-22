import Link from "next/link";
import { Car, Home, ArrowRight, Star, Shield, Award, Users } from 'lucide-react';
import ImageWithAlternate from './components/figma/ImageWithFallback';


export default function HomePage() {
  const stats = [
    { icon: Car, label: 'Vehicles Available', value: '500+' },
    { icon: Home, label: 'Properties Listed', value: '1,200+' },
    { icon: Users, label: 'Happy Clients', value: '10,000+' },
    { icon: Award, label: 'Awards Won', value: '25+' },
  ];

  const features = [
    {
      icon: Shield,
      title: 'Trusted & Verified',
      description: 'All vehicles and properties undergo rigorous verification for your peace of mind.',
    },
    {
      icon: Star,
      title: 'Premium Selection',
      description: 'Curated collection of luxury cars and exceptional homes tailored to your lifestyle.',
    },
    {
      icon: Award,
      title: 'Award-Winning Service',
      description: 'Industry-leading customer service with personalized attention to every detail.',
    },
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/80 to-gray-900/95 z-10" />
        <ImageWithAlternate
            srcList={[
              "https://cdn.pixabay.com/photo/2023/05/03/14/47/bmw-7967852_640.jpg",
              "https://cdn.pixabay.com/photo/2017/07/09/03/19/home-2486092_640.jpg",
            ]}
            alt="Hero Background"
            className="absolute inset-0 w-full h-full object-cover"
          />


        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl text-white mb-6 tracking-tight">
            Your Premier Destination for
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-amber-400">
              Cars & Homes
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Discover luxury vehicles and exceptional properties all in one place. 
            Your dream lifestyle starts here.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/cars"
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <Car className="w-5 h-5" />
              Explore Cars
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/homes"
              className="group px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-full hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Explore Homes
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl text-gray-900 mb-4">Dual Excellence</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Whether you&lsquo;re looking for the perfect ride or the ideal home, we&lsquo;ve got you covered.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Cars Service */}
            <Link
              href="/cars"
              className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 p-8 hover:shadow-2xl transition-all hover:scale-[1.02]"
            >
              <div className="relative z-10">
                <div className="inline-flex p-3 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
                  <Car className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl text-white mb-4">Premium Vehicles</h3>
                <p className="text-blue-100 mb-6">
                  From luxury sedans to high-performance sports cars. Buy or rent with flexible options.
                </p>
                <div className="flex items-center gap-2 text-white group-hover:gap-4 transition-all">
                  <span>Browse Collection</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>

            {/* Homes Service */}
            <Link
              href="/homes"
              className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-600 to-amber-800 p-8 hover:shadow-2xl transition-all hover:scale-[1.02]"
            >
              <div className="relative z-10">
                <div className="inline-flex p-3 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
                  <Home className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl text-white mb-4">Exceptional Properties</h3>
                <p className="text-amber-100 mb-6">
                  From modern apartments to luxury estates. Find your perfect home to buy or rent.
                </p>
                <div className="flex items-center gap-2 text-white group-hover:gap-4 transition-all">
                  <span>View Properties</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl text-gray-900 mb-4">Why Choose PremierHub</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We combine expertise, quality, and service to deliver an unmatched experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl hover:shadow-xl transition-shadow"
              >
                <div className="inline-flex p-4 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl mb-6">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-blue-700 to-amber-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Let our experts help you find the perfect car or home that matches your lifestyle.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-700 rounded-full hover:shadow-2xl hover:scale-105 transition-all"
          >
            <span>Contact Us Today</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}

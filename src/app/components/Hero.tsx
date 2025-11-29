import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Calendar, MapPin, Users } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1702743599501-a821d0b38b66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGJlYWNoJTIwcGFyYWRpc2V8ZW58MXx8fHwxNzYxNDc2OTUxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Tropical paradise beach"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="text-white text-5xl md:text-7xl mb-6 max-w-4xl mx-auto">
          Discover Your Next Adventure
        </h1>
        <p className="text-white/90 text-xl md:text-2xl mb-12 max-w-2xl mx-auto">
          Explore the world with our expertly crafted travel experiences
        </p>

        {/* Search Card */}
        <Card className="max-w-4xl mx-auto p-6 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <MapPin className="h-5 w-5 text-gray-400" />
              <div className="text-left flex-1">
                <label className="text-xs text-gray-500">Destination</label>
                <input 
                  type="text" 
                  placeholder="Where to?" 
                  className="w-full outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div className="text-left flex-1">
                <label className="text-xs text-gray-500">Check In</label>
                <input 
                  type="date" 
                  className="w-full outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Users className="h-5 w-5 text-gray-400" />
              <div className="text-left flex-1">
                <label className="text-xs text-gray-500">Guests</label>
                <input 
                  type="number" 
                  placeholder="2" 
                  min="1"
                  className="w-full outline-none"
                />
              </div>
            </div>

            <Button className="h-full bg-blue-600 hover:bg-blue-700">
              Search
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
}

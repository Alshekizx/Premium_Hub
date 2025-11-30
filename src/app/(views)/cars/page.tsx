//file ../cars/page.tsx
//file ../cars/page.tsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, Bus, Calendar, DollarSign, Fuel, Users, Settings } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback'; 
import { db } from '../../../../firebase'; 
import { collection, getDocs } from 'firebase/firestore';
import { Car } from '@/app/data/cars';
export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');

  
  // Fetch cars from Firestore
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "cars"));
        const fetchedCars: Car[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as Partial<Car>;

          fetchedCars.push({
            id: doc.id,
            ...data,
          } as Car);
        });

        setCars(fetchedCars);
      } catch (error) {
        console.error("Error fetching cars:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'sports', label: 'Sports' },
    { value: 'luxury', label: 'Luxury' },
    { value: 'sedan', label: 'Sedan' },
    { value: 'suv', label: 'SUV' },
    { value: 'electric', label: 'Electric' },
  ];

  const types = [
    { value: 'all', label: 'All' },
    { value: 'sale', label: 'For Sale' },
    { value: 'rent', label: 'For Rent' },
  ];

  const filteredCars = cars.filter((car) => {
    const matchesSearch = car.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         car.brand?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || car.category === selectedCategory;
    const matchesType = selectedType === 'all' || car.type === selectedType || car.type === 'both';
    
    let matchesPrice = true;
    if (priceRange === 'under100k') matchesPrice = car.price < 100000;
    else if (priceRange === '100k-150k') matchesPrice = car.price >= 100000 && car.price < 150000;
    else if (priceRange === 'over150k') matchesPrice = car.price >= 150000;

    return matchesSearch && matchesCategory && matchesType && matchesPrice;
  });

  if (loading) {
    return (
      <div className="pt-40 text-center text-gray-600 text-xl">
        Loading cars...
      </div>
    );
  }
    return (
    <div className="pt-20 bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-80 flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex p-3 bg-white/10 backdrop-blur-sm rounded-2xl mb-4">
            <Bus className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl text-white mb-4">Premium Vehicles</h1>
          <p className="text-xl text-blue-100">
            Discover our curated collection of luxury cars for sale and rent
          </p>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="bg-white shadow-lg -mt-12 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by brand or model..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              >
                {types.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">Price Range</label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              >
                <option value="all">All Prices</option>
                <option value="under100k">Under ₦100K</option>
                <option value="100k-150k">₦100K - ₦150K</option>
                <option value="over150k">Over ₦150K</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedType('all');
                  setPriceRange('all');
                }}
                className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <Filter className="w-5 h-5" />
                Reset Filters
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-6 text-gray-600">
            Showing {filteredCars.length} vehicle{filteredCars.length !== 1 ? 's' : ''}
          </div>
        </div>
      </section>

      {/* Cars Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredCars.length === 0 ? (
            <div className="text-center py-20">
              <Bus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl text-gray-900 mb-2">No vehicles found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCars.map((car) => (
                <Link
                  key={car.id}
                  href={`/cars/${car.id}`}
                  className="group bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all hover:scale-[1.02]"
                >
                  <div className="relative h-64 overflow-hidden bg-gray-100">
                    <ImageWithFallback
                      src={car.image}
                      alt={car.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
                        {car.category}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-white text-gray-900 text-sm rounded-full">
                        {car.year}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-2xl text-gray-900 mb-2">{car.name}</h3>
                    <p className="text-gray-600 mb-4">{car.brand}</p>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Settings className="w-4 h-4" />
                        {car.transmission}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Fuel className="w-4 h-4" />
                        {car.fuelType}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        {car.seatingCapacity} seats
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Bus className="w-4 h-4" />
                        {car.mileage.toLocaleString()} mi
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4">
                      <div className="flex justify-between items-center">
                        <div>
                          {(car.type === 'sale' || car.type === 'both') && (
                            <div className="flex items-center gap-1 text-blue-600">
                              <DollarSign className="w-5 h-5" />
                              <span className="text-2xl">{car.price.toLocaleString()}</span>
                            </div>
                          )}
                          {car.type === 'rent' && (
                            <div className="flex items-center gap-1 text-blue-600">
                              <Calendar className="w-5 h-5" />
                              <span className="text-2xl">₦{car.rentalPrice}/day</span>
                            </div>
                          )}
                          {car.type === 'both' && (
                            <div className="text-sm text-gray-600 mt-1">
                              or ₦{car.rentalPrice}/day
                            </div>
                          )}
                        </div>
                        <span className="text-blue-600 group-hover:gap-2 flex items-center gap-1 transition-all">
                          View Details →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

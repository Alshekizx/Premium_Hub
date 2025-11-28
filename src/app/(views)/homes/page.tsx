'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, House, DollarSign, Bed, Bath, Square, MapPin } from 'lucide-react';
import { db } from '../../../../firebase'; 
import { collection, getDocs } from 'firebase/firestore';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { Home } from '@/app/data/homes';
export default function HomesPage() {
  const [homes, setHomes] = useState<Home[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [bedroomFilter, setBedroomFilter] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'villa', label: 'Villa' },
    { value: 'condo', label: 'Condo' },
    { value: 'townhouse', label: 'Townhouse' },
  ];

  const types = [
    { value: 'all', label: 'All' },
    { value: 'sale', label: 'For Sale' },
    { value: 'rent', label: 'For Rent' },
  ];

  // Fetch homes from Firestore
useEffect(() => {
  const fetchHomes = async () => {
    try {
      const homesCollection = collection(db, 'homes');
      const snapshot = await getDocs(homesCollection);
      const homesData: Home[] = snapshot.docs.map(doc => {
        const data = doc.data() as Omit<Home, 'id'>;
        return {
          id: doc.id, // Firestore doc ID
          ...data,
        } as Home;
      });
      setHomes(homesData);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch homes:', err);
      setLoading(false);
    }
  };

  fetchHomes();
}, []);

  const filteredHomes = homes.filter((home) => {
    const matchesSearch =
      home.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      home.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      home.state?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || home.category === selectedCategory;
    const matchesType =
      selectedType === 'all' || home.type === selectedType || home.type === 'both';

    let matchesBedrooms = true;
    if (bedroomFilter === '1-2') matchesBedrooms = home.bedrooms >= 1 && home.bedrooms <= 2;
    else if (bedroomFilter === '3-4') matchesBedrooms = home.bedrooms >= 3 && home.bedrooms <= 4;
    else if (bedroomFilter === '5+') matchesBedrooms = home.bedrooms >= 5;

    let matchesPrice = true;
    if (priceRange === 'under1m') matchesPrice = home.price < 1000000;
    else if (priceRange === '1m-2m') matchesPrice = home.price >= 1000000 && home.price < 2000000;
    else if (priceRange === '2m-3m') matchesPrice = home.price >= 2000000 && home.price < 3000000;
    else if (priceRange === 'over3m') matchesPrice = home.price >= 3000000;

    return matchesSearch && matchesCategory && matchesType && matchesBedrooms && matchesPrice;
  });

  if (loading) {
    return (
      <div className="text-center py-20">
        <House className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600">Loading properties...</p>
      </div>
    );
  }


  return (
    <div className="pt-20 bg-amber-50/30">
      {/* Hero Section */}
      <section className="relative h-80 flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-900 via-amber-800 to-amber-600">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex p-3 bg-white/10 backdrop-blur-sm rounded-2xl mb-4">
            <House className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl text-white mb-4">Exceptional Properties</h1>
          <p className="text-xl text-amber-100">
            Find your dream home from our exclusive collection of premium properties
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
                placeholder="Search by location, city, or property type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
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
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
              >
                {types.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">Bedrooms</label>
              <select
                value={bedroomFilter}
                onChange={(e) => setBedroomFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
              >
                <option value="all">Any</option>
                <option value="1-2">1-2 Beds</option>
                <option value="3-4">3-4 Beds</option>
                <option value="5+">5+ Beds</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">Price Range</label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
              >
                <option value="all">All Prices</option>
                <option value="under1m">Under $1M</option>
                <option value="1m-2m">$1M - $2M</option>
                <option value="2m-3m">$2M - $3M</option>
                <option value="over3m">Over $3M</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedType('all');
                  setBedroomFilter('all');
                  setPriceRange('all');
                }}
                className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <Filter className="w-5 h-5" />
                Reset
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-6 text-gray-600">
            Showing {filteredHomes.length} propert{filteredHomes.length !== 1 ? 'ies' : 'y'}
          </div>
        </div>
      </section>

      {/* Homes Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredHomes.length === 0 ? (
            <div className="text-center py-20">
              <House className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl text-gray-900 mb-2">No properties found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredHomes.map((home) => (
                <Link
                 key={home.id}
                 href={`/homes/${home.id}`}

                  className="group bg-white rounded-3xl overflow-hidden hover:shadow-2xl transition-all hover:scale-[1.02]"
                >
                  <div className="relative h-64 overflow-hidden bg-gray-100">
                    <ImageWithFallback
                      src={home.image}
                      alt={home.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-amber-600 text-white text-sm rounded-full capitalize">
                        {home.category}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-sm rounded-full">
                        {home.type === 'sale' ? 'For Sale' : home.type === 'rent' ? 'For Rent' : 'Sale/Rent'}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-2xl text-gray-900 mb-2">{home.title}</h3>
                    <div className="flex items-start gap-2 text-gray-600 mb-4">
                      <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                      <span>{home.address}, {home.city}, {home.state}</span>
                    </div>

                    <div className="flex items-center gap-4 mb-4 text-gray-600">
                      <div className="flex items-center gap-1">
                        <Bed className="w-4 h-4" />
                        <span>{home.bedrooms} bed</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bath className="w-4 h-4" />
                        <span>{home.bathrooms} bath</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Square className="w-4 h-4" />
                        <span>{home.sqft.toLocaleString()} sqft</span>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4">
                      <div className="flex justify-between items-center">
                        <div>
                          {(home.type === 'sale' || home.type === 'both') && (
                            <div className="flex items-center gap-1 text-amber-700">
                              <DollarSign className="w-5 h-5" />
                              <span className="text-2xl">
                                {(home.price / 1000000).toFixed(2)}M
                              </span>
                            </div>
                          )}
                          {home.type === 'rent' && (
                            <div className="flex items-center gap-1 text-amber-700">
                              <DollarSign className="w-5 h-5" />
                              <span className="text-2xl">{home.rentalPrice.toLocaleString()}/mo</span>
                            </div>
                          )}
                          {home.type === 'both' && (
                            <div className="text-sm text-gray-600 mt-1">
                              or ${home.rentalPrice.toLocaleString()}/mo
                            </div>
                          )}
                        </div>
                        <span className="text-amber-600 group-hover:gap-2 flex items-center gap-1 transition-all">
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

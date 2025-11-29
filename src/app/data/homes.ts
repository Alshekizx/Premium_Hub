export interface Home {
  id: string;
  title: string;
  price: number;
  rentalPrice: number;
  category: 'apartment' | 'house' | 'villa' | 'condo' | 'townhouse';
  type: 'sale' | 'rent' | 'both';
  image: string;
  images: string[];
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  yearBuilt: number;
  amenities: string[];
  description: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}



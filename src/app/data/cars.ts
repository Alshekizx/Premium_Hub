//file: /data/cars.ts

export interface InterestedUser {
  id: string;                  // unique id for the user message
  fullName: string;            // name of the user who is interested
  email: string;               // email of the user
  phone?: string;              // optional phone number
  message?: string;            // optional custom message

  itemId: string;
  itemName: string;              // ID of the car or home the user is interested in
  itemType: 'car' | 'home';    // type of item
  dateSubmitted: string;    // timestamp
}

export interface Car {
  id: string;
  name: string;
  brand: string;
  year: number;
  price: number;
  rentalPrice: number;
  category: 'sedan' | 'suv' | 'sports' | 'luxury' | 'electric';
  type: 'sale' | 'rent' | 'both';
  image: string;
  images: string[];
  mileage: number;
  transmission: 'automatic' | 'manual';
  fuelType: string;
  seatingCapacity: number;
  features: string[];
  description: string;

   interestedUsers?: InterestedUser[];
}



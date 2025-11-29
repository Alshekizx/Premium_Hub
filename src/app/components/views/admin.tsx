"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import QuillEditor from '../ui/quillEditor';
import { 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Globe,
  Plane,
  FileText,
  Hotel,
  Calendar,
  MessageSquare,
  Settings,
  BarChart3,
  Eye,
  Trash2,
  Plus,
  Save,
  LogOut,
  Lock,
  Shield,
  Edit,
  Quote,
  Paperclip,
  CheckCircle
} from 'lucide-react';

import { toast } from 'sonner';
import React from 'react';
import { db } from '../../../../firebase';
import { doc, setDoc, deleteDoc,  getDocs, query, collection, orderBy, getDoc, updateDoc } from "firebase/firestore";

interface AdminDashboardPageProps {
  onNavigate: (page: string) => void;
}

export interface CompanyInfo {
  phones: string[];
  emails: string[];
  address: string;
  workHours: string;
  socialMedia: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
  };
}

export interface FlightData {
  tripType: 'roundtrip' | 'oneway';
  from: string;
  to: string;
  departure: string;    // ISO date string
  return?: string;      // ISO date string, optional for one-way trips
  passengers: string;   // number of passengers as string
  class: 'economy' |'premium'| 'business' | 'first';
  email: string;
  note?: string;
}

export interface VisaData {
  country: string;
  visaType: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  travelDate: string;   // ISO date string
  note?: string;
}

export interface HotelData {
  destination: string;
  checkIn: string;      // ISO date string
  checkOut: string;     // ISO date string
  rooms: string;        // number of rooms as string
  guests: string;       // number of guests as string
  email: string;
  note?: string;
}

export interface EventData {
  eventType: string;
  location: string;
  date: string;         // ISO date string
  guests: string;       // number of guests as string
  duration: string;     // e.g., "2 hours" or "1 day"
  requirements?: string;
  email: string;
}



export type Booking =
  | { id: string; type: 'flight'; data: FlightData; timestamp: string }
  | { id: string; type: 'visa'; data: VisaData; timestamp: string }
  | { id: string; type: 'hotel'; data: HotelData; timestamp: string }
  | { id: string; type: 'event'; data: EventData; timestamp: string };


export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  inquiry: string;
  message: string;
  timestamp: string;
  countryCode: string;
}

interface Destination {
  id: string;
  name: string;
  region: string,
  image: string,
  rating: number,
  description: string,
  category: string,
  includes: string[];
  featured: boolean;
}

export interface HotelItem {
  id: string;
  name: string;
  location: string;
  description: string;
  image: string;
  rating: number;
  price: string;
  reviews: number;
  category: string;
  amenities:string[];
}

export interface VisaDestination {
  id: string;
  country: string;
  flag: string;
  processingTime: string;
  types: string[];          // e.g. ['Tourist', 'Business', 'Student']
  successRate?: string;     // e.g. '92%'       // whether it’s marked as popular
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  text: string;
  initials: string;
  approved: boolean;
}



export interface FAQ {
  id: string;
  question: string;
  answer: string;
}



export function AdminDashboardPage({ onNavigate }: AdminDashboardPageProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

// Company Info State
const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
  phones: [''],
  emails: [''],
  address: '',
  workHours: '',
  socialMedia: {
    facebook: '',
    instagram: '',
    twitter: '',
    linkedin: ''
  }
});

  // Bookings State
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);

const [destinations, setDestinations] = useState<Destination[]>([]);
const [hotels, setHotels] = useState<HotelItem[]>([]);
const [visaDestinations, setVisaDestinations] = useState<VisaDestination[]>([]);

const [faqs, setFaqs] = useState<FAQ[]>([
  {
    id: '1',
    question: 'How do I book a flight?',
    answer:
      'You can book flights through our Book Now page by selecting the Flight tab and filling out the booking form.',
  },
  {
    id: '2',
    question: 'What documents do I need for a visa application?',
    answer:
      'Required documents vary by country but typically include a valid passport, photos, application form, and supporting documents.',
  },
]);

  // New item forms
    const [newDestination, setNewDestination] = useState({
    name: '',
    region: '',
    image: '',
    rating: 5,
    description: '',
    category: '',
    includes: [] as string[],
    featured: false,
  });
  const [newHotel, setNewHotel] = useState({
    name: '',
    location: '',
    image: '',
    price: '',
    rating: 5,
    reviews: 0,
    category: '',
    amenities: [] as string[],
    description: '',
  });
  const [newVisaDestination, setNewVisaDestination] = useState<VisaDestination>({
  id: '',
  country: '',
  flag: '',
  processingTime: '',
  types: [],
  successRate: '',
});



  // Load data from localStorage
useEffect(() => {
  if (!isLoggedIn) return;

  const storedCompanyInfo = localStorage.getItem('company_info');
  const storedBookings = localStorage.getItem('bookings');
  const storedContacts = localStorage.getItem('contacts');
  const storedDestinations = localStorage.getItem('destinations');
  const storedHotels = localStorage.getItem('hotels');
  const storedVisaDestinations = localStorage.getItem('visa_destinations');
  const storedFaqs = localStorage.getItem('faqs');

  React.startTransition(() => {
    if (storedCompanyInfo) setCompanyInfo(JSON.parse(storedCompanyInfo));
    if (storedBookings) setBookings(JSON.parse(storedBookings));
    if (storedContacts) setContactSubmissions(JSON.parse(storedContacts));
    if (storedDestinations) setDestinations(JSON.parse(storedDestinations));
    if (storedHotels) setHotels(JSON.parse(storedHotels));
    if (storedVisaDestinations) setVisaDestinations(JSON.parse(storedVisaDestinations));
    if (storedFaqs) setFaqs(JSON.parse(storedFaqs));
  });
}, [isLoggedIn]);

const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password check (for demo purposes only)
    if (password === adminPassword) {
      setIsLoggedIn(true);
      toast.success('Welcome to Admin Dashboard!');
    } else {
      toast.error('Incorrect password. Try "admin123"');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPassword('');
    toast.success('Logged out successfully');
  };

// Save Company Info to Firestore first, then locally
const saveCompanyInfo = async () => {
  try {
    // Save remotely in Firestore (under "companyInfo" collection)
    await setDoc(doc(db, "companyInfo", "main"), companyInfo);

    // Only save locally if Firestore save was successful
    localStorage.setItem('company_info', JSON.stringify(companyInfo));

    toast.success('Company information saved successfully!');
  } catch (error) {
    console.error("Error saving company info:", error);
    toast.error('Failed to save company information!');
  }
};

useEffect(() => {
  const fetchBookings = async () => {
    try {
      const allBookings: Booking[] = [];

      // Flight bookings
      const flightSnap = await getDocs(query(collection(db, "flightBookings"), orderBy("createdAt", "desc")));
      flightSnap.forEach(doc => {
        allBookings.push({
          id: doc.id,
          type: "flight",
          data: doc.data() as FlightData,
          timestamp: (doc.data().createdAt?.toDate() || new Date()).toISOString(),
        });
      });

      // Visa bookings
      const visaSnap = await getDocs(query(collection(db, "visaApplications"), orderBy("createdAt", "desc")));
      visaSnap.forEach(doc => {
        allBookings.push({
          id: doc.id,
          type: "visa",
          data: doc.data() as VisaData,
          timestamp: (doc.data().createdAt?.toDate() || new Date()).toISOString(),
        });
      });

      // Hotel bookings
      const hotelSnap = await getDocs(query(collection(db, "hotelReservations"), orderBy("createdAt", "desc")));
      hotelSnap.forEach(doc => {
        allBookings.push({
          id: doc.id,
          type: "hotel",
          data: doc.data() as HotelData,
          timestamp: (doc.data().createdAt?.toDate() || new Date()).toISOString(),
        });
      });

      // Event bookings
      const eventSnap = await getDocs(query(collection(db, "eventBookings"), orderBy("createdAt", "desc")));
      eventSnap.forEach(doc => {
        allBookings.push({
          id: doc.id,
          type: "event",
          data: doc.data() as EventData,
          timestamp: (doc.data().createdAt?.toDate() || new Date()).toISOString(),
        });
      });

      // Update state
      setBookings(allBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load bookings from database!");
    }
  };

  fetchBookings();
}, []);

const deleteBooking = async (id: string, type: Booking['type']) => {
  try {
    const updatedBookings = bookings.filter(b => b.id !== id);
    setBookings(updatedBookings);
    localStorage.setItem("bookings", JSON.stringify(updatedBookings));

    let collectionName = '';
    switch(type) {
      case 'flight': collectionName = 'flightBookings'; break;
      case 'visa': collectionName = 'visaApplications'; break;
      case 'hotel': collectionName = 'hotelReservations'; break;
      case 'event': collectionName = 'eventBookings'; break;
    }

    await deleteDoc(doc(db, collectionName, id));
    toast.success("Booking deleted successfully!");
  } catch (error) {
    console.error("Error deleting booking:", error);
    toast.error("Failed to delete booking!");
  }
};

const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
const [isModalOpen, setIsModalOpen] = useState(false);

const handleBookingClick = (booking: Booking) => {
  setSelectedBooking(booking);
  setIsModalOpen(true);
};


useEffect(() => {
  const fetchContacts = async () => {
    try {
      const q = query(collection(db, "contactMessages"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const contacts: ContactSubmission[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          countryCode: data.countryCode || '',
          subject: data.subject,
          inquiry: data.inquiry,
          message: data.message,
          timestamp: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
        };
      });
      setContactSubmissions(contacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      toast.error("Failed to load contact submissions!");
    }
  };

  fetchContacts();
}, []);
const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);

const handleContactClick = (contact: ContactSubmission) => {
  setSelectedContact(contact);
  setIsModalOpen(true);
};



const deleteContact = async (id: string) => {
  try {
    // Delete from Firestore
    await deleteDoc(doc(db, "contactSubmissions", id));

    // Update local state
    setContactSubmissions(prev => prev.filter(c => c.id !== id));

    toast.success('Contact submission deleted successfully');
  } catch (error) {
    console.error("Error deleting contact:", error);
    toast.error('Failed to delete contact submission');
  }
};

const addDestination = async () => {
  if (!newDestination.name || !newDestination.description) {
    toast.error('Please fill in all required fields');
    return;
  }

  try {
    let updated: Destination[];

    if (editingId) {
      // ✏️ Update existing destination
      const updatedDestination = { ...newDestination, id: editingId };
      await setDoc(doc(db, "destinations", editingId), updatedDestination);
      updated = destinations.map(d => d.id === editingId ? updatedDestination : d);
      toast.success("Destination updated successfully!");
      setEditingId(null);
    } else {
      // ➕ Add new destination
      const id = crypto.randomUUID();
      const destination: Destination = { id, ...newDestination };
      await setDoc(doc(db, "destinations", id), destination);
      updated = [...destinations, destination];
      toast.success("Destination added successfully!");
    }

    setDestinations(updated);
    localStorage.setItem("destinations", JSON.stringify(updated));

    // Reset
    setNewDestination({
      name: "",
      region: "",
      image: "",
      rating: 5,
      description: "",
      category: "",
      includes: [],
      featured: false,
    });
  } catch (error) {
    console.error("Error adding/updating destination:", error);
    toast.error("Error saving destination");
  }
};




const deleteDestination = async (id: string) => {
  try {
    await deleteDoc(doc(db, "destinations", id));
    const updated = destinations.filter(d => d.id !== id);
    setDestinations(updated);
    localStorage.setItem("destinations", JSON.stringify(updated));
    toast.success("Destination deleted");
  } catch (error) {
    console.error("Error deleting destination:", error);
    toast.error("Error deleting destination");
  }
};

  const [editingId, setEditingId] = useState<string | null>(null);

  const editDestination = (dest: Destination) => {
  setNewDestination({
    name: dest.name,
    region: dest.region,
    image: dest.image,
    rating: dest.rating,
    description: dest.description,
    category: dest.category,
    includes: dest.includes || [],
    featured: dest.featured || false,
  });
  setEditingId(dest.id);
  toast.info(`Editing ${dest.name}`);
};

const fetchDestinations = async () => {
  try {
    const q = query(collection(db, "destinations"), orderBy("name"));
    const snapshot = await getDocs(q);
    const list: Destination[] = snapshot.docs.map(doc => doc.data() as Destination);
    setDestinations(list);
    localStorage.setItem("destinations", JSON.stringify(list));
  } catch (error) {
    console.error("Error fetching destinations:", error);
  }
};



const [editingHotelId, setEditingHotelId] = useState<string | null>(null);

const addHotel = async () => {
  if (!newHotel.name || !newHotel.location) {
    toast.error('Please fill in all required fields');
    return;
  }

  try {
    let updated: HotelItem[];

    if (editingHotelId) {
      const updatedHotel = { ...newHotel, id: editingHotelId };
      await setDoc(doc(db, "hotels", editingHotelId), updatedHotel);
      updated = hotels.map(h => h.id === editingHotelId ? updatedHotel : h);
      toast.success("Hotel updated successfully!");
      setEditingHotelId(null);
    } else {
      const id = crypto.randomUUID();
      const hotel: HotelItem = { id, ...newHotel };
      await setDoc(doc(db, "hotels", id), hotel);
      updated = [...hotels, hotel];
      toast.success("Hotel added successfully!");
    }

    setHotels(updated);
    localStorage.setItem("hotels", JSON.stringify(updated));

    setNewHotel({
      name: "",
      location: "",
      image: "",
      price: "",
      rating: 5,
      reviews: 0,
      category: "",
      amenities: [],
      description: "",
    });
  } catch (error) {
    console.error("Error saving hotel:", error);
    toast.error("Error saving hotel");
  }
};


const editHotel = (hotel: HotelItem) => {
  setNewHotel({
    name: hotel.name,
    location: hotel.location,
    image: hotel.image,
    price: hotel.price,
    rating: hotel.rating,
    reviews: hotel.reviews,
    category: hotel.category,
    amenities: hotel.amenities || [],
    description: hotel.description,
  });
  setEditingHotelId(hotel.id);
  toast.info(`Editing ${hotel.name}`);
};


const deleteHotel = async (id: string) => {
  try {
    await deleteDoc(doc(db, "hotels", id));
    const updated = hotels.filter(h => h.id !== id);
    setHotels(updated);
    localStorage.setItem("hotels", JSON.stringify(updated));
    toast.success("Hotel deleted");
  } catch (error) {
    console.error("Error deleting hotel:", error);
    toast.error("Error deleting hotel");
  }
};
const fetchHotels = async () => {
  try {
    const q = query(collection(db, "hotels"), orderBy("name"));
    const snapshot = await getDocs(q);
    const list: HotelItem[] = snapshot.docs.map(doc => doc.data() as HotelItem);
    setHotels(list);
    localStorage.setItem("hotels", JSON.stringify(list));
  } catch (error) {
    console.error("Error fetching hotels:", error);
  }
};


const addVisaDestination = async () => {
  if (!newVisaDestination.country || !newVisaDestination.flag) {
    toast.error('Please fill in all required fields');
    return;
  }

  try {
    let updatedList;

    if (newVisaDestination.id) {
      await setDoc(doc(db, "visaDestinations", newVisaDestination.id), newVisaDestination);
      updatedList = visaDestinations.map(v => v.id === newVisaDestination.id ? newVisaDestination : v);
      toast.success("Visa destination updated successfully!");
    } else {
      const id = crypto.randomUUID();
      const visaDest: VisaDestination = { ...newVisaDestination, id };
      await setDoc(doc(db, "visaDestinations", id), visaDest);
      updatedList = [...visaDestinations, visaDest];
      toast.success("Visa destination added successfully!");
    }

    setVisaDestinations(updatedList);
    localStorage.setItem("visa_destinations", JSON.stringify(updatedList));

    setNewVisaDestination({
      id: '',
      country: '',
      flag: '',
      processingTime: '',
      types: [],
      successRate: '',
    });
  } catch (error) {
    console.error("Error saving visa destination:", error);
    toast.error("Error saving visa destination");
  }
};

const editVisaDestination = (visa: VisaDestination) => {
  setNewVisaDestination(visa);
  toast.info(`Editing ${visa.country}`);
};


const deleteVisaDestination = async (id: string) => {
  try {
    await deleteDoc(doc(db, "visaDestinations", id));
    const updated = visaDestinations.filter(v => v.id !== id);
    setVisaDestinations(updated);
    localStorage.setItem("visa_destinations", JSON.stringify(updated));
    toast.success("Visa destination deleted");
  } catch (error) {
    console.error("Error deleting visa destination:", error);
    toast.error("Error deleting visa destination");
  }
};
const fetchVisaDestinations = async () => {
  try {
    const q = query(collection(db, "visaDestinations"), orderBy("country"));
    const snapshot = await getDocs(q);
    const list: VisaDestination[] = snapshot.docs.map(doc => doc.data() as VisaDestination);
    setVisaDestinations(list);
    localStorage.setItem("visa_destinations", JSON.stringify(list));
  } catch (error) {
    console.error("Error fetching visa destinations:", error);
  }
};

useEffect(() => {
  const fetchAllData = async () => {
    await Promise.all([
      fetchDestinations(),
      fetchHotels(),
      fetchVisaDestinations()
    ]);
  };

  fetchAllData();
}, []);



 const [testimonials, setTestimonials] = useState<Testimonial[]>([]);




const fetchTestimonials = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "testimonials"));
      const data: Testimonial[] = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as Testimonial[];
      setTestimonials(data);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      toast.error("Failed to fetch testimonials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  // ✅ Delete testimonial
  const deleteTestimonial = async (id: string) => {
    try {
      await deleteDoc(doc(db, "testimonials", id));
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
      toast.success("Testimonial deleted successfully!");
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      toast.error("Failed to delete testimonial");
    }
  };

  // ✅ Approve testimonial
  const approveTestimonial = async (id: string) => {
    try {
      const testimonialRef = doc(db, "testimonials", id);
      await updateDoc(testimonialRef, { approved: true });
      setTestimonials((prev) =>
        prev.map((t) => (t.id === id ? { ...t, approved: true } : t))
      );
      toast.success("Testimonial approved!");
    } catch (error) {
      console.error("Error approving testimonial:", error);
      toast.error("Failed to approve testimonial");
    }
  };

 const [newFaq, setNewFaq] = useState({ question: '', answer: '' });
   const [loading, setLoading] = useState(false);
   

 // ✅ Fetch FAQs from Firestore on component mount
  useEffect(() => {
    const fetchFaqs = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'faqs'), orderBy('question', 'asc'));
        const snapshot = await getDocs(q);
        const list: FAQ[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as FAQ[];
        setFaqs(list);
      } catch (error) {
        console.error('Error fetching FAQs:', error);
        toast.error('Failed to load FAQs');
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

   // ✅ Add new FAQ to Firestore
  const addFaq = async () => {
    if (!newFaq.question || !newFaq.answer) {
      toast.error('Please fill in all required fields');
      return;
    }

    const id = Date.now().toString();
    const faq: FAQ = { id, ...newFaq };

    try {
      await setDoc(doc(db, 'faqs', id), faq);
      setFaqs(prev => [...prev, faq]);
      setNewFaq({ question: '', answer: '' });
      toast.success('FAQ added successfully!');
    } catch (error) {
      console.error('Error adding FAQ:', error);
      toast.error('Failed to add FAQ');
    }
  };

  // ✅ Delete FAQ from Firestore
  const deleteFaq = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'faqs', id));
      setFaqs(prev => prev.filter(f => f.id !== id));
      toast.success('FAQ deleted');
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      toast.error('Failed to delete FAQ');
    }
  };

   const [terms, setTerms] = useState('');
  const [privacy, setPrivacy] = useState('');
 // ✅ Fetch contracts from Firestore when component mounts
  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const termsRef = doc(db, 'contracts', 'terms');
        const privacyRef = doc(db, 'contracts', 'privacy');

        const [termsSnap, privacySnap] = await Promise.all([
          getDoc(termsRef),
          getDoc(privacyRef),
        ]);

        if (termsSnap.exists()) {
          setTerms(termsSnap.data().content || '');
        }

        if (privacySnap.exists()) {
          setPrivacy(privacySnap.data().content || '');
        }

        toast.success('Contracts loaded successfully!');
      } catch (error) {
        console.error('Error fetching contracts:', error);
        toast.error('Failed to load contracts');
      }
    };

    fetchContracts();
  }, []);

  const saveContracts = async () => {
    try {
      await setDoc(doc(db, 'contracts', 'terms'), { content: terms });
      await setDoc(doc(db, 'contracts', 'privacy'), { content: privacy });
      toast.success('Contracts saved successfully!');
    } catch (error) {
      console.error('Error saving contracts:', error);
      toast.error('Failed to save contracts');
    }
  };

  // React Quill toolbar options
 

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--primary)] via-[var(--secondary)] to-[var(--primary)] animate-gradient-x flex items-center justify-center p-4">
  <Card className="w-full max-w-md bg-[var(--card)] text-[var(--card-foreground)] border border-[var(--border)] shadow-md">
    <CardHeader className="text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-full flex items-center justify-center mx-auto mb-4">
        <Shield className="h-8 w-8 text-[var(--primary-foreground)]" />
      </div>
      <CardTitle className="text-2xl font-semibold text-[var(--primary)]">
        Login
      </CardTitle>
    </CardHeader>

    <CardContent>
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password" className="text-[var(--foreground)]">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
            <Input
              id="password"
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 bg-[var(--input-background)] border border-[var(--border)] text-[var(--foreground)] placeholder-[var(--muted-foreground)]"
              required
            />
          </div>
       </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] hover:from-[var(--secondary)] hover:to-[var(--primary)] text-[var(--primary-foreground)] font-semibold transition-all duration-300 shadow-md"
        >
          Login
        </Button>
      </form>
    </CardContent>
  </Card>
</div>

    );
  }

  // Main Dashboard
  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Header */}
      <div
  className="text-[var(--primary-foreground)] py-8 shadow-lg"
  style={{
    background: `linear-gradient(to right, var(--primary), var(--secondary))`,
  }}
>
  <div className="container mx-auto px-4">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-4xl font-semibold mb-1">Admin Dashboard</h1>
        <p className="text-[var(--muted-foreground)]">Manage your travel agency</p>
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          className="border-[var(--border)] text-[var(--primary-foreground)] bg-[var(--primary)]/20 hover:bg-[var(--primary)]/30"
          onClick={() => onNavigate('home')}
        >
          <Eye className="h-4 w-4 mr-2" />
          View Website
        </Button>

        <Button
          variant="outline"
          className="border-[var(--border)] text-[var(--primary-foreground)] bg-[var(--secondary)]/20 hover:bg-[var(--secondary)]/30"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  </div>
</div>


      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 lg:grid-cols-8 gap-2 h-auto p-1 bg-white shadow-sm mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2 py-3">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="company" className="flex items-center gap-2 py-3">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Company</span>
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center gap-2 py-3">
              <Plane className="h-4 w-4" />
              <span className="hidden sm:inline">Bookings</span>
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex items-center gap-2 py-3">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Contacts</span>
            </TabsTrigger>
            <TabsTrigger value="destinations" className="flex items-center gap-2 py-3">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">Destinations</span>
            </TabsTrigger>
            <TabsTrigger value="faqs" className="flex items-center gap-2 py-3">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">FAQs</span>
            </TabsTrigger>
            <TabsTrigger value="testimonials" className="flex items-center gap-2 py-3">
              <Quote className="h-4 w-4" />
              <span className="hidden sm:inline">Testimonials</span>
            </TabsTrigger>

            <TabsTrigger value="contracts" className="flex items-center gap-2 py-3">
              <Paperclip className="h-4 w-4" />
              <span className="hidden sm:inline">Contracts</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Bookings</p>
                      <p className="text-3xl mt-2">{bookings.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <Plane className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Contact Forms</p>
                      <p className="text-3xl mt-2">{contactSubmissions.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                      <MessageSquare className="h-6 w-6 text-pink-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Destinations</p>
                      <p className="text-3xl mt-2">{destinations.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Globe className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">FAQs</p>
                      <p className="text-3xl mt-2">{faqs.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <MessageSquare className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.slice(0, 5).map(booking => (
                    <div key={booking.id} className="flex items-center justify-between border-b pb-3">
                      <div className="flex items-center gap-3">
                        {booking.type === 'flight' && <Plane className="h-5 w-5 text-purple-600" />}
                        {booking.type === 'visa' && <FileText className="h-5 w-5 text-blue-600" />}
                        {booking.type === 'hotel' && <Hotel className="h-5 w-5 text-pink-600" />}
                        {booking.type === 'event' && <Calendar className="h-5 w-5 text-green-600" />}
                        <div>
                          <p className="capitalize">{booking.type} Booking</p>
                          <p className="text-sm text-gray-500">{new Date(booking.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                      <Badge>{booking.type}</Badge>
                    </div>
                  ))}
                  {bookings.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No bookings yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Company Info Tab */}
<TabsContent value="company">
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Building2 className="h-6 w-6" />
        Company Information
      </CardTitle>
    </CardHeader>

    <CardContent className="space-y-6">
      {/* Phone Numbers */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2">
          <Phone className="h-4 w-4" />
          Phone Numbers
        </Label>
        <div className="space-y-2">
          {companyInfo.phones.map((phone, index) => (
            <Input
              key={index}
              value={phone}
              onChange={(e) => {
                const newPhones = [...companyInfo.phones];
                newPhones[index] = e.target.value;
                setCompanyInfo({ ...companyInfo, phones: newPhones });
              }}
            />
          ))}
        </div>
        <Button
          type="button"
          onClick={() =>
            setCompanyInfo({
              ...companyInfo,
              phones: [...companyInfo.phones, ""],
            })
          }
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Phone
        </Button>
      </div>

      {/* Email Addresses */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Email Addresses
        </Label>
        <div className="space-y-2">
          {companyInfo.emails.map((email, index) => (
            <Input
              key={index}
              type="email"
              value={email}
              onChange={(e) => {
                const newEmails = [...companyInfo.emails];
                newEmails[index] = e.target.value;
                setCompanyInfo({ ...companyInfo, emails: newEmails });
              }}
            />
          ))}
        </div>
        <Button
          type="button"
          onClick={() =>
            setCompanyInfo({
              ...companyInfo,
              emails: [...companyInfo.emails, ""],
            })
          }
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Email
        </Button>
      </div>

      {/* Office Address */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Office Address
        </Label>
        <Textarea
          value={companyInfo.address}
          onChange={(e) =>
            setCompanyInfo({ ...companyInfo, address: e.target.value })
          }
          rows={2}
        />
      </div>

      {/* Work Hours */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Work Hours
        </Label>
        <Input
          value={companyInfo.workHours}
          onChange={(e) =>
            setCompanyInfo({ ...companyInfo, workHours: e.target.value })
          }
        />
      </div>

      {/* Social Media Links */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          Social Media Links
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm">Facebook</Label>
            <Input
              value={companyInfo.socialMedia.facebook}
              onChange={(e) =>
                setCompanyInfo({
                  ...companyInfo,
                  socialMedia: {
                    ...companyInfo.socialMedia,
                    facebook: e.target.value,
                  },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Instagram</Label>
            <Input
              value={companyInfo.socialMedia.instagram}
              onChange={(e) =>
                setCompanyInfo({
                  ...companyInfo,
                  socialMedia: {
                    ...companyInfo.socialMedia,
                    instagram: e.target.value,
                  },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Twitter</Label>
            <Input
              value={companyInfo.socialMedia.twitter}
              onChange={(e) =>
                setCompanyInfo({
                  ...companyInfo,
                  socialMedia: {
                    ...companyInfo.socialMedia,
                    twitter: e.target.value,
                  },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm">LinkedIn</Label>
            <Input
              value={companyInfo.socialMedia.linkedin}
              onChange={(e) =>
                setCompanyInfo({
                  ...companyInfo,
                  socialMedia: {
                    ...companyInfo.socialMedia,
                    linkedin: e.target.value,
                  },
                })
              }
            />
          </div>
        </div>
      </div>

      <Button
        onClick={saveCompanyInfo}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
      >
        <Save className="h-4 w-4 mr-2" />
        Save Company Information
      </Button>
    </CardContent>
  </Card>
</TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid grid-cols-5 mb-6">
                <TabsTrigger value="all">All ({bookings.length})</TabsTrigger>
                <TabsTrigger value="flight">Flights ({bookings.filter(b => b.type === 'flight').length})</TabsTrigger>
                <TabsTrigger value="visa">Visa ({bookings.filter(b => b.type === 'visa').length})</TabsTrigger>
                <TabsTrigger value="hotel">Hotels ({bookings.filter(b => b.type === 'hotel').length})</TabsTrigger>
                <TabsTrigger value="event">Events ({bookings.filter(b => b.type === 'event').length})</TabsTrigger>
              </TabsList>

              {['all', 'flight', 'visa', 'hotel', 'event'].map(type => (
                <TabsContent key={type} value={type}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="capitalize">{type === 'all' ? 'All Bookings' : `${type} Bookings`}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Details</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {bookings
                            .filter(b => type === 'all' || b.type === type)
                            .map(booking => (
                              <TableRow 
                                key={booking.id} 
                                className="cursor-pointer hover:bg-gray-50" 
                                onClick={() => handleBookingClick(booking)}
                              >
                                <TableCell className="text-xs">{booking.id.slice(0, 8)}...</TableCell>
                                <TableCell>
                                  <Badge variant={
                                    booking.type === 'flight' ? 'default' :
                                    booking.type === 'visa' ? 'secondary' :
                                    booking.type === 'hotel' ? 'outline' : 'default'
                                  }>
                                    {booking.type}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-sm">
                                  {booking.type === 'flight' && (
                                    <span>{booking.data.from} → {booking.data.to}</span>
                                  )}
                                  {booking.type === 'visa' && (
                                    <span>{booking.data.firstName} {booking.data.lastName} - {booking.data.country}</span>
                                  )}
                                  {booking.type === 'hotel' && (
                                    <span>{booking.data.destination}</span>
                                  )}
                                  {booking.type === 'event' && (
                                    <span>{booking.data.eventType} - {booking.data.location}</span>
                                  )}
                                </TableCell>
                                <TableCell className="text-sm">{new Date(booking.timestamp).toLocaleString()}</TableCell>
                                <TableCell>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation(); // Prevent triggering row click
                                      deleteBooking(booking.id, booking.type);
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-600" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                          ))}
                        </TableBody>

                      </Table>
                      {isModalOpen && selectedBooking && (
                        <div className="fixed inset-0 bg-[#00000055] bg-opacity-30 flex items-center justify-center z-50">
                          <div className="bg-white p-6 rounded shadow-lg w-96 relative">
                            <h2 className="text-xl font-bold mb-4">Booking Details</h2>
                           {selectedBooking && selectedBooking.type === "flight" && (
                            <div className="space-y-1">
                              <p><strong>From:</strong> {(selectedBooking.data as FlightData).from}</p>
                              <p><strong>To:</strong> {(selectedBooking.data as FlightData).to}</p>
                              <p><strong>Trip Type:</strong> {(selectedBooking.data as FlightData).tripType}</p>
                              <p><strong>Departure:</strong> {(selectedBooking.data as FlightData).departure}</p>
                              {((selectedBooking.data as FlightData).tripType === "roundtrip") && (
                                <p><strong>Return:</strong> {(selectedBooking.data as FlightData).return}</p>
                              )}
                              <p><strong>Passengers:</strong> {(selectedBooking.data as FlightData).passengers}</p>
                              <p><strong>Class:</strong> {(selectedBooking.data as FlightData).class}</p>
                              <p><strong>Email:</strong> {(selectedBooking.data as FlightData).email}</p>
                              {(selectedBooking.data as FlightData).note && (
                                <p><strong>Note:</strong> {(selectedBooking.data as FlightData).note}</p>
                              )}
                            </div>
                          )}
                          {selectedBooking && selectedBooking.type === "visa" && (
                            <div className="space-y-1">
                              <p><strong>Full Name:</strong> {(selectedBooking.data as VisaData).firstName} {(selectedBooking.data as VisaData).lastName}</p>
                              <p><strong>Country:</strong> {(selectedBooking.data as VisaData).country}</p>
                              <p><strong>Visa Type:</strong> {(selectedBooking.data as VisaData).visaType}</p>
                              <p><strong>Email:</strong> {(selectedBooking.data as VisaData).email}</p>
                              <p><strong>Phone:</strong> {(selectedBooking.data as VisaData).phone}</p>
                              <p><strong>Travel Date:</strong> {(selectedBooking.data as VisaData).travelDate}</p>
                              {(selectedBooking.data as VisaData).note && (
                                <p><strong>Note:</strong> {(selectedBooking.data as VisaData).note}</p>
                              )}
                            </div>
                          )}

                          {selectedBooking && selectedBooking.type === "hotel" && (
                            <div className="space-y-1">
                              <p><strong>Destination:</strong> {(selectedBooking.data as HotelData).destination}</p>
                              <p><strong>Check-In:</strong> {(selectedBooking.data as HotelData).checkIn}</p>
                              <p><strong>Check-Out:</strong> {(selectedBooking.data as HotelData).checkOut}</p>
                              <p><strong>Rooms:</strong> {(selectedBooking.data as HotelData).rooms}</p>
                              <p><strong>Guests:</strong> {(selectedBooking.data as HotelData).guests}</p>
                              <p><strong>Email:</strong> {(selectedBooking.data as HotelData).email}</p>
                              {(selectedBooking.data as HotelData).note && (
                                <p><strong>Note:</strong> {(selectedBooking.data as HotelData).note}</p>
                              )}
                            </div>
                          )}

                          {selectedBooking && selectedBooking.type === "event" && (
                            <div className="space-y-1">
                              <p><strong>Event Type:</strong> {(selectedBooking.data as EventData).eventType}</p>
                              <p><strong>Location:</strong> {(selectedBooking.data as EventData).location}</p>
                              <p><strong>Date:</strong> {(selectedBooking.data as EventData).date}</p>
                              <p><strong>Guests:</strong> {(selectedBooking.data as EventData).guests}</p>
                              <p><strong>Duration:</strong> {(selectedBooking.data as EventData).duration}</p>
                              {(selectedBooking.data as EventData).requirements && (
                                <p><strong>Requirements:</strong> {(selectedBooking.data as EventData).requirements}</p>
                              )}
                              <p><strong>Email:</strong> {(selectedBooking.data as EventData).email}</p>
                            </div>
                          )}
                            <button
                              className="absolute top-2 right-2 text-red-500 font-bold"
                              onClick={() => setIsModalOpen(false)}
                            >
                              X
                            </button>
                          </div>
                        </div>
                      )}

                      {bookings.filter(b => type === 'all' || b.type === type).length === 0 && (
                        <p className="text-center text-gray-500 py-8">No bookings found</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </TabsContent>

          {/* Contacts Tab */}
          <TabsContent value="contacts">
            <Card>
              <CardHeader>
                <CardTitle>Contact Form Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>phone</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Inquiry Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contactSubmissions.map(contact => (
                      <TableRow key={contact.id}  onClick={() => handleContactClick(contact)}>
                        <TableCell>{contact.name}</TableCell>
                        <TableCell>{contact.email}</TableCell>
                        <TableCell>{contact.countryCode}-{contact.phone}</TableCell>
                        <TableCell>{contact.subject}</TableCell>
                        <TableCell>
                          <Badge>{contact.inquiry}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">{new Date(contact.timestamp).toLocaleString()}</TableCell>
                        <TableCell>
                          <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent opening modal
                                deleteContact(contact.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {isModalOpen && selectedContact && (
                    <div className="fixed inset-0 bg-[#00000055] bg-opacity-30 flex items-center justify-center z-50">
                      <div className="bg-white p-6 rounded shadow-lg w-96 relative">
                        <button
                              className="absolute top-2 right-2 text-red-500 font-bold"
                              onClick={() => setIsModalOpen(false)}
                            >
                              X
                            </button>

                        <h2 className="text-xl font-bold mb-4">Contact Details</h2>
                        <p><strong>Name:</strong> {selectedContact.name}</p>
                        <p><strong>Email:</strong> {selectedContact.email}</p>
                        <p><strong>Phone:</strong> {selectedContact.countryCode}-{selectedContact.phone}</p>
                        <p><strong>Subject:</strong> {selectedContact.subject}</p>
                        <p><strong>Inquiry:</strong> {selectedContact.inquiry}</p>
                        <p><strong>Message:</strong> {selectedContact.message}</p>
                        <p><strong>Date:</strong> {new Date(selectedContact.timestamp).toLocaleString()}</p>

                        
                      </div>
                    </div>
                  )}

                {contactSubmissions.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No contact submissions yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Destinations Tab */}
          <TabsContent value="destinations">
            <div className="space-y-6">
              {/* Add New Destination */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Add New Content
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="destination">
                    <TabsList className="grid grid-cols-3 mb-6">
                      <TabsTrigger value="destination">Destination</TabsTrigger>
                      <TabsTrigger value="hotel">Hotel</TabsTrigger>
                      <TabsTrigger value="visa">Visa Destination</TabsTrigger>
                    </TabsList>

                    {/* Add Destination */}
                    <TabsContent value="destination">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Destination Name *</Label>
            <Input
              value={newDestination.name}
              onChange={(e) =>
                setNewDestination({ ...newDestination, name: e.target.value })
              }
              placeholder="e.g., Paris, France"
            />
          </div>

          <div className="space-y-2">
            <Label>Region *</Label>
            <Input
              value={newDestination.region}
              onChange={(e) =>
                setNewDestination({ ...newDestination, region: e.target.value })
              }
              placeholder="e.g., Europe, Asia, Middle East"
            />
          </div>

          <div className="space-y-2">
            <Label>Image URL *</Label>
            <Input
              value={newDestination.image}
              onChange={(e) =>
                setNewDestination({ ...newDestination, image: e.target.value })
              }
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label>Rating *</Label>
            <Input
              type="number"
              min="1"
              max="5"
              step="0.1"
              value={newDestination.rating}
              onChange={(e) =>
                setNewDestination({
                  ...newDestination,
                  rating: parseFloat(e.target.value),
                })
              }
              placeholder="e.g., 4.9"
            />
          </div>

          <div className="space-y-2">
            <Label>Category *</Label>
            <Input
              value={newDestination.category}
              onChange={(e) =>
                setNewDestination({
                  ...newDestination,
                  category: e.target.value,
                })
              }
              placeholder="e.g., Cultural, Beach, Luxury"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Description *</Label>
            <Textarea
              value={newDestination.description}
              onChange={(e) =>
                setNewDestination({
                  ...newDestination,
                  description: e.target.value,
                })
              }
              placeholder="Describe the destination"
              rows={3}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Includes *</Label>
            <Input
              value={newDestination.includes.join(', ')}
              onChange={(e) =>
                setNewDestination({
                  ...newDestination,
                  includes: e.target.value
                    .split(',')
                    .map((item) => item.trim())
                    .filter(Boolean),
                })
              }
              placeholder="e.g., Flights, Hotels, Tours"
            />
            <p className="text-xs text-muted-foreground">
              Separate each item with a comma.
            </p>
          </div>

                        <div className="space-y-2 md:col-span-2 flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="featured-dest"
                            checked={newDestination.featured}
                            onChange={(e) => setNewDestination({ ...newDestination, featured: e.target.checked })}
                            className="rounded"
                          />
                          <Label htmlFor="featured-dest" className="mb-0">Mark as Featured</Label>
                        </div>

                        <div className="md:col-span-2">
                          <Button onClick={addDestination} className="w-full bg-purple-600 hover:bg-purple-700">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Destination
                          </Button>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Add  Hotel */}
                    <TabsContent value="hotel">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Hotel Name */}
                        <div className="space-y-2">
                          <Label>Hotel Name *</Label>
                          <Input
                            value={newHotel.name}
                            onChange={(e) => setNewHotel({ ...newHotel, name: e.target.value })}
                            placeholder="e.g., Grand Palace Hotel"
                          />
                        </div>

                        {/* Location */}
                        <div className="space-y-2">
                          <Label>Location *</Label>
                          <Input
                            value={newHotel.location}
                            onChange={(e) => setNewHotel({ ...newHotel, location: e.target.value })}
                            placeholder="e.g., Paris, France"
                          />
                        </div>

                        {/* Image URL */}
                        <div className="space-y-2">
                          <Label>Image URL</Label>
                          <Input
                            value={newHotel.image}
                            onChange={(e) => setNewHotel({ ...newHotel, image: e.target.value })}
                            placeholder="https://example.com/hotel.jpg"
                          />
                        </div>

                        {/* Price */}
                        <div className="space-y-2">
                          <Label>Price per night</Label>
                          <Input
                            type="text"
                            value={newHotel.price}
                            onChange={(e) => setNewHotel({ ...newHotel, price: e.target.value })}
                            placeholder="e.g., $250 per night"
                          />
                        </div>

                        {/* Rating */}
                        <div className="space-y-2">
                          <Label>Rating</Label>
                          <Input
                            type="number"
                            min="1"
                            max="5"
                            value={newHotel.rating}
                            onChange={(e) =>
                              setNewHotel({ ...newHotel, rating: parseInt(e.target.value) || 5 })
                            }
                          />
                        </div>

                        {/* Reviews */}
                        <div className="space-y-2">
                          <Label>Reviews</Label>
                          <Input
                            type="number"
                            min="0"
                            value={newHotel.reviews}
                            onChange={(e) =>
                              setNewHotel({ ...newHotel, reviews: parseInt(e.target.value) || 0 })
                            }
                            placeholder="Number of reviews"
                          />
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                          <Label>Category</Label>
                          <Input
                            value={newHotel.category}
                            onChange={(e) => setNewHotel({ ...newHotel, category: e.target.value })}
                            placeholder="e.g., Luxury, Budget, Resort"
                          />
                        </div>

                        {/* Amenities */}
                        <div className="space-y-2 md:col-span-2">
                          <Label>Amenities</Label>
                          <Input
                            value={newHotel.amenities.join(', ')}
                            onChange={(e) =>
                              setNewHotel({
                                ...newHotel,
                                amenities: e.target.value
                                  .split(',')
                                  .map((item) => item.trim())
                                  .filter(Boolean),
                              })
                            }
                            placeholder="e.g., Free WiFi, Pool, Gym"
                          />
                        </div>

                        {/* Description */}
                        <div className="space-y-2 md:col-span-2">
                          <Label>Description</Label>
                          <Textarea
                            value={newHotel.description}
                            onChange={(e) => setNewHotel({ ...newHotel, description: e.target.value })}
                            placeholder="Describe the hotel"
                            rows={3}
                          />
                        </div>

                        {/* Submit Button */}
                        <div className="md:col-span-2">
                          <Button
                            onClick={addHotel}
                            className={`w-full ${
                              editingHotelId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-purple-600 hover:bg-purple-700'
                            }`}
                          >
                            {editingHotelId ? (
                              <>
                                <Edit className="h-4 w-4 mr-2" />
                                Update Hotel
                              </>
                            ) : (
                              <>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Hotel
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </TabsContent>


                    {/* Add Visa Destination */}
                    <TabsContent value="visa">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Country */}
                        <div className="space-y-2">
                          <Label>Country *</Label>
                          <Input
                            value={newVisaDestination.country}
                            onChange={(e) =>
                              setNewVisaDestination({ ...newVisaDestination, country: e.target.value })
                            }
                            placeholder="e.g., United States"
                          />
                        </div>

                        {/* Flag */}
                        <div className="space-y-2">
                          <Label>Country Flag (Emoji or URL)</Label>
                          <Input
                            value={newVisaDestination.flag}
                            onChange={(e) =>
                              setNewVisaDestination({ ...newVisaDestination, flag: e.target.value })
                            }
                            placeholder="e.g., 🇺🇸 or https://example.com/flag.png"
                          />
                        </div>

                        {/* Visa Types */}
                        <div className="space-y-2 md:col-span-2">
                          <Label>Visa Types *</Label>
                          <Input
                            value={newVisaDestination.types.join(', ')}
                            onChange={(e) =>
                              setNewVisaDestination({
                                ...newVisaDestination,
                                types: e.target.value
                                  .split(',')
                                  .map((type) => type.trim())
                                  .filter(Boolean),
                              })
                            }
                            placeholder="e.g., Tourist, Business, Student"
                          />
                          <p className="text-xs text-muted-foreground">
                            Separate each type with a comma.
                          </p>
                        </div>

                        {/* Processing Time */}
                        <div className="space-y-2">
                          <Label>Processing Time *</Label>
                          <Input
                            value={newVisaDestination.processingTime}
                            onChange={(e) =>
                              setNewVisaDestination({ ...newVisaDestination, processingTime: e.target.value })
                            }
                            placeholder="e.g., 7–14 days"
                          />
                        </div>

                        {/* Success Rate */}
                        <div className="space-y-2">
                          <Label>Success Rate *</Label>
                          <Input
                            value={newVisaDestination.successRate}
                            onChange={(e) =>
                              setNewVisaDestination({ ...newVisaDestination, successRate: e.target.value })
                            }
                            placeholder="e.g., 92%"
                          />
                        </div>

                       

                       

                        {/* Submit Button */}
                        <div className="md:col-span-2">
                          <Button
                            onClick={addVisaDestination}
                            className="w-full bg-purple-600 hover:bg-purple-700"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Visa Destination
                          </Button>
                        </div>
                      </div>
                    </TabsContent>

                  </Tabs>
                </CardContent>
              </Card>

              {/* Manage Existing Content */}
              <Card>
                <CardHeader>
                  <CardTitle>Manage Existing Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="destinations">
                    <TabsList className="grid grid-cols-3 mb-6">
                      <TabsTrigger value="destinations">Destinations ({destinations.length})</TabsTrigger>
                      <TabsTrigger value="hotels">Hotels ({hotels.length})</TabsTrigger>
                      <TabsTrigger value="visas">Visa Destinations ({visaDestinations.length})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="destinations">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Region</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Rating</TableHead>
                            <TableHead>Includes</TableHead>
                            <TableHead>Featured</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {destinations.length > 0 ? (
                            destinations.map((dest) => (
                              <TableRow key={dest.id}>
                                <TableCell className="font-medium">{dest.name}</TableCell>
                                <TableCell>{dest.region}</TableCell>
                                <TableCell>{dest.category}</TableCell>
                                <TableCell>{dest.rating}</TableCell>
                                <TableCell className="max-w-xs truncate">
                                  {dest.includes && dest.includes.length > 0
                                    ? dest.includes.join(', ')
                                    : '—'}
                                </TableCell>
                                <TableCell>
                                  {dest.featured && <Badge variant="default">Featured</Badge>}
                                </TableCell>
                                <TableCell className="max-w-sm truncate">
                                  {dest.description}
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => deleteDestination(dest.id)}
                                    title="Delete"
                                  >
                                    <Trash2 className="h-4 w-4 text-red-600" />
                                  </Button>

                                  
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => editDestination(dest)}
                                    title="Edit"
                                  >
                                    <Edit className="h-4 w-4 text-blue-600" />
                                  </Button> 
                                
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                                No destinations added yet.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TabsContent>


                    {/* Manage Hotels */}
                    <TabsContent value="hotels">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Price per nignt</TableHead>
                            <TableHead>Rating</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>

                        <TableBody>
                          {hotels.length > 0 ? (
                            hotels.map((hotel) => (
                              <TableRow key={hotel.id}>
                                <TableCell className="font-medium">{hotel.name}</TableCell>
                                <TableCell>{hotel.location}</TableCell>
                                <TableCell>{hotel.price || '—'}</TableCell>
                                <TableCell>{'⭐'.repeat(hotel.rating)}</TableCell>
                                <TableCell>{hotel.category || '—'}</TableCell>
                                <TableCell className="flex items-center gap-2">
                                  {/* Edit Button */}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    title="Edit"
                                    onClick={() => editHotel(hotel)}
                                  >
                                    <Edit className="h-4 w-4 text-blue-600" />
                                  </Button>

                                  {/* Delete Button */}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    title="Delete"
                                    onClick={() => deleteHotel(hotel.id)}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-600" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                                No hotels found.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TabsContent>



                    <TabsContent value="visas">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Country</TableHead>
                              <TableHead>Processing Time</TableHead>
                              <TableHead>Visa Types</TableHead>
                              <TableHead>Success Rate</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>

                          <TableBody>
                            {visaDestinations.length > 0 ? (
                              visaDestinations.map((visa) => (
                                <TableRow key={visa.id}>
                                  <TableCell className="font-medium">{visa.country}</TableCell>
                                  <TableCell>{visa.processingTime || '—'}</TableCell>
                                  <TableCell>
                                    {visa.types && visa.types.length > 0
                                      ? visa.types.join(', ')
                                      : '—'}
                                  </TableCell>
                                  <TableCell>{visa.successRate ? `${visa.successRate}%` : '—'}</TableCell>
                                  
                                  <TableCell className="flex items-center gap-2">
                                    {/* Edit Button */}
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      title="Edit"
                                      onClick={() => editVisaDestination(visa)}
                                    >
                                      <Edit className="h-4 w-4 text-blue-600" />
                                    </Button>

                                    {/* Delete Button */}
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      title="Delete"
                                      onClick={() => deleteVisaDestination(visa.id)}
                                    >
                                      <Trash2 className="h-4 w-4 text-red-600" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                                  No visa destinations found.
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </TabsContent>

                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* FAQs Tab */}
          <TabsContent value="faqs">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Add Visa New FAQ
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Question *</Label>
                      <Input
                        value={newFaq.question}
                        onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                        placeholder="Enter the question"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Answer *</Label>
                      <Textarea
                        value={newFaq.answer}
                        onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                        placeholder="Enter the answer"
                        rows={4}
                      />
                    </div>
                    <Button onClick={addFaq} className="w-full bg-purple-600 hover:bg-purple-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add FAQ
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Manage FAQs</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Question</TableHead>
                        <TableHead>Answer</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {faqs.map(faq => (
                        <TableRow key={faq.id}>
                          <TableCell className="max-w-xs">{faq.question}</TableCell>
                          <TableCell className="max-w-md truncate">{faq.answer}</TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => deleteFaq(faq.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Testimonials Tab */}
          <TabsContent value="testimonials">
            <Card>
      <CardHeader>
        <CardTitle>Client Testimonials</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-center text-gray-500">Loading testimonials...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Feedback</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testimonials.length > 0 ? (
                testimonials.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>{t.name}</TableCell>
                    <TableCell>{t.location}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {t.text}
                    </TableCell>
                    <TableCell>
                      {t.approved ? (
                        <span className="text-green-600 font-medium">Approved</span>
                      ) : (
                        <span className="text-yellow-600 font-medium">Pending</span>
                      )}
                    </TableCell>
                    <TableCell className="flex gap-2">
                      {!t.approved && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => approveTestimonial(t.id)}
                          title="Approve"
                        >
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteTestimonial(t.id)}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                    No testimonials found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
          </TabsContent>

          {/* contracts Tab */}
<TabsContent value="contracts">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Manage Contracts
            </CardTitle>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="termsOfService">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="termsOfService">Terms of Service</TabsTrigger>
                <TabsTrigger value="privacyPolicy">Privacy Policy</TabsTrigger>
              </TabsList>

<TabsContent value="termsOfService">
  <QuillEditor value={terms} onChange={setTerms} />
</TabsContent>

<TabsContent value="privacyPolicy">
  <QuillEditor value={privacy} onChange={setPrivacy} />
</TabsContent>
            </Tabs>

            <div className="flex justify-end mt-6">
              <Button onClick={saveContracts}>Save All</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}

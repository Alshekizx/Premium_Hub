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
  Shield
} from 'lucide-react';
import { toast } from 'sonner';
import React from 'react';

interface AdminDashboardPageProps {
  onNavigate: (page: string) => void;
}

interface CompanyInfo {
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

interface FlightData {
  from: string;
  to: string;
}

interface VisaData {
  firstName: string;
  lastName: string;
  country: string;
}

interface HotelData {
  destination: string;
}

interface EventData {
  eventType: string;
  location: string;
}

type Booking =
  | { id: string; type: 'flight'; data: FlightData; timestamp: string }
  | { id: string; type: 'visa'; data: VisaData; timestamp: string }
  | { id: string; type: 'hotel'; data: HotelData; timestamp: string }
  | { id: string; type: 'event'; data: EventData; timestamp: string };


interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  inquiry: string;
  message: string;
  timestamp: string;
}

interface Destination {
  id: string;
  name: string;
  description: string;
  image: string;
  featured: boolean;
}

interface HotelItem {
  id: string;
  name: string;
  location: string;
  description: string;
  image: string;
  rating: number;
}

interface VisaDestination {
  id: string;
  country: string;
  requirements: string;
  processingTime: string;
  popular: boolean;
}

interface FAQ {
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
    phones: ['+1 (555) MAJIK-00', '+1 (555) 624-4500'],
    emails: ['info@majiktravels.com', 'support@majiktravels.com'],
    address: '123 Travel Plaza, Suite 500, New York, NY 10001',
    workHours: 'Mon-Fri: 9AM - 6PM, Sat-Sun: 10AM - 4PM',
    socialMedia: {
      facebook: 'https://facebook.com/majiktravels',
      instagram: 'https://instagram.com/majiktravels',
      twitter: 'https://twitter.com/majiktravels',
      linkedin: 'https://linkedin.com/company/majiktravels'
    }
  });

  // Bookings State
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);

  // Content Management State
  const [destinations, setDestinations] = useState<Destination[]>([
    {
      id: '1',
      name: 'Paris, France',
      description: 'The City of Light awaits with its iconic Eiffel Tower',
      image: 'paris.jpg',
      featured: true
    },
    {
      id: '2',
      name: 'Tokyo, Japan',
      description: 'Experience the perfect blend of tradition and modernity',
      image: 'tokyo.jpg',
      featured: true
    }
  ]);

  const [hotels, setHotels] = useState<HotelItem[]>([
    {
      id: '1',
      name: 'Grand Palace Hotel',
      location: 'Paris, France',
      description: 'Luxury 5-star accommodation',
      image: 'hotel1.jpg',
      rating: 5
    }
  ]);

  const [visaDestinations, setVisaDestinations] = useState<VisaDestination[]>([
    {
      id: '1',
      country: 'United States',
      requirements: 'Valid passport, DS-160, Interview',
      processingTime: '2-4 weeks',
      popular: true
    },
    {
      id: '2',
      country: 'United Kingdom',
      requirements: 'Valid passport, Online application, Biometrics',
      processingTime: '3 weeks',
      popular: true
    }
  ]);

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
  const [newDestination, setNewDestination] = useState({ name: '', description: '', image: '', featured: false });
  const [newHotel, setNewHotel] = useState({ name: '', location: '', description: '', image: '', rating: 5 });
  const [newVisaDestination, setNewVisaDestination] = useState({ country: '', requirements: '', processingTime: '', popular: false });
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });

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


  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password check (for demo purposes only)
    if (password === 'admin123') {
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

  const saveCompanyInfo = () => {
    localStorage.setItem('company_info', JSON.stringify(companyInfo));
    toast.success('Company information saved successfully!');
  };

  const deleteBooking = (id: string) => {
    const updated = bookings.filter(b => b.id !== id);
    setBookings(updated);
    localStorage.setItem('bookings', JSON.stringify(updated));
    toast.success('Booking deleted');
  };

  const deleteContact = (id: string) => {
    const updated = contactSubmissions.filter(c => c.id !== id);
    setContactSubmissions(updated);
    localStorage.setItem('contacts', JSON.stringify(updated));
    toast.success('Contact submission deleted');
  };

  const addDestination = () => {
    if (!newDestination.name || !newDestination.description) {
      toast.error('Please fill in all required fields');
      return;
    }
    const destination: Destination = {
      id: Date.now().toString(),
      ...newDestination
    };
    const updated = [...destinations, destination];
    setDestinations(updated);
    localStorage.setItem('destinations', JSON.stringify(updated));
    setNewDestination({ name: '', description: '', image: '', featured: false });
    toast.success('Destination added successfully!');
  };

  const deleteDestination = (id: string) => {
    const updated = destinations.filter(d => d.id !== id);
    setDestinations(updated);
    localStorage.setItem('destinations', JSON.stringify(updated));
    toast.success('Destination deleted');
  };

  const addHotel = () => {
    if (!newHotel.name || !newHotel.location) {
      toast.error('Please fill in all required fields');
      return;
    }
    const hotel: HotelItem = {
      id: Date.now().toString(),
      ...newHotel
    };
    const updated = [...hotels, hotel];
    setHotels(updated);
    localStorage.setItem('hotels', JSON.stringify(updated));
    setNewHotel({ name: '', location: '', description: '', image: '', rating: 5 });
    toast.success('Hotel added successfully!');
  };

  const deleteHotel = (id: string) => {
    const updated = hotels.filter(h => h.id !== id);
    setHotels(updated);
    localStorage.setItem('hotels', JSON.stringify(updated));
    toast.success('Hotel deleted');
  };

  const addVisaDestination = () => {
    if (!newVisaDestination.country || !newVisaDestination.requirements) {
      toast.error('Please fill in all required fields');
      return;
    }
    const visaDest: VisaDestination = {
      id: Date.now().toString(),
      ...newVisaDestination
    };
    const updated = [...visaDestinations, visaDest];
    setVisaDestinations(updated);
    localStorage.setItem('visa_destinations', JSON.stringify(updated));
    setNewVisaDestination({ country: '', requirements: '', processingTime: '', popular: false });
    toast.success('Visa destination added successfully!');
  };

  const deleteVisaDestination = (id: string) => {
    const updated = visaDestinations.filter(v => v.id !== id);
    setVisaDestinations(updated);
    localStorage.setItem('visa_destinations', JSON.stringify(updated));
    toast.success('Visa destination deleted');
  };

  const addFaq = () => {
    if (!newFaq.question || !newFaq.answer) {
      toast.error('Please fill in all required fields');
      return;
    }
    const faq: FAQ = {
      id: Date.now().toString(),
      ...newFaq
    };
    const updated = [...faqs, faq];
    setFaqs(updated);
    localStorage.setItem('faqs', JSON.stringify(updated));
    setNewFaq({ question: '', answer: '' });
    toast.success('FAQ added successfully!');
  };

  const deleteFaq = (id: string) => {
    const updated = faqs.filter(f => f.id !== id);
    setFaqs(updated);
    localStorage.setItem('faqs', JSON.stringify(updated));
    toast.success('FAQ deleted');
  };

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
        Admin Dashboard
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
          <p className="text-xs text-[var(--muted-foreground)]">Demo password: admin123</p>
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] hover:from-[var(--secondary)] hover:to-[var(--primary)] text-[var(--primary-foreground)] font-semibold transition-all duration-300 shadow-md"
        >
          Login to Dashboard
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
          <TabsList className="grid grid-cols-2 lg:grid-cols-6 gap-2 h-auto p-1 bg-white shadow-sm mb-8">
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
                </div>

                {/* Office Address */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Office Address
                  </Label>
                  <Textarea
                    value={companyInfo.address}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, address: e.target.value })}
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
                    onChange={(e) => setCompanyInfo({ ...companyInfo, workHours: e.target.value })}
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
                        onChange={(e) => setCompanyInfo({
                          ...companyInfo,
                          socialMedia: { ...companyInfo.socialMedia, facebook: e.target.value }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Instagram</Label>
                      <Input
                        value={companyInfo.socialMedia.instagram}
                        onChange={(e) => setCompanyInfo({
                          ...companyInfo,
                          socialMedia: { ...companyInfo.socialMedia, instagram: e.target.value }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Twitter</Label>
                      <Input
                        value={companyInfo.socialMedia.twitter}
                        onChange={(e) => setCompanyInfo({
                          ...companyInfo,
                          socialMedia: { ...companyInfo.socialMedia, twitter: e.target.value }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">LinkedIn</Label>
                      <Input
                        value={companyInfo.socialMedia.linkedin}
                        onChange={(e) => setCompanyInfo({
                          ...companyInfo,
                          socialMedia: { ...companyInfo.socialMedia, linkedin: e.target.value }
                        })}
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
                              <TableRow key={booking.id}>
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
                                    onClick={() => deleteBooking(booking.id)}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-600" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
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
                      <TableHead>Subject</TableHead>
                      <TableHead>Inquiry Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contactSubmissions.map(contact => (
                      <TableRow key={contact.id}>
                        <TableCell>{contact.name}</TableCell>
                        <TableCell>{contact.email}</TableCell>
                        <TableCell>{contact.subject}</TableCell>
                        <TableCell>
                          <Badge>{contact.inquiry}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">{new Date(contact.timestamp).toLocaleString()}</TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => deleteContact(contact.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
                            onChange={(e) => setNewDestination({ ...newDestination, name: e.target.value })}
                            placeholder="e.g., Paris, France"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Image URL</Label>
                          <Input
                            value={newDestination.image}
                            onChange={(e) => setNewDestination({ ...newDestination, image: e.target.value })}
                            placeholder="URL or filename"
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label>Description *</Label>
                          <Textarea
                            value={newDestination.description}
                            onChange={(e) => setNewDestination({ ...newDestination, description: e.target.value })}
                            placeholder="Describe the destination"
                            rows={3}
                          />
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

                    {/* Add Hotel */}
                    <TabsContent value="hotel">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Hotel Name *</Label>
                          <Input
                            value={newHotel.name}
                            onChange={(e) => setNewHotel({ ...newHotel, name: e.target.value })}
                            placeholder="e.g., Grand Palace Hotel"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Location *</Label>
                          <Input
                            value={newHotel.location}
                            onChange={(e) => setNewHotel({ ...newHotel, location: e.target.value })}
                            placeholder="e.g., Paris, France"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Image URL</Label>
                          <Input
                            value={newHotel.image}
                            onChange={(e) => setNewHotel({ ...newHotel, image: e.target.value })}
                            placeholder="URL or filename"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Rating</Label>
                          <Input
                            type="number"
                            min="1"
                            max="5"
                            value={newHotel.rating}
                            onChange={(e) => setNewHotel({ ...newHotel, rating: parseInt(e.target.value) })}
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label>Description</Label>
                          <Textarea
                            value={newHotel.description}
                            onChange={(e) => setNewHotel({ ...newHotel, description: e.target.value })}
                            placeholder="Describe the hotel"
                            rows={3}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Button onClick={addHotel} className="w-full bg-purple-600 hover:bg-purple-700">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Hotel
                          </Button>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Add Visa Destination */}
                    <TabsContent value="visa">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Country *</Label>
                          <Input
                            value={newVisaDestination.country}
                            onChange={(e) => setNewVisaDestination({ ...newVisaDestination, country: e.target.value })}
                            placeholder="e.g., United States"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Processing Time</Label>
                          <Input
                            value={newVisaDestination.processingTime}
                            onChange={(e) => setNewVisaDestination({ ...newVisaDestination, processingTime: e.target.value })}
                            placeholder="e.g., 2-4 weeks"
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label>Requirements *</Label>
                          <Textarea
                            value={newVisaDestination.requirements}
                            onChange={(e) => setNewVisaDestination({ ...newVisaDestination, requirements: e.target.value })}
                            placeholder="List visa requirements"
                            rows={3}
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2 flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="popular-visa"
                            checked={newVisaDestination.popular}
                            onChange={(e) => setNewVisaDestination({ ...newVisaDestination, popular: e.target.checked })}
                            className="rounded"
                          />
                          <Label htmlFor="popular-visa" className="mb-0">Mark as Popular</Label>
                        </div>
                        <div className="md:col-span-2">
                          <Button onClick={addVisaDestination} className="w-full bg-purple-600 hover:bg-purple-700">
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
                            <TableHead>Description</TableHead>
                            <TableHead>Featured</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {destinations.map(dest => (
                            <TableRow key={dest.id}>
                              <TableCell>{dest.name}</TableCell>
                              <TableCell className="max-w-xs truncate">{dest.description}</TableCell>
                              <TableCell>
                                {dest.featured && <Badge variant="default">Featured</Badge>}
                              </TableCell>
                              <TableCell>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => deleteDestination(dest.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TabsContent>

                    <TabsContent value="hotels">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Rating</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {hotels.map(hotel => (
                            <TableRow key={hotel.id}>
                              <TableCell>{hotel.name}</TableCell>
                              <TableCell>{hotel.location}</TableCell>
                              <TableCell>{'⭐'.repeat(hotel.rating)}</TableCell>
                              <TableCell>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => deleteHotel(hotel.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TabsContent>

                    <TabsContent value="visas">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Country</TableHead>
                            <TableHead>Processing Time</TableHead>
                            <TableHead>Popular</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {visaDestinations.map(visa => (
                            <TableRow key={visa.id}>
                              <TableCell>{visa.country}</TableCell>
                              <TableCell>{visa.processingTime}</TableCell>
                              <TableCell>
                                {visa.popular && <Badge variant="default">Popular</Badge>}
                              </TableCell>
                              <TableCell>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => deleteVisaDestination(visa.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
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
                    Add New FAQ
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
        </Tabs>
      </div>
    </div>
  );
}

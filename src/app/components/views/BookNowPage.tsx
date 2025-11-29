import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Plane, 
  Hotel, 
  FileText, 
  Calendar,
  Users,
  MapPin,
  CreditCard,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { db } from '../../../../firebase';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Booking, EventData, FlightData, HotelData, VisaData } from './admin';



export function BookNowPage() {
  const [activeTab, setActiveTab] = useState('flight');

  // Flight booking form
 const [flightData, setFlightData] = useState<FlightData>({
  tripType: 'roundtrip', // ok, 'roundtrip' is allowed
  from: '',
  to: '',
  departure: '',
  return: '',
  passengers: '1',
  class: 'economy',      // ok, 'economy' is allowed
  email: '',
  note: '',
});

const [visaData, setVisaData] = useState<VisaData>({
  country: '',
  visaType: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  travelDate: '',
  note: '',
});

const [hotelData, setHotelData] = useState<HotelData>({
  destination: '',
  checkIn: '',
  checkOut: '',
  rooms: '1',
  guests: '2',
  email: '',
  note: '',
});

const [eventData, setEventData] = useState<EventData>({
  eventType: '',
  location: '',
  date: '',
  guests: '',
  duration: '',
  requirements: '',
  email: '',
});



const [, setBookings] = useState<Booking[]>([]);

const handleFlightSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    // Save to Firestore
    const docRef = await addDoc(collection(db, "flightBookings"), {
      ...flightData,
      createdAt: serverTimestamp(),
    });

    // Add to local state
    setBookings(prev => [
      ...prev,
      { id: docRef.id, type: 'flight', data: flightData, timestamp: new Date().toISOString() }
    ]);

    toast.success('Flight booking request submitted! Our team will contact you shortly.');

    // Reset form
    setFlightData({
      tripType: 'roundtrip',
      from: '',
      to: '',
      departure: '',
      return: '',
      passengers: '1',
      class: 'economy',
      email: '',
      note: '',
    });

  } catch (error) {
    console.error("Error submitting flight booking:", error);
    toast.error('Failed to submit flight booking. Please try again.');
  }
};

const handleVisaSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const docRef = await addDoc(collection(db, "visaApplications"), {
      ...visaData,
      createdAt: serverTimestamp(),
    });

    setBookings(prev => [
      ...prev,
      { id: docRef.id, type: 'visa', data: visaData, timestamp: new Date().toISOString() }
    ]);

    toast.success('Visa application submitted! We will review your information and contact you within 24 hours.');

    setVisaData({
      country: '',
      visaType: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      travelDate: '',
      note: '',
    });

  } catch (error) {
    console.error("Error submitting visa application:", error);
    toast.error('Failed to submit visa application. Please try again.');
  }
};

// Similarly, for hotel and event bookings:
const handleHotelSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const docRef = await addDoc(collection(db, "hotelReservations"), {
      ...hotelData,
      createdAt: serverTimestamp(),
    });

    setBookings(prev => [
      ...prev,
      { id: docRef.id, type: 'hotel', data: hotelData, timestamp: new Date().toISOString() }
    ]);

    toast.success('Hotel reservation request submitted! We\'ll send you the best options shortly.');

    setHotelData({
      destination: '',
      checkIn: '',
      checkOut: '',
      rooms: '1',
      guests: '2',
      email: '',
      note: '',
    });

  } catch (error) {
    console.error("Error submitting hotel reservation:", error);
    toast.error('Failed to submit hotel reservation. Please try again.');
  }
};

const handleEventSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const docRef = await addDoc(collection(db, "eventBookings"), {
      ...eventData,
      createdAt: serverTimestamp(),
    });

    setBookings(prev => [
      ...prev,
      { id: docRef.id, type: 'event', data: eventData, timestamp: new Date().toISOString() }
    ]);

    toast.success('Event space booking request received! Our event specialists will contact you soon.');

    setEventData({
      eventType: '',
      location: '',
      date: '',
      guests: '',
      duration: '',
      requirements: '',
      email: ''
    });

  } catch (error) {
    console.error("Error submitting event booking:", error);
    toast.error('Failed to submit event booking. Please try again.');
  }
};


  return (
    <div className="pt-16">
      {/* Hero Section */}
        <section
          className="relative py-20 text-white"
          style={{
            background: 'linear-gradient(90deg, var(--primary), var(--accent))',
          }}
        >
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-6xl mb-4 font-bold">
              Book Your Journey
            </h1>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto">
              Start planning your perfect trip with Majik Travels
            </p>
          </div>
        </section>


      {/* Booking Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 lg:grid-cols-4 h-auto p-1 bg-white shadow-sm mb-8">
              <TabsTrigger value="flight" className="flex flex-col items-center gap-2 py-4">
                <Plane className="h-5 w-5" />
                <span>Flights</span>
              </TabsTrigger>
              <TabsTrigger value="visa" className="flex flex-col items-center gap-2 py-4">
                <FileText className="h-5 w-5" />
                <span>Visa</span>
              </TabsTrigger>
              <TabsTrigger value="hotel" className="flex flex-col items-center gap-2 py-4">
                <Hotel className="h-5 w-5" />
                <span>Hotels</span>
              </TabsTrigger>
              <TabsTrigger value="event" className="flex flex-col items-center gap-2 py-4">
                <Calendar className="h-5 w-5" />
                <span>Events</span>
              </TabsTrigger>
            </TabsList>

           {/* Flight Booking */}
          <TabsContent value="flight">
            <Card className="bg-card text-card-foreground border border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plane className="h-6 w-6 text-primary" />
                  Flight Booking
                </CardTitle>
                <p className="text-muted-foreground">
                  Find the best flights for your journey
                </p>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleFlightSubmit} className="space-y-6">
                  {/* Trip Type Buttons */}
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant={flightData.tripType === 'roundtrip' ? 'default' : 'outline'}
                      onClick={() =>
                        setFlightData({ ...flightData, tripType: 'roundtrip' })
                      }
                      className={
                        flightData.tripType === 'roundtrip'
                          ? 'bg-primary hover:bg-secondary text-primary-foreground'
                          : 'border border-border text-foreground hover:bg-muted'
                      }
                    >
                      Round Trip
                    </Button>

                    <Button
                      type="button"
                      variant={flightData.tripType === 'oneway' ? 'default' : 'outline'}
                      onClick={() =>
                        setFlightData({ ...flightData, tripType: 'oneway' })
                      }
                      className={
                        flightData.tripType === 'oneway'
                          ? 'bg-primary hover:bg-secondary text-primary-foreground'
                          : 'border border-border text-foreground hover:bg-muted'
                      }
                    >
                      One Way
                    </Button>
                  </div>

                  {/* Locations */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="from">From *</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="from"
                          placeholder="Departure city"
                          value={flightData.from}
                          onChange={(e) =>
                            setFlightData({ ...flightData, from: e.target.value })
                          }
                          className="pl-10 bg-input-background border-border"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="to">To *</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="to"
                          placeholder="Destination city"
                          value={flightData.to}
                          onChange={(e) =>
                            setFlightData({ ...flightData, to: e.target.value })
                          }
                          className="pl-10 bg-input-background border-border"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="departure">Departure Date *</Label>
                      <Input
                        id="departure"
                        type="date"
                        value={flightData.departure}
                        onChange={(e) =>
                          setFlightData({ ...flightData, departure: e.target.value })
                        }
                        className="bg-input-background border-border"
                        required
                      />
                    </div>

                    {flightData.tripType === 'roundtrip' && (
                      <div className="space-y-2">
                        <Label htmlFor="return">Return Date *</Label>
                        <Input
                          id="return"
                          type="date"
                          value={flightData.return}
                          onChange={(e) =>
                            setFlightData({ ...flightData, return: e.target.value })
                          }
                          className="bg-input-background border-border"
                          required
                        />
                      </div>
                    )}
                  </div>

                  {/* Passengers & Class */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="passengers">Passengers *</Label>
                      <Select
                        value={flightData.passengers}
                        onValueChange={(value) =>
                          setFlightData({ ...flightData, passengers: value })
                        }
                      >
                        <SelectTrigger id="passengers" className="bg-input-background">
                          <SelectValue placeholder="Select number" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} {num === 1 ? 'Passenger' : 'Passengers'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="class">Class *</Label>
                      <Select
                        value={flightData.class}
                        onValueChange={(value) =>
                          setFlightData({ ...flightData, class: value as 'economy' | 'premium' | 'business' | 'first' })
                        }
                      >
                        <SelectTrigger id="class" className="bg-input-background">
                          <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="economy">Economy</SelectItem>
                          <SelectItem value="premium">Premium Economy</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="first">First Class</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={flightData.email}
                      onChange={(e) =>
                        setFlightData({ ...flightData, email: e.target.value })
                      }
                      className="bg-input-background border-border"
                      required
                    />
                  </div>

                  {/* Note */}
                  <div className="space-y-2">
                    <Label htmlFor="note">Note (Optional)</Label>
                    <textarea
                      id="note"
                      placeholder="Add any special requests or notes here..."
                      value={flightData.note}
                      onChange={(e) =>
                        setFlightData({ ...flightData, note: e.target.value })
                      }
                      className="w-full min-h-[100px] p-3 rounded-md border border-border bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-accent text-primary-foreground animate-gradient-x"
                    size="lg"
                  >
                    Search Flights
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>



            {/* Visa Application */}
            <TabsContent value="visa">
              <Card className="bg-card text-card-foreground border border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-6 w-6 text-primary" />
                    Visa Application
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Apply for your visa with expert assistance
                  </p>
                </CardHeader>

                <CardContent>
                  <form onSubmit={handleVisaSubmit} className="space-y-6">
                    {/* Country & Visa Type */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="country">Destination Country *</Label>
                        <Select
                          value={visaData.country}
                          onValueChange={(value) =>
                            setVisaData({ ...visaData, country: value })
                          }
                        >
                          <SelectTrigger id="country" className="bg-input-background border-border">
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="usa">United States</SelectItem>
                            <SelectItem value="uk">United Kingdom</SelectItem>
                            <SelectItem value="canada">Canada</SelectItem>
                            <SelectItem value="schengen">Schengen (Europe)</SelectItem>
                            <SelectItem value="australia">Australia</SelectItem>
                            <SelectItem value="uae">Dubai (UAE)</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="visaType">Visa Type *</Label>
                        <Select
                          value={visaData.visaType}
                          onValueChange={(value) =>
                            setVisaData({ ...visaData, visaType: value })
                          }
                        >
                          <SelectTrigger id="visaType" className="bg-input-background border-border">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tourist">Tourist Visa</SelectItem>
                            <SelectItem value="business">Business Visa</SelectItem>
                            <SelectItem value="student">Student Visa</SelectItem>
                            <SelectItem value="work">Work Visa</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Personal Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          placeholder="As per passport"
                          value={visaData.firstName}
                          onChange={(e) =>
                            setVisaData({ ...visaData, firstName: e.target.value })
                          }
                          className="bg-input-background border-border"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          placeholder="As per passport"
                          value={visaData.lastName}
                          onChange={(e) =>
                            setVisaData({ ...visaData, lastName: e.target.value })
                          }
                          className="bg-input-background border-border"
                          required
                        />
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="visaEmail">Email Address *</Label>
                        <Input
                          id="visaEmail"
                          type="email"
                          placeholder="your@email.com"
                          value={visaData.email}
                          onChange={(e) =>
                            setVisaData({ ...visaData, email: e.target.value })
                          }
                          className="bg-input-background border-border"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="visaPhone">Phone Number *</Label>
                        <Input
                          id="visaPhone"
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          value={visaData.phone}
                          onChange={(e) =>
                            setVisaData({ ...visaData, phone: e.target.value })
                          }
                          className="bg-input-background border-border"
                          required
                        />
                      </div>
                    </div>


                    {/* Note Field */}
                    <div className="space-y-2">
                      <Label htmlFor="visaNote">Additional Notes (Optional)</Label>
                      <textarea
                        id="visaNote"
                        placeholder="Add any special requests or comments..."
                        value={visaData.note}
                        onChange={(e) =>
                          setVisaData({ ...visaData, note: e.target.value })
                        }
                        className="w-full min-h-[100px] p-3 rounded-md border border-border bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    {/* Info Banner */}
                    <div className="bg-secondary/10 p-4 rounded-lg border border-border">
                      <p className="text-sm text-foreground">
                        <CheckCircle className="h-4 w-4 inline mr-2 text-primary" />
                        After submission, our visa experts will contact you with the required documents and next steps.
                      </p>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-accent text-primary-foreground animate-gradient-x"
                      size="lg"
                    >
                      Submit Application
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>


           {/* Hotel Booking */}
          <TabsContent value="hotel">
            <Card className="bg-[var(--card)] text-[var(--card-foreground)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[var(--primary)]">
                  <Hotel className="h-6 w-6 text-[var(--primary)]" />
                  Hotel Reservation
                </CardTitle>
                <p className="text-[var(--muted-foreground)]">
                  Book the perfect accommodation for your stay
                </p>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleHotelSubmit} className="space-y-6">
                  {/* Destination */}
                  <div className="space-y-2">
                    <Label htmlFor="destination">Destination *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
                      <Input
                        id="destination"
                        placeholder="Where are you going?"
                        value={hotelData.destination}
                        onChange={(e) => setHotelData({ ...hotelData, destination: e.target.value })}
                        className="pl-10 bg-[var(--input-background)] border border-[var(--border)] focus:ring-[var(--ring)]"
                        required
                      />
                    </div>
                  </div>

                  {/* Check-In & Check-Out */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="checkIn">Check-In Date *</Label>
                      <Input
                        id="checkIn"
                        type="date"
                        value={hotelData.checkIn}
                        onChange={(e) => setHotelData({ ...hotelData, checkIn: e.target.value })}
                        className="bg-[var(--input-background)] border border-[var(--border)]"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="checkOut">Check-Out Date *</Label>
                      <Input
                        id="checkOut"
                        type="date"
                        value={hotelData.checkOut}
                        onChange={(e) => setHotelData({ ...hotelData, checkOut: e.target.value })}
                        className="bg-[var(--input-background)] border border-[var(--border)]"
                        required
                      />
                    </div>
                  </div>

                  {/* Rooms & Guests */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="rooms">Rooms *</Label>
                      <Select value={hotelData.rooms} onValueChange={(value) => setHotelData({ ...hotelData, rooms: value })}>
                        <SelectTrigger id="rooms" className="bg-[var(--input-background)] border border-[var(--border)]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5].map(num => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} {num === 1 ? 'Room' : 'Rooms'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hotelGuests">Guests *</Label>
                      <Select value={hotelData.guests} onValueChange={(value) => setHotelData({ ...hotelData, guests: value })}>
                        <SelectTrigger id="hotelGuests" className="bg-[var(--input-background)] border border-[var(--border)]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} {num === 1 ? 'Guest' : 'Guests'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="hotelEmail">Email Address *</Label>
                    <Input
                      id="hotelEmail"
                      type="email"
                      placeholder="your@email.com"
                      value={hotelData.email}
                      onChange={(e) => setHotelData({ ...hotelData, email: e.target.value })}
                      className="bg-[var(--input-background)] border border-[var(--border)]"
                      required
                    />
                  </div>

                  {/* Note */}
                  <div className="space-y-2">
                    <Label htmlFor="hotelNote">Special Request or Note</Label>
                    <textarea
                      id="hotelNote"
                      placeholder="Any special requests or preferences?"
                      value={hotelData.note || ""}
                      onChange={(e) => setHotelData({ ...hotelData, note: e.target.value })}
                      className="w-full p-3 rounded-md border border-[var(--border)] bg-[var(--input-background)] focus:ring-[var(--ring)] text-[var(--foreground)]"
                      rows={3}
                    />
                  </div>

                  {/* Info Box */}
                  <div className="bg-[var(--muted)] p-4 rounded-lg">
                    <p className="text-sm text-[var(--muted-foreground)]">
                      <CheckCircle className="h-4 w-4 inline mr-2 text-[var(--primary)]" />
                      Our agents will contact you shortly to confirm your reservation and provide available hotel options.
                    </p>
                  </div>

                  {/* Submit */}
                  <Button 
                    type="submit" 
                    className="w-full bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--secondary)]"
                    size="lg"
                  >
                    Search Hotels
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>


           {/* Event Booking */}
          <TabsContent value="event">
            <Card className="bg-[var(--card)] text-[var(--card-foreground)] border border-[var(--border)] shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[var(--primary)]">
                  <Calendar className="h-6 w-6 text-[var(--primary)]" />
                  Event Space Booking
                </CardTitle>
                <p className="text-[var(--muted-foreground)]">
                  Find the perfect venue for your special occasion
                </p>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleEventSubmit} className="space-y-6">
                  {/* Event Type + Location */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="eventType">Event Type *</Label>
                      <Select
                        value={eventData.eventType}
                        onValueChange={(value) => setEventData({ ...eventData, eventType: value })}
                      >
                        <SelectTrigger
                          id="eventType"
                          className="bg-[var(--input-background)] border border-[var(--border)]"
                        >
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="wedding">Wedding</SelectItem>
                          <SelectItem value="conference">Conference</SelectItem>
                          <SelectItem value="corporate">Corporate Event</SelectItem>
                          <SelectItem value="birthday">Birthday Party</SelectItem>
                          <SelectItem value="other">Other Celebration</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="eventLocation">Preferred Location *</Label>
                      <Input
                        id="eventLocation"
                        placeholder="City or region"
                        className="bg-[var(--input-background)] border border-[var(--border)]"
                        value={eventData.location}
                        onChange={(e) =>
                          setEventData({ ...eventData, location: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  {/* Date + Guests */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="eventDate">Event Date *</Label>
                      <Input
                        id="eventDate"
                        type="date"
                        className="bg-[var(--input-background)] border border-[var(--border)]"
                        value={eventData.date}
                        onChange={(e) =>
                          setEventData({ ...eventData, date: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="eventGuests">Expected Guests *</Label>
                      <Input
                        id="eventGuests"
                        type="number"
                        placeholder="Number of attendees"
                        className="bg-[var(--input-background)] border border-[var(--border)]"
                        value={eventData.guests}
                        onChange={(e) =>
                          setEventData({ ...eventData, guests: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration *</Label>
                    <Select
                      value={eventData.duration}
                      onValueChange={(value) => setEventData({ ...eventData, duration: value })}
                    >
                      <SelectTrigger
                        id="duration"
                        className="bg-[var(--input-background)] border border-[var(--border)]"
                      >
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="half">Half Day (4 hours)</SelectItem>
                        <SelectItem value="full">Full Day (8 hours)</SelectItem>
                        <SelectItem value="evening">Evening (4–6 hours)</SelectItem>
                        <SelectItem value="multi">Multiple Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Contact Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="bg-[var(--input-background)] border border-[var(--border)]"
                      value={eventData.email}
                      onChange={(e) =>
                        setEventData({ ...eventData, email: e.target.value })
                      }
                      required
                    />
                  </div>

                  {/* Special Requirements */}
                  <div className="space-y-2">
                    <Label htmlFor="requirements">Special Requirements</Label>
                    <Textarea
                      id="requirements"
                      placeholder="Tell us about your vision, budget, and any specific needs..."
                      rows={4}
                      className="bg-[var(--input-background)] border border-[var(--border)]"
                      value={eventData.requirements}
                      onChange={(e) =>
                        setEventData({ ...eventData, requirements: e.target.value })
                      }
                    />
                  </div>


                  {/* Submit Button */}
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-[var(--primary)] hover:bg-[var(--secondary)] text-[var(--primary-foreground)] font-semibold transition-colors"
                  >
                    Request Quote
                    <ArrowRight className="h-4 w-4 ml-2 text-[var(--accent)]" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          </Tabs>
        </div>
      </section>

      {/* Info Section */}
      <section
        className="py-16"
        style={{ background: 'var(--card)', color: 'var(--foreground)' }}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            {/* Instant Confirmation */}
            <div>
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{
                  background: 'linear-gradient(135deg, var(--secondary), var(--accent))',
                }}
              >
                <CheckCircle className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl mb-2 font-medium">Instant Confirmation</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get immediate booking confirmation via email
              </p>
            </div>

            {/* Secure Payment */}
            <div>
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{
                  background: 'linear-gradient(135deg, var(--secondary), var(--accent))',
                }}
              >
                <CreditCard className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl mb-2 font-medium">Secure Payment</h3>
              <p className="text-gray-600 dark:text-gray-300">
                All transactions are encrypted and protected
              </p>
            </div>

            {/* Expert Support */}
            <div>
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{
                  background: 'linear-gradient(135deg, var(--secondary), var(--accent))',
                }}
              >
                <Users className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl mb-2 font-medium">Expert Support</h3>
              <p className="text-gray-600 dark:text-gray-300">
                24/7 customer service for any assistance
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

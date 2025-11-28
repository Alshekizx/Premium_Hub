//file: /pages/homes/[id]/page.tsx
'use client';

import { useState, useEffect} from 'react';
import { useParams } from "next/navigation";
import Link from 'next/link';
import { ArrowLeft, House, Bed, Bath, Square, MapPin, Calendar, Check, Phone, Mail } from 'lucide-react';
import { db } from '../../../../../firebase';
import { addDoc, collection, doc, getDoc } from 'firebase/firestore';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { Home } from '@/app/data/homes';
import { CompanyDetails } from '@/app/data/types';
import { InterestedUser } from '@/app/data/cars';


export default function HomeDetailPage() {
   const params = useParams();
const id = params?.id as string;
  const [home, setHome] = useState<Home| null>(null);
  const [company, setCompany] = useState<CompanyDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [inquiryType, setInquiryType] = useState<'sale' | 'rent'>('sale');
 // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
useEffect(() => {
  if (!id) return;

const fetchHome = async () => {
  try {
    const ref = doc(db, "homes", id);
    const snapshot = await getDoc(ref);

    if (snapshot.exists()) {
  const data = snapshot.data() as Omit<Home, 'id'>;
  setHome({ id: snapshot.id, ...data });
} else {
      setHome(null);
    }
  } catch (err) {
    console.error("Failed to fetch home:", err);
    setHome(null);
  } finally {
    setLoading(false);
  }
};



  const fetchCompany = async () => {
    try {
      const ref = doc(db, "company", 'details');
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setCompany(snap.data() as CompanyDetails);
      }
    } catch (err) {
      console.error("Failed to fetch company details:", err);
    }
  };

  fetchHome();
  fetchCompany();
}, [id]);






  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <House className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600">Loading property details...</p>
      </div>
    );
  }

  if (!home) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <House className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl text-gray-900 mb-2">Property not found</h2>
          <Link href="/homes" className="text-amber-600 hover:text-amber-700">
            Back to properties
          </Link>
        </div>
      </div>
    );
  }
const handleInquiry = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!id) {
    alert("Property ID is missing. Please try again later.");
    return;
  }

  try {
    setSubmitting(true);

    const userData: InterestedUser = {
      id: crypto.randomUUID(),
      fullName,
      email,
      phone,
      message,
      itemId: id,               // ✅ use params.id directly
      itemName: home?.title || "Unknown Property",
      itemType: "home",
      dateSubmitted: new Date().toISOString(),
    };

    await addDoc(collection(db, "interestedUsers"), userData);

    alert("Your inquiry has been submitted successfully!");

    setFullName("");
    setEmail("");
    setPhone("");
    setMessage("");
  } catch (err) {
    console.error("Failed to submit inquiry:", err);
    alert("Failed to submit inquiry. Try again.");
  } finally {
    setSubmitting(false);
  }
};


  
  return (
    <div className="pt-20 bg-amber-50/30">
      {/* Back Button */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/homes"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-amber-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to properties
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2">
            {/* Main Image */}
            <div className="bg-white rounded-3xl overflow-hidden mb-6">
              <div className="relative h-96 bg-gray-100">
                <ImageWithFallback
                  src={home.images[selectedImage]}
                  alt={`${home.title} - Image ${selectedImage + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-4 py-2 bg-amber-600 text-white rounded-full capitalize">
                    {home.category}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-900 rounded-full">
                    {home.type === 'sale' ? 'For Sale' : home.type === 'rent' ? 'For Rent' : 'Sale/Rent'}
                  </span>
                </div>
              </div>

              {/* Thumbnail Gallery */}
              <div className="p-4 grid grid-cols-3 gap-4">
                {home.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-24 rounded-2xl overflow-hidden transition-all ${
                      selectedImage === index
                        ? 'ring-4 ring-amber-600 scale-105'
                        : 'hover:scale-105 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <ImageWithFallback
                      src={image}
                      alt={`${home.title} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-3xl p-8 mb-6">
              <h1 className="text-4xl text-gray-900 mb-2">{home.title}</h1>
              <div className="flex items-start gap-2 text-xl text-gray-600 mb-6">
                <MapPin className="w-6 h-6 mt-1 text-amber-600" />
                <span>{home.address}, {home.city}, {home.state} {home.zipCode}</span>
              </div>
              
              <p className="text-gray-700 mb-8">{home.description}</p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="p-4 bg-amber-50 rounded-2xl">
                  <Bed className="w-6 h-6 text-amber-600 mb-2" />
                  <div className="text-sm text-gray-600">Bedrooms</div>
                  <div className="text-gray-900 text-xl">{home.bedrooms}</div>
                </div>
                <div className="p-4 bg-amber-50 rounded-2xl">
                  <Bath className="w-6 h-6 text-amber-600 mb-2" />
                  <div className="text-sm text-gray-600">Bathrooms</div>
                  <div className="text-gray-900 text-xl">{home.bathrooms}</div>
                </div>
                <div className="p-4 bg-amber-50 rounded-2xl">
                  <Square className="w-6 h-6 text-amber-600 mb-2" />
                  <div className="text-sm text-gray-600">Square Feet</div>
                  <div className="text-gray-900 text-xl">{home.sqft.toLocaleString()}</div>
                </div>
                <div className="p-4 bg-amber-50 rounded-2xl">
                  <Calendar className="w-6 h-6 text-amber-600 mb-2" />
                  <div className="text-sm text-gray-600">Year Built</div>
                  <div className="text-gray-900 text-xl">{home.yearBuilt}</div>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h2 className="text-2xl text-gray-900 mb-4">Amenities & Features</h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {home.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="mt-1 p-1 bg-amber-100 rounded-full">
                        <Check className="w-4 h-4 text-amber-600" />
                      </div>
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Map Section */}
            <div className="bg-white rounded-3xl p-8">
              <h2 className="text-2xl text-gray-900 mb-4">Location</h2>
              <div className="bg-gray-100 rounded-2xl h-80 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-amber-600 mx-auto mb-2" />
                  <p className="text-gray-600">
                    {home.city}, {home.state}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Coordinates: {home.coordinates.lat}, {home.coordinates.lng}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Pricing & Contact */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 sticky top-24">
              {/* Pricing */}
              <div className="mb-6">
                <div className="text-sm text-gray-600 mb-2">Price</div>
                {home.type === 'sale' || home.type === 'both' ? (
                  <div className="text-4xl text-gray-900 mb-2">
                    ${(home.price / 1000000).toFixed(2)}M
                  </div>
                ) : null}
                {home.type === 'rent' || home.type === 'both' ? (
                  <div className="flex items-center gap-2 text-amber-600">
                    <Calendar className="w-5 h-5" />
                    <span className="text-xl">
                      ${home.rentalPrice.toLocaleString()}/month
                    </span>
                  </div>
                ) : null}
              </div>

              {/* Inquiry Type Selection */}
              {home.type === 'both' && (
                <div className="mb-6">
                  <div className="text-sm text-gray-600 mb-2">I&lsquo;m interested in</div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setInquiryType('sale')}
                      className={`px-4 py-2 rounded-xl transition-all ${
                        inquiryType === 'sale'
                          ? 'bg-amber-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Buying
                    </button>
                    <button
                      onClick={() => setInquiryType('rent')}
                      className={`px-4 py-2 rounded-xl transition-all ${
                        inquiryType === 'rent'
                          ? 'bg-amber-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Renting
                    </button>
                  </div>
                </div>
              )}

              {/* Contact Form */}
<form onSubmit={handleInquiry} className="space-y-4">
  <div>
    <label className="block text-sm text-gray-600 mb-2">Full Name</label>
    <input
      required
      type="text"
      value={fullName}
      onChange={(e) => setFullName(e.target.value)}
      placeholder="John Doe"
      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:border-blue-500"
    />
  </div>

  <div>
    <label className="block text-sm text-gray-600 mb-2">Email Address</label>
    <input
      required
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      placeholder="email@example.com"
      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:border-blue-500"
    />
  </div>

  <div>
    <label className="block text-sm text-gray-600 mb-2">Phone Number (optional) </label>
    <input
      type="tel"
      value={phone}
      onChange={(e) => setPhone(e.target.value)}
      placeholder="+234 801 234 5678"
      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:border-blue-500"
    />
  </div>

  <div>
    <label className="block text-sm text-gray-600 mb-2">Message</label>
    <textarea
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      placeholder="Your message…"
      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:border-blue-500"
    />
  </div>

<button
  type="submit"
  disabled={submitting}
  className={`w-full px-6 py-4 rounded-xl text-white transition-all ${
    submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-amber-600 to-amber-700 hover:shadow-lg hover:scale-105'
  }`}
>
  {submitting ? 'Submitting...' : 'Schedule a Viewing'}
</button>

</form>
 
{/* Contact Info */}
<div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
  {/* Company Phones */}
  {company?.homePhone && company.homePhone.length > 0 ? (
    company.homePhone.map((phone: string, index: number) => (
      <a
        key={index}
        href={`tel:${phone}`}
        className="flex items-center gap-3 hover:text-amber-600 transition-colors"
      >
        <Phone className="w-5 h-5" />
        <span>{phone}</span>
      </a>
    ))
  ) : (
    <p className="text-gray-500">No phone numbers available</p>
  )}

  {/* Company Email */}
  {company?.primaryEmail ? (
    <a
      href={`mailto:${company.primaryEmail}`}
      className="flex items-center gap-3 hover:text-amber-600 transition-colors"
    >
      <Mail className="w-5 h-5" />
      <span>{company.primaryEmail}</span>
    </a>
  ) : (
    <p className="text-gray-500">No company email provided</p>
  )}
</div>



            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

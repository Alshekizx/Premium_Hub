"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Bus,
  Calendar,
  Fuel,
  Settings,
  Users,
  Check,
} from "lucide-react";

import { db } from "../../../../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { collection, addDoc } from "firebase/firestore";
import { InterestedUser, Car } from "@/app/data/cars";
export default function CarDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [car, setCar] = useState<Car | null>(null);

  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [inquiryType, setInquiryType] = useState<"sale" | "rent">("sale");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // 🔥 Fetch car from Firestore
  useEffect(() => {
    if (!id) return;

    const fetchCar = async () => {
      try {
        const ref = doc(db, "cars", id);
        const snapshot = await getDoc(ref);

        if (snapshot.exists()) {
          setCar(snapshot.data() as Car);


        } else {
          setCar(null);
        }
      } catch (error) {
        console.error("Failed to fetch car:", error);
        setCar(null);
      }
      setLoading(false);
    };

    fetchCar();
  }, [id]);

  // ⏳ Loading state
  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading vehicle details...</p>
      </div>
    );
  }

  // ❌ Car not found
  if (!car) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Bus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl text-gray-900 mb-2">Vehicle not found</h2>

          <Link
            href="/cars"
            className="text-blue-600 hover:text-blue-700 transition"
          >
            Back to vehicles
          </Link>
        </div>
      </div>
    );
  }

const handleInquiry = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!car) return;

  try {
    setSubmitting(true);

    const userData: InterestedUser = {
      id: crypto.randomUUID(),
      fullName,
      email,
      phone,
      message,
      itemId: car.id,
      itemName: car.name,
      itemType: "car",
      dateSubmitted: new Date().toISOString(),
    };

    await addDoc(collection(db, "interestedUsers"), userData);

    alert("Your inquiry has been submitted successfully!");

    // Clear form
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
    <div className="pt-20 bg-gray-50">
      {/* Top nav */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/cars"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to vehicles
          </Link>
        </div>
      </div>

      {/* Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid lg:grid-cols-3 gap-8">
        {/* MAIN COLUMN */}
        <div className="lg:col-span-2">
          {/* Main Image */}
          <div className="bg-white rounded-2xl overflow-hidden mb-6">
            <div className="relative h-96 bg-gray-100">
              <ImageWithFallback
                src={car.images?.[selectedImage]}
                alt={`${car.name} Main Image`}
                className="w-full h-full object-cover"
              />

              <span className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-2 rounded-full text-sm">
                {car.category}
              </span>
            </div>

            {/* Thumbnails */}
            <div className="p-4 grid grid-cols-3 gap-4">
              {(car.images || []).map((image: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative h-24 rounded-xl overflow-hidden transition-all ${
                    selectedImage === i
                      ? "ring-4 ring-blue-600 scale-105"
                      : "opacity-70 hover:opacity-100 hover:scale-105"
                  }`}
                >
                  <ImageWithFallback
                    src={image}
                    alt={`${car.name} thumbnail ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="bg-white rounded-2xl p-8 mb-6">
            <h1 className="text-4xl text-gray-900 mb-2">{car.name}</h1>
            <p className="text-xl text-gray-600 mb-6">
              {car.brand} • {car.year}
            </p>

            <p className="text-gray-700 mb-8 leading-relaxed">
              {car.description}
            </p>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="p-4 bg-gray-50 rounded-xl">
                <Settings className="w-6 h-6 text-blue-600 mb-2" />
                <div className="text-sm text-gray-600">Transmission</div>
                <div className="text-gray-900 capitalize">
                  {car.transmission}
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <Fuel className="w-6 h-6 text-blue-600 mb-2" />
                <div className="text-sm text-gray-600">Fuel</div>
                <div className="text-gray-900">{car.fuelType}</div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <Users className="w-6 h-6 text-blue-600 mb-2" />
                <div className="text-sm text-gray-600">Seating</div>
                <div className="text-gray-900">{car.seatingCapacity} seats</div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl">
                <Bus className="w-6 h-6 text-blue-600 mb-2" />
                <div className="text-sm text-gray-600">Mileage</div>
                <div className="text-gray-900">
                  {car.mileage?.toLocaleString()} mi
                </div>
              </div>
            </div>

            {/* Features */}
            <h2 className="text-2xl text-gray-900 mb-4">Features</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {(car.features || []).map((f: string, idx: number) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="p-1 bg-blue-100 rounded-full mt-1">
                    <Check className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-gray-700">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="bg-white rounded-2xl p-6 sticky top-24 h-fit">
          {/* Price */}
          <div className="mb-6">
            <div className="text-sm text-gray-600 mb-2">Price</div>

            {(car.type === "sale" || car.type === "both") && (
              <p className="text-4xl text-gray-900 mb-2">
                ₦{car.price?.toLocaleString()}
              </p>
            )}

            {(car.type === "rent" || car.type === "both") && (
              <div className="flex items-center gap-2 text-blue-600">
                <Calendar className="w-5 h-5" />
                <span className="text-xl">
                  ₦{car.rentalPrice?.toLocaleString()}/day
                </span>
              </div>
            )}
          </div>

          {/* inquiry type */}
          {car.type === "both" && (
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">I&apos;m interested in</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setInquiryType("sale")}
                  className={`px-4 py-2 rounded-lg ${
                    inquiryType === "sale"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Buying
                </button>

                <button
                  onClick={() => setInquiryType("rent")}
                  className={`px-4 py-2 rounded-lg ${
                    inquiryType === "rent"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Renting
                </button>
              </div>
            </div>
          )}

          {/* Form */}
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
    className="w-full py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
  >
    {submitting ? "Submitting..." : "Send Inquiry"}
  </button>
</form>

        </div>
      </div>
    </div>
  );
}

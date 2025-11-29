'use client';

import Link from "next/link";
import { Car, Home, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Send } from 'lucide-react';
import { useState, useEffect } from 'react';
import { db } from "../../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { CompanyDetails } from "@/app/data/types";

export default function Footer() {
  const [email, setEmail] = useState('');

  const [companyDetails, setCompanyDetails] = useState<CompanyDetails | null>(null);

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const ref = doc(db, "company", "details");
        const snapshot = await getDoc(ref);

        if (snapshot.exists()) {
          setCompanyDetails(snapshot.data() as CompanyDetails);
        }
      } catch (err) {
        console.error("Error fetching company info:", err);
      }
    };

    fetchCompanyInfo();
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for subscribing!');
    setEmail('');
  };
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Car className="w-4 h-4 text-white" />
                </div>
                <div className="bg-amber-600 p-2 rounded-lg">
                  <Home className="w-4 h-4 text-white" />
                </div>
              </div>
              <span className="text-xl text-white">
                Premier<span className="text-blue-500">Hub</span>
              </span>
            </div>

            <p className="text-sm text-gray-400 mb-4">
              Your premier destination for luxury cars and exceptional homes. We deliver excellence in both automotive and real estate services.
            </p>

            <div className="flex gap-3">
              <a href="#" className="p-2 bg-gray-800 hover:bg-blue-600 rounded-lg transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 hover:bg-blue-600 rounded-lg transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 hover:bg-blue-600 rounded-lg transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-800 hover:bg-blue-600 rounded-lg transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-blue-400 transition-colors">Home</Link></li>
              <li><Link href="/cars" className="hover:text-blue-400 transition-colors">Browse Cars</Link></li>
              <li><Link href="/homes" className="hover:text-blue-400 transition-colors">Browse Homes</Link></li>
              <li><Link href="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-blue-400 transition-colors cursor-pointer">Car Sales</li>
              <li className="hover:text-blue-400 transition-colors cursor-pointer">Car Rentals</li>
              <li className="hover:text-blue-400 transition-colors cursor-pointer">Home Sales</li>
              <li className="hover:text-blue-400 transition-colors cursor-pointer">Home Rentals</li>
              <li className="hover:text-blue-400 transition-colors cursor-pointer">Financing Options</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white mb-4">Newsletter</h3>
            <p className="text-sm text-gray-400 mb-4">
              Subscribe to get special offers, updates, and more.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                required
                className="px-4 py-2.5 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                Subscribe <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Contact Info */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6 border-t border-gray-800">
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-sm text-gray-400">Call Us</p>
              <p className="text-white">{companyDetails?.generalPhone?.[0] || "Loading..."}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-sm text-gray-400">Email</p>
              <p className="text-white">{companyDetails?.primaryEmail || "Loading..."}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-sm text-gray-400">Location</p>
              <p className="text-white">
                {companyDetails
                  ? `${companyDetails.address.street}, ${companyDetails.address.city}, ${companyDetails.address.state} ${companyDetails.address.zipCode}`
                  : "Loading..."}
              </p>
            </div>
          </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>&copy; 2025 PremierHub. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
     </div>
    </footer>
  );
}

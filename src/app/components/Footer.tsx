import {  Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { CompanyInfo } from './views/admin';
import { db } from '../../../firebase';
interface FooterProps {
  onNavigate: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {

  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const docRef = doc(db, "companyInfo", "main");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCompanyInfo(docSnap.data() as CompanyInfo);
        }
      } catch (err) {
        console.error("Failed to fetch company info:", err);
      }
    };
    fetchCompanyInfo();
  }, []);

  const handleNavClick = (page: string) => {
    onNavigate(page);
    window.scrollTo(0, 0);
  };
  return (
    <footer
      className="py-12"
      style={{
        backgroundColor: 'var(--foreground)',
        color: 'var(--primary-foreground)',
      }}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-br from-primary to-secondary p-2 rounded-lg">
               <Image
                           src="/logo.png"
                           alt="Dêo Travel Agency Logo"
                           width={32}
                           height={32}
                           className="rounded-md"
                           priority
                         />
              </div>
              <div>
                <div className="text-xl font-semibold">Dêo Travel Agency</div>
                <button onClick={() => handleNavClick('admin')} className="hover:text-white transition-colors ">
                <div
                  className="text-xs"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  Your travels, made simple
                </div>
                </button>
              </div>
            </div>
            <p
              className="mb-4"
              style={{ color: 'var(--muted-foreground)' }}
            >
              Making travel dreams come true with exceptional service and unbeatable deals.
            </p>
            <div className="space-y-2 text-sm">
              {companyInfo?.phones?.[0] && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{companyInfo.phones[0]}</span>
                </div>
              )}
              {companyInfo?.emails?.[0] && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>{companyInfo.emails[0]}</span>
                </div>
              )}
              {companyInfo?.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{companyInfo.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              {['home', 'destinations', 'hotels', 'contact'].map((page) => (
                <li key={page}>
                  <button
                    onClick={() => handleNavClick(page)}
                    className="transition-colors"
                    style={{
                      color: 'var(--muted-foreground)',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = 'var(--accent)')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = 'var(--muted-foreground)')
                    }
                  >
                    {page.charAt(0).toUpperCase() + page.slice(1)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-4 font-semibold">Our Services</h3>
            <ul className="space-y-2">
              {[
                ['services', 'Flight Bookings'],
                ['visa', 'Visa Applications'],
                ['hotels', 'Hotel Reservations'],
                ['services-event', 'Event Spaces'],
              ].map(([page, label]) => (
                <li key={page}>
                  <button
                    onClick={() => handleNavClick(page)}
                    className="transition-colors"
                    style={{
                      color: 'var(--muted-foreground)',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = 'var(--accent)')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = 'var(--muted-foreground)')
                    }
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
           <div className="flex gap-4 mb-6">
              {[
                { Icon: Facebook, link: companyInfo?.socialMedia.facebook },
                { Icon: Twitter, link: companyInfo?.socialMedia.twitter },
                { Icon: Instagram, link: companyInfo?.socialMedia.instagram },
                { Icon: Linkedin, link: companyInfo?.socialMedia.linkedin },
              ].map(({ Icon, link }, idx) => (
                <a
                  key={idx}
                  href={link || '#'}
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
                  style={{ backgroundColor: 'var(--secondary)', color: 'var(--secondary-foreground)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'linear-gradient(to right, var(--primary), var(--accent))'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--secondary)'; }}
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
        </div>

        <div
          className="pt-8 text-center text-sm border-t"
          style={{
            borderColor: 'var(--border)',
            color: 'var(--muted-foreground)',
          }}
        >
          <p>
            &copy; 2025 Dêo Travel Agency. All rights reserved. | {' '}
            <button onClick={() => handleNavClick('contract')} className="hover:text-white transition-colors underline">
              Privacy Policy
            </button> | {' '}
            <button onClick={() => handleNavClick('contract')} className="hover:text-white transition-colors underline">
              Terms of Service
            </button> 
          </p>
        </div>
      </div>
    </footer>
  );
}

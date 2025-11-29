'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Car, Home, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

useEffect(() => {
  let frameId: number;

  const handleScroll = () => {
    if (frameId) cancelAnimationFrame(frameId);
    frameId = requestAnimationFrame(() => {
      setIsScrolled(window.scrollY > 20);
    });
  };

  window.addEventListener('scroll', handleScroll);
  return () => {
    window.removeEventListener('scroll', handleScroll);
    if (frameId) cancelAnimationFrame(frameId);
  };
}, []);


useEffect(() => {
  const timer = setTimeout(() => setIsMobileMenuOpen(false), 0);
  return () => clearTimeout(timer);
}, [pathname]);


  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/cars', label: 'Cars' },
    { href: '/homes', label: 'Homes' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white ${
        isScrolled
          ? 'shadow-lg '
          : ' backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex items-center gap-1">
              <div className="p-2 rounded-xl group-hover:scale-110 transition-transform bg-blue-600">
                <Car className="w-5 h-5 text-white" />
              </div>
              <div className="p-2 rounded-xl group-hover:scale-110 transition-transform bg-amber-600">
                <Home className="w-5 h-5 text-white" />
              </div>
            </div>

            <span className="text-2xl tracking-tight text-gray-900">
              Premier<span className="text-blue-600">Hub</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-2 transition-colors ${
                  pathname === link.href
                    ? 'text-blue-600'
                    : 'text-gray-900 hover:text-blue-600'
                }`}
              >
                {link.label}

                {pathname === link.href && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link
              href="/contact"
              className="px-6 py-2.5 rounded-full text-white bg-blue-600 hover:shadow-lg hover:scale-105 transition-all"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-900 hover:text-blue-600 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[var(--border)]">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block py-3 px-4 rounded-lg transition-colors ${
                  pathname === link.href
                    ? 'bg-[var(--accent)] text-blue-600'
                    : 'text-gray-900 hover:bg-[var(--muted)]'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/contact"
              className="block mt-4 py-3 px-4 rounded-lg text-center bg-blue-600 text-[var(--primary-foreground)]"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

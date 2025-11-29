"use client";

import {  Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import Image from "next/image";

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", page: "home" },
    { name: "Destinations", page: "destinations" },
    { name: "Services", page: "services" },
    { name: "Hotels", page: "hotels" },
    { name: "Visa Application", page: "visa" },
    { name: "Contact", page: "contact" },
  ];

  const handleNavClick = (page: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm shadow-sm">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <button
          onClick={() => handleNavClick("home")}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
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
          <div className="text-left">
            <div className="text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-semibold">
              Dêo Travel Agency
            </div>
            <div className="text-xs text-muted-foreground">
              Your travels, made simple
            </div>
          </div>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => (
            <button
              key={item.page}
              onClick={() => handleNavClick(item.page)}
              className={`transition-colors ${
                currentPage === item.page
                  ? "text-primary"
                  : "text-foreground hover:text-primary"
              }`}
            >
              {item.name}
            </button>
          ))}
          <Button
            onClick={() => handleNavClick("book")}
            className="bg-gradient-to-r from-primary to-accent hover:from-secondary hover:to-accent text-primary-foreground"
          >
            Book Now
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6 text-foreground" />
          ) : (
            <Menu className="h-6 w-6 text-foreground" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-card border-t border-border">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => handleNavClick(item.page)}
                className={`text-left transition-colors ${
                  currentPage === item.page
                    ? "text-primary"
                    : "text-foreground hover:text-primary"
                }`}
              >
                {item.name}
              </button>
            ))}
            <Button
              onClick={() => handleNavClick("book")}
              className="w-full bg-gradient-to-r from-primary to-accent hover:from-secondary hover:to-accent text-primary-foreground"
            >
              Book Now
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { HomePage } from "./components/views/homePage";
import { DestinationsPage } from "./components/views/DestinationsPage";
import { ServicesPage } from "./components/views/ServicesPage";
import { HotelsPage } from "./components/views/HotelsPage";
import { VisaApplicationPage } from "./components/views/VisaApplicationPage";
import { ContactPage } from "./components/views/ContactPage";
import { BookNowPage } from "./components/views/BookNowPage";
import { Toaster } from "./components/ui/sonner";
import { AdminDashboardPage } from "./components/views/admin";

export default function AppLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  const [currentPage, setCurrentPage] = useState("home");
  const previousPage = useRef<string>("home");

  // 🧠 Load last page from localStorage on mount
  useEffect(() => {
    const savedPage = localStorage.getItem("currentPage");
    if (savedPage) {
      setTimeout(() => setCurrentPage(savedPage), 0);
    }
  }, []);


  // 💾 Save current page to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("currentPage", currentPage);
  }, [currentPage]);

  // 🧭 Handle page navigation and store previous page
  const handleNavigate = (page: string) => {
    previousPage.current = currentPage;
    setCurrentPage(page);
  };

  // 🔙 Handle going back from admin
  const handleGoBack = () => {
    if (previousPage.current) {
      setCurrentPage(previousPage.current);
    } else {
      setCurrentPage("home");
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage onNavigate={handleNavigate} />;
      case "destinations":
        return <DestinationsPage onNavigate={handleNavigate} />;
      case "services":
        return <ServicesPage onNavigate={handleNavigate} />;
      case "hotels":
        return <HotelsPage onNavigate={handleNavigate} />;
      case "visa":
        return <VisaApplicationPage onNavigate={handleNavigate} />;
      case "contact":
        return <ContactPage onNavigate={handleNavigate} />;
      case "book":
        return <BookNowPage />;
      case "admin":
        return (
          <div className="relative min-h-screen">
            <button
              onClick={handleGoBack}
              className="absolute top-4 left-4 bg-[var(--primary)] text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all"
            >
              ← Back
            </button>
            <AdminDashboardPage onNavigate={handleNavigate} />
          </div>
        );
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen">
      {currentPage !== "admin" && (
        <Header currentPage={currentPage} onNavigate={handleNavigate} />
      )}
      <main>{renderPage() || children}</main>
      {currentPage !== "admin" && (
        <Footer onNavigate={handleNavigate} />
      )}
      <Toaster position="top-center" />
    </div>
  );
}

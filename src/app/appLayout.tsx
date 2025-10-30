//file: app/appLayout
"use client";

import { useState } from "react";
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

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
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
      case 'admin':
        return <AdminDashboardPage onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen">
      {currentPage !== 'admin' && <Header currentPage={currentPage} onNavigate={handleNavigate} />}
      <main>{renderPage() || children}</main>
      {currentPage !== 'admin' && <Footer onNavigate={handleNavigate} />}
      <Toaster position="top-center" />
    </div>
  );
}

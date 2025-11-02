"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
import { ContractsPage } from "./components/views/ContractsPage";
import { TestimonialFormPage } from "./components/views/TestimonialForm";
import { useRouter, usePathname } from "next/navigation";

export default function AppLayout({ children }: { children?: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [currentPage, setCurrentPage] = useState("home");
  const [isInitialized, setIsInitialized] = useState(false);
  const previousPage = useRef<string>("home");

  const handleNavigate = useCallback(
    (page: string) => {
      previousPage.current = currentPage;
      setCurrentPage(page);
    },
    [currentPage]
  );

  const handleGoBack = () => {
    setCurrentPage(previousPage.current || "home");
  };

  useEffect(() => {
    const init = () => {
      if (pathname === "/review") return "testimonial";
      return localStorage.getItem("currentPage") || "home";
    };

    setTimeout(() => {
      setCurrentPage(init());
      setIsInitialized(true);
    }, 0);
  }, [pathname]);

  useEffect(() => {
    if (!isInitialized) return;

    const pathMap: Record<string, string> = {
      home: "/",
      testimonial: "/review",
    };

    const targetPath = pathMap[currentPage];
    if (targetPath && pathname !== targetPath) {
      router.replace(targetPath);
    }
  }, [currentPage, pathname, isInitialized, router]);

  useEffect(() => {
    if (isInitialized && currentPage && currentPage !== "testimonial") {
      localStorage.setItem("currentPage", currentPage);
    }
  }, [currentPage, isInitialized]);

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
      case "contract":
        return <ContractsPage />;
      case "testimonial":
        return <TestimonialFormPage />;
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
      <main>{isInitialized ? renderPage() : children}</main>
      {currentPage !== "admin" && <Footer onNavigate={handleNavigate} />}
      <Toaster position="top-center" />
    </div>
  );
}


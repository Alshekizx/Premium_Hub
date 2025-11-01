"use client";
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { FileText, Clock, CheckCircle, Globe, Shield, Users } from 'lucide-react';
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from '../../../../firebase';
import { VisaDestination } from './admin';

interface VisaApplicationPageProps {
  onNavigate: (page: string) => void;
}

export function VisaApplicationPage({ onNavigate }: VisaApplicationPageProps) {
  const visaTypes = [
    {
      name: 'Tourist Visa',
      icon: Globe,
      description: 'For leisure travel and sightseeing',
      validity: '6 months - 5 years',
    },
    {
      name: 'Business Visa',
      icon: Users,
      description: 'For business meetings and conferences',
      validity: '1-10 years',
    },
    {
      name: 'Student Visa',
      icon: FileText,
      description: 'For educational purposes',
      validity: 'Duration of study',
    },
    {
      name: 'Work Visa',
      icon: Shield,
      description: 'For employment opportunities',
      validity: 'Contract duration',
    }
  ];

 const [popularDestinations, setPopularDestinations] = useState<VisaDestination[]>([]);
  const [, setLoading] = useState(true);
 // Fetch destinations from Firestore
useEffect(() => {
  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "visaDestinations"));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as VisaDestination[];
      setPopularDestinations(data);
    } catch (error) {
      console.error("Error fetching visa destinations:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchDestinations();
}, []);



  const applicationProcess = [
    {
      step: 1,
      title: 'Choose Visa Type',
      description: 'Select the appropriate visa category for your travel purpose'
    },
    {
      step: 2,
      title: 'Document Collection',
      description: 'We provide you with a detailed checklist of required documents'
    },
    {
      step: 3,
      title: 'Application Review',
      description: 'Our experts review your application for completeness and accuracy'
    },
    {
      step: 4,
      title: 'Submission',
      description: 'We submit your application to the appropriate consulate/embassy'
    },
    {
      step: 5,
      title: 'Tracking & Updates',
      description: 'Regular updates on your application status'
    },
    {
      step: 6,
      title: 'Visa Collection',
      description: 'Receive your approved visa and travel documents'
    }
  ];

  const faqs = [
    {
      question: 'How long does the visa application process take?',
      answer: 'Processing times vary by country and visa type, typically ranging from 3 days to 6 weeks. We always recommend applying well in advance of your travel dates. Express processing is available for select countries at an additional fee.'
    },
    {
      question: 'What documents do I need for a visa application?',
      answer: 'Common documents include a valid passport, photographs, financial statements, travel itinerary, and purpose of visit documentation. Specific requirements vary by country and visa type. We provide a comprehensive checklist tailored to your application.'
    },
    {
      question: 'What is your visa approval success rate?',
      answer: 'We maintain an average approval rate of 92% across all visa categories. Our experienced team carefully reviews each application to ensure all requirements are met before submission, maximizing your chances of approval.'
    },
    {
      question: 'Can you help if my visa application is rejected?',
      answer: 'Yes! We offer reapplication assistance and will help identify the reasons for rejection. Our team will work with you to strengthen your application and improve the chances of approval on the next attempt.'
    },
    {
      question: 'Do you offer expedited visa processing?',
      answer: 'Yes, we offer express processing services for select countries at an additional fee. This can reduce processing time by 50-70% depending on the destination. Contact us to check if expedited processing is available for your visa type.'
    },
    {
      question: 'What happens after I submit my application?',
      answer: 'After submission, you\'ll receive a confirmation and tracking number. We monitor your application status and provide regular updates. You can also track your application online through our portal. Once approved, we\'ll notify you immediately and arrange for document collection.'
    }
  ];

  return (
    <div className="pt-16">
     {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1655722725332-9925c96dd627?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXNzcG9ydCUyMHZpc2ElMjBzdGFtcHN8ZW58MXx8fHwxNzYxNDk3MTIzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Visa application"
            className="w-full h-full object-cover"
          />
          {/* Overlay using brand colors */}
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)]/90 to-[var(--secondary)]/90" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center text-[var(--primary-foreground)]">
          <Badge className="mb-6 bg-[var(--accent)]/20 backdrop-blur-sm text-[var(--accent-foreground)] border-[var(--accent)]/30">
            Fast & Reliable Service
          </Badge>
          <h1 className="text-5xl md:text-6xl mb-4 text-[var(--primary-foreground)]">
            Visa Application Services
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto text-[var(--accent-foreground)]">
            Expert assistance for tourist, business, student, and work visas worldwide
          </p>
        </div>
      </section>

        {/* Quick Stats */}
        <section className="py-12 bg-[var(--card)] border-b border-[var(--border)]">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto text-center">
              <div>
                <div className="text-4xl mb-2 text-[var(--primary)]">92%</div>
                <div className="text-[var(--muted-foreground)]">Approval Rate</div>
              </div>
              <div>
                <div className="text-4xl mb-2 text-[var(--primary)]">50+</div>
                <div className="text-[var(--muted-foreground)]">Countries</div>
              </div>
              <div>
                <div className="text-4xl mb-2 text-[var(--primary)]">10K+</div>
                <div className="text-[var(--muted-foreground)]">Visas Processed</div>
              </div>
              <div>
                <div className="text-4xl mb-2 text-[var(--primary)]">24/7</div>
                <div className="text-[var(--muted-foreground)]">Support</div>
              </div>
            </div>
          </div>
        </section>


      {/* Visa Types */}
<section className="py-20 bg-[var(--lighter-background)]">
  <div className="container mx-auto px-4">
    <div className="text-center mb-12">
      <h2 className="text-4xl md:text-5xl mb-4 text-[var(--foreground)]">
        Visa Types We Process
      </h2>
      <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
        Comprehensive visa services for all your travel needs
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
      {visaTypes.map((visa, index) => {
        const Icon = visa.icon;
        return (
          <Card
            key={index}
            className="hover:shadow-xl transition-all border-2 border-[var(--border)] hover:border-[var(--accent)]/30 bg-[var(--card)]"
          >
            <CardContent className="p-6">
              <div className="w-14 h-14 bg-gradient-to-br from-[var(--muted)] to-[var(--input-background)] rounded-xl flex items-center justify-center mb-4">
                <Icon className="h-7 w-7 text-[var(--primary)]" />
              </div>
              <h3 className="text-xl mb-2 text-[var(--foreground)]">{visa.name}</h3>
              <p className="text-[var(--muted-foreground)] text-sm mb-4">{visa.description}</p>
              <div className="space-y-2 text-sm">
                
                <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
                  <CheckCircle className="h-4 w-4" />
                  <span>{visa.validity}</span>
                </div>
                
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  </div>
</section>

{/* Popular Destinations */}
<section className="py-20 bg-[var(--card)]">
  <div className="container mx-auto px-4">
    <div className="text-center mb-12">
      <h2 className="text-4xl md:text-5xl mb-4 text-[var(--foreground)]">
        Popular Visa Destinations
      </h2>
      <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
        We process visas for over 50 countries worldwide
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {popularDestinations.map((dest, index) => (
        <Card
          key={index}
          className="hover:shadow-lg transition-shadow bg-[var(--card)] border border-[var(--border)]"
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{dest.flag}</span>
                <div>
                  <h3 className="text-xl text-[var(--foreground)]">{dest.country}</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">{dest.processingTime}</p>
                </div>
              </div>
              <Badge className="bg-[var(--muted)] text-[var(--foreground)] border-[var(--border)]">
                {dest.successRate} success
              </Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              {dest.types.map((type, idx) => (
                <Badge key={idx} variant="outline" className="text-xs text-[var(--muted-foreground)] border-[var(--border)]">
                  {type}
                </Badge>
              ))}
            </div>
            <Button
              onClick={() => onNavigate('book')}
              className="w-full mt-4 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] hover:from-[var(--secondary)] hover:to-[var(--primary)] text-[var(--primary-foreground)]"
            >
              Apply Now
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
</section>

{/* Application Process */}
<section className="py-20 bg-[var(--lighter-background)]">
  <div className="container mx-auto px-4">
    <div className="text-center mb-12">
      <h2 className="text-4xl md:text-5xl mb-4 text-[var(--foreground)]">
        How It Works
      </h2>
      <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
        Our streamlined process makes visa applications simple and stress-free
      </p>
    </div>

    <div className="max-w-4xl mx-auto">
      <div className="space-y-6">
        {applicationProcess.map((item, index) => (
          <Card
            key={index}
            className="hover:shadow-lg transition-shadow bg-[var(--card)] border border-[var(--border)]"
          >
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-full flex items-center justify-center flex-shrink-0 text-[var(--primary-foreground)] text-xl">
                  {item.step}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl mb-2 text-[var(--foreground)]">{item.title}</h3>
                  <p className="text-[var(--muted-foreground)]">{item.description}</p>
                </div>
                <CheckCircle className="h-6 w-6 text-[var(--primary)] flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </div>
</section>


     {/* Why Choose Us */}
<section className="py-20 bg-[var(--lighter-background)]">
  <div className="container mx-auto px-4">
    <div className="text-center mb-12">
      <h2 className="text-4xl md:text-5xl mb-4 text-[var(--foreground)]">
        Why Choose Our Visa Services?
      </h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
      {[
        {
          icon: <CheckCircle className="h-8 w-8 text-[var(--primary)]" />,
          title: "High Success Rate",
          desc: "92% average approval rate across all visa types",
        },
        {
          icon: <Clock className="h-8 w-8 text-[var(--primary)]" />,
          title: "Fast Processing",
          desc: "Expedited services available for urgent applications",
        },
        {
          icon: <Shield className="h-8 w-8 text-[var(--primary)]" />,
          title: "Expert Guidance",
          desc: "Experienced team with in-depth knowledge of visa requirements",
        },
      ].map((item, i) => (
        <div key={i} className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-[var(--muted)] to-[var(--input-background)] rounded-full flex items-center justify-center mx-auto mb-4">
            {item.icon}
          </div>
          <h3 className="text-xl mb-2 text-[var(--foreground)]">{item.title}</h3>
          <p className="text-[var(--muted-foreground)]">{item.desc}</p>
        </div>
      ))}
    </div>
  </div>
</section>

{/* FAQs */}
<section className="py-20 bg-[var(--card)]">
  <div className="container mx-auto px-4">
    <div className="text-center mb-12">
      <h2 className="text-4xl md:text-5xl mb-4 text-[var(--foreground)]">
        Frequently Asked Questions
      </h2>
      <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
        Find answers to common questions about visa applications
      </p>
    </div>

    <div className="max-w-3xl mx-auto">
      <Accordion type="single" collapsible className="space-y-4">
        {faqs.map((faq, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className="bg-[var(--card)] border border-[var(--border)] rounded-lg px-6"
          >
            <AccordionTrigger className="text-left text-[var(--foreground)] hover:no-underline">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-[var(--muted-foreground)]">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </div>
</section>

{/* CTA Section */}
<section className="py-16 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-[var(--primary-foreground)] animate-gradient-x">
  <div className="container mx-auto px-4 text-center">
    <h2 className="text-4xl md:text-5xl mb-6">Ready to Apply for Your Visa?</h2>
    <p className="text-xl mb-8 max-w-2xl mx-auto text-[var(--primary-foreground)]/90">
      Let our experts handle your visa application. Start your journey today!
    </p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Button
        size="lg"
        onClick={() => onNavigate('book')}
        className="bg-[var(--card)] text-[var(--primary)] hover:bg-[var(--muted)] text-lg px-8"
      >
        Start Application
      </Button>
      <Button
        size="lg"
        variant="outline"
        onClick={() => onNavigate('contact')}
        className="bg-[var(--primary)]/10 backdrop-blur-sm border border-[var(--card)]/30 text-[var(--primary-foreground)] hover:bg-[var(--primary)]/20 text-lg px-8"
      >
        Speak to an Expert
      </Button>
    </div>
  </div>
</section>

    </div>
  );
}

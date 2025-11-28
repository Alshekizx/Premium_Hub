'use client';
import { useEffect, useState } from 'react';
import { doc, getDoc,getDocs, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, Car, Home } from 'lucide-react';
import { CompanyDetails } from '@/app/data/types';


export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'general',
    message: '',
  });

 const [companyDetails, setCompanyDetails] = useState<CompanyDetails | null>(null);
  const [loading, setLoading] = useState(true);
const [faqs, setFaqs] = useState<{ q: string; a: string }[]>([]);
const [faqLoading, setFaqLoading] = useState(true);
useEffect(() => {
  const fetchFaqs = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'faqs'));
      const faqData = querySnapshot.docs.map((doc) => ({
        q: doc.data().question,
        a: doc.data().answer,
      }));
      setFaqs(faqData);
    } catch (err) {
      console.error("Error fetching FAQs:", err);
    } finally {
      setFaqLoading(false);
    }
  };

  fetchFaqs();
}, []);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const docRef = doc(db, 'company', 'details');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
        setCompanyDetails(docSnap.data() as CompanyDetails);
      } else {
          console.warn('No company details found');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, []);

  if (loading) return <p className="text-center py-20">Loading company info...</p>;
if (!companyDetails) return <p className="text-center py-20">No company info available</p>;

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    // Reference the "messages" collection
    const messagesRef = collection(db, 'messages');

    // Add the new message document
    await addDoc(messagesRef, {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: formData.subject,
      message: formData.message,
      status: 'unread', // using your ContactMessage type
      date: serverTimestamp(), // Firestore timestamp
    });

    alert('Thank you for contacting us! Your message has been sent.');

    // Reset the form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: 'general',
      message: '',
    });
  } catch (err) {
    console.error('Error sending message:', err);
    alert('Oops! Something went wrong. Please try again later.');
  }
};




  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

const contactInfo = companyDetails
  ? [
      {
        icon: Phone,
        title: 'Call Us',
        details: [
          ...companyDetails.generalPhone,
          `Mon-Sat: 9AM-8PM` // fallback if you want working hours
        ],
        link: `tel:${companyDetails.generalPhone[0]}`,
      },
      {
        icon: Mail,
        title: 'Email Us',
        details: [companyDetails.primaryEmail, 'We reply within 24 hours'],
        link: `mailto:${companyDetails.primaryEmail}`,
      },
      {
        icon: MapPin,
        title: 'Visit Us',
        details: [
          companyDetails.address.street,
          `${companyDetails.address.city}, ${companyDetails.address.state} ${companyDetails.address.zipCode}`
        ],
        link: `https://www.google.com/maps?q=${companyDetails.mapCoordinates.lat},${companyDetails.mapCoordinates.lng}`,
      },
      {
        icon: Clock,
        title: 'Office Hours',
        details: companyDetails.workingHours
          ? Object.entries(companyDetails.workingHours).map(
              ([day, hours]) =>
                `${day}: ${hours.closed ? 'Closed' : `${hours.open} - ${hours.close}`}`
            )
          : [],
        link: null,
      },
    ]
  : [];


const departments = companyDetails
  ? [
      {
        icon: Car,
        title: 'Automotive Department',
        email: companyDetails.primaryEmail || 'cars@example.com',
        phone: companyDetails.carPhone?.[0] || '',
        color: 'blue',
      },
      {
        icon: Home,
        title: 'Real Estate Department',
        email: companyDetails.secondaryEmail || 'homes@example.com',
        phone: companyDetails.homePhone?.[0] || '',
        color: 'amber',
      },
    ]
  : [];


  return (
    <div className="pt-20 bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-amber-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex p-3 bg-white/10 backdrop-blur-sm rounded-2xl mb-4">
            <MessageSquare className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl text-white mb-6">Get In Touch</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Have questions? We&apos;re here to help. Reach out to our team and we&apos;ll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 -mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <a
                key={index}
                href={info.link || '#'}
                target={info.link?.startsWith('http') ? '_blank' : undefined}
                rel={info.link?.startsWith('http') ? 'noopener noreferrer' : undefined}
                className={`bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all ${
                  info.link ? 'hover:scale-105 cursor-pointer' : 'cursor-default'
                }`}
              >
                <div className="inline-flex p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl mb-4">
                  <info.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg text-gray-900 mb-2">{info.title}</h3>
                {info.details.map((detail, idx) => (
                  <p key={idx} className="text-gray-600 text-sm">
                    {detail}
                  </p>
                ))}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <h2 className="text-3xl text-gray-900 mb-2">Send Us a Message</h2>
              <p className="text-gray-600 mb-8">
                Fill out the form below and we&apos;ll get back to you shortly.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">Subject *</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="cars">Car Sales/Rental</option>
                    <option value="homes">Home Sales/Rental</option>
                    <option value="financing">Financing Options</option>
                    <option value="support">Customer Support</option>
                    <option value="partnership">Partnership Opportunities</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder="Tell us how we can help you..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Send Message
                </button>
              </form>
            </div>

            {/* Departments & Map */}
            <div className="space-y-6">
              {/* Departments */}
              <div className="space-y-4">
                <h2 className="text-3xl text-gray-900 mb-6">Contact by Department</h2>
                {departments.map((dept, index) => (
                  <div
                    key={index}
                    className={`bg-white rounded-2xl p-6 shadow-lg border-l-4 ${
                      dept.color === 'blue' ? 'border-blue-600' : 'border-amber-600'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-3 rounded-xl ${
                          dept.color === 'blue'
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-amber-100 text-amber-600'
                        }`}
                      >
                        <dept.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl text-gray-900 mb-3">{dept.title}</h3>
                        <div className="space-y-2">
                          <a
                            href={`mailto:${dept.email}`}
                            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            <Mail className="w-4 h-4" />
                            <span>{dept.email}</span>
                          </a>
                          <a
                            href={`tel:${dept.phone.replace(/\s/g, '')}`}
                            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            <Phone className="w-4 h-4" />
                            <span>{dept.phone}</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Map Placeholder */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl text-gray-900 mb-4">Our Location</h3>
                <div className="bg-gray-100 rounded-xl h-64 flex items-center justify-center">
                  <div className="text-center">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">{companyDetails.address.street}</p>
                  <p className="text-gray-600">
                    {companyDetails.address.city}, {companyDetails.address.state} {companyDetails.address.zipCode}
                  </p>
                  <a
                    href={`https://www.google.com/maps?q=${companyDetails.mapCoordinates.lat},${companyDetails.mapCoordinates.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 text-blue-600 hover:text-blue-700"
                  >
                    Get Directions →
                  </a>
                </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">
              Quick answers to common questions
            </p>
          </div>

          <div className="space-y-4">
           {faqLoading ? (
  <p className="text-center">Loading FAQs...</p>
) : faqs.length === 0 ? (
  <p className="text-center">No FAQs available at the moment.</p>
) : (
  faqs.map((faq, index) => (
    <details
      key={index}
      className="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-colors group"
    >
      <summary className="cursor-pointer text-lg text-gray-900 list-none flex items-center justify-between">
        <span>{faq.q}</span>
        <span className="text-blue-600 group-open:rotate-180 transition-transform">▼</span>
      </summary>
      <p className="mt-4 text-gray-600">{faq.a}</p>
    </details>
  ))
)}

          </div>
        </div>
      </section>
    </div>
  );
}

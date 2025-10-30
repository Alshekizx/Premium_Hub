import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Mail, Phone, MapPin, Clock, MessageSquare, Send } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface ContactPageProps {
  onNavigate: (page: string) => void;
}

export function ContactPage({ onNavigate }: ContactPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    inquiry: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Thank you for your inquiry! Our team will get back to you within 24 hours.');
    setFormData({ name: '', email: '', phone: '', subject: '', inquiry: '', message: '' });
  };

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-[var(--primary-foreground)] animate-gradient-x">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl mb-4 text-[var(--primary-foreground)]">Get In Touch</h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto text-[var(--primary-foreground)]/90">
            Have questions? We&apos;re here to help you plan your perfect journey
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 bg-[var(--background)]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto -mt-24 relative z-10">
            {[
              {
                icon: <Phone className="h-7 w-7 text-[var(--primary)]" />,
                title: "Phone",
                lines: ["+1 (555) MAJIK-00", "+1 (555) 624-4500"],
              },
              {
                icon: <Mail className="h-7 w-7 text-[var(--primary)]" />,
                title: "Email",
                lines: ["info@majiktravels.com", "support@majiktravels.com"],
              },
              {
                icon: <MapPin className="h-7 w-7 text-[var(--primary)]" />,
                title: "Office",
                lines: ["123 Travel Plaza", "New York, NY 10001"],
              },
              {
                icon: <Clock className="h-7 w-7 text-[var(--primary)]" />,
                title: "Hours",
                lines: ["Mon-Fri: 9AM - 6PM", "Sat-Sun: 10AM - 4PM"],
              },
            ].map((info, i) => (
              <Card key={i} className="shadow-xl bg-[var(--card)] border border-[var(--border)] hover:shadow-2xl transition-all">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-[var(--muted)] to-[var(--input-background)] rounded-full flex items-center justify-center mx-auto mb-4">
                    {info.icon}
                  </div>
                  <h3 className="mb-2 text-[var(--foreground)]">{info.title}</h3>
                  {info.lines.map((line, j) => (
                    <p key={j} className="text-sm text-[var(--muted-foreground)]">{line}</p>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>


      {/* Contact Form Section */}
      <section className="py-20 bg-[var(--lighter-background)] dark:bg-[var(--background)]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            
            {/* Form */}
            <div>
              <div className="mb-8">
                <h2 className="text-4xl mb-4 text-[var(--foreground)] dark:text-[var(--card-foreground)]">Send Us a Message</h2>
                <p className="text-[var(--muted-foreground)] dark:text-[var(--muted)]">
                  Fill out the form below and our team will respond within 24 hours
                </p>
              </div>

              <Card className="bg-[var(--card)] border border-[var(--border)]">
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          className="bg-[var(--input-background)] text-[var(--foreground)]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          className="bg-[var(--input-background)] text-[var(--foreground)]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="bg-[var(--input-background)] text-[var(--foreground)]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="inquiry">Inquiry Type *</Label>
                        <Select
                          value={formData.inquiry}
                          onValueChange={(value) => setFormData({ ...formData, inquiry: value })}
                        >
                          <SelectTrigger id="inquiry" className="bg-[var(--input-background)] text-[var(--foreground)]">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="flight">Flight Booking</SelectItem>
                            <SelectItem value="visa">Visa Application</SelectItem>
                            <SelectItem value="hotel">Hotel Reservation</SelectItem>
                            <SelectItem value="event">Event Space Booking</SelectItem>
                            <SelectItem value="package">Travel Package</SelectItem>
                            <SelectItem value="general">General Inquiry</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        placeholder="How can we help you?"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                        className="bg-[var(--input-background)] text-[var(--foreground)]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us more about your travel plans or questions..."
                        rows={6}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                        className="bg-[var(--input-background)] text-[var(--foreground)]"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] hover:from-[var(--primary)]/90 hover:to-[var(--secondary)]/90"
                      size="lg"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>

                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Additional Info */}
            <div className="space-y-6 text-[var(--foreground)] dark:text-[var(--card-foreground)]">
              <div>
                <h2 className="text-4xl mb-4">We&apos;re Here to Help</h2>
                <p className="text-[var(--muted-foreground)] dark:text-[var(--muted)] mb-8">
                  Our dedicated team is committed to making your travel experience seamless and memorable. Whether you&apos;re planning a vacation, business trip, or need visa assistance, we&apos;re just a message away.
                </p>
              </div>

              <Card className="bg-[var(--card)] border border-[var(--border)]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-[var(--primary)]" />
                    Quick Response
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[var(--muted-foreground)] dark:text-[var(--muted)]">
                    Most inquiries are responded to within 2-4 hours during business hours. For urgent matters, please call us directly.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-[var(--card)] border border-[var(--border)]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-[var(--primary)]" />
                    24/7 Emergency Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[var(--muted-foreground)] dark:text-[var(--muted)] mb-4">
                    For travelers already on their journey who need immediate assistance:
                  </p>
                  <div className="bg-[var(--muted)] p-4 rounded-lg">
                    <p className="text-[var(--primary-foreground)]">Emergency Hotline:</p>
                    <p className="text-2xl text-[var(--primary)]">+1 (555) 911-HELP</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[var(--card)] border border-[var(--border)]">
                <CardHeader>
                  <CardTitle>Visit Our Office</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[var(--muted-foreground)] dark:text-[var(--muted)] mb-4">
                    We welcome walk-in consultations! Our travel experts are available to discuss your travel plans in person.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-[var(--primary)] flex-shrink-0 mt-0.5" />
                      <div>
                        <p>123 Travel Plaza, Suite 500</p>
                        <p>New York, NY 10001</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-[var(--primary)] flex-shrink-0 mt-0.5" />
                      <div>
                        <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                        <p>Saturday - Sunday: 10:00 AM - 4:00 PM</p>
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--muted)]"
                    onClick={() => window.open('https://maps.google.com', '_blank')}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Get Directions
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-[var(--primary-foreground)]">
                <CardHeader>
                  <CardTitle>Prefer to Book Directly?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-[var(--primary-foreground)]/90">
                    Skip the wait and start booking your dream trip right away!
                  </p>
                  <Button 
                    onClick={() => onNavigate('book')}
                    className="w-full bg-[var(--primary-foreground)] text-[var(--primary)] hover:bg-[var(--lighter-background)]"
                  >
                    Book Now
                  </Button>
                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </section>


      {/* Map Section */}
      <section className="py-0">
        <div className="w-full h-96 flex items-center justify-center bg-[var(--muted)] dark:bg-[var(--muted-foreground)] rounded-lg">
          <div className="text-center text-[var(--foreground)] dark:text-[var(--card-foreground)]">
            <MapPin className="h-12 w-12 mx-auto mb-2 text-[var(--primary)]" />
            <p className="font-medium text-lg">Interactive Map</p>
            <p className="text-sm text-[var(--muted-foreground)] dark:text-[var(--muted)]">
              123 Travel Plaza, New York, NY 10001
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}

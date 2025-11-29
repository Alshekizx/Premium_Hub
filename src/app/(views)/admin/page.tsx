'use client';
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Bus, House, MessageSquare, Upload, DollarSign, TrendingUp } from 'lucide-react';
import { fetchCars,  fetchHomes, fetchCompanyDetails, fetchMessages } from "@/app/lib/firebase"; 
import { Car } from "@/app/data/cars";
import { Home } from "@/app/data/homes";
import { CompanyDetails, ContactMessage } from "@/app/data/types";

export default function Overview() {
  const [cars, setCars] = useState<Car[]>([]);
  const [homes, setHomes] = useState<Home[]>([]);
  const [, setCompany] = useState<CompanyDetails | null>(null);
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const [carsData, homesData, companyData, messagesData] = await Promise.all([
        fetchCars(),
        fetchHomes(),
        fetchCompanyDetails(),
        fetchMessages(),
      ]);
      setCars(carsData);
      setHomes(homesData);
      setCompany(companyData);
      setMessages(messagesData);
    };
    loadData();
  }, []);

  // Prepare dynamic stats
  const stats = [
    { name: 'Total Cars', value: cars.length.toString(), icon: Bus, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { name: 'Total Homes', value: homes.length.toString(), icon: House, color: 'text-green-600', bgColor: 'bg-green-50' },
    { name: 'Cars For Sale', value: cars.filter(c => c.type === 'sale' || c.type === 'both').length.toString(), icon: DollarSign, color: 'text-purple-600', bgColor: 'bg-purple-50' },
    { name: 'Cars For Rent', value: cars.filter(c => c.type === 'rent' || c.type === 'both').length.toString(), icon: Bus, color: 'text-orange-600', bgColor: 'bg-orange-50' },
    { name: 'Homes For Sale', value: homes.filter(h => h.type === 'sale' || h.type === 'both').length.toString(), icon: DollarSign, color: 'text-teal-600', bgColor: 'bg-teal-50' },
    { name: 'Homes For Rent', value: homes.filter(h => h.type === 'rent' || h.type === 'both').length.toString(), icon: House, color: 'text-pink-600', bgColor: 'bg-pink-50' },
    { name: 'Total Inquiries', value: messages.length.toString(), icon: MessageSquare, color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
    { name: 'Recent Uploads', value: (cars.length + homes.length).toString(), icon: Upload, color: 'text-amber-600', bgColor: 'bg-amber-50' },
  ];

  const recentActivity = [
    ...cars.slice(-3).map(c => ({ action: 'New car uploaded', item: c.name, time: 'Just now' })),
    ...homes.slice(-3).map(h => ({ action: 'New home uploaded', item: h.title, time: 'Just now' })),
    ...messages.slice(-3).map(m => ({ action: 'New message', item: m.subject, time: 'Just now' })),
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">
          Welcome back! You have {cars.length} cars and {homes.length} homes listed.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map(stat => (
          <Card key={stat.name}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.name}</p>
                <p className="text-2xl">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Stats & Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Total Revenue (This Month)</span>
                </div>
                <span className="text-lg">$145,230</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Pending Inquiries</span>
                </div>
                <span className="text-lg">{messages.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Upload className="h-4 w-4 text-purple-600" />
                  <span className="text-sm">This Week&apos;s Uploads</span>
                </div>
                <span className="text-lg">{cars.length + homes.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-blue-600"></div>
                  <div className="flex-1">
                    <p className="text-sm">{activity.action}</p>
                    <p className="text-sm text-gray-500">{activity.item}</p>
                  </div>
                  <span className="text-xs text-gray-400">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

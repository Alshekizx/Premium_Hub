'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Building2, 
  Car, 
  Home, 
  MessageSquare, 
  HelpCircle,
  Upload,
  List,
  Users
} from 'lucide-react';

const navigation = [
  { name: 'Overview', href: '/admin', icon: LayoutDashboard },
  { name: 'Company Details', href: '/admin/pages/companyDetails', icon: Building2 },
  {
    name: 'Cars',
    icon: Car,
    children: [
      { name: 'Upload New Car', href: '/admin/pages/cars/uploadCars', icon: Upload },
      { name: 'Car List', href: '/admin/pages/cars/carList', icon: List },
      { name: 'Interested For Cars', href: '/admin/pages/cars/interestedCars', icon: Users },
    ],
  },
  {
    name: 'Homes',
    icon: Home,
    children: [
      { name: 'Upload New Home', href: '/admin/pages/homes/uploadHomes', icon: Upload },
      { name: 'Home List', href: '/admin/pages/homes/homeList', icon: List },
      { name: 'Interested For Homes', href: '/admin/pages/homes/interestedHomes', icon: Users },
    ],
  },
  { name: 'Contact Messages', href: '/admin/pages/contactMessage', icon: MessageSquare },
  { name: 'FAQ Manager', href: '/admin/pages/faqManager', icon: HelpCircle },
];

export default function Sidebar() {
  const pathname = usePathname(); // Next.js hook to get current path

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-white">
      <div className="flex h-16 items-center border-b px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <Car className="h-5 w-5 text-white" />
          </div>
          <span className="font-semibold">RentalHub Admin</span>
        </div>
      </div>
      
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navigation.map((item) => (
          <div key={item.name}>
            {item.children ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2 px-3 py-2 text-gray-700 text-sm">
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </div>
                <div className="ml-4 space-y-1">
                  {item.children.map((child) => {
                    const isActive = pathname === child.href;
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`flex items-center gap-2 rounded-md px-8 py-2  text-sm transition-colors ${
                          isActive
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <child.icon className="h-4 w-4" />
                        <span>{child.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ) : (
              <Link
                href={item.href}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                  pathname === item.href
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}

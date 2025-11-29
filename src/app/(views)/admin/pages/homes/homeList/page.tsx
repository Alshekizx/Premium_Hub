"use client";

import { useState, useEffect } from 'react';
import { db } from '../../../../../../../firebase';  // adjust the path to your firebase.ts
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from 'firebase/firestore';

import Image from 'next/image';

import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { Eye, Pencil, Trash2, Search } from 'lucide-react';
import { Home } from '@/app/data/homes';

import { toast } from 'sonner';
import Link from 'next/link';

export default function HomeList() {
  const [homes, setHomes] = useState<Home[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [loading, setLoading] = useState(true);

  // Fetch homes from Firestore
  useEffect(() => {
    const fetchHomes = async () => {
      try {
        const homesCollection = collection(db, 'homes');
        const snapshot = await getDocs(homesCollection);
const homesData: Home[] = snapshot.docs.map(doc => {
  const data = doc.data() as Omit<Home, 'id'>; // exclude id
  return {
    id: doc.id, // Firestore document ID
    ...data,
  };
});


        setHomes(homesData);
        setLoading(false);
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch homes.');
        setLoading(false);
      }
    };

    fetchHomes();
  }, []);

const handleDelete = async (id: string) => {
  const confirmDelete = confirm("Are you sure you want to delete this home?");
  if (!confirmDelete) return;

  try {
    // Optimistic UI update (remove first)
    setHomes(prev => prev.filter(home => home.id !== id));

    // Delete from Firestore
    await deleteDoc(doc(db, "homes", id));

    toast.success("Home deleted successfully!");
  } catch (err) {
    console.error(err);

    toast.error("Failed to delete home. Restoring...");

    // Rollback if delete fails
    const snapshot = await getDocs(collection(db, "homes"));
    const homesData: Home[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<Home, "id">),
    }));

    setHomes(homesData);
  }
};


  const filteredHomes = homes.filter(
    (home) =>
      home.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      home.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      home.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p>Loading homes...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl">Home List</h1>
        <p className="text-gray-500 mt-1">Manage your home inventory</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Homes ({filteredHomes.length})</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search homes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Beds/Baths</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Rental Price</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHomes.map((home) => (
                <TableRow key={home.id}>
                  <TableCell>
                    <Image
                      src={home.image}
                      alt={home.title}
                      width={80}   // 20 * 4 = 80px
                      height={48}  // 12 * 4 = 48px
                      className="rounded object-cover"
                    />
                  </TableCell>
                  <TableCell>{home.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{home.category}</Badge>
                  </TableCell>
                  <TableCell>{home.city}, {home.state}</TableCell>
                  <TableCell>{home.bedrooms} / {home.bathrooms}</TableCell>
                  <TableCell>${home.price.toLocaleString()}</TableCell>
                  <TableCell>{home.rentalPrice ? `$${home.rentalPrice}/mo` : '-'}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link href={`/homes/${home.id}`}>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>

                        <Link href={`/admin/pages/homes/edit/${home.id}`}>
                          <Button variant="ghost" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(home.id)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { db } from "../../../../../../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore"; 
import { InterestedUser } from "../../../../../data/cars";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Eye, Search, Mail } from "lucide-react";
import { Badge } from "@/app/components/ui/badge";

export default function InterestedCars() {
  const [interested, setInterested] = useState<InterestedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<InterestedUser | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  // 🔥 Fetch from Firestore
  useEffect(() => {
    const fetchInterested = async () => {
      try {
        const q = query(
          collection(db, "interestedUsers"),
          where("itemType", "==", "car")
        );

        const querySnapshot = await getDocs(q);

        const list: InterestedUser[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as InterestedUser[];

        setInterested(list);
      } catch (error) {
        console.error("Error fetching interested users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInterested();
  }, []);

  const filteredInterested = interested.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.itemName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl">Interested For Cars</h1>
        <p className="text-gray-500 mt-1">View and manage user inquiries for car listings</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              All Inquiries ({loading ? "Loading..." : filteredInterested.length})
            </CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search inquiries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Car</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredInterested.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-500">
                      No inquiries found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInterested.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.fullName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone || "-"}</TableCell>
                      <TableCell>{user.itemName}</TableCell>
                      <TableCell>{formatDate(user.dateSubmitted)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedUser(user);
                              setViewModalOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => window.open(`mailto:${user.email}`)}
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

{viewModalOpen && selectedUser && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-auto">
    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-auto p-6 relative animate-fadeIn">
      {/* Close button */}
      <button
        onClick={() => setViewModalOpen(false)}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold transition-colors"
      >
        ✕
      </button>

      {/* Header */}
      <div className="mb-6 border-b pb-3">
        <h2 className="text-2xl font-bold text-gray-800">Inquiry Details</h2>
        <p className="text-gray-500 text-sm mt-1">View full inquiry details</p>
      </div>

      {/* Inquiry details */}
      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
        <div>
          <p className="text-sm text-gray-500">Full Name</p>
          <p className="font-medium text-gray-700">{selectedUser.fullName}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="font-medium text-gray-700">{selectedUser.email}</p>
        </div>

        {selectedUser.phone && (
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="font-medium text-gray-700">{selectedUser.phone}</p>
          </div>
        )}

        <div>
          <p className="text-sm text-gray-500">Car</p>
          <Badge>{selectedUser.itemName}</Badge>
        </div>

        <div>
          <p className="text-sm text-gray-500">Date Submitted</p>
          <p className="font-medium text-gray-700">{formatDate(selectedUser.dateSubmitted)}</p>
        </div>

        {selectedUser.message && (
          <div>
            <p className="text-sm text-gray-500 mb-2">Message</p>
            <div className="rounded-md bg-gray-50 p-4 text-gray-800 text-sm whitespace-pre-wrap">
              {selectedUser.message}
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-4">
          <Button
            className="flex-1 gap-2"
            onClick={() => window.open(`mailto:${selectedUser.email}`)}
          >
            <Mail className="h-4 w-4" />
            Reply via Email
          </Button>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

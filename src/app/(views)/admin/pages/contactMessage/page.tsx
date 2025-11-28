"use client";
import { useState, useEffect } from "react";
import { Timestamp } from "firebase/firestore";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import { Eye, Search, Mail, Trash2 } from "lucide-react";
import { ContactMessage } from "@/app/data/types";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { toast } from "sonner";
import { collection, onSnapshot, doc, deleteDoc, updateDoc, query, orderBy } from "firebase/firestore";
import { db } from "../../../../../../firebase"; // adjust path to your firebase config

export default function ContactMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "read" | "unread">("all");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch messages in real-time
  useEffect(() => {
    const messagesRef = collection(db, "messages");
    const q = query(messagesRef, orderBy("date", "desc")); // newest first

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const msgs: ContactMessage[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<ContactMessage, "id">),
        }));
        setMessages(msgs);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching messages:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe(); // clean up listener
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "messages", id));
      toast.success("Message deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete message");
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const messageRef = doc(db, "messages", id);
      await updateDoc(messageRef, { status: "read" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleViewMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    setViewModalOpen(true);
    if (message.status === "unread") {
      handleMarkAsRead(message.id);
    }
  };

  const filteredMessages = messages.filter((msg) => {
    const matchesSearch =
      msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || msg.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (date: Timestamp | string) => {
  const d = date instanceof Timestamp ? date.toDate() : new Date(date);

  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

  const unreadCount = messages.filter((msg) => msg.status === "unread").length;

  if (loading) return <p className="text-center py-20">Loading messages...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl">Contact Messages</h1>
        <p className="text-gray-500 mt-1">
          Manage customer inquiries and messages ({unreadCount} unread)
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <CardTitle>All Messages ({filteredMessages.length})</CardTitle>
            <div className="flex items-center gap-4">
              <Select
                value={statusFilter}
               onValueChange={(value: "all" | "read" | "unread") =>
                  setStatusFilter(value)
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMessages.map((message) => (
                <TableRow
                  key={message.id}
                  className={message.status === "unread" ? "bg-blue-50/50" : ""}
                >
                  <TableCell>
                    <Badge
                      variant={message.status === "unread" ? "default" : "secondary"}
                    >
                      {message.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{message.name}</TableCell>
                  <TableCell>{message.email}</TableCell>
                  <TableCell>{message.phone}</TableCell>
                  <TableCell className="max-w-xs truncate">{message.subject}</TableCell>
                  <TableCell>{formatDate(message.date)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewMessage(message)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => window.open(`mailto:${message.email}`)}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(message.id)}
                      >
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

{viewModalOpen && selectedMessage && (
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
        <h2 className="text-2xl font-bold text-gray-800">Message Details</h2>
        <p className="text-gray-500 text-sm mt-1">View full message</p>
      </div>

      {/* Message details */}
      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
        <div>
          <p className="text-sm text-gray-500">From</p>
          <p className="font-medium text-gray-700">{selectedMessage.name}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="font-medium text-gray-700">{selectedMessage.email}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Phone</p>
          <p className="font-medium text-gray-700">{selectedMessage.phone}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Subject</p>
          <p className="font-medium text-gray-700">{selectedMessage.subject}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Date</p>
          <p className="font-medium text-gray-700">{formatDate(selectedMessage.date)}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-2">Message</p>
          <div className="rounded-md bg-gray-50 p-4 text-gray-800 text-sm whitespace-pre-wrap">
            {selectedMessage.message}
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            className="flex-1 gap-2"
            onClick={() => window.open(`mailto:${selectedMessage.email}`)}
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

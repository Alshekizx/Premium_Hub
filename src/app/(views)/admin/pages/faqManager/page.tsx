"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Plus, Pencil, Trash2, Save, X } from "lucide-react";
import { FAQ } from "@/app/data/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui/accordion";

import { toast } from "sonner";

import { db } from "../../../../../../firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  doc,
} from "firebase/firestore";

export default function FAQManager() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [formData, setFormData] = useState({ question: "", answer: "" });

  // ================================
  // 🔥 Fetch FAQs in Real Time
  // ================================
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "faqs"), (snapshot) => {
      const faqList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FAQ[];

      setFaqs(faqList);
    });

    return () => unsub();
  }, []);

  // ================================
  // 🔥 Open Modal
  // ================================
  const handleOpenDialog = (faq?: FAQ) => {
    if (faq) {
      setEditingFAQ(faq);
      setFormData({ question: faq.question, answer: faq.answer });
    } else {
      setEditingFAQ(null);
      setFormData({ question: "", answer: "" });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingFAQ(null);
    setFormData({ question: "", answer: "" });
  };

  // ================================
  // 🔥 Add / Update FAQ
  // ================================
  const handleSave = async () => {
    if (!formData.question.trim() || !formData.answer.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      if (editingFAQ) {
        // Update Firestore
        const ref = doc(db, "faqs", editingFAQ.id);
        await updateDoc(ref, {
          question: formData.question,
          answer: formData.answer,
        });
        toast.success("FAQ updated successfully!");
      } else {
        // Add new FAQ
        await addDoc(collection(db, "faqs"), {
          question: formData.question,
          answer: formData.answer,
        });
        toast.success("FAQ added successfully!");
      }

      handleCloseDialog();
    } catch (error) {
      toast.error("Something went wrong!");
      console.error(error);
    }
  };

  // ================================
  // 🔥 Delete FAQ
  // ================================
  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "faqs", id));
      toast.success("FAQ deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete FAQ");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">FAQ Manager</h1>
          <p className="text-gray-500 mt-1">
            Manage frequently asked questions for your customers
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus className="h-4 w-4" />
          Add FAQ
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All FAQs ({faqs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {faqs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-gray-500 mb-4">No FAQs yet. Add your first FAQ!</p>
              <Button onClick={() => handleOpenDialog()} className="gap-2">
                <Plus className="h-4 w-4" />
                Add FAQ
              </Button>
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <div className="flex items-center gap-2">
                    <AccordionTrigger className="flex-1 hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDialog(faq);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(faq.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                  <AccordionContent>
                    <p className="text-sm text-gray-600 pl-1">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      {/* Create/Edit Modal (Custom Styled) */}
{dialogOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-auto">
    <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full mx-auto p-6 relative animate-fadeIn">

      {/* Close Button */}
      <button
        onClick={handleCloseDialog}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold transition-colors"
      >
        ✕
      </button>

      {/* Header */}
      <div className="mb-6 border-b pb-3">
        <h2 className="text-2xl font-bold text-gray-800">
          {editingFAQ ? "Edit FAQ" : "Add New FAQ"}
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          {editingFAQ ? "Update this FAQ item" : "Create a new FAQ entry"}
        </p>
      </div>

      {/* Body */}
      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">

        <div>
          <Label htmlFor="question" className="text-gray-600">Question *</Label>
          <Input
            id="question"
            value={formData.question}
            onChange={(e) =>
              setFormData({ ...formData, question: e.target.value })
            }
            placeholder="Enter the question"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="answer" className="text-gray-600">Answer *</Label>
          <Textarea
            id="answer"
            value={formData.answer}
            onChange={(e) =>
              setFormData({ ...formData, answer: e.target.value })
            }
            placeholder="Enter the answer"
            rows={6}
            className="mt-1"
          />
        </div>

      </div>

      {/* Footer Buttons */}
      <div className="flex gap-2 pt-6">
        <Button
          variant="outline"
          className="flex-1 gap-2"
          onClick={handleCloseDialog}
        >
          <X className="h-4 w-4" />
          Cancel
        </Button>

        <Button
          className="flex-1 gap-2"
          onClick={handleSave}
        >
          <Save className="h-4 w-4" />
          {editingFAQ ? "Update FAQ" : "Add FAQ"}
        </Button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

'use client';

import {  useState } from 'react';
import { db } from '../../../../firebase';
import {
  collection,
  addDoc,
  getDocs,
} from 'firebase/firestore';
import { toast } from 'sonner';
import { Testimonial } from './admin';


export function TestimonialFormPage() {
  const [, setTestimonials] = useState<Testimonial[]>([]);
  const [newTestimonial, setNewTestimonial] = useState({
    name: '',
    location: '',
    text: '',
  });

  const testimonialsRef = collection(db, 'testimonials');

  // ✅ Fetch testimonials
  const fetchTestimonials = async () => {
    try {
      const snapshot = await getDocs(testimonialsRef);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Testimonial, 'id'>),
      }));
      setTestimonials(data);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast.error('Failed to fetch testimonials');
    }
  };



  // ✅ Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewTestimonial({ ...newTestimonial, [e.target.name]: e.target.value });
  };

  // ✅ Add testimonial
  const addTestimonial = async () => {
    if (!newTestimonial.name || !newTestimonial.location || !newTestimonial.text) {
      toast.error('Please fill all fields');
      return;
    }

    const initials = newTestimonial.name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);

    try {
      await addDoc(testimonialsRef, {
        ...newTestimonial,
        initials,
      });
      toast.success('Testimonial added successfully!');
      setNewTestimonial({ name: '', location: '', text: '' });
      fetchTestimonials();
    } catch (error) {
      console.error('Error adding testimonial:', error);
      toast.error('Failed to add testimonial');
    }
  };

 

  return (
    <div className="p-6 my-30 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Add Testimonial</h2>

      {/* Form */}
      <div className="bg-white p-4 rounded-2xl shadow-md space-y-4">
        <input
          type="text"
          name="name"
          value={newTestimonial.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full border p-2 rounded-md"
        />

        <input
          type="text"
          name="location"
          value={newTestimonial.location}
          onChange={handleChange}
          placeholder="Location"
          className="w-full border p-2 rounded-md"
        />

        <textarea
          name="text"
          value={newTestimonial.text}
          onChange={handleChange}
          placeholder="Testimonial text"
          className="w-full border p-2 rounded-md h-24"
        />

        <button
          onClick={addTestimonial}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Add Review
        </button>
      </div>

     
    </div>
  );
}

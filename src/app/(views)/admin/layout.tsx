'use client';

import { useState, useEffect } from 'react';
import "./styles/globals.css";

import Sidebar from "@/app/components/dashboard/Sidebar"; 
import Header from "@/app/components/dashboard/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Button } from "@/app/components/ui/button";
import { Lock, Shield } from "lucide-react";

import { signInWithEmailAndPassword, onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from '../../../../firebase';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Get ID token and save in sessionStorage
        const token = await currentUser.getIdToken();
        sessionStorage.setItem('firebaseToken', token);
        setUser(currentUser);
      } else {
        sessionStorage.removeItem('firebaseToken');
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const token = await credential.user.getIdToken();
      sessionStorage.setItem('firebaseToken', token);
      setUser(credential.user);
      setEmail('');
      setPassword('');
    } catch (err) {
      alert('Invalid email or password');
      console.error(err);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    sessionStorage.removeItem('firebaseToken');
    setUser(null);
  };

  if (loading) return <p>Loading...</p>;

  // Check for existing token in sessionStorage
  const token = sessionStorage.getItem('firebaseToken');
  if (!user && !token) {
    // Login screen
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-200 via-green-400 to-green-600 flex items-center justify-center p-4 animate-gradient-x">
        <Card className="w-full max-w-md bg-white text-gray-800 border border-gray-300 shadow-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-semibold text-green-600">
              Admin Login
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter admin email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-green-500 to-green-700 hover:from-green-700 hover:to-green-500 text-white font-semibold transition-all duration-300 shadow-md">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Dashboard layout
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="p-6 overflow-visible">
          <div className="flex justify-end mb-4">
            <Button onClick={handleLogout} variant="destructive">Logout</Button>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}

// /app/lib/firestore.ts
import { db } from "../../../firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { Car } from "@/app/data/cars";
import { Home } from "../data/homes";
import { CompanyDetails, ContactMessage } from "@/app/data/types";
import { FAQ } from "@/app/data/types"; 

// Fetch all cars
export const fetchCars = async (): Promise<Car[]> => {
  const colRef = collection(db, "cars");
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Car));
};

// Fetch all homes
export const fetchHomes = async (): Promise<Home[]> => {
  const colRef = collection(db, "homes");
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Home));
};

// Fetch company details
export const fetchCompanyDetails = async (): Promise<CompanyDetails | null> => {
  const docRef = doc(db, "company", "details");
  const snapshot = await getDoc(docRef);
  return snapshot.exists() ? (snapshot.data() as CompanyDetails) : null;
};

// Fetch contact messages
export const fetchMessages = async (): Promise<ContactMessage[]> => {
  const colRef = collection(db, "messages");
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContactMessage));
};

// Fetch FAQs
export const fetchFAQs = async (): Promise<FAQ[]> => {
  const colRef = collection(db, "faqs");
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FAQ));
};

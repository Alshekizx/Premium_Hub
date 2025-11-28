"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/app/components/ui/table";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import { Eye, Pencil, Trash2, Search } from "lucide-react";
import { Car } from "@/app/data/cars";

import { toast } from "sonner";

import { db } from "../../../../../../../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import Image from "next/image";

export default function CarList() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // ---------------------------------------------------
  //  FETCH CARS FROM FIRESTORE
  // ---------------------------------------------------
  const fetchCars = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "cars"));
      const carList: Car[] = [];

      querySnapshot.forEach((docSnap) => {
  const data = docSnap.data() as Omit<Car, "id">;

  carList.push({
    id: docSnap.id,
    ...data,
  });
});

      setCars(carList);
    } catch (error) {
      console.error("Error fetching cars:", error);
      toast.error("Failed to fetch cars.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  // ---------------------------------------------------
  // DELETE CAR FROM FIRESTORE
  // ---------------------------------------------------
  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "cars", id));
      setCars((prev) => prev.filter((car) => car.id !== id));
      toast.success("Car deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete car.");
    }
  };

  const filteredCars = cars.filter(
    (car) =>
      car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl">Car List</h1>
        <p className="text-gray-500 mt-1">Manage your car inventory</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {loading ? "Loading Cars..." : `All Cars (${filteredCars.length})`}
            </CardTitle>

            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search cars..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p className="text-center py-6 text-gray-500">Fetching cars...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Rental</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredCars.map((car) => (
                  <TableRow key={car.id}>
                    <TableCell>
                      <Image
                          src={car.image}
                          alt={car.name}
                          width={80}   // 20 * 4 = 80px
                          height={48}  // 12 * 4 = 48px
                          className="rounded object-cover"
                        />

                    </TableCell>

                    <TableCell>{car.name}</TableCell>
                    <TableCell>{car.brand}</TableCell>
                    <TableCell>{car.year}</TableCell>
                    <TableCell>${car.price?.toLocaleString()}</TableCell>

                    <TableCell>
                      {car.rentalPrice ? `$${car.rentalPrice}/day` : "-"}
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {car.category}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={car.type === "both" ? "default" : "secondary"}
                        className="capitalize"
                      >
                        {car.type}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Link href={`/cars/${car.id}`}>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>

                        <Link href={`/admin/pages/cars/edit/${car.id}`}>
                          <Button variant="ghost" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(car.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>




    </div>
  );
}



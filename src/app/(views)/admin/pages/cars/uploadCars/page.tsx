"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Button } from "@/app/components/ui/button";
import { Textarea } from "@/app/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Badge } from "@/app/components/ui/badge";
import { X, Upload, Plus } from "lucide-react";
import { toast } from "sonner";
import { Car } from "@/app/data/cars";
import { db } from "../../../../../../../firebase"; 
import { addDoc, collection } from "firebase/firestore";


export default function UploadCar() {
  const [car, setCar] = useState<Partial<Car>>({
    name: "",
    brand: "",
    year: new Date().getFullYear(),
    price: 0,
    rentalPrice: 0,
    category: "sedan",
    type: "both",
    mileage: 0,
    transmission: "automatic",
    fuelType: "",
    seatingCapacity: 5,
    features: [],
    description: "",
    images: [],
    image: "",
    interestedUsers: [], // optional
  });

  const [featureInput, setFeatureInput] = useState("");

  const handleAddFeature = () => {
    const trimmed = featureInput.trim();
    if (trimmed && !car.features?.includes(trimmed)) {
      setCar({ ...car, features: [...(car.features || []), trimmed] });
      setFeatureInput("");
    }
  };

  const handleRemoveFeature = (feature: string) => {
    setCar({
      ...car,
      features: car.features?.filter((f) => f !== feature),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!car.name || !car.brand || !car.image) {
  toast.error("Please fill in required fields.");
  return;
}

try {
  toast.info("Saving... Please wait.");

  const finalCarData = {
    ...car,
    createdAt: Date.now(),
  };

  await addDoc(collection(db, "cars"), finalCarData);

  toast.success("Car uploaded successfully!");

  // Reset form
  setCar({
    name: "",
    brand: "",
    year: new Date().getFullYear(),
    price: 0,
    rentalPrice: 0,
    category: "sedan",
    type: "both",
    mileage: 0,
    transmission: "automatic",
    fuelType: "",
    seatingCapacity: 5,
    features: [],
    description: "",
    image: "",
    images: [],
  });

} catch (err) {
  console.error(err);
  toast.error("Failed to save car.");
}

};


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Upload New Car</h1>
        <p className="text-gray-500 mt-1">Add a new car to your inventory</p>
      </div>

    <form onSubmit={handleSubmit} className="space-y-6">
        {/* BASIC INFO */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Car Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., 2024 Toyota Camry"
                  required
                  value={car.name}
                  onChange={(e) => setCar({ ...car, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand">Brand *</Label>
                <Input
                  id="brand"
                  placeholder="e.g., Toyota"
                  required
                  value={car.brand}
                  onChange={(e) => setCar({ ...car, brand: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="year">Year *</Label>
                <Input
                  id="year"
                  type="number"
                  required
                  value={car.year}
                  onChange={(e) => setCar({ ...car, year: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                
                value={car.category}
                onValueChange={(value: Car["category"]) =>
                  setCar({ ...car, category: value })
                }
              >
  <SelectTrigger id="category">
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="sedan">Sedan</SelectItem>
    <SelectItem value="suv">SUV</SelectItem>
    <SelectItem value="sports">Sports</SelectItem>
    <SelectItem value="luxury">Luxury</SelectItem>
    <SelectItem value="electric">Electric</SelectItem>
  </SelectContent>
</Select>

              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Listing Type *</Label>
                <Select
                  value={car.type}
                  onValueChange={(value) =>
                    setCar({ ...car, type: value as "sale" | "rent" | "both" })
                  }
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sale">For Sale</SelectItem>
                    <SelectItem value="rent">For Rent</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>

              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="price">Sale Price ($) *</Label>
                <Input
                  id="price"
                  type="number"
                  required
                  value={car.price}
                  onChange={(e) => setCar({ ...car, price: parseFloat(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rentalPrice">Rental Price ($/day)</Label>
                <Input
                  id="rentalPrice"
                  type="number"
                  value={car.rentalPrice}
                  onChange={(e) => setCar({ ...car, rentalPrice: parseFloat(e.target.value) })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SPECIFICATIONS */}
        <Card>
          <CardHeader>
            <CardTitle>Specifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="mileage">Mileage *</Label>
                <Input
                  id="mileage"
                  type="number"
                  required
                  value={car.mileage}
                  onChange={(e) => setCar({ ...car, mileage: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="transmission">Transmission *</Label>
<Select
  value={car.transmission}
  onValueChange={(value) =>
    setCar({ ...car, transmission: value as "automatic" | "manual" })
  }
>
  <SelectTrigger id="transmission">
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="automatic">Automatic</SelectItem>
    <SelectItem value="manual">Manual</SelectItem>
  </SelectContent>
</Select>

              </div>
              <div className="space-y-2">
                <Label htmlFor="fuelType">Fuel Type *</Label>
                <Input
                  id="fuelType"
                  required
                  value={car.fuelType}
                  onChange={(e) => setCar({ ...car, fuelType: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seatingCapacity">Seating Capacity *</Label>
                <Input
                  id="seatingCapacity"
                  type="number"
                  required
                  value={car.seatingCapacity}
                  onChange={(e) =>
                    setCar({ ...car, seatingCapacity: parseInt(e.target.value) })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FEATURES */}
        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Add a feature"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddFeature())}
              />
              <Button type="button" onClick={handleAddFeature} className="gap-2">
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>

            {(car.features || []).length > 0 && (
          <div className="flex flex-wrap gap-2">
            {(car.features || []).map((feature) => (
              <Badge key={feature} variant="secondary" className="gap-1">
                {feature}
                <button
                  type="button"
                  onClick={() => handleRemoveFeature(feature)}
                  className="ml-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

          </CardContent>
        </Card>

        {/* IMAGES */}
        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
   {/* MAIN IMAGE URL */}
    <div className="space-y-2">
      <Label htmlFor="mainImageUrl">Main Image URL *</Label>
      <Input
        id="mainImageUrl"
        type="url"
        required
        placeholder="https://example.com/car-main.jpg"
        value={car.image}
        onChange={(e) => setCar({ ...car, image: e.target.value })}
      />
    </div>

    {/* GALLERY IMAGE URLs */}
    <div className="space-y-2">
      <Label htmlFor="galleryUrls">Gallery Image URLs (comma separated)</Label>
      <Textarea
        id="galleryUrls"
        placeholder="https://img1.jpg, https://img2.jpg, https://img3.jpg"
        value={car.images?.join(", ")}
        onChange={(e) =>
          setCar({ ...car, images: e.target.value.split(",").map((url) => url.trim()) })
        }
        rows={3}
      />
    </div>
          </CardContent>
        </Card>

        {/* DESCRIPTION */}
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Describe the car..."
              value={car.description}
              onChange={(e) => setCar({ ...car, description: e.target.value })}
              rows={6}
            />
          </CardContent>
        </Card>

        {/* SUBMIT */}
     
<div className="flex justify-end gap-4">
  <Button type="button" variant="outline">
    Cancel
  </Button>

  {/* Normal HTML button instead of <Button /> */}
  <button
    type="submit"
    className="flex items-center cursor-pointer gap-2  px-4 py-2 rounded-md hover:bg-primary/90 transition"
  >
    <Upload className="h-4 w-4" />
    Upload Car
  </button>
</div>

      </form>
    </div>
  );
}

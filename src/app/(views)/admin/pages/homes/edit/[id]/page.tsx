'use client';

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "../../../../../../../../firebase";
import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Button } from "@/app/components/ui/button";
import { Textarea } from "@/app/components/ui/textarea";
import { Badge } from "@/app/components/ui/badge";
import { X, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Home } from "@/app/data/homes";

export default function EditHomePage() {
  const params = useParams();
  const router = useRouter();
  const homeId = params.id as string;

  const [home, setHome] = useState<Home | null>(null);
  const [loading, setLoading] = useState(true);
  const [amenityInput, setAmenityInput] = useState("");

  // Fetch home data by ID
  useEffect(() => {
    if (!homeId) return;

    const fetchHome = async () => {
      try {
        const docRef = doc(db, "homes", homeId);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          setHome({ id: snapshot.id, ...(snapshot.data() as Omit<Home, 'id'>) });
        } else {
          toast.error("Home not found!");
          router.push("/homes");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch home data.");
      } finally {
        setLoading(false);
      }
    };

    fetchHome();
  }, [homeId, router]);

  if (loading || !home) return <p>Loading home data...</p>;

  // Amenity handlers
  const handleAddAmenity = () => {
    if (amenityInput.trim() && !home.amenities.includes(amenityInput.trim())) {
      setHome({ ...home, amenities: [...home.amenities, amenityInput.trim()] });
      setAmenityInput("");
    }
  };

  const handleRemoveAmenity = (amenity: string) => {
    setHome({ ...home, amenities: home.amenities.filter(a => a !== amenity) });
  };

  // Update Firestore doc
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!home.id) return;

    try {
      const docRef = doc(db, "homes", home.id);
      await updateDoc(docRef, { ...home });
      toast.success("Home updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update home.");
    }
  };

  // Delete Firestore doc
  const handleDelete = async () => {
    if (!home.id) return;

    try {
      const docRef = doc(db, "homes", home.id);
      await deleteDoc(docRef);
      toast.success("Home deleted successfully!");
      router.push("/homes"); // redirect after deletion
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete home.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl">Update Home</h1>
        <p className="text-gray-500 mt-1">Modify this property&apos;s details</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">

          {/* BASIC INFORMATION */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">

              <div className="space-y-2">
                <Label>Property Title *</Label>
                <Input
                  value={home.title}
                  onChange={(e) => setHome({ ...home, title: e.target.value })}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <select
                  className="border rounded-md p-2 w-full"
                  value={home.category}
                  onChange={(e) =>
                    setHome({ ...home, category: e.target.value as Home["category"] })
                  }
                >
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="villa">Villa</option>
                  <option value="condo">Condo</option>
                  <option value="townhouse">Townhouse</option>
                </select>

                </div>
                <div className="space-y-2">
                  <Label>Year Built *</Label>
                  <Input
                    type="number"
                    value={home.yearBuilt}
                    onChange={(e) =>
                      setHome({ ...home, yearBuilt: parseInt(e.target.value) })
                    }
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Sale Price ($)</Label>
                  <Input
                    type="number"
                    value={home.price}
                    onChange={(e) =>
                      setHome({ ...home, price: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Rental Price ($/month)</Label>
                  <Input
                    type="number"
                    value={home.rentalPrice}
                    onChange={(e) =>
                      setHome({ ...home, rentalPrice: Number(e.target.value) })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

           {/* IMAGE LINKS */}
            <div className="space-y-2">
              <Label>Main Image URL *</Label>
              <Input
                value={home.image}
                onChange={(e) => setHome({ ...home, image: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Additional Images (comma-separated URLs)</Label>
              <Input
                value={home.images.join(", ")}
                onChange={(e) =>
                  setHome({ ...home, images: e.target.value.split(",").map((i) => i.trim()) })
                }
              />
            </div>

          {/* PROPERTY DETAILS */}
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Bedrooms *</Label>
                  <Input
                    type="number"
                    value={home.bedrooms}
                    onChange={(e) =>
                      setHome({ ...home, bedrooms: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Bathrooms *</Label>
                  <Input
                    type="number"
                    step="0.5"
                    value={home.bathrooms}
                    onChange={(e) =>
                      setHome({ ...home, bathrooms: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Square Feet *</Label>
                  <Input
                    type="number"
                    value={home.sqft}
                    onChange={(e) =>
                      setHome({ ...home, sqft: Number(e.target.value) })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* LOCATION */}
          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              
              <div className="space-y-2">
                <Label>Street Address *</Label>
                <Input
                  value={home.address}
                  onChange={(e) => setHome({ ...home, address: e.target.value })}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <Input
                  value={home.city}
                  onChange={(e) => setHome({ ...home, city: e.target.value })}
                  placeholder="City"
                />
                <Input
                  value={home.state}
                  onChange={(e) => setHome({ ...home, state: e.target.value })}
                  placeholder="State"
                />
                <Input
                  value={home.zipCode}
                  onChange={(e) => setHome({ ...home, zipCode: e.target.value })}
                  placeholder="ZIP"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  type="number"
                  value={home.coordinates.lat}
                  onChange={(e) =>
                    setHome({
                      ...home,
                      coordinates: {
                        ...home.coordinates,
                        lat: Number(e.target.value),
                      },
                    })
                  }
                  placeholder="Latitude"
                />
                <Input
                  type="number"
                  value={home.coordinates.lng}
                  onChange={(e) =>
                    setHome({
                      ...home,
                      coordinates: {
                        ...home.coordinates,
                        lng: Number(e.target.value),
                      },
                    })
                  }
                  placeholder="Longitude"
                />
              </div>
            </CardContent>
          </Card>

          {/* AMENITIES */}
          <Card>
            <CardHeader>
              <CardTitle>Amenities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">

              <div className="flex gap-2">
                <Input
                  value={amenityInput}
                  onChange={(e) => setAmenityInput(e.target.value)}
                  placeholder="Add amenity..."
                />
                <Button type="button" onClick={handleAddAmenity}>
                  Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {home.amenities.map((a) => (
                  <Badge key={a} variant="secondary" className="gap-1">
                    {a}
                    <button onClick={() => handleRemoveAmenity(a)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
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
                rows={6}
                value={home.description}
                onChange={(e) =>
                  setHome({ ...home, description: e.target.value })
                }
              />
            </CardContent>
          </Card>

          {/* ACTION BUTTONS */}
          <div className="flex justify-between">
            <Button type="button" variant="destructive" onClick={handleDelete} className="gap-2">
              <Trash2 className="h-4 w-4" />
              Delete Home
            </Button>

            <Button type="submit" className="gap-2">
              <Save className="h-4 w-4" />
              Update Home
            </Button>
          </div>

        </div>
      </form>
    </div>
  );
}

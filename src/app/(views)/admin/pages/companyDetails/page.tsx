'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../../../../firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Button } from '@/app/components/ui/button';
import { Switch } from '@/app/components/ui/switch';
import { Save, Upload } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import type { CompanyDetails } from '@/app/data/types';

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

export default function CompanyDetails() {
const [details, setDetails] = useState<CompanyDetails>({
  generalPhone: [''],  // start with one empty input
  carPhone: [''],
  homePhone: [''],
  primaryEmail: '',       // leave as string if only one primary email
  secondaryEmail: '',
  address: {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  },
  workingHours: DAYS.reduce((acc, day) => {
    acc[day as keyof CompanyDetails['workingHours']] = { open: '09:00', close: '17:00', closed: false };
    return acc;
  }, {} as CompanyDetails['workingHours']),
  logo: '',
  mapCoordinates: { lat: 0, lng: 0 },
});


  const [loading, setLoading] = useState(true);

  // Fetch company details from Firestore
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const docRef = doc(db, 'company', 'details');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setDetails(docSnap.data() as CompanyDetails);
        } else {
          toast.info('No company details found. You can add them now.');
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch company details');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, []);

const handleSave = async () => {
  if (!details) return;

  try {
    // Make sure carPhone and homePhone are always arrays
    const payload: CompanyDetails = {
      ...details,
      carPhone: details.carPhone || [],
      homePhone: details.homePhone || [],
      secondaryEmail: details.secondaryEmail || '',
      logo: details.logo || '',
    };

    const docRef = doc(db, 'company', 'details');
    await setDoc(docRef, payload);
    toast.success('Company details saved successfully!');
  } catch (err) {
    console.error(err);
    toast.error('Failed to save company details.');
  }
};


  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setDetails({ ...details!, logo: reader.result as string });
      reader.readAsDataURL(file);
      toast.success('Logo uploaded successfully!');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!details) return <p>No details available</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Company Details</h1>
          <p className="text-gray-500 mt-1">Manage your company information and settings</p>
        </div>
        <Button onClick={handleSave} className="gap-2 cursor-pointer">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>

      {/* Contact Information */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* General Phones */}
<div className="space-y-2">
  <Label>General Phone Numbers</Label>
  {details.generalPhone.map((phone, index) => (
    <div key={index} className="flex gap-2">
      <Input
        value={phone}
        onChange={(e) => {
          const phones = [...details.generalPhone];
          phones[index] = e.target.value;
          setDetails({ ...details, generalPhone: phones });
        }}
      />
      <Button
        type="button"
        onClick={() => {
          const phones = details.generalPhone.filter((_, i) => i !== index);
          setDetails({ ...details, generalPhone: phones });
        }}
      >
        Remove
      </Button>
    </div>
  ))}
  <Button type="button" onClick={() => setDetails({ ...details, generalPhone: [...details.generalPhone, ''] })}>
    Add Phone
  </Button>
</div>

            <div className="space-y-2">
  <Label>Cars Department Phone Numbers (Optional)</Label>
  {details.carPhone?.map((phone, index) => (
    <div key={index} className="flex gap-2">
      <Input
        value={phone}
        onChange={(e) => {
          const phones = [...(details.carPhone || [])];
          phones[index] = e.target.value;
          setDetails({ ...details, carPhone: phones });
        }}
      />
      <Button
        type="button"
        onClick={() => {
          const phones = (details.carPhone || []).filter((_, i) => i !== index);
          setDetails({ ...details, carPhone: phones });
        }}
      >
        Remove
      </Button>
    </div>
  ))}
  <Button
    type="button"
    onClick={() =>
      setDetails({ ...details, carPhone: [...(details.carPhone || []), ''] })
    }
  >
    Add Phone
  </Button>
</div>

<div className="space-y-2">
  <Label>Homes Department Phone Numbers (Optional)</Label>
  {details.homePhone?.map((phone, index) => (
    <div key={index} className="flex gap-2">
      <Input
        value={phone}
        onChange={(e) => {
          const phones = [...(details.homePhone || [])];
          phones[index] = e.target.value;
          setDetails({ ...details, homePhone: phones });
        }}
      />
      <Button
        type="button"
        onClick={() => {
          const phones = (details.homePhone || []).filter((_, i) => i !== index);
          setDetails({ ...details, homePhone: phones });
        }}
      >
        Remove
      </Button>
    </div>
  ))}
  <Button
    type="button"
    onClick={() =>
      setDetails({ ...details, homePhone: [...(details.homePhone || []), ''] })
    }
  >
    Add Phone
  </Button>
</div>


            <div className="space-y-2">
              <Label htmlFor="primaryEmail">Primary Email</Label>
              <Input
                id="primaryEmail"
                type="email"
                value={details.primaryEmail}
                onChange={(e) => setDetails({ ...details, primaryEmail: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondaryEmail">Secondary Email (Optional)</Label>
              <Input
                id="secondaryEmail"
                type="email"
                value={details.secondaryEmail}
                onChange={(e) => setDetails({ ...details, secondaryEmail: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Physical Address */}
        <Card>
          <CardHeader>
            <CardTitle>Physical Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                value={details.address.street}
                onChange={(e) =>
                  setDetails({ ...details, address: { ...details.address, street: e.target.value } })
                }
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={details.address.city}
                  onChange={(e) =>
                    setDetails({ ...details, address: { ...details.address, city: e.target.value } })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={details.address.state}
                  onChange={(e) =>
                    setDetails({ ...details, address: { ...details.address, state: e.target.value } })
                  }
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  value={details.address.zipCode}
                  onChange={(e) =>
                    setDetails({ ...details, address: { ...details.address, zipCode: e.target.value } })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={details.address.country}
                  onChange={(e) =>
                    setDetails({ ...details, address: { ...details.address, country: e.target.value } })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Working Hours */}
      <Card>
        <CardHeader>
          <CardTitle>Working Hours</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {DAYS.map((day) => {
            const key = day as keyof CompanyDetails['workingHours'];
            const dayDetails = details.workingHours[key];
            return (
              <div key={day} className="flex items-center justify-between">
                <span>{day}</span>
                <div className="flex items-center gap-2">
                  <Input
                    type="time"
                    value={dayDetails.open}
                    onChange={(e) =>
                      setDetails({
                        ...details,
                        workingHours: {
                          ...details.workingHours,
                          [key]: { ...dayDetails, open: e.target.value },
                        },
                      })
                    }
                    disabled={dayDetails.closed}
                  />
                  <Input
                    type="time"
                    value={dayDetails.close}
                    onChange={(e) =>
                      setDetails({
                        ...details,
                        workingHours: {
                          ...details.workingHours,
                          [key]: { ...dayDetails, close: e.target.value },
                        },
                      })
                    }
                    disabled={dayDetails.closed}
                  />
                  <Switch
                    checked={!dayDetails.closed}
                    onCheckedChange={(checked) =>
                      setDetails({
                        ...details,
                        workingHours: {
                          ...details.workingHours,
                          [key]: { ...dayDetails, closed: !checked },
                        },
                      })
                    }
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Logo and Map */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Company Logo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {details.logo && (
              <div className="flex items-center justify-center rounded-lg border-2 border-dashed p-8">
                <Image src={details.logo} alt="Company Logo" className="max-h-32" />
              </div>
            )}
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="flex-1"
              />
              <Button variant="outline" className="gap-2">
                <Upload className="h-4 w-4" />
                Upload
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Map Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${details.mapCoordinates.lng - 0.01},${details.mapCoordinates.lat - 0.01},${details.mapCoordinates.lng + 0.01},${details.mapCoordinates.lat + 0.01}&layer=mapnik&marker=${details.mapCoordinates.lat},${details.mapCoordinates.lng}`}
              ></iframe>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="lat">Latitude</Label>
                <Input
                  id="lat"
                  type="number"
                  step="0.0001"
                  value={details.mapCoordinates.lat}
                  onChange={(e) =>
                    setDetails({
                      ...details,
                      mapCoordinates: { ...details.mapCoordinates, lat: parseFloat(e.target.value) },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lng">Longitude</Label>
                <Input
                  id="lng"
                  type="number"
                  step="0.0001"
                  value={details.mapCoordinates.lng}
                  onChange={(e) =>
                    setDetails({
                      ...details,
                      mapCoordinates: { ...details.mapCoordinates, lng: parseFloat(e.target.value) },
                    })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

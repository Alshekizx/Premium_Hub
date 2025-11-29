//file: /data/types.ts
export interface CompanyDetails {
  generalPhone:  string[];
  carPhone?:  string[];
  homePhone?:  string[];
  primaryEmail: string;
  secondaryEmail?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  workingHours: {
    [day in
      | 'Monday'
      | 'Tuesday'
      | 'Wednesday'
      | 'Thursday'
      | 'Friday'
      | 'Saturday'
      | 'Sunday']: {
      open: string; // e.g., "09:00"
      close: string; // e.g., "18:00"
      closed: boolean;
    };
  };
  mapCoordinates: {
    lat: number;
    lng: number;
  };
  logo?: string; // optional, since user may not upload initially
}



export type MessageStatus = 'read' | 'unread';

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  date: string; // ISO string, e.g., "2024-11-22T09:30:00"
  status: MessageStatus;
}


// file: src/app/(views)/admin/pages/types.ts

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "provider" | "admin";
  phone: string;
  avatar: string;
  location: {
    type: string;
    coordinates: number[];
  };
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Provider {
  _id: string;
  userId: User | string;
  businessName: string;
  description: string;
  services: Service[];
  avgRating: number;
  totalReviews: number;
  totalJobs: number;
  serviceArea: {
    type: string;
    coordinates: number[];
    radius: number;
  };
  availability: {
    day: string;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
  }[];
  verified: boolean;
  documents: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  _id: string;
  name: string;
  category: string;
  description: string;
  basePrice: number;
  duration: number;
  icon: string;
  active: boolean;
}

export interface Booking {
  _id: string;
  userId: User | string;
  providerId: Provider | string;
  serviceId: Service | string;
  date: string;
  timeSlot: string;
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
  amount: number;
  paymentId: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  bookingId: Booking | string;
  userId: User | string;
  providerId: Provider | string;
  rating: number;
  comment: string;
  reply: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

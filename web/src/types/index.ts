export type UserRole = 'USER' | 'NGO' | 'ADMIN';

export interface User {
  _id: string;
  name: string;
  email: string;
  address?: string;
  role: UserRole;
}

export interface Pet {
  _id: string;
  name?: string;
  type: string;
  breed: string;
  age: number;
  size: string;
  disabilityStatus: boolean;
  healthConcerns: string[];
  shelterLocation: string;
  imageUrl?: string;
}

export interface NGO {
  _id: string;
  name: string;
  registrationId: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  contactInfo: string;
  description: string;
  status: 'verified' | 'pending' | 'rejected';
}

export interface Fundraiser {
  _id: string;
  title: string;
  description: string;
  targetAmount: number;
  collectedAmount: number;
  ngo: NGO;
}

export interface FoodProduct {
  _id: string;
  name: string;
  brand: string;
  price: number;
  description?: string;
  nutritionDetails: string;
  sold?: number;
  image?: string;
}

export interface CartItem {
  product: FoodProduct;
  quantity: number;
}

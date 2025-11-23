// types/index.ts
export interface TeamMember {
  id: number;
  name: string;
  position: string;
  bio?: string;
  photoUrl?: string;
  social?: {
    github?: string;
    instagram?: string;
    facebook?: string;
  };
  createdAt: Date;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  demoLink?: string;
  category: string;
  technologies: string[];
  createdAt: Date;
}

export interface PricingPlan {
  id: number;
  packageName: string;
  features: string; // JSON string from database
  price: number;
  createdAt: Date;
}

export interface ContactFormData {
  name: string;
  email: string;
  phoneNumber: string;
  message: string;
  userId?: number;
}

export interface StatItem {
  number: number;
  label: string;
  suffix: string;
}

export interface CoreValue {
  icon: React.ReactNode;
  title: string;
  description: string;
}

// Types untuk parsed pricing plans (untuk frontend usage)
export interface ParsedPricingPlan extends Omit<PricingPlan, 'features'> {
  features: string[];
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phoneNumber?: string;
  role: Role;
  photo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: number;
  userId: number;
  createdById?: number;
  projectName: string;
  description: string;
  status: OrderStatus;
  source: OrderSource;
  progress: number;
  repositoryLink?: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  user?: User;
  createdBy?: User;
  complaints?: Complaint[];
  rating?: Rating;
  progressLog?: ProgressLog[];
}

export interface Complaint {
  id: number;
  orderId: number;
  userId: number;
  message: string;
  createdAt: Date;
  
  // Relations
  order?: Order;
  user?: User;
}

export interface Rating {
  id: number;
  orderId: number;
  userId: number;
  score: number;
  review?: string;
  createdAt: Date;
  
  // Relations
  order?: Order;
  user?: User;
}

export interface ProgressLog {
  id: number;
  orderId: number;
  description: string;
  percentage: number;
  createdAt: Date;
  
  // Relations
  order?: Order;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  message: string;
  createdAt: Date;
  userId?: number;
  
  // Relations
  user?: User;
}

// Enums from your schema
export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum OrderSource {
  WEBSITE = 'WEBSITE',
  WHATSAPP = 'WHATSAPP',
  MANUAL = 'MANUAL'
}
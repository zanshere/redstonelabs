// data/projects.ts
import { Project } from '@/types';

export const projects: Project[] = [
  {
    id: 1,
    title: "E-Commerce Fashion Store",
    description: "Website toko online fashion dengan sistem inventory terintegrasi, payment gateway, dan dashboard admin yang user-friendly.",
    imageUrl: "/images/projects/fashion-store.jpg",
    demoLink: "https://demo-fashionstore.ryuzen.dev",
    category: "E-Commerce",
    technologies: ["Next.js", "TypeScript", "Prisma", "Stripe", "Tailwind CSS"],
    createdAt: new Date('2024-03-15')
  },
  {
    id: 2,
    title: "Company Profile PT. Maju Jaya",
    description: "Website company profile modern dengan portfolio, blog, dan sistem kontak untuk perusahaan konstruksi terkemuka.",
    imageUrl: "/images/projects/company-profile.jpg",
    demoLink: "https://majujaya.ryuzen.dev",
    category: "Company Profile",
    technologies: ["React", "TypeScript", "Contentful", "Framer Motion"],
    createdAt: new Date('2024-02-28')
  },
  {
    id: 3,
    title: "Restaurant Booking System",
    description: "Sistem reservasi restoran dengan table management, menu digital, dan integrasi WhatsApp untuk konfirmasi.",
    imageUrl: "/images/projects/restaurant-booking.jpg",
    demoLink: "https://resto-booking.ryuzen.dev",
    category: "Web Application",
    technologies: ["Next.js", "Node.js", "MySQL", "WhatsApp API"],
    createdAt: new Date('2024-04-10')
  },
  {
    id: 4,
    title: "Educational Platform",
    description: "Platform pembelajaran online dengan video streaming, quiz system, progress tracking, dan certificate generation.",
    imageUrl: "/images/projects/education-platform.jpg",
    demoLink: "https://edu-platform.ryuzen.dev",
    category: "Web Application",
    technologies: ["Vue.js", "Laravel", "MySQL", "AWS S3"],
    createdAt: new Date('2024-01-20')
  },
  {
    id: 5,
    title: "Real Estate Portal",
    description: "Portal properti dengan advanced search, virtual tour, mortgage calculator, dan agent management system.",
    imageUrl: "/images/projects/real-estate.jpg",
    demoLink: "https://realestate.ryuzen.dev",
    category: "Web Application",
    technologies: ["React", "Python", "PostgreSQL", "Mapbox"],
    createdAt: new Date('2024-05-05')
  },
  {
    id: 6,
    title: "Healthcare Management System",
    description: "Sistem manajemen klinik dengan appointment scheduling, patient records, billing, dan telemedicine features.",
    imageUrl: "/images/projects/healthcare-system.jpg",
    demoLink: "https://clinic-management.ryuzen.dev",
    category: "Web Application",
    technologies: ["Angular", "NestJS", "MongoDB", "WebRTC"],
    createdAt: new Date('2024-03-30')
  }
];

// Project categories for filtering
export const projectCategories = [
  "All",
  "E-Commerce",
  "Company Profile", 
  "Web Application",
  "Mobile App",
  "Dashboard"
];

// Helper functions for filtering
export const getFeaturedProjects = () => projects.slice(0, 3);

export const getProjectsByCategory = (category: string) => {
  if (category === "All") return projects;
  return projects.filter(project => project.category === category);
};

export default projects;
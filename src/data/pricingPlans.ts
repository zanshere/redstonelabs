// data/pricingPlans.ts
import { PricingPlan } from '@/types';

export const pricingPlans: PricingPlan[] = [
  {
    id: 1,
    packageName: "Website Sederhana",
    features: JSON.stringify([
      "Desain responsif modern",
      "1-5 halaman website",
      "Optimasi SEO dasar",
      "Form kontak",
      "Hosting & domain 1 tahun",
      "Support 1 bulan"
    ]),
    price: 1000000,
    createdAt: new Date('2024-01-15')
  },
  {
    id: 2,
    packageName: "Website Bisnis",
    features: JSON.stringify([
      "Semua fitur Website Sederhana",
      "5-15 halaman website",
      "Integrasi media sosial",
      "Blog section",
      "Google Analytics",
      "Optimasi SEO lanjutan",
      "Support 3 bulan",
      "Training penggunaan"
    ]),
    price: 2500000,
    createdAt: new Date('2024-01-15')
  },
  {
    id: 3,
    packageName: "Website Premium",
    features: JSON.stringify([
      "Semua fitur Website Bisnis",
      "Halaman unlimited",
      "Sistem admin custom",
      "Integrasi payment gateway",
      "API custom",
      "Database management",
      "Backup rutin",
      "Priority support 6 bulan",
      "Garansi 1 tahun"
    ]),
    price: 5000000,
    createdAt: new Date('2024-01-15')
  },
  {
    id: 4,
    packageName: "E-Commerce",
    features: JSON.stringify([
      "Website toko online lengkap",
      "System inventory management",
      "Multiple payment methods",
      "Shipping integration",
      "Customer account system",
      "Product reviews & ratings",
      "Sales analytics dashboard",
      "Mobile app ready",
      "Priority support 12 bulan"
    ]),
    price: 19990000,
    createdAt: new Date('2024-01-15')
  }
];

// Helper function to parse features from JSON string to array
export const getParsedPricingPlans = () => {
  return pricingPlans.map(plan => ({
    ...plan,
    features: JSON.parse(plan.features) as string[]
  }));
};

export default pricingPlans;
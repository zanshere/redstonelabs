// data/projects.ts
import { Project } from '@/types';

export const projects: Project[] = [
  {
    id: 1,
    title: "UNAIR Library",
    description: "Website ini merupakan platform perpustakaan online Universitas Airlangga yang memungkinkan mahasiswa, dosen, dan staf untuk mengakses informasi buku, penulis, dan penerbit secara digital. Website ini juga menyediakan fitur manajemen data siswa dan buku, sehingga mempermudah proses peminjaman dan pencarian koleksi perpustakaan.",
    imageUrl: "/images/projects/unair-library.jpeg",
    demoLink: "https://github.com/afiyontheroad/unairlibrary",
    category: "Edukasi",
    technologies: ["PHP Native", "CSS", "JavaScript", "MySQL"],
    createdAt: new Date('2024-03-15')
  },
  {
    id: 2,
    title: "Mobila Showroom Mobil",
    description: "Website dealer mobil ini dibuat sebagai platform digital untuk menampilkan berbagai informasi mengenai mobil yang tersedia, layanan dealer, serta memudahkan calon pembeli dalam mencari mobil sesuai kebutuhan.",
    imageUrl: "/images/projects/mobila.jpeg",
    demoLink: "https://github.com/Rindo88/mobila-php-native",
    category: "Proyek Perusahaan",
    technologies: ["PHP Native", "Tailwind CSS", "JavaScript", "SweetAlert2", "Lenis", "MySQL"],
    createdAt: new Date('2024-02-28')
  },
  {
    id: 3,
    title: "TitipAja Sewa Loker",
    description: "Sistem reservasi restoran dengan table management, menu digital, dan integrasi WhatsApp untuk konfirmasi.",
    imageUrl: "/images/projects/titip-aja.png",
    demoLink: "https://github.com/Aamyoo/titip-aja",
    category: "Proyek Perusahaan",
    technologies: ["PHP Native", "Bootstrap 5", "MySQL", "Midtrans API"],
    createdAt: new Date('2024-04-10')
  },
  {
    id: 4,
    title: "Fajar World Fantasy",
    description: "website yang mengenalkan kebun binatang Fajar World Fantasy kepada pengunjungnya. Website ini menyediakan informasi lengkap tentang berbagai atraksi, fasilitas, dan kegiatan yang dapat dinikmati di kebun binatang tersebut. Dengan desain yang menarik dan navigasi yang mudah, pengunjung dapat dengan cepat menemukan informasi yang mereka butuhkan untuk merencanakan kunjungan mereka ke Fajar World Fantasy.",
    imageUrl: "/images/projects/fwf-project.png",
    demoLink: "https://github.com/zanshere/fwf-projects",
    category: "Edukasi",
    technologies: ["Laravel 12", "Tailwind CSS", "GSAP"],
    createdAt: new Date('2024-01-20')
  },
  {
    id: 5,
    title: "Ryuzen Portfolio",
    description: "Website portfolio pribadi untuk menampilkan proyek, keterampilan, dan informasi kontak secara profesional.",
    imageUrl: "/images/projects/ryuzen-portfolio.png",
    demoLink: "https://github.com/zanshere/my-portfolio",
    category: "Personal",
    technologies: ["Astro", "React", "Tailwind CSS", "GSAP", "Lenis"],
    createdAt: new Date('2024-05-05')
  },
  {
    id: 6,
    title: "Noeru Store",
    description: "website yang menawarkan jasa joki game dan juga top up berbagai item dalam game. Website ini dirancang untuk memudahkan para gamer dalam meningkatkan pengalaman bermain mereka dengan menyediakan layanan joki profesional serta berbagai pilihan item game yang dapat dibeli dengan mudah dan cepat.",
    imageUrl: "/images/projects/healthcare-system.jpg",
    demoLink: "https://github.com/",
    category: "Web Aplikasi",
    technologies: ["PHP Native", "Bootstrap 5", "MySQL"],
    createdAt: new Date('2024-03-30')
  }
];

// Project categories for filtering
export const projectCategories = [
  "All",
  "Edukasi",
  "Proyek Perusahaan",
  "Personal",
  "Hiburan"
];

// Helper functions for filtering
export const getFeaturedProjects = () => projects.slice(0, 3);

export const getProjectsByCategory = (category: string) => {
  if (category === "All") return projects;
  return projects.filter(project => project.category === category);
};

export default projects;
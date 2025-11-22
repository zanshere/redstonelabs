// data/teamMembers.ts
import { TeamMember } from '@/types';

export const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Ahmad Rizki",
    position: "Full Stack Developer",
    bio: "Berpengalaman lebih dari 5 tahun dalam pengembangan web full stack. Spesialis dalam React, Node.js, dan sistem database. Passionate dalam menciptakan solusi digital yang efisien dan scalable.",
    photoUrl: "/images/team/ahmad-rizki.jpg",
    social: {
      github: "https://github.com/ahmadrizki",
      linkedin: "https://linkedin.com/in/ahmadrizki",
      twitter: "https://twitter.com/ahmadrizki",
    },
    createdAt: new Date('2024-01-10')
  },
  {
    id: 2,
    name: "Sarah Wijaya",
    position: "UI/UX Designer",
    bio: "Designer dengan latar belakang seni digital dan pengalaman 4 tahun dalam menciptakan user experience yang intuitif dan engaging. Expert dalam Figma, Adobe Creative Suite, dan design thinking.",
    photoUrl: "/images/team/sarah-wijaya.jpg",
    social: {
      github: "https://github.com/sarahwijaya",
      linkedin: "https://linkedin.com/in/sarahwijaya",
      twitter: "https://twitter.com/sarahwijaya",
    },
    createdAt: new Date('2024-01-10')
  },
  {
    id: 3,
    name: "Budi Santoso",
    position: "Backend Specialist",
    bio: "Spesialis backend dengan keahlian dalam arsitektur microservices, API development, dan cloud infrastructure. Berpengalaman membangun sistem yang handal dan high-performance.",
    photoUrl: "/images/team/budi-santoso.jpg",
    social: {
      github: "https://github.com/budisantoso",
      linkedin: "https://linkedin.com/in/budisantoso",
    },
    createdAt: new Date('2024-01-10')
  },
  {
    id: 4,
    name: "Maya Sari",
    position: "Frontend Developer",
    bio: "Frontend developer dengan spesialisasi dalam React, TypeScript, dan modern CSS. Fokus pada creating responsive, accessible, dan performant web applications.",
    photoUrl: "/images/team/maya-sari.jpg",
    social: {
      github: "https://github.com/mayasari",
      linkedin: "https://linkedin.com/in/mayasari",
      twitter: "https://twitter.com/mayasari",
    },
    createdAt: new Date('2024-01-10')
  },
  {
    id: 5,
    name: "Dewa Putra",
    position: "DevOps Engineer",
    bio: "DevOps engineer dengan pengalaman dalam CI/CD pipeline, containerization, dan cloud deployment. Memastikan aplikasi berjalan smooth dari development sampai production.",
    photoUrl: "/images/team/dewa-putra.jpg",
    social: {
      github: "https://github.com/devaputra",
      linkedin: "https://linkedin.com/in/devaputra",
    },
    createdAt: new Date('2024-02-15')
  },
  {
    id: 6,
    name: "Rina Melati",
    position: "Project Manager",
    bio: "Project manager dengan track record dalam mengelola tim development dan memastikan project deliver on time and within budget. Expert dalam Agile methodology dan client communication.",
    photoUrl: "/images/team/rina-melati.jpg",
    social: {
      linkedin: "https://linkedin.com/in/rinamelati",
      twitter: "https://twitter.com/rinamelati",
    },
    createdAt: new Date('2024-02-15')
  }
];

// Helper functions
export const getCoreTeam = () => teamMembers.slice(0, 4);

export const getLeadershipTeam = () => teamMembers.filter(member => 
  member.position.includes('Manager') || member.position.includes('Lead')
);

export default teamMembers;
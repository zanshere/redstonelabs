// data/teamMembers.ts
import { TeamMember } from '@/types';

export const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Muhammad Fauzan",
    position: "Full Stack Developer",
    bio: "Berpengalaman lebih dari 5 tahun dalam pengembangan web full stack. Spesialis dalam React, Node.js, dan sistem database. Passionate dalam menciptakan solusi digital yang efisien dan scalable.",
    photoUrl: "/images/team/fauzan.jpeg",
    social: {
      github: "https://github.com/zanshere",
      instagram: "https://instagram.com/zanshere_",
      facebook:"#"
      
    },
    createdAt: new Date('2024-01-10')
  },
  {
    id: 2,
    name: "Rozan Fathin Yafi",
    position: "Frontend Developer",
    bio: "Frontend developer dengan keahlian dalam React, TypeScript, dan modern UI development. Berfokus pada pembuatan antarmuka yang responsif, cepat, dan mudah diakses.",
    photoUrl: "/images/team/rozan.png",
    social: {
      github: "https://github.com/RozanFathinYafi",
      instagram: "#",
      facebook:"https://www.facebook.com/TrozanMalware"
      
    },
    createdAt: new Date('2024-01-10')
  },
  {
    id: 3,
    name: "Ishaq Hafiz",
    position: "Backend Developer",
    bio: "Spesialis backend dengan pengalaman 4 tahun dalam pengembangan API, database management, dan arsitektur server-side. Berfokus pada performa, keamanan, dan stabilitas sistem.",
    photoUrl: "/images/team/ishaq.jpeg",
    social: {
      github: "https://github.com/budisantoso",
      instagram: "https://instagram.com/amyo.ku",
      facebook: "#"
    },
    createdAt: new Date('2024-01-10')
  },
  {
    id: 4,
    name: "Nafila Osa Sumayya",
    position: "UI/UX Designer",
    bio: "UI/UX designer dengan pendekatan human-centered design. Berpengalaman dalam riset pengguna, wireframing, dan pembuatan desain visual yang intuitif serta estetis.",
    photoUrl: "/images/team/osaa.jpeg",
    social: {
      github: "https://github.com/afiyontheroad",
      instagram: "https://instagram.com/nafileya",
      facebook: "#"
         },
    createdAt: new Date('2024-01-10')
  },
  {
    id: 5,
    name: "Joshua Noel Siregar",
    position: "Application Security Engineer",
    bio: "Application Security Engineer yang berfokus pada pengujian keamanan web dan server. Berpengalaman menggunakan berbagai tools dari Kali Linux untuk vulnerability assessment, penetration testing, dan analisis risiko keamanan aplikasi.",
    photoUrl: "/images/team/dewa-putra.jpg",
    social: {
      github: "https://github.com/devaputra",
      instagram: "https://instagram.com/jowell21",
      facebook: "#"
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
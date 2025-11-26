"use client";

import React from "react";
import Image from "next/image";
import { Rocket, Shield, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "next-themes";

const coreValues = [
  {
    icon: <Rocket className="w-12 h-12 text-primary" />,
    title: "Inovasi Utama",
    description: "Kami selalu selangkah lebih maju, terus mengeksplorasi teknologi dan metodologi baru untuk menghadirkan solusi mutakhir.",
  },
  {
    icon: <Shield className="w-12 h-12 text-primary" />,
    title: "Kualitas Unggul",
    description: "Setiap baris kode dirancang dengan presisi. Kami menjunjung standar tertinggi dalam pengembangan dan desain.",
  },
  {
    icon: <Target className="w-12 h-12 text-primary" />,
    title: "Prioritas Klien",
    description: "Mewujudkan tujuan Anda adalah misi kami. Kami bekerja dekat dengan Anda untuk menghasilkan dampak yang nyata.",
  },
];

export default function AboutSection() {
  const { theme } = useTheme();

  return (
    <section id="about" className="py-20 bg-background fade-in-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4">Tentang Kami</Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Mewujudkan Solusi Digital <br />Berkualitas Sejak 2014
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Kami adalah tim berdedikasi dari pengembang, desainer, 
            dan ahli strategi, yang menghadirkan solusi web yang berdampak nyata.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-3xl font-bold mb-6 text-foreground">Dedikasi Kami</h3>
            <p className="text-lg text-muted-foreground mb-6">
              Memberdayakan bisnis melalui solusi digital inovatif yang mendorong pertumbuhan, meningkatkan pengalaman pengguna, 
              dan menciptakan nilai berkelanjutan di era digital yang terus berkembang.
            </p>
            <p className="text-lg text-muted-foreground">
              Kami percaya bahwa teknologi memiliki kekuatan untuk mentransformasi bisnis dan meningkatkan kualitas hidup. 
              Setiap proyek yang kami tangani adalah kesempatan untuk mendorong batas kemampuan dan melampaui ekspektasi.
            </p>
          </div>
          <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src={theme === 'dark' ? "/images/logo/redstonelabs-dark.png" : "/images/logo/redstonelabs-light.png"}
              alt="Redstone Labs Team"
              width={800}
              height={600}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Core Values */}
        <div className="grid md:grid-cols-3 gap-8">
          {coreValues.map((value, idx) => (
            <Card key={idx} className="hover-card border-2 hover:border-primary transition-colors">
              <CardHeader>
                <div className="mb-4">{value.icon}</div>
                <CardTitle className="text-foreground">{value.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
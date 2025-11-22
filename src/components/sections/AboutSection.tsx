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
    title: "Innovation First",
    description: "We stay ahead of the curve, constantly exploring new technologies and methodologies to deliver cutting-edge solutions.",
  },
  {
    icon: <Shield className="w-12 h-12 text-primary" />,
    title: "Quality Assured",
    description: "Every line of code is crafted with precision. We maintain the highest standards in development and design.",
  },
  {
    icon: <Target className="w-12 h-12 text-primary" />,
    title: "Client-Focused",
    description: "Your success is our success. We work closely with you to understand your goals and deliver results that matter.",
  },
];

export default function AboutSection() {
  const { theme } = useTheme();

  return (
    <section id="about" className="py-20 bg-background fade-in-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4">About Us</Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Building Digital Excellence Since 2014
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We`re a passionate team of developers, designers, and strategists
            dedicated to creating web solutions that make a difference
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-3xl font-bold mb-6 text-foreground">Our Mission</h3>
            <p className="text-lg text-muted-foreground mb-6">
              To empower businesses with innovative digital solutions that drive growth,
              enhance user experiences, and create lasting value in an ever-evolving digital landscape.
            </p>
            <p className="text-lg text-muted-foreground">
              We believe in the power of technology to transform businesses and improve lives.
              Every project we undertake is an opportunity to push boundaries and exceed expectations.
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
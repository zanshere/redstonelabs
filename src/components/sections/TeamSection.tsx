"use client";

import React from "react";
import Image from "next/image";
import { Github, Linkedin, Twitter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { teamMembers } from "@/data/teamMembers";

export default function TeamSection() {
  return (
    <section id="team" className="py-20 bg-muted/50 fade-in-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4">Our Team</Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">Meet The Experts</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Talented individuals united by a passion for creating exceptional digital experiences
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <Card key={member.id} className="hover-card overflow-hidden group">
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={member.photoUrl || "/images/team/placeholder.jpg"}
                  alt={member.name}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                  <p className="text-sm text-white/80">{member.position}</p>
                </div>
              </div>
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-4 line-clamp-3">{member.bio}</p>
                <div className="flex gap-3 justify-center">
                  {member.social?.github && (
                    <a
                      href={member.social.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                  {member.social?.linkedin && (
                    <a
                      href={member.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                  {member.social?.twitter && (
                    <a
                      href={member.social.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
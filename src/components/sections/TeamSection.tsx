"use client";

import React from "react";
import Image from "next/image";
import { Github, Instagram, ExternalLink, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { teamMembers } from "@/data/teamMembers";
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogClose,
  MorphingDialogTitle,
  MorphingDialogDescription,
  MorphingDialogImage,
} from "@/components/motion-primitives/morphing-dialog";

export default function TeamSection() {
  // Format date untuk ditampilkan
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  return (
    <section id="team" className="py-20 bg-muted/50 fade-in-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4">Tim Kami</Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">Kenali Tim Profesional</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
           Tim berkompeten yang dipersatukan oleh dedikasi untuk pengalaman digital unggul.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <MorphingDialog key={member.id}>
              <MorphingDialogTrigger>
                <Card className="hover-card overflow-hidden group cursor-pointer">
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
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Github className="w-5 h-5" />
                        </a>
                      )}
                      {member.social?.instagram && (
                        <a
                          href={member.social.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Instagram className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </MorphingDialogTrigger>

              <MorphingDialogContainer>
                <MorphingDialogContent className="max-w-4xl mx-auto bg-background rounded-2xl shadow-2xl overflow-hidden">
                  <MorphingDialogClose className="top-4 right-4 bg-background/80 backdrop-blur-sm border border-border rounded-full p-2 z-50 hover:bg-accent transition-colors">
                    <ExternalLink className="w-5 h-5" />
                  </MorphingDialogClose>
                  
                  <div className="grid md:grid-cols-2 gap-8 p-6">
                    <div className="space-y-6">
                      <MorphingDialogImage
                        src={member.photoUrl || "/images/team/placeholder.jpg"}
                        alt={member.name}
                        className="w-full h-80 object-cover rounded-xl shadow-lg"
                      />
                      
                      <div className="flex gap-4 justify-center">
                        {member.social?.github && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={member.social.github} target="_blank" rel="noopener noreferrer">
                              <Github className="w-4 h-4 mr-2" />
                              GitHub
                            </a>
                          </Button>
                        )}
                        {member.social?.instagram && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={member.social.instagram} target="_blank" rel="noopener noreferrer">
                              <Instagram className="w-4 h-4 mr-2" />
                              Instagram
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <MorphingDialogTitle className="text-3xl font-bold text-foreground mb-2">
                          {member.name}
                        </MorphingDialogTitle>
                        <Badge variant="secondary" className="text-lg px-3 py-1">
                          {member.position}
                        </Badge>
                      </div>
                      
                      <MorphingDialogDescription className="text-muted-foreground leading-relaxed">
                        {member.bio}
                      </MorphingDialogDescription>
                      
                      <div className="space-y-3">
                        {member.createdAt && (
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>Joined {formatDate(member.createdAt)}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Skills Section - Using technologies from bio or position as fallback */}
                      <div>
                        <h4 className="font-semibold text-foreground mb-3">Expertise</h4>
                        <div className="flex flex-wrap gap-2">
                          {/* Extract technologies from bio or use position-based skills */}
                          {(() => {
                            const skills: string[] = [];
                            
                            // Add skills based on position
                            if (member.position.toLowerCase().includes('full stack')) {
                              skills.push('React', 'Node.js', 'Database', 'API Development');
                            } else if (member.position.toLowerCase().includes('frontend')) {
                              skills.push('React', 'TypeScript', 'UI/UX', 'Responsive Design');
                            } else if (member.position.toLowerCase().includes('backend')) {
                              skills.push('API Development', 'Database', 'Security', 'System Architecture');
                            } else if (member.position.toLowerCase().includes('ui/ux')) {
                              skills.push('User Research', 'Wireframing', 'Visual Design', 'Prototyping');
                            } else if (member.position.toLowerCase().includes('security')) {
                              skills.push('Penetration Testing', 'Vulnerability Assessment', 'Kali Linux', 'Risk Analysis');
                            }
                            
                            return skills.map((skill, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ));
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                </MorphingDialogContent>
              </MorphingDialogContainer>
            </MorphingDialog>
          ))}
        </div>
      </div>
    </section>
  );
}
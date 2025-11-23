"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ExternalLink, Calendar, Github } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { projects, projectCategories } from "@/data/projects";
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

export default function PortfolioSection() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProjects =
    selectedCategory === "All"
      ? projects
      : projects.filter((project) => project.category === selectedCategory);

  // Format date untuk ditampilkan
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <section id="portfolio" className="py-20 bg-background fade-in-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4">Hasil Kerja Kami</Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">Proyek Terkemuka</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Jelajahi karya kami yang sukses dan berdampak nyata.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {projectCategories.map((category: string) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <MorphingDialog key={project.id}>
              <MorphingDialogTrigger>
                <Card className="hover-card overflow-hidden group cursor-pointer h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="relative h-48 overflow-hidden flex-shrink-0">
                    <Image
                      src={project.imageUrl}
                      alt={project.title}
                      width={600}
                      height={400}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Hapus tombol view details yang muncul saat hover */}
                  </div>
                  <CardHeader className="flex-grow">
                    <CardTitle className="line-clamp-1 text-foreground group-hover:text-primary transition-colors">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-between items-center">
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.slice(0, 3).map((tech: string, techIdx: number) => (
                        <Badge key={techIdx} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {project.technologies.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{project.technologies.length - 3} eksplor
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                     Lihat Detail
                    </div>
                  </CardFooter>
                </Card>
              </MorphingDialogTrigger>

              <MorphingDialogContainer>
                <MorphingDialogContent className="max-w-6xl mx-auto bg-background rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
                  <MorphingDialogClose className="top-4 right-4 bg-background/80 backdrop-blur-sm border border-border rounded-full p-2 z-50 hover:bg-accent transition-colors">
                    <ExternalLink className="w-5 h-5" />
                  </MorphingDialogClose>
                  
                  <div className="grid lg:grid-cols-2 gap-8 p-6">
                    <div className="space-y-6">
                      <MorphingDialogImage
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-80 object-cover rounded-xl shadow-lg"
                      />
                      
                      {/* View Details Section - Dipindahkan ke dalam dialog */}
                      <div className="bg-muted/50 rounded-lg p-4">
                        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                          <ExternalLink className="w-4 h-4" />
                          Project Details
                        </h3>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center justify-between">
                            <span>Category:</span>
                            <Badge variant="secondary">{project.category}</Badge>
                          </div>
                          {project.createdAt && (
                            <div className="flex items-center justify-between">
                              <span>Created:</span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(project.createdAt)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <MorphingDialogTitle className="text-3xl font-bold text-foreground mb-3">
                          {project.title}
                        </MorphingDialogTitle>
                        <Badge variant="secondary" className="text-lg px-3 py-1 mb-4">
                          {project.category}
                        </Badge>
                      </div>
                      
                      <MorphingDialogDescription className="text-muted-foreground leading-relaxed text-base">
                        {project.description}
                      </MorphingDialogDescription>
                      
                      <div>
                        <h4 className="font-semibold text-foreground mb-3">Technologies Used</h4>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech: string, techIdx: number) => (
                            <Badge key={techIdx} variant="secondary" className="text-sm">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {/* Action Buttons - Dipindahkan ke dalam dialog */}
                      <div className="flex gap-4 pt-4">
                        {project.demoLink && (
                          <Button asChild className="flex-1">
                            <a href={project.demoLink} target="_blank" rel="noopener noreferrer">
                              <Github className="w-4 h-4 mr-2" />
                              View on GitHub
                            </a>
                          </Button>
                        )}
                      </div>
                      
                      {/* Additional Project Information */}
                      <div className="border-t pt-4 mt-4">
                        <h4 className="font-semibold text-foreground mb-3">Project Overview</h4>
                        <div className="text-sm text-muted-foreground space-y-2">
                          <p>
                            This project demonstrates our expertise in {project.technologies.slice(0, 2).join(' and ')} 
                            and showcases our ability to deliver {project.category.toLowerCase()} solutions.
                          </p>
                          <p>
                            Click the button above to explore the source code and implementation details on GitHub.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </MorphingDialogContent>
              </MorphingDialogContainer>
            </MorphingDialog>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No projects found in the {selectedCategory} category.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
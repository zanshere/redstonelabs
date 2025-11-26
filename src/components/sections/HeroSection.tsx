"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatItem } from "@/types";
import { useRouter } from 'next/navigation';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const stats: StatItem[] = [
  { number: 300, label: "Proyek Selesai", suffix: "+" },
  { number: 99, label: "Kepuasan Klien", suffix: "%" },
  { number: 50, label: "Profesional Tim", suffix: "+" },
  { number: 10, label: "Tahun Keahlian", suffix: "+" },
];

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);
  const orb4Ref = useRef<HTMLDivElement>(null);
  const patternRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

    const priceClick = () => {
    router.push('#pricing');
  };

    const portfolioClick = () => {
    router.push('#portfolio');
  };

  useEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      // Clear any existing animations first
      gsap.set([titleRef.current, subtitleRef.current, buttonsRef.current, statsRef.current], {
        opacity: 1,
        y: 0
      });

      // Hero section animations dengan delay yang lebih aman
      const heroTimeline = gsap.timeline({
        defaults: { ease: "power3.out", duration: 1 }
      });

      heroTimeline
        .fromTo(titleRef.current, 
          { y: 80, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.2 }
        )
        .fromTo(subtitleRef.current,
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 1 },
          "-=0.8"
        )
        .fromTo(buttonsRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          "-=0.6"
        )
        .fromTo(statsRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 1 },
          "-=0.4"
        );

      // Enhanced Parallax effects - FIXED: Hilangkan opacity pada teks
      
      // Background pattern parallax (medium movement)
      gsap.to(patternRef.current, {
        y: 250, // Diperbesar
        scale: 1.3,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        }
      });

      // Orb 1 parallax (kiri atas)
      gsap.to(orb1Ref.current, {
        y: -250,
        x: -150,
        scale: 1.4,
        rotation: 30,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        }
      });

      // Orb 2 parallax (kanan bawah) - DIPERBAIKI: lebih dramatis
      gsap.to(orb2Ref.current, {
        y: 350, // Diperbesar signifikan
        x: 180,
        scale: 1.6,
        rotation: -40,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        }
      });

      // Orb 3 (tengah) 
      gsap.to(orb3Ref.current, {
        y: -200,
        x: 100,
        scale: 1.1,
        rotation: 50,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        }
      });

      // Orb 4 BARU - khusus untuk bagian bawah
      gsap.to(orb4Ref.current, {
        y: 400, // Pergerakan sangat besar untuk bagian bawah
        x: -120,
        scale: 1.3,
        rotation: 60,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8, // Lebih cepat
        }
      });

      // Main content parallax - FIXED: HAPUS opacity changes
      gsap.to(titleRef.current, {
        y: -80, // Kurangi pergerakan vertikal
        scale: 1.02, // Sedikit zoom in, bukan zoom out
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        }
      });

      gsap.to(subtitleRef.current, {
        y: -60,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        }
      });

      // Buttons parallax 
      gsap.to(buttonsRef.current, {
        y: -40,
        scale: 1.05, // Zoom in, bukan zoom out
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        }
      });

      // Stats parallax - lebih dramatis
      gsap.to(statsRef.current, {
        y: 100,
        scale: 1.08,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        }
      });

      // Scroll indicator fade out - lebih cepat
      gsap.to(scrollIndicatorRef.current, {
        opacity: 0,
        y: 30,
        ease: "power2.in",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top 70%",
          end: "bottom 50%",
          scrub: true,
        }
      });

      // Stats counter animation
      const statNumbers = document.querySelectorAll('.stat-number');
      statNumbers.forEach((stat) => {
        const target = parseInt(stat.getAttribute("data-target") || "0");
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              gsap.set(stat, { innerText: 0 });
              
              gsap.to(stat, {
                innerText: target,
                duration: 2.5,
                snap: { innerText: 1 },
                ease: "power2.out",
                onUpdate: function() {
                  const value = Math.ceil(Number(stat.textContent));
                  stat.textContent = value.toString();
                }
              });
              observer.disconnect();
            }
          });
        }, { 
          threshold: 0.5,
          rootMargin: '0px 0px -50px 0px'
        });
        
        if (stat) observer.observe(stat);
      });

    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/5 via-background to-background dark:from-primary/10 pt-16"
    >
      {/* Background Pattern dengan parallax yang lebih kuat */}
      <div 
        ref={patternRef}
        className="absolute inset-0 opacity-5"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Gradient Orbs dengan parallax yang lebih dramatis */}
      <div 
        ref={orb1Ref}
        className="absolute top-1/4 left-1/4 w-80 h-80 bg-primary/20 rounded-full blur-3xl"
      ></div>
      <div 
        ref={orb2Ref}
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"
      ></div>
      <div 
        ref={orb3Ref}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl"
      ></div>
      {/* Orb 4 BARU - untuk efek bawah yang lebih kuat */}
      <div 
        ref={orb4Ref}
        className="absolute bottom-10 left-1/3 w-72 h-72 bg-green-400/10 rounded-full blur-3xl"
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Title - TIDAK ADA opacity change saat scroll */}
        <div ref={titleRef} style={{ opacity: 0 }}>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-foreground leading-tight">
            Wujudkan Visi Digital Anda
            <br />
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Menjadi Kenyataan
            </span>
          </h1>
        </div>

        {/* Subtitle - TIDAK ADA opacity change saat scroll */}
        <p 
          ref={subtitleRef} 
          style={{ opacity: 0 }}
          className="text-lg md:text-xl lg:text-2xl mb-8 text-muted-foreground max-w-3xl mx-auto leading-relaxed"
        >
          Kami menghadirkan pengalaman web luar biasa dengan teknologi modern 
          dan desain elegan untuk pertumbuhan bisnis Anda.
        </p>

        {/* Buttons */}
        <div 
          ref={buttonsRef} 
          style={{ opacity: 0 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105" onClick={priceClick}>
            Wujudkan Proyek Anda <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary/10 px-8 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105" onClick={portfolioClick}>
            Lihat Portfolio
          </Button>
        </div>

        {/* Stats */}
        <div 
          ref={statsRef} 
          style={{ opacity: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto bg-background/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-border/50 shadow-lg"
        >
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2">
                <span 
                  className="stat-number" 
                  data-target={stat.number}
                >
                  0
                </span>
                <span className="text-primary">{stat.suffix}</span>
              </div>
              <div className="text-sm md:text-base text-muted-foreground font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div 
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
      >
        <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
// hooks/useGsapAnimations.ts
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function useScrollAnimations(mounted: boolean) {
  useEffect(() => {
    if (!mounted) return;

    // Scroll-triggered animations for sections
    gsap.utils.toArray<HTMLElement>(".fade-in-section").forEach((section) => {
      gsap.from(section, {
        y: 80,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "top 50%",
          toggleActions: "play none none reverse",
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [mounted]);
}

export function useCardHoverAnimations(mounted: boolean) {
  useEffect(() => {
    if (!mounted) return;

    const cards = gsap.utils.toArray<HTMLElement>(".hover-card");
    
    const handleMouseEnter = (card: HTMLElement) => {
      gsap.to(card, {
        y: -10,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = (card: HTMLElement) => {
      gsap.to(card, {
        y: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    cards.forEach((card) => {
      card.addEventListener("mouseenter", () => handleMouseEnter(card));
      card.addEventListener("mouseleave", () => handleMouseLeave(card));
    });

    return () => {
      cards.forEach((card) => {
        card.removeEventListener("mouseenter", () => handleMouseEnter(card));
        card.removeEventListener("mouseleave", () => handleMouseLeave(card));
      });
    };
  }, [mounted]);
}
// hooks/useScrollAnimations.ts
import { useEffect, useRef, useState } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';

interface LenisInstance {
  raf: (time: number) => void;
  destroy: () => void;
  scrollTo: (target: string | HTMLElement | number, options?: ScrollOptions) => void;
  on: (event: string, callback: (params: { progress: number }) => void) => void;
}

interface ScrollOptions {
  offset?: number;
  duration?: number;
  easing?: (t: number) => number;
}

interface LenisOptions {
  duration?: number;
  easing?: (t: number) => number;
  orientation?: 'vertical' | 'horizontal';
  gestureOrientation?: 'vertical' | 'horizontal';
  smoothWheel?: boolean;
  wheelMultiplier?: number;
  touchMultiplier?: number;
  touchInertiaMultiplier?: number;
}

export const useScrollAnimations = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lenis, setLenis] = useState<LenisInstance | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hasMounted, setHasMounted] = useState(false);

  // Pastikan hook hanya jalan di klien
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Initialize Lenis smooth scroll (client-only)
  useEffect(() => {
    if (!hasMounted) return;

    const initLenis = async () => {
      try {
        const LenisModule = await import('lenis');
        const Lenis = LenisModule.default || LenisModule;
        
        const lenisOptions: LenisOptions = {
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: 'vertical',
          gestureOrientation: 'vertical',
          smoothWheel: true,
          wheelMultiplier: 1,
          touchMultiplier: 2,
          touchInertiaMultiplier: 3,
        };

        const lenisInstance = new Lenis(lenisOptions) as LenisInstance;

        lenisInstance.on('scroll', (e: { progress: number }) => {
          setScrollProgress(e.progress);
        });

        const raf = (time: number) => {
          lenisInstance.raf(time);
          requestAnimationFrame(raf);
        };

        requestAnimationFrame(raf);
        setLenis(lenisInstance);

        return () => {
          lenisInstance.destroy();
        };
      } catch (error) {
        console.warn('Lenis smooth scrolling not available:', error);
      }
    };

    initLenis();
  }, [hasMounted]);

  // ✅ Gunakan useScroll hanya jika sudah mounted
  const { scrollYProgress } = useScroll({
    target: hasMounted ? containerRef : undefined,
    offset: ["start start", "end end"]
  });

  // Transform values
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [0.8, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5], [100, 0]);
  const yParallaxFast = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const yParallaxSlow = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5], [15, 0]);
  const rotateY = useTransform(scrollYProgress, [0, 0.5], [-5, 0]);
  const backgroundPosition = useTransform(scrollYProgress, [0, 1], ['0% 0%', '0% 100%']);
  const textShadow = useTransform(scrollYProgress, [0, 0.5], ['0 0 0px rgba(0,0,0,0)', '0 0 20px rgba(0,0,0,0.5)']);

  // Animation variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const slideInLeft = {
    hidden: { opacity: 0, x: -100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const slideInRight = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  // Reveal animation using Intersection Observer (client-only)
  const useRevealAnimation = (threshold = 0.1) => {
    const [isVisible, setIsVisible] = useState(false);
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!hasMounted || !elementRef.current) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        },
        { threshold }
      );

      observer.observe(elementRef.current);

      return () => {
        if (elementRef.current) {
          observer.unobserve(elementRef.current);
        }
      };
    }, [hasMounted, threshold]);

    return {
      ref: elementRef,
      isVisible,
      variants: fadeInUp
    };
  };

  const scrollToSection = (sectionId: string) => {
    if (lenis) {
      const element = document.getElementById(sectionId);
      if (element) {
        lenis.scrollTo(element, {
          offset: 0,
          duration: 1.5,
          easing: (t: number) => 1 - Math.pow(1 - t, 3),
        });
      }
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const scrollToTop = () => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return {
    ref: containerRef,
    lenis,
    scrollProgress: lenis ? scrollProgress : scrollYProgress.get(),
    effectiveScrollProgress: lenis ? scrollProgress : scrollYProgress.get(),
    opacity,
    scale,
    y,
    yParallaxFast,
    yParallaxSlow,
    rotateX,
    rotateY,
    backgroundPosition,
    textShadow,
    staggerContainer,
    staggerItem,
    fadeInUp,
    scaleIn,
    slideInLeft,
    slideInRight,
    useRevealAnimation,
    scrollToSection,
    scrollToTop,
    m: motion
  };
};

export const heroAnimations = {
  title: {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  },
  subtitle: {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.2, ease: "easeOut" } }
  },
  cta: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, delay: 0.4, ease: "easeOut" } }
  }
};

export const sectionAnimations = {
  container: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  },
  item: {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  }
};

export default useScrollAnimations;
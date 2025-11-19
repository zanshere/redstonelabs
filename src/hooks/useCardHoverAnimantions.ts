// hooks/useCardHoverAnimations.ts
import { useRef } from 'react';
import { useSpring, useTransform, motion, SpringOptions } from 'framer-motion';

interface UseCardHoverAnimationsOptions {
  tiltIntensity?: number;
  scaleIntensity?: number;
  springConfig?: SpringOptions;
}

export const useCardHoverAnimations = (options?: UseCardHoverAnimationsOptions) => {
  const {
    tiltIntensity = 15,
    scaleIntensity = 1.05,
    springConfig = { stiffness: 300, damping: 20 }
  } = options || {};

  const cardRef = useRef<HTMLDivElement>(null);

  // Mouse position relative to card
  const mouseX = useSpring(0, springConfig);
  const mouseY = useSpring(0, springConfig);
  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);
  const scale = useSpring(1, springConfig);
  const zIndex = useSpring(1, springConfig);

  // Transform styles for 3D tilt effect
  const transform = useTransform(
    [rotateX, rotateY, scale],
    ([rx, ry, s]: number[]) => 
      `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${s})`
  );

  // Glow effect based on mouse position
  const glowX = useTransform(rotateX, [-tiltIntensity, tiltIntensity], [-10, 10]);
  const glowY = useTransform(rotateY, [-tiltIntensity, tiltIntensity], [-10, 10]);
  const glowOpacity = useTransform(scale, [1, scaleIntensity], [0, 0.1]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseXValue = e.clientX - rect.left;
    const mouseYValue = e.clientY - rect.top;
    
    const rotateYValue = ((mouseXValue - width / 2) / width) * tiltIntensity;
    const rotateXValue = ((mouseYValue - height / 2) / height) * -tiltIntensity;

    mouseX.set(mouseXValue);
    mouseY.set(mouseYValue);
    rotateX.set(rotateXValue);
    rotateY.set(rotateYValue);
  };

  const handleMouseEnter = () => {
    scale.set(scaleIntensity);
    zIndex.set(10);
  };

  const handleMouseLeave = () => {
    scale.set(1);
    zIndex.set(1);
    rotateX.set(0);
    rotateY.set(0);
  };

  // Card animation variants for Framer Motion
  const cardVariants = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.95
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    hover: {
      scale: scaleIntensity,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1
      }
    }
  };

  // Content animation variants (for text, buttons inside card)
  const contentVariants = {
    initial: {
      opacity: 0,
      y: 10
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    hover: {
      y: -5,
      transition: {
        duration: 0.2
      }
    }
  };

  // Image/thumbnail animation variants
  const imageVariants = {
    initial: {
      scale: 1
    },
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  // Stagger animations for card children
  const staggerVariants = {
    initial: {
      opacity: 0
    },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const staggerItemVariants = {
    initial: {
      opacity: 0,
      y: 20
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  // Props to spread on card element for advanced 3D tilt
  const advancedCardProps = {
    ref: cardRef,
    style: {
      transform,
      zIndex,
      rotateX,
      rotateY,
      scale
    },
    onMouseMove: handleMouseMove,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave
  };

  // Simple hover props for basic usage
  const simpleCardProps = {
    whileHover: { 
      scale: scaleIntensity,
      y: -5,
      transition: { duration: 0.2 }
    },
    whileTap: { 
      scale: 0.98 
    },
    initial: "initial" as const,
    animate: "animate" as const
  };

  return {
    // Refs and state
    cardRef,
    
    // Motion values
    mouseX,
    mouseY,
    rotateX,
    rotateY,
    scale,
    zIndex,
    transform,
    glowX,
    glowY,
    glowOpacity,
    
    // Event handlers
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
    
    // Animation variants
    cardVariants,
    contentVariants,
    imageVariants,
    staggerVariants,
    staggerItemVariants,
    
    // Pre-configured props
    advancedCardProps,
    simpleCardProps,
    
    // Quick access to motion
    motion
  };
};

// Utility hook for individual card with specific settings
export const useProjectCardHover = () => 
  useCardHoverAnimations({
    tiltIntensity: 10,
    scaleIntensity: 1.03,
    springConfig: { stiffness: 200, damping: 25 }
  });

export const usePricingCardHover = () =>
  useCardHoverAnimations({
    tiltIntensity: 8,
    scaleIntensity: 1.02,
    springConfig: { stiffness: 150, damping: 15 }
  });

export const useTeamCardHover = () =>
  useCardHoverAnimations({
    tiltIntensity: 12,
    scaleIntensity: 1.04,
    springConfig: { stiffness: 250, damping: 20 }
  });

export default useCardHoverAnimations;
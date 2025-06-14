import { useEffect, useState, RefObject } from "react";

export default function useRevealOnScroll<T extends HTMLElement>(
  ref: RefObject<T | null>
): boolean {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // solo una vez
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [ref]);

  return isVisible;
}

import { useEffect } from 'react';

export default function useScrollAnimation(ref, className = 'fade-slide-in') {
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const handleIntersect = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          node.classList.add(className);
          observer.unobserve(node);
        }
      });
    };
    const observer = new window.IntersectionObserver(handleIntersect, {
      threshold: 0.15,
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref, className]);
} 
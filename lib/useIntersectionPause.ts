import { useState, useEffect, useRef, RefObject } from "react";

export function useIntersectionPause<T extends Element>(): [RefObject<T>, boolean] {
  const [isVisible, setIsVisible] = useState(true);
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    });

    observer.observe(el);
    return () => {
      observer.disconnect();
    };
  }, []);

  return [ref, isVisible];
}

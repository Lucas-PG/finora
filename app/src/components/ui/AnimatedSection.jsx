import { useEffect, useRef, useState } from "react";

export const AnimatedSection = ({
  children,
  className = "",
  delay = 0,
  rootMargin = "0px",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        root: null,
        rootMargin,
        threshold: 0.1,
      },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [rootMargin]);

  return (
    <div
      ref={sectionRef}
      className={`animated-section ${className} ${
        isVisible ? "animated-section-active" : "animated-section-inactive"
      }`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
};

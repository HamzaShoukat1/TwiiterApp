import { Loader } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

interface InfinityScrollbarProps {
  children: ReactNode; // <-- allow children
}

export const InfinityScrollbar = ({children}:InfinityScrollbarProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.3,
      }

    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);
  

  return (
    <div ref={ref}>
      {visible ? (
        children
      ) : (
        <Loader className="animate-spin w-6 h-6" />
      )}
    </div>
  );
};

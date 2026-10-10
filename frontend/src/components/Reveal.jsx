import { useEffect, useRef, useState } from 'react';

// Bungkus konten agar muncul dengan animasi fade + slide saat di-scroll
// ke dalam viewport. Dipicu sekali saja (once). Tanpa dependency eksternal.
export default function Reveal({ children, delay = 0, y = 28, className = '' }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '-60px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : `translateY(${y}px)`,
        transition: `opacity 0.55s ease-out ${delay}s, transform 0.55s ease-out ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

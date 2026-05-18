import { useState, useEffect, useRef } from 'react';

export function useCountUp(end, duration = 1000, decimals = 2, start = 0) {
  const [count, setCount] = useState(start);
  const countRef = useRef(start);
  const startTimeRef = useRef(null);

  useEffect(() => {
    const animate = (timestamp) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = start + (end - start) * easeOutQuart;

      countRef.current = currentCount;
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);

    return () => {
      startTimeRef.current = null;
    };
  }, [end, duration, start]);

  return count.toFixed(decimals);
}

import { useEffect, useState } from 'react';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  format?: 'currency' | 'percent' | 'number';
  decimals?: number;
}

export default function AnimatedCounter({
  value,
  duration = 1500,
  format = 'number',
  decimals,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    const startValue = displayValue;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (value - startValue) * eased;

      setDisplayValue(current);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  const formatValue = (val: number): string => {
    const dec = decimals ?? (format === 'percent' ? 2 : format === 'currency' ? 0 : 0);

    if (format === 'currency') {
      if (val >= 10000000) {
        return `${(val / 10000000).toFixed(2)} Cr`;
      }
      if (val >= 100000) {
        return `${(val / 100000).toFixed(2)} L`;
      }
      return val.toLocaleString('en-IN', {
        maximumFractionDigits: dec,
        minimumFractionDigits: dec,
      });
    }

    if (format === 'percent') {
      return val.toFixed(dec);
    }

    return val.toLocaleString('en-IN', {
      maximumFractionDigits: dec,
      minimumFractionDigits: dec,
    });
  };

  return <>{formatValue(displayValue)}</>;
}

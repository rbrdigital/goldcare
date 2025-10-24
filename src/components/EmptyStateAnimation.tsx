import React from 'react';
import { motion } from 'framer-motion';
import { useConsultStore } from '@/store/useConsultStore';

export function EmptyStateAnimation() {
  const { markEmptyAnimationSeen } = useConsultStore();
  const [showText, setShowText] = React.useState(false);

  // Mark animation as seen on mount
  React.useEffect(() => {
    markEmptyAnimationSeen();
  }, [markEmptyAnimationSeen]);

  // Show text after cards fade out (3.5 seconds)
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowText(true);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // If user prefers reduced motion, skip animation and show text immediately
  if (prefersReducedMotion) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-bg">
        <div className="text-center" role="status" aria-live="polite">
          <p className="text-xl font-medium text-fg-muted">
            Your visit summary will appear here soon.
          </p>
        </div>
      </div>
    );
  }

  // Number of cards based on viewport
  const cardCount = 6;

  return (
    <div className="relative flex items-center justify-center min-h-[60vh] bg-bg overflow-hidden">
      {/* Placeholder Cards Grid */}
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
          {Array.from({ length: cardCount }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{
                opacity: [0, 1, 1, 0],
                y: [40, 0, 0, -10],
                scale: [0.95, 1, 1, 1],
              }}
              transition={{
                duration: 4,
                delay: i * 0.08,
                times: [0, 0.15, 0.75, 1],
              }}
              className="h-64 bg-surface-muted border border-border rounded-lg"
              style={{
                boxShadow: '0 0 20px hsla(var(--warning) / 0.08)',
              }}
            />
          ))}
        </div>
      </div>

      {/* Final Text Message */}
      {showText && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 text-center px-4"
          role="status"
          aria-live="polite"
        >
          <p className="text-xl font-medium text-fg-muted">
            Your visit summary will appear{' '}
            <span className="text-warning">here</span> soon.
          </p>
        </motion.div>
      )}
    </div>
  );
}

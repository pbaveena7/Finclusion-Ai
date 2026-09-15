import { motion } from 'framer-motion';
import React from 'react';

interface PageWrapperProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  action?: React.ReactNode;
}

export default function PageWrapper({ children, title, subtitle, className = '', action }: PageWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`w-full mx-auto px-6 lg:px-12 py-8 ${className}`}
    >
      {(title || subtitle) && (
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            {title && (
              <h1 className="text-2xl lg:text-3xl font-bold text-[#1C1B1F] leading-tight tracking-tight">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-sm text-[#49454F] mt-2 leading-relaxed max-w-xl">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </motion.div>
  );
}

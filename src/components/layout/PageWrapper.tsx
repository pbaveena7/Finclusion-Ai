import { motion } from 'framer-motion';
import React from 'react';

interface PageWrapperProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
}

export default function PageWrapper({ children, title, subtitle, className = '' }: PageWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`p-6 lg:p-8 ${className}`}
    >
      {(title || subtitle) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          {title && <h1 className="text-2xl lg:text-3xl font-bold text-white">{title}</h1>}
          {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
        </motion.div>
      )}
      {children}
    </motion.div>
  );
}

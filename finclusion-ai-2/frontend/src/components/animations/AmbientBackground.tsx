import React from 'react';

/**
 * Subtle background orbs — fixed position, GPU-friendly (transform + opacity only).
 * Communicates: intelligence, growth, trust.
 */
export default function AmbientBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{ willChange: 'transform' }}
    >
      {/* Top-left orb */}
      <div
        className="absolute rounded-full orb-float"
        style={{
          width: 560,
          height: 560,
          top: '-15%',
          left: '-10%',
          background: 'radial-gradient(circle, var(--orb-primary) 0%, transparent 70%)',
          opacity: 'var(--orb-opacity)',
          animationDelay: '0s',
          animationDuration: '18s',
        }}
      />
      {/* Top-right orb */}
      <div
        className="absolute rounded-full orb-float"
        style={{
          width: 420,
          height: 420,
          top: '5%',
          right: '-8%',
          background: 'radial-gradient(circle, var(--orb-secondary) 0%, transparent 70%)',
          opacity: 'var(--orb-opacity)',
          animationDelay: '-6s',
          animationDuration: '22s',
        }}
      />
      {/* Bottom-center orb */}
      <div
        className="absolute rounded-full orb-float"
        style={{
          width: 380,
          height: 380,
          bottom: '10%',
          left: '40%',
          background: 'radial-gradient(circle, var(--orb-tertiary) 0%, transparent 70%)',
          opacity: 'var(--orb-opacity)',
          animationDelay: '-12s',
          animationDuration: '26s',
        }}
      />
    </div>
  );
}

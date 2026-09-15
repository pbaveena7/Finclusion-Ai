/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        theme: {
          base: 'var(--bg-base)',
          surface: 'var(--bg-surface)',
          card: 'var(--bg-card)',
          'card-hover': 'var(--bg-card-hover)',
          border: 'var(--border-card)',
          'border-hover': 'var(--border-hover)',
          main: 'var(--text-main)',
          muted: 'var(--text-muted)',
          dim: 'var(--text-dim)',
          glow: 'var(--accent-primary)',
          'glow-secondary': 'var(--accent-secondary)',
          'glow-subtle': 'var(--accent-glow-subtle)',
          sidebar: 'var(--sidebar-bg)',
          'sidebar-border': 'var(--sidebar-border)',
          input: 'var(--input-bg)',
        }
      },
      boxShadow: {
        'theme-card': 'var(--card-shadow)',
        'glow': '0 0 20px var(--glow-color)',
        'glow-lg': '0 0 40px var(--glow-color)',
        'glow-sm': '0 0 10px var(--glow-color)',
      },
      backdropBlur: {
        'glass': 'var(--glass-blur)',
      },
      backgroundImage: {
        'gradient-accent': 'var(--accent-gradient)',
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 10s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'mesh': 'mesh-move 20s ease-in-out infinite',
        'mesh-reverse': 'mesh-move 25s ease-in-out infinite reverse',
        'gradient-x': 'gradient-x 3s ease infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        'mesh-move': {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '25%': { transform: 'translate(30px, -30px) rotate(5deg)' },
          '50%': { transform: 'translate(-20px, 20px) rotate(-3deg)' },
          '75%': { transform: 'translate(15px, 10px) rotate(2deg)' },
        },
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
}

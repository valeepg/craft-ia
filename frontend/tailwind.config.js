/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        tech: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(37, 99, 235, 0.35)',
        'glow-lg': '0 0 40px rgba(15, 23, 42, 0.8)',
        glass: '0 18px 45px rgba(15, 23, 42, 0.45)',
      },
      backgroundImage: {
        'mesh-dark': `
          radial-gradient(at 10% 20%, rgba(59, 130, 246, 0.2) 0px, transparent 40%),
          radial-gradient(at 80% 50%, rgba(30, 58, 138, 0.1) 0px, transparent 50%),
          radial-gradient(at 40% 80%, rgba(16, 185, 129, 0.05) 0px, transparent 40%)
        `,
      },
      colors: {
        neo: {
          cobalt: '#2563eb',
          ink: '#020617',
          pearl: '#f9fafb',
        },
      },
      keyframes: {
        'gradient-shift': {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '50%': { transform: 'translate3d(3%, -3%, 0) scale(1.05)' },
        },
        'fade-slide-up': {
          '0%': { opacity: 0, transform: 'translateY(16px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        'gradient-slow': 'gradient-shift 18s ease-in-out infinite alternate',
        'fade-up': 'fade-slide-up 700ms ease-out forwards',
      },
    },
  },
  plugins: [],
};

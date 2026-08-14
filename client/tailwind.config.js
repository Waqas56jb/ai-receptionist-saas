/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Deep navy / midnight blue surfaces
        ink: {
          950: '#050A1A',
          900: '#0A1128',
          800: '#0F1A3A',
          700: '#16244C',
          600: '#1F3160',
          500: '#2C4278',
        },
        // Elegant blue / indigo accent
        brand: {
          50: '#EEF3FF',
          100: '#DEE8FF',
          200: '#C2D3FF',
          300: '#9AB4FF',
          400: '#6E8FFA',
          500: '#4569F0',
          600: '#2F4EDB',
          700: '#2740B4',
          800: '#24398F',
          900: '#213472',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-sm': ['2.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-md': ['3.25rem', { lineHeight: '1.05', letterSpacing: '-0.025em' }],
        'display-lg': ['4.25rem', { lineHeight: '1.02', letterSpacing: '-0.03em' }],
      },
      boxShadow: {
        subtle: '0 1px 2px rgba(10, 17, 40, 0.04), 0 1px 3px rgba(10, 17, 40, 0.06)',
        card: '0 2px 4px rgba(10, 17, 40, 0.03), 0 12px 32px -12px rgba(10, 17, 40, 0.12)',
        lift: '0 4px 8px rgba(10, 17, 40, 0.04), 0 24px 48px -16px rgba(10, 17, 40, 0.18)',
        panel: '0 40px 90px -30px rgba(10, 17, 40, 0.45)',
        glow: '0 0 0 1px rgba(69, 105, 240, 0.18), 0 20px 60px -20px rgba(69, 105, 240, 0.45)',
      },
      backgroundImage: {
        'grid-light':
          'linear-gradient(to right, rgba(10,17,40,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(10,17,40,0.045) 1px, transparent 1px)',
        'grid-dark':
          'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(0.9)', opacity: '0.6' },
          '80%, 100%': { transform: 'scale(1.6)', opacity: '0' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'pulse-ring': 'pulseRing 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}

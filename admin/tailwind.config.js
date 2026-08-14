/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Deep navy control-plane surfaces
        ink: {
          950: '#050A1A',
          900: '#0A1128',
          800: '#0F1A3A',
          700: '#16244C',
          600: '#1F3160',
          500: '#2C4278',
        },
        // Blue accent — actions, links, active states
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
      boxShadow: {
        subtle: '0 1px 2px rgba(10, 17, 40, 0.04), 0 1px 3px rgba(10, 17, 40, 0.06)',
        card: '0 2px 4px rgba(10, 17, 40, 0.03), 0 12px 32px -12px rgba(10, 17, 40, 0.12)',
        lift: '0 4px 8px rgba(10, 17, 40, 0.04), 0 24px 48px -16px rgba(10, 17, 40, 0.18)',
        panel: '0 40px 90px -30px rgba(10, 17, 40, 0.45)',
      },
      backgroundImage: {
        'grid-dark':
          'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
}

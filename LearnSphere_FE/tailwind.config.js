/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#07111f',
        panel: '#0d1828',
        panelSoft: '#122238',
        line: '#1e3147',
        accent: '#37c7d6',
        accent2: '#8de9c5',
        text: '#e7eef8',
        muted: '#8fa3bd',
        warn: '#f5b74b',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(55, 199, 214, 0.12), 0 24px 60px rgba(0, 0, 0, 0.35)',
      },
      backgroundImage: {
        grid: 'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
};
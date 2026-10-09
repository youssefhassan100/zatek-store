import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#FFFBEC',
        butter: '#FFF8DC',
        ink: '#2B2F2E',
        forest: '#2E694D',
        matcha: { 400: '#84A98C', 600: '#52796F', 800: '#354F52' },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'var(--font-ar)', 'system-ui', 'sans-serif'],
      },
    },
  },
} satisfies Config;

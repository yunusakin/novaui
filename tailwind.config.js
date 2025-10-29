/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb',
          foreground: '#f8fafc',
        },
        accent: '#0ea5e9',
        success: '#16a34a',
        warning: '#f59e0b',
        danger: '#dc2626',
      },
      boxShadow: {
        card: '0 10px 30px -12px rgba(15, 23, 42, 0.25)',
      },
    },
  },
  plugins: [],
}

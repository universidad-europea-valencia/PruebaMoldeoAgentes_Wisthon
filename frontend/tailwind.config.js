/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0066cc',
        secondary: '#ffa500',
        danger: '#dc2626',
        success: '#10b981',
        warning: '#f59e0b',
        info: '#3b82f6',
      },
      fontFamily: {
        sans: ['Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['Monaco', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
}

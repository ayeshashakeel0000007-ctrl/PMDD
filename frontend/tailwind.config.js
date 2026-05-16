/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pmdd: {
          dark: '#0f172a',    // slate-900
          darker: '#020617',  // slate-950
          accent: '#3b82f6',  // blue-500
          secondary: '#818cf8',// indigo-400
          neutral: '#94a3b8', // slate-400
          soft: '#e2e8f0',    // slate-200
          bg: '#f8fafc'       // slate-50
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace']
      }
    },
  },
  plugins: [],
}

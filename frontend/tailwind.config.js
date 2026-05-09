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
          dark: '#191D23',
          accent: '#57707A',
          secondary: '#7E919F',
          neutral: '#979DAB',
          soft: '#C5BAC4',
          bg: '#DECDCD'
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

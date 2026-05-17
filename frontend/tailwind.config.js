/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: '#030712',
        'holo-cyan': '#00f0ff',
        'plasma-violet': '#b026ff',
        'semantic-teal': '#00f5c4',
        'neural-magenta': '#ff007f',
        'comp-amber': '#ffb700',
        'pmdd': {
          dark: '#030712',    
          darker: '#000000',  
          accent: '#00f0ff',  
          secondary: '#b026ff',
          neutral: '#64748b', 
          soft: '#e2e8f0',    
          bg: '#050a14'       
        }
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'system-ui', 'sans-serif'],
        mono: ['"Fira Code"', '"JetBrains Mono"', 'monospace']
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 12s linear infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'scan': 'scan 3s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      }
    },
  },
  plugins: [],
}

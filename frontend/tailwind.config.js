/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#0a0a0a',
          white: '#fafafa',
          accent: '#c8f542',
          gray: {
            100: '#f5f5f5',
            200: '#e8e8e8',
            300: '#d0d0d0',
            400: '#a0a0a0',
            500: '#707070',
            600: '#505050',
            700: '#303030',
            800: '#1a1a1a',
            900: '#111111'
          }
        }
      },
      fontFamily: {
        display: ['Bebas Neue', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['Space Mono', 'monospace']
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-left': 'slideLeft 0.4s ease forwards',
        'marquee': 'marquee 20s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite'
      },
      keyframes: {
        fadeUp: { from: { opacity: 0, transform: 'translateY(30px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideLeft: { from: { transform: 'translateX(20px)', opacity: 0 }, to: { transform: 'translateX(0)', opacity: 1 } },
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } }
      }
    }
  },
  plugins: []
}

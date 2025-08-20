/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx,md,mdx}',
    './docs/**/*.{md,mdx}',
    './blog/**/*.{md,mdx}',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        'karantina': ['Karantina', 'cursive', 'fantasy'],
        'assistant': ['Rubik', 'Heebo', 'Assistant', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'sans-serif'],
        'hebrew': ['Rubik', 'Heebo', 'sans-serif'],
      },
      fontSize: {
        'xs': 'clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)',
        'sm': 'clamp(0.875rem, 0.8rem + 0.375vw, 1rem)',
        'base': 'clamp(1rem, 0.9rem + 0.5vw, 1.125rem)',
        'lg': 'clamp(1.125rem, 1rem + 0.625vw, 1.25rem)',
        'xl': 'clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)',
        '2xl': 'clamp(1.5rem, 1.3rem + 1vw, 2rem)',
        '3xl': 'clamp(1.875rem, 1.6rem + 1.375vw, 2.5rem)',
        '4xl': 'clamp(2.25rem, 1.9rem + 1.75vw, 3rem)',
        '5xl': 'clamp(3rem, 2.4rem + 3vw, 4rem)',
        '6xl': 'clamp(3.75rem, 3rem + 3.75vw, 5rem)',
      },
      colors: {
        'gradient-start': '#35c3f3',
        'gradient-mid-1': '#8b9fe8',
        'gradient-mid-2': '#e681d8',
        'gradient-mid-3': '#ffa9a4',
        'gradient-end': '#fed2ce',
        'dark-bg': '#0a0a0a',
        'glow-blue': '#35c3f3',
        'glow-purple': '#8b9fe8',
        'glow-pink': '#e681d8',
      },
      backgroundImage: {
        'space-gradient': 'linear-gradient(135deg, #35c3f3 0%, #8b9fe8 25%, #e681d8 50%, #ffa9a4 75%, #fed2ce 100%)',
        'space-glow': 'radial-gradient(ellipse at center, rgba(53, 195, 243, 0.3) 0%, rgba(139, 159, 232, 0.2) 35%, rgba(230, 129, 216, 0.1) 70%, transparent 100%)',
      },
      animation: {
        'twinkle': 'twinkle 2s infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // disable Tailwind's reset to avoid conflicts with Docusaurus
  },
}

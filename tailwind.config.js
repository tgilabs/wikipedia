/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx,md,mdx}',
    './docs/**/*.{md,mdx}',
    './blog/**/*.{md,mdx}',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    preflight: false, // disable Tailwind's reset to avoid conflicts with Docusaurus
  },
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-gray': '#2a2a2a',
        'medium-gray': '#3a3a3a',
        'border-gray': '#4a4a4a',
        'light-green': '#e0f2e0',
        'accent-green': '#a8e6a8',
        'accent-green-hover': '#b8f6b8',
        'accent-green-active': '#98d698',
        'dark-text': '#1a1a1a',
      },
    },
  },
  plugins: [],
}


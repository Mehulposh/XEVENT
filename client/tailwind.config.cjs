
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-yellow': '#FBC60',
        // 'primary-bg': '#2A2B2',
        "primary-bg": "#ff00ff",     
        'secondary-bg': '#1E1E1',
        'card-bg': '#2d3e50',
        'input-bg': '##1E2838',
        'border-color': '#4a5f7f',
      },
    },
  },
  plugins: [],
}
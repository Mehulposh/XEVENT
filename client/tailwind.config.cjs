/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],

  theme: {
    extend: {
      colors: {
        'primary-yellow': '#ffc400',
        'primary-bg': '#292929',
        'secondary-bg': '#1f1f1f',
        'card-bg': '#202020',
        'input-bg': '#202b3d',
        'border-color': '#d4a900',
      },
    },
  },

  plugins: [],
};
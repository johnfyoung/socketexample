/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/**/*.handlebars'],
  theme: {
    extend: {
      fontFamily: {
        display: ['MuseoModerno', 'sans-serif'],
        heading: ['Rowdies', 'sans-serif'],
        sans: ['Libre Franklin', 'Arial', 'sans-serif'],
      },
      colors: {
        transparent: 'transparent',
        red: '#BA3B0A',
        peach: {
          100: '#FFF4E1ff',
          200: '#FEEAC9ff',
          300: '#FDE0B2ff',
          400: '#FBD69Aff',
          500: '#FACD83ff',
          600: '#F9C36Bff',
          700: '#F8B953ff',
          800: '#F6AF3Cff',
          900: '#F5A524ff',
        },
        orange: {
          100: '#FFE3D5ff',
          200: '#FFD4BFff',
          300: '#FFC5A8ff',
          400: '#FFB692ff',
          500: '#FFA77Cff',
          600: '#FF9865ff',
          700: '#FF894Fff',
          800: '#FF7A38ff',
          900: '#FF6B22ff',
        },
        white: '#fff',
      },
    },
  },
  plugins: [],
};

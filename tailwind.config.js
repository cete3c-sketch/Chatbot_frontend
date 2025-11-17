export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        'primary-1': '#6EE7B7',
        'primary-2': '#7C3AED'
      }
    },
  },
  plugins: [require('@tailwindcss/typography')],

  plugins: [],
};

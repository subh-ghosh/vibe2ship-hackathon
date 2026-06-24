/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        google: ['Google Sans', 'Roboto', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
      },
      colors: {
        gblue: {
          DEFAULT: '#1A73E8',
          dark: '#1557B0',
          light: '#4285F4',
          50: '#E8F0FE',
          100: '#D2E3FC',
        },
        gsurface: '#FFFFFF',
        gcard: '#F8F9FA',
        gborder: '#DADCE0',
        gtext: '#202124',
        gmuted: '#5F6368',
        gchip: '#E8EAED',
      },
      boxShadow: {
        google: '0 1px 3px 0 rgba(60,64,67,.3), 0 4px 8px 3px rgba(60,64,67,.15)',
        'google-sm': '0 1px 2px 0 rgba(60,64,67,.3), 0 2px 6px 2px rgba(60,64,67,.15)',
        'google-lg': '0 2px 6px rgba(0,0,0,.3)',
        fab: '0 3px 5px -1px rgba(0,0,0,.2), 0 6px 10px 0 rgba(0,0,0,.14), 0 1px 18px 0 rgba(0,0,0,.12)',
      },
      borderRadius: {
        'google': '8px',
        'google-full': '24px',
      },
    },
  },
  plugins: [],
}

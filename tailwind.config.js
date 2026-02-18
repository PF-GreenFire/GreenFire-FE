/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        'green-primary': '#4A7C59',
        'green-dark': '#3d6b4a',
        'green-light': '#D4E8D1',
        'green-lighter': '#E8F5E9',
        'green-badge': '#c8e6c9',
        'admin-green': '#1E9E57',
        'admin-green-dark': '#16a34a',
        'danger': '#D32F2F',
        'danger-light': '#FFEBEE',
        'warning': '#F57C00',
        'warning-light': '#FFF3E0',
        'info': '#1976D2',
        'info-light': '#E3F2FD',
        'purple': '#7B1FA2',
        'purple-light': '#F3E5F5',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0,0,0,0.05)',
        'card-hover': '0 6px 20px rgba(0,0,0,0.1)',
        'card-highlight': '0 4px 16px rgba(211, 47, 47, 0.15)',
      },
    },
  },
  plugins: [],
}

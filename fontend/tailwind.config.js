/** @type {import('tailwindcss').Config} */

export default {
  darkMode: ['variant', [
    '@media (prefers-color-scheme: dark) { &:not(.light *) }',
    '&:is(.dark *)',
  ]],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      color: {
        "primary" : "bg-blue-800",
        "boxdark" : "#24303f"
      }
    },
  },
  daisyui: {
    themes: ["light", "dark"],
  },
  plugins: [
    require('daisyui'),
  ],
}

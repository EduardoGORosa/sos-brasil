import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{html,js,svelte,ts}'
  ],
  theme: {
    extend: {}
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        brazil: {
          "primary":           "#3b82f6",
          "primary-content":   "#ffffff",
          "secondary":         "#64748b",
          "secondary-content": "#ffffff",
          "accent":            "#60a5fa",
          "accent-content":    "#ffffff",
          "neutral":           "#e2e8f0",
          "neutral-content":   "#1e293b",
          "base-100":          "#ffffff",
          "base-200":          "#f8fafc",
          "base-300":          "#f1f5f9",
          "base-content":      "#1e293b",
        },
      },      
      "light", 
      "dark", 
      "cupcake",
      "emerald"
    ],
  }
};


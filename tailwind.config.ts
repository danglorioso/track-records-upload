import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
        runIn: {
          '0%': { transform: 'translateX(-100%) scale(0.5)', opacity: '0' },
          '60%': { transform: 'translateX(20%) scale(1.1)', opacity: '1' },
          '100%': { transform: 'translateX(0) scale(1)', opacity: '1' },
        },
      },
      animation: {
        'run-in-once': 'runIn 1s ease-out forwards',
      },
    },
  },
  plugins: [],
} satisfies Config;


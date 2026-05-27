import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    // البحث في الجذر مباشرة (خارج مجلد src)
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    
    // البحث داخل مجلد src للاحتياط إذا كان هناك ملفات بداخله
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0d0b18",
        surface: "rgba(23, 20, 38, 0.7)",
      },
    },
  },
  plugins: [],
};
export default config;

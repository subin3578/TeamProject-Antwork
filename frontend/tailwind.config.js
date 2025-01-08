/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx,scss}"],
  theme: {
    extend: {
      colors: {
        customBlueOpacity: "#B2D1FF33", // 2024/11/27 황수빈 landing fuction page 위해 추가
      },
    },
  },
  plugins: [],
};

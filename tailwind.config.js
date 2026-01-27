module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fffbeb",
          100: "#fdf3c8",
          200: "#fce48b",
          300: "#fad04f",
          400: "#f9c033",
          500: "#f29b0e",
          600: "#d77508",
          700: "#b2520b",
          800: "#913f0f",
          900: "#773410",
          950: "#441904",
        },
        shark: {
          50: "#f6f6f6",
          100: "#e7e7e7",
          200: "#d1d1d1",
          300: "#b0b0b0",
          400: "#888888",
          500: "#6d6d6d",
          600: "#5d5d5d",
          700: "#4f4f4f",
          800: "#454545",
          900: "#3d3d3d",
          950: "#212121",
        },
      },
    },
  },
  plugins: [],
};

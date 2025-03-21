import js from "@eslint/js";
import react from "eslint-plugin-react";

export default [
  js.configs.recommended,
  {
    plugins: { react },
    rules: {
      "react/react-in-jsx-scope": "off", // Disable "React must be in scope" error
      "@typescript-eslint/no-unused-vars": "off", // Disable unused variable warnings
      "@typescript-eslint/no-explicit-any": "off", // Disable "no explicit any" warnings
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];


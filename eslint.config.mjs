import js from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat["jsx-runtime"],
  reactHooks.configs.flat["recommended-latest"],
  { settings: { react: { version: "detect" } } },
  {
    rules: {
      "@typescript-eslint/explicit-function-return-type": "warn",
      "no-console": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { varsIgnorePattern: "^_", argsIgnorePattern: "^_" },
      ],
    },
  },
  {
    files: ["**/webpack.config.js", "**/postcss.config.js", "eslint.config.mjs"],
    languageOptions: { globals: globals.node },
  },
]);

import js from "@eslint/js";
import ts from "typescript-eslint";
import vue from "eslint-plugin-vue";

export default [
  js.configs.recommended,
  ...ts.configs.recommended,
  ...vue.configs["flat/essential"],
  {
    files: ["*.vue", "**/*.vue"],
    languageOptions: {
      parserOptions: {
        parser: ts.parser,
      },
    },
  },
  {
    rules: {
      "vue/multi-word-component-names": "off",
      "no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "off",
      "vue/no-unused-vars": "warn",
    },
  },
  {
    ignores: ["node_modules/", "dist/", "public/", "yarn.lock"],
  },
];

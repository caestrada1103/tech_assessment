import js from "@eslint/js";
import json from "@eslint/json";
import { defineConfig } from "eslint/config";
import pluginCypress from 'eslint-plugin-cypress'

export default defineConfig([
  {
    files: ['cypress/**/*.js'],
    extends: [
      pluginCypress.configs.recommended,
    ],
    rules: {
      'cypress/no-unnecessary-waiting': 'off',
    },
  },
  { files: ["**/*.{js,mjs,cjs}"], plugins: { js }, extends: ["js/recommended"] },
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  { files: ["**/*.json"], plugins: { json }, language: "json/json", extends: ["json/recommended"] },
]);

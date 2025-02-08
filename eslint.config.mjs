import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import filenamesPlugin from "eslint-plugin-filenames";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["./src/posts/*.md"],
    plugins: {
      filenames: filenamesPlugin
    },
    rules: {
      "filenames/match-regex": ["error", "^\\d{4}-\\d{2}-\\d{2}-[a-z0-9-]+$"]
    }
  },
  {
    ignores: ["./src/posts/**/*"]  // Ignora todos os arquivos dentro de src/posts
  },
  { files: ["./src/**/*.{js, ts}"] },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
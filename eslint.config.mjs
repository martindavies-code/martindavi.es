export default [
  {
    files: ["**/*.js", "**/*.mjs"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        window: "readonly",
        document: "readonly",
        localStorage: "readonly",
        fetch: "readonly",
        Response: "readonly",
        AbortController: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        console: "readonly",
        module: "readonly",
        require: "readonly",
        process: "readonly",
        FormData: "readonly",
        URL: "readonly",
        URLSearchParams: "readonly",
        global: "writable",
        globalThis: "readonly"
      }
    },
    rules: {
      "no-undef": "error",
      "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
      "no-const-assign": "error",
      "no-dupe-keys": "error"
    }
  }
];

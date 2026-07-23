// Phase 1 – Foundation
// Enterprise ESLint config for a mixed JS/TS React Native (Expo) codebase.
// INERT until the dev dependencies are installed (see PHASE_1_FOUNDATION.md).
// Rules are intentionally lenient on the legacy .js files (warnings, not
// errors) so adopting the linter does not turn the existing code red.
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    ecmaFeatures: { jsx: true },
  },
  env: {
    "react-native/react-native": true,
    es2022: true,
    node: true,
  },
  plugins: ["@typescript-eslint", "react", "react-hooks", "react-native", "import"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier", // must be last: disables formatting rules that fight Prettier
  ],
  settings: {
    react: { version: "detect" },
  },
  rules: {
    "react/react-in-jsx-scope": "off", // new JSX transform
    "react/prop-types": "off", // types come from TS, not PropTypes
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],
    "@typescript-eslint/no-var-requires": "off", // RN uses require() for assets
    "no-console": "off", // logger wraps console; raw console allowed for now
  },
  overrides: [
    {
      // Legacy JavaScript: keep noise low during gradual migration.
      files: ["**/*.js", "**/*.jsx"],
      rules: {
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "no-unused-vars": "warn",
      },
    },
  ],
  ignorePatterns: [
    "node_modules/",
    "android/",
    "ios/",
    ".expo/",
    "dist/",
    "build/",
    "coverage/",
    "*.config.js",
    "babel.config.js",
  ],
};

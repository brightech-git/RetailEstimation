// Phase 1 – Foundation
// Prettier config tuned to match the project's EXISTING style so running it
// does not reformat the whole codebase unexpectedly:
//   - double quotes, 2-space indent, semicolons, trailing commas on multiline.
module.exports = {
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: false,
  quoteProps: "as-needed",
  trailingComma: "es5",
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: "always",
  endOfLine: "auto",
};

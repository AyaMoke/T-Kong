/** @type {import('web-ext').Config} */
export default {
  // Keep extension packages free of docs / CI / repo metadata.
  ignoreFiles: [
    "docs",
    "docs/**",
    ".github",
    ".github/**",
    "web-ext-artifacts",
    "web-ext-artifacts/**",
    "node_modules",
    "node_modules/**",
    "*.md",
    "LICENSE",
    "web-ext-config.mjs",
  ],
};

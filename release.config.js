// eslint-disable-next-line no-undef
module.exports = {
  branches: "main",
  repositoryURL: "https://github.com/daraja-sdks/daraja.js",
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    "@semantic-release/npm",
    "@semantic-release/github",
  ],
};

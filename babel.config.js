module.exports = {
  "presets": [
    "@babel/env",
    "@babel/preset-react",
    "@babel/preset-typescript",
  ],
  "plugins": [
    "@babel/plugin-syntax-dynamic-import",
    "@babel/plugin-syntax-import-meta",
    ["@babel/plugin-proposal-class-properties", { "loose": false }],
    "@babel/plugin-proposal-json-strings",
  ],
};

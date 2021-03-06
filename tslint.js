/* eslint-disable quote-props */

module.exports = {
  'extends': [
    '@ridi/tslint-config',
  ],
  'rules': {
    'jsx-no-lambda': false,
    'max-line-length': [true, 180],
    'no-empty': [true, 'allow-empty-functions'],
  },
  'linterOptions': {
    'exclude': [
      '**/node_modules/**',
      '**/__tests__/**',
    ],
  },
};

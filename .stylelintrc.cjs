module.exports = {
  extends: ['stylelint-config-recess-order'],
  rules: {
    'order/order': ['custom-properties', 'declarations'],
  },
  overrides: [
    {
      files: ['**/*.{jsx,tsx}'],
      customSyntax: '@stylelint/postcss-css-in-js',
    },
  ],
};

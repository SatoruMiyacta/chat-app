const path = require('path');
module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    'storybook-css-modules',
    '@storybook/addon-actions',
  ],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-vite',
  },
  features: {
    storyStoreV7: true,
  },

  async viteFinal(config, { configType }) {
    return {
      ...config,
      resolve: {
        alias: [
          {
            find: '@',
            replacement: path.resolve(__dirname, '/src'),
          },
        ],
      },
    };
  },
};

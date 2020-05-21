module.exports = {
  stories: ['../stories/**/*.stories.tsx'],
  addons: ['@storybook/addon-actions', '@storybook/addon-links', '@storybook/addon-knobs/register'],
  webpackFinal: async (config) => {
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      use: [
        {
          loader: require.resolve('ts-loader'),
        },
        // Optional
        {
          loader: require.resolve('react-docgen-typescript-loader'),
        },
      ],
    })
    config.resolve.extensions.push('.ts', '.tsx')

    config.module.rules.find(
      (rule) => rule.test.toString() === '/\\.css$/'
    ).exclude = /\.module\.css$/

    config.module.rules.push({
      test: /\.module\.css$/,
      use: [
        'style-loader',
        'css-modules-typescript-loader',
        {
          loader: 'css-loader',
          options: {
            modules: true,
          },
        },
      ],
    })

    return config
  },
}

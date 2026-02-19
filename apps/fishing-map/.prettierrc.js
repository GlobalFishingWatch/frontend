import gfwPrettierConfig from '@globalfishingwatch/linting/prettier'

/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  ...gfwPrettierConfig,
  overrides: [
    ...(gfwPrettierConfig.overrides ?? []),
    {
      files: ['./data/workspaces.ts'],
      options: {
        printWidth: 140,
      },
    },
  ],
}

export default config

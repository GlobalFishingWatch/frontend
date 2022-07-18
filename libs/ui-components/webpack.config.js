const getConfig = require('@nrwl/react/plugins/babel');
const cssModuleRegex = /\.module\.css$/;

module.exports = (config) => {
  config = getConfig(config);
  
  config.module.rules.forEach((rule, idx) => {
    // Find rule tests for CSS.
    // Then make sure it excludes .module.css files.
    if (rule.test.test('foo.css')) {
      rule.exclude = rule.exclude
       ? Array.isArray(rule.exclude)
       ? [...rule.exclude, cssModuleRegex]
       : [rule.exclude, cssModuleRegex]
       : cssModuleRegex
    }
  });

  // Add new rule to handle .module.css files by using css-loader
  // with modules on.
  config.module.rules.push({
    test: /\.module\.css$/,
    use: [
      { loader: 'style-loader' },
      { loader: 'css-modules-typescript-loader' },
      {
        loader: 'css-loader',
        options: {
          modules: true,
          importLoaders: 1
        }
      }
    ]
  });

  return config;
}
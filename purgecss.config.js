module.exports = {
  // Specify the paths to all of your template files
  content: [
    './apps/**/src/**/*.{js,jsx,ts,tsx}',
    './apps/**/pages/**/*.{js,jsx,ts,tsx}',
    './apps/**/features/**/*.{js,jsx,ts,tsx}',
    './libs/**/*.{js,jsx,ts,tsx}',
  ],
  // Specify the paths to all of your CSS files
  css: [
    './apps/**/src/**/*.css',
    './apps/**/features/**/*.css',
    './apps/**/pages/**/*.css',
    './libs/**/*.css',
  ],
  // CSS files to write the purged CSS to
  output: (filepath) => {
    // Return the same path as the source file
    return filepath
  },
  // Options for PurgeCSS
  defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
  safelist: {
    standard: [
      // Add classes that are dynamically created
      /^recharts-/, // For recharts classes
      /^print-/, // For print-related classes
      /^sticky/, // For sticky classes
      /^active/, // For active states
      /^disabled/, // For disabled states
    ],
    deep: [
      // Add classes that include other classes
      /^tooltip/,
      /^modal/,
    ],
    greedy: [
      // Add classes with certain patterns
      /^data-/,
      /^react-/,
    ],
  },
}

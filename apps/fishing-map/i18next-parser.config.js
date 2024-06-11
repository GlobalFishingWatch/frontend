module.exports = {
  // Key separator used in your translation keys
  contextSeparator: '_',
  // Save the \_old files
  createOldCatalogs: true,
  // Default namespace used in your i18next config
  defaultNamespace: 'translations',
  // Indentation of the catalog files
  indentation: 2,
  // Keep keys from the catalog that are no longer in code
  keepRemoved: true,
  // Plural separator used in your translation keys
  // If you want to use plain english keys, separators such as `_` might conflict. You might want to set `pluralSeparator` to a different string that does not occur in your keys.
  // If you don't want to generate keys for plurals (for example, in case you are using ICU format), set `pluralSeparator: false`.
  pluralSeparator: '_',
  // Key separator used in your translation keys
  // If you want to use plain english keys, separators such as `.` and `:` will conflict. You might want to set `keySeparator: false` and `namespaceSeparator: false`. That way, `t('Status: Loading...')` will not think that there are a namespace and three separator dots for instance.
  keySeparator: '.',
  // see below for more details
  lexers: {
    js: ['JavascriptLexer'], // if you're writing jsx inside .js files, change this to JsxLexer
    ts: ['JavascriptLexer'],
    jsx: ['JsxLexer'],
    tsx: ['JsxLexer'],
    default: ['JavascriptLexer'],
  },
  // Control the line ending. See options at https://github.com/ryanve/eol
  lineEnding: 'auto',
  // An array of the locales in your applications
  locales: ['source'],
  // Namespace separator used in your translation keys
  // If you want to use plain english keys, separators such as `.` and `:` will conflict. You might want to set `keySeparator: false` and `namespaceSeparator: false`. That way, `t('Status: Loading...')` will not think that there are a namespace and three separator dots for instance.
  namespaceSeparator: ':',
  // Supports $LOCALE and $NAMESPACE injection
  // Supports JSON (.json) and YAML (.yml) file formats
  // Where to write the locale files relative to process.cwd()
  output: 'public/locales/$LOCALE/$NAMESPACE.json',
  // An array of globs that describe where to look for source files
  // relative to the location of the configuration file
  input: [
    './data/**/*',
    './pages/**/*',
    './features/**/*',
    '[!node_modules][!public]*/**/*.{js,jsx,ts,tsx}',
  ],
  // For react file, extract the defaultNamespace - https://react.i18next.com/latest/withtranslation-hoc
  // Ignored when parsing a `.jsx` file and namespace is extracted from that file.
  reactNamespace: false,
  // Whether or not to sort the catalog
  sort: true,
  // Default value to give to empty keys
  defaultValue: function (locale, namespace, key, value) {
    return value || key
  },
  // Display info about the parsing including some stats
  verbose: true,
  i18nextOptions: {
    compatibilityJSON: "v4"
  }
}

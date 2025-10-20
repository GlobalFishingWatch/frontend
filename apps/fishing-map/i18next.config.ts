import { defineConfig } from 'i18next-cli';

export default defineConfig({
  "locales": [
    "source"
  ],
  "extract": {
    "input": [
      "./data/**/*",
      "./pages/**/*",
      "./features/**/*",
      "./routes/**/*",
      "./utils/**/*",
      "[!node_modules][!public]*/**/*.{js,jsx,ts,tsx}"
    ],
    "output": "public/locales/{{language}}/{{namespace}}.json",
    "defaultNS": "translations",
    "keySeparator": ".",
    "nsSeparator": ":",
    "contextSeparator": "_",
    "functions": [
      "t",
      "*.t"
    ],
    "transComponents": [
      "Trans"
    ]
  },
  "types": {
    "input": [
      "locales/{{language}}/{{namespace}}.json"
    ],
    "output": "src/types/i18next.d.ts"
  }
});
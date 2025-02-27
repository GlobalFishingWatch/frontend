# @globalfishingwatch/i18n-labels

A library for managing i18n labels in Global Fishing Watch applications.

## Overview

This library contains JSON files with translations and labels for:

- Datasets metadata and schema definitions
- Country flags/names
- Timebar interface elements

It uses [Crowdin](https://crowdin.com/project/gfw-frontend) for managing the translations files

As a developer the only file you need to care about is the `source/` file, the rest is managed by the Crowdin project.

## Structure

The library is organized into language-specific directories:

```
i18n-labels/
├── en/          # English translations
├── es/          # Spanish translations
├── fr/          # French translations
├── id/          # Indonesian translations
├── pt/          # Portuguese translations
├── source/      # Source JSON files
└── val/         # Used for the crowdin live translation
```

## Installation

```bash
yarn add @globalfishingwatch/i18n-labels
```

## Available Resources

### 1. Datasets (`datasets.json`)

Contains translations for dataset names, descriptions and schema definitions.

Example usage:

```typescript
import { datasets } from '@globalfishingwatch/i18n-labels'

// Access dataset information
const bathymetryInfo = datasets['public-global-bathymetry']
console.log(bathymetryInfo.name) // "Bathymetry"
```

### 2. Flags (`flags.json`)

Contains country names mapped to their ISO-3 codes.

Example usage:

```typescript
import { flags } from '@globalfishingwatch/i18n-labels'

console.log(flags.USA) // "United States of America"
```

### 3. Timebar (`timebar.json`)

Contains translations for the time navigation interface elements:

Example usage:

```typescript
import { timebar } from '@globalfishingwatch/i18n-labels'

console.log(timebar.playback.playAnimation) // "Play animation"
```

## Build and publish

```bash
nx build i18n-labels
nx publish i18n-labels
```

## License

MIT

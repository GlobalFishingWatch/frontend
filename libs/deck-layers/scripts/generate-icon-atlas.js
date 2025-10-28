#!/usr/bin/env node

/**
 * Script to generate an icon atlas (spritesheet) and JSON mapping for deck.gl IconLayer
 *
 * Usage:
 *   node scripts/generate-icon-atlas.js [images-dir] [output-png] [output-json]
 *
 * Defaults:
 *   images-dir: icons/
 *   output-png: icon-atlas.png
 *   output-json: icon-atlas.json
 *
 * Examples:
 *   node scripts/generate-icon-atlas.js
 *   node scripts/generate-icon-atlas.js images/
 *   node scripts/generate-icon-atlas.js images/ output/icon-atlas.png output/icon-atlas.json
 *
 * The script will:
 * 1. Read all PNG images from the specified directory
 * 2. Combine them into a horizontal spritesheet
 * 3. Generate a JSON mapping file with icon coordinates
 */

const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const ERROR_CODES = {
  INVALID_ARGS: 1,
  DIRECTORY_NOT_FOUND: 2,
  NO_IMAGES_FOUND: 3,
  PROCESSING_ERROR: 4,
}

function parseArgs() {
  const args = process.argv.slice(2)

  return {
    imagesDir: args[0] ? path.resolve(args[0]) : path.join(__dirname, 'icons'),
    outputPng: args[1] ? path.resolve(args[1]) : path.join(__dirname, 'icon-atlas.png'),
    outputJson: args[2] ? path.resolve(args[2]) : path.join(__dirname, 'icon-atlas.json'),
  }
}

async function getImageFiles(imagesDir) {
  if (!fs.existsSync(imagesDir)) {
    console.error(`Error: Directory not found: ${imagesDir}`)
    process.exit(ERROR_CODES.DIRECTORY_NOT_FOUND)
  }

  const files = fs
    .readdirSync(imagesDir)
    .filter((file) => /\.png$/i.test(file))
    .sort()
    .map((file) => path.join(imagesDir, file))

  if (files.length === 0) {
    console.error(`Error: No PNG images found in ${imagesDir}`)
    process.exit(ERROR_CODES.NO_IMAGES_FOUND)
  }

  return files
}

async function getImageInfo(imagePath) {
  const image = sharp(imagePath)
  const metadata = await image.metadata()
  return {
    path: imagePath,
    width: metadata.width,
    height: metadata.height,
  }
}

async function createSpritesheet(imageFiles, outputPng) {
  console.log(`Processing ${imageFiles.length} images...`)

  // Get dimensions for each image
  const images = await Promise.all(imageFiles.map(getImageInfo))

  // Calculate total canvas size
  let totalWidth = 0
  let maxHeight = 0
  const icons = []

  for (const image of images) {
    const iconName = path.basename(image.path, '.png')
    icons.push({
      name: iconName,
      x: totalWidth,
      y: 0,
      width: image.width,
      height: image.height,
    })

    totalWidth += image.width
    maxHeight = Math.max(maxHeight, image.height)
  }

  console.log(`Canvas size: ${totalWidth}x${maxHeight}`)

  // Create composite operations
  const compositors = []
  let currentX = 0

  for (const imagePath of imageFiles) {
    compositors.push({
      input: imagePath,
      left: currentX,
      top: 0,
    })
    currentX += images[compositors.length - 1].width
  }

  // Create output directory if needed
  const outputDir = path.dirname(outputPng)
  if (outputDir && !fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  return { icons, compositors, width: totalWidth, height: maxHeight }
}

async function generateIconAtlas() {
  const { imagesDir, outputPng, outputJson } = parseArgs()

  console.log(`Generating icon atlas from: ${imagesDir}`)
  console.log(`Output PNG: ${outputPng}`)
  console.log(`Output JSON: ${outputJson}`)

  try {
    // Get all image files
    const imageFiles = await getImageFiles(imagesDir)
    console.log(`Found ${imageFiles.length} images`)

    // Create spritesheet
    const { icons, compositors, width, height } = await createSpritesheet(imageFiles, outputPng)

    // Generate the PNG spritesheet using sharp
    console.log('Creating spritesheet PNG...')

    // Create an empty canvas with transparent background
    const canvas = sharp({
      create: {
        width,
        height,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })

    // Composite all images
    await canvas.composite(compositors).png().toFile(outputPng)

    console.log(`✓ Created ${outputPng}`)

    // Generate JSON mapping
    console.log('Generating icon mapping JSON...')

    const mapping = {}
    for (const icon of icons) {
      mapping[icon.name] = {
        x: icon.x,
        y: icon.y,
        width: icon.width,
        height: icon.height,
        anchorY: icon.height, // Default: bottom anchor
        mask: true, // Default: true for transparency support
      }
    }

    const jsonContent = JSON.stringify(mapping, null, 2)
    fs.writeFileSync(outputJson, jsonContent)

    console.log(`✓ Created ${outputJson}`)
    console.log(`\nIcon mapping:`)
    console.log(JSON.stringify(mapping, null, 2))
  } catch (error) {
    console.error('Error generating icon atlas:', error.message)
    process.exit(ERROR_CODES.PROCESSING_ERROR)
  }
}

// Run the script
generateIconAtlas()

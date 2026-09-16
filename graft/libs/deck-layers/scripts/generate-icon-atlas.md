# libs/deck-layers/scripts/generate-icon-atlas.js · [[icon-atlas-generation]]

Node.js script that generates a PNG spritesheet and JSON mapping file for deck.gl IconLayer from a directory of PNG icons.

- parseArgs · function · L39-L47 — Parses command-line arguments to extract the images directory and output file paths, applying sensible defaults.
- getImageFiles · function · L49-L67 — Reads and filters PNG image files from a specified directory, exiting with an error if the directory is missing or contains no images.
- getImageInfo · function · L69-L77 — Extracts and returns the dimensions and path of a single image using the sharp library.
- createSpritesheet · function · L79-L126 — Calculates layout coordinates for horizontally-arranged icons and prepares composition operations to merge them into a single spritesheet canvas.
- generateIconAtlas · function · L128-L186 — Main entry point that orchestrates icon atlas generation: collects image files, creates the spritesheet PNG, and writes the JSON coordinate mapping.

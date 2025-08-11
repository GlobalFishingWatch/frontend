#!/bin/bash

set -euo pipefail

if [ -z "$PROJECT" ] || [ -z "$REPOSITORY" ] || [ -z "$LOCATION" ]; then
  echo "Error: Required environment variables PROJECT, REPOSITORY, and LOCATION must be set"
  exit 1
fi

cache_key=$(cat /workspace/cache-key)

# Function to check if cache exists
check_cache_exists() {
  gcloud artifacts repositories describe ${REPOSITORY} \
    --project=${PROJECT} --location=${LOCATION} 2>/dev/null && \
  gcloud artifacts versions describe ${cache_key} \
    --location=${LOCATION} \
    --project=${PROJECT} \
    --repository=${REPOSITORY} \
    --package=node-modules 2>/dev/null
}

# Function to restore cache with high performance streaming
restore_cache() {
  echo "Cache hit! Restoring node_modules with optimized streaming..."

  # Determine best decompression method available
  if command -v pigz >/dev/null 2>&1; then
    DECOMPRESS_CMD="pigz -dc -p$(nproc)"
    echo "Using pigz for parallel decompression with $(nproc) threads"
  elif command -v gzip >/dev/null 2>&1; then
    DECOMPRESS_CMD="gzip -dc"
    echo "Using gzip for decompression"
  else
    echo "Warning: No decompression tool found"
    DECOMPRESS_CMD="cat"
  fi

  # Try high-performance streaming first
  echo "Attempting high-performance streaming download..."

  # Method 1: Direct streaming with parallel decompression
  if gcloud artifacts generic download \
    --repository=${REPOSITORY} \
    --location=${LOCATION} \
    --project=${PROJECT} \
    --package=node-modules \
    --version=${cache_key} \
    --destination=- 2>/dev/null | \
    ${DECOMPRESS_CMD} | \
    tar -xf - -C /workspace --strip-components=0; then
    echo "Cache restored successfully with high-performance streaming!"
    return 0
  else
    echo "Streaming failed, trying chunked download..."
  fi

  # Method 2: Chunked download for large files (better for network issues)
  echo "Attempting chunked download for better reliability..."
  temp_cache="/tmp/cache-${cache_key}.tar.gz"

  # Download with progress indication
  echo "Downloading cache file..."
  if gcloud artifacts generic download \
    --repository=${REPOSITORY} \
    --location=${LOCATION} \
    --project=${PROJECT} \
    --package=node-modules \
    --version=${cache_key} \
    --destination="${temp_cache}" 2>/dev/null; then

    # Check if file exists and has content
    if [ ! -f "${temp_cache}" ] || [ ! -s "${temp_cache}" ]; then
      echo "Error: Downloaded cache file is empty or missing"
      rm -f "${temp_cache}"
      return 1
    fi

    # Quick validation without full decompression
    echo "Validating cache file integrity..."
    if ! gzip -t "${temp_cache}" 2>/dev/null; then
      echo "Error: Cache file is not a valid gzip archive"
      rm -f "${temp_cache}"
      return 1
    fi

    # Extract with parallel processing if available
    echo "Extracting cache file with optimized extraction..."
    if command -v pigz >/dev/null 2>&1; then
      # Use pigz for parallel decompression during extraction
      if pigz -dc -p$(nproc) "${temp_cache}" | tar -xf - -C /workspace --strip-components=0; then
        echo "Cache restored successfully with parallel extraction!"
        rm -f "${temp_cache}"
        return 0
      fi
    else
      # Fallback to standard extraction
      if tar -xzf "${temp_cache}" -C /workspace --strip-components=0; then
        echo "Cache restored successfully!"
        rm -f "${temp_cache}"
        return 0
      fi
    fi

    echo "Error: Failed to extract cache file"
    rm -f "${temp_cache}"
    return 1
  else
    echo "Error: Failed to download cache file"
    return 1
  fi
}

# Main execution
if check_cache_exists; then
  if restore_cache; then
    echo "Cache restoration completed successfully"
  else
    echo "Cache restoration failed, will proceed with fresh install"
    # Don't exit with error, just continue without cache
  fi
else
  echo "Cache miss. Will create new cache after install."
fi

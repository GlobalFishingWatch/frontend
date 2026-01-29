#!/bin/bash

# Script to remove all dist folders and tsconfig.tsbuildinfo from libraries in /libs directory

# Get the script directory and navigate to workspace root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "Cleaning dist folders and tsbuildinfo from libraries..."
echo "Workspace root: $WORKSPACE_ROOT"
echo ""

# Counter for removed items
removed_count=0

# Find and remove all dist directories in libs
for dist_dir in "$WORKSPACE_ROOT/libs/"*/dist; do
    if [ -d "$dist_dir" ]; then
        lib_name=$(basename "$(dirname "$dist_dir")")
        echo "Removing: libs/$lib_name/dist"
        rm -rf "$dist_dir"
        ((removed_count++))
    fi
done

# Find and remove all tsconfig.tsbuildinfo in libs
for tsbuildinfo in "$WORKSPACE_ROOT/libs/"*/tsconfig.tsbuildinfo; do
    if [ -f "$tsbuildinfo" ]; then
        lib_name=$(basename "$(dirname "$tsbuildinfo")")
        echo "Removing: libs/$lib_name/tsconfig.tsbuildinfo"
        rm -f "$tsbuildinfo"
        ((removed_count++))
    fi
done

echo ""
if [ $removed_count -eq 0 ]; then
    echo "No dist folders or tsbuildinfo found to remove."
else
    echo "Successfully removed $removed_count item(s)."
fi

#!/bin/bash
# Batch convert images to WebP and AVIF for performance optimization
# Requires: ImageMagick (convert) or libwebp (cwebp) / libavif (avifenc)

echo "Optimizing images..."

find ./public/images -type f \( -name "*.jpg" -o -name "*.png" \) -print0 | while IFS= read -r -d '' file; do
  dir=$(dirname "$file")
  base=$(basename "$file" | sed 's/\.[^.]*$//')
  
  # Convert to WebP (Quality 85)
  if command -v cwebp &> /dev/null; then
    cwebp -q 85 "$file" -o "$dir/$base.webp"
  else
    convert "$file" -quality 85 "$dir/$base.webp"
  fi
  
  # Convert to AVIF (Quality 50 for good size/quality ratio)
  if command -v avifenc &> /dev/null; then
    avifenc -q 50 "$file" "$dir/$base.avif"
  fi
  
  echo "Optimized: $base"
done

echo "Image optimization complete."

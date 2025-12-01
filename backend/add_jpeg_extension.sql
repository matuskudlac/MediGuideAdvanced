-- SQL Script to add .jpeg extension to all product image URLs
-- Run this in your Supabase SQL Editor

-- Update all image URLs to append .jpeg if they don't already have an extension
UPDATE products_product 
SET image = image || '.jpeg'
WHERE image IS NOT NULL 
  AND image != '' 
  AND image NOT LIKE '%.jpeg'
  AND image NOT LIKE '%.jpg'
  AND image NOT LIKE '%.png'
  AND image NOT LIKE '%.gif'
  AND image NOT LIKE '%.webp';

-- Verify the updates
SELECT id, name, image 
FROM products_product 
ORDER BY id;

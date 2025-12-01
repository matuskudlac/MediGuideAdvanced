-- SQL Script to rename columns to lowercase for consistency
-- Run this in your Supabase SQL Editor

-- Rename Ingredients to ingredients
ALTER TABLE products_product 
RENAME COLUMN "Ingredients" TO ingredients;

-- Rename Recommended_Usage to recommended_usage
ALTER TABLE products_product 
RENAME COLUMN "Recommended_Usage" TO recommended_usage;

-- Verify the changes
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products_product' 
  AND column_name IN ('ingredients', 'recommended_usage')
ORDER BY column_name;

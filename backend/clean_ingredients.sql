-- SQL Script to extract only active ingredients (remove inactive ingredients)
-- This removes everything after "plus", "with", "and inactive", etc.
-- Run this in your Supabase SQL Editor

-- Update ingredients to show only active ingredients
UPDATE products_product 
SET ingredients = TRIM(
    CASE 
        -- Remove everything after " plus "
        WHEN ingredients LIKE '% plus %' THEN 
            SUBSTRING(ingredients FROM 1 FOR POSITION(' plus ' IN ingredients) - 1)
        -- Remove everything after " with "
        WHEN ingredients LIKE '% with %' THEN 
            SUBSTRING(ingredients FROM 1 FOR POSITION(' with ' IN ingredients) - 1)
        -- Remove everything after "and inactive"
        WHEN ingredients LIKE '%and inactive%' THEN 
            SUBSTRING(ingredients FROM 1 FOR POSITION('and inactive' IN ingredients) - 1)
        -- Keep as is if no separator found
        ELSE ingredients
    END
);

-- Verify the updates
SELECT id, name, ingredients 
FROM products_product 
ORDER BY id;

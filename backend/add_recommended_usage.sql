-- SQL Script to add Recommended_Usage column and populate it from CSV data
-- Run this in your Supabase SQL Editor

-- Step 1: Add the Recommended_Usage column if it doesn't exist
ALTER TABLE products_product 
ADD COLUMN IF NOT EXISTS "Recommended_Usage" TEXT;

-- Step 2: Update products with their recommended usage from the CSV

-- Product ID 101 - Advil
UPDATE products_product 
SET "Recommended_Usage" = 'Adults and children 12+: take 1 tablet every 4–6 hours; may increase to 2 tablets if needed. Do not exceed 6 tablets in 24 hours.'
WHERE id = 101;

-- Product ID 102 - Tylenol
UPDATE products_product 
SET "Recommended_Usage" = 'Adults: take 2 caplets every 6 hours; do not exceed 6 caplets per 24 hours.'
WHERE id = 102;

-- Product ID 103 - Halls
UPDATE products_product 
SET "Recommended_Usage" = 'Dissolve 1 drop in mouth every 2 hours as needed. Do not chew or swallow whole.'
WHERE id = 103;

-- Product ID 104 - Nature Made Vitamin C
UPDATE products_product 
SET "Recommended_Usage" = 'Adults: take 1 tablet daily with water and a meal.'
WHERE id = 104;

-- Product ID 105 - Natrol Melatonin
UPDATE products_product 
SET "Recommended_Usage" = 'Take 1 tablet 20–30 minutes before bed. Allow to dissolve in mouth.'
WHERE id = 105;

-- Product ID 106 - Claritin
UPDATE products_product 
SET "Recommended_Usage" = 'Adults and children 6+: take 1 tablet once daily.'
WHERE id = 106;

-- Product ID 107 - Vitafusion
UPDATE products_product 
SET "Recommended_Usage" = 'Adults: chew 2 gummies daily with or without food.'
WHERE id = 107;

-- Product ID 108 - Nature Made Fish Oil
UPDATE products_product 
SET "Recommended_Usage" = 'Adults: take 2 softgels daily with a meal.'
WHERE id = 108;

-- Product ID 109 - Robitussin
UPDATE products_product 
SET "Recommended_Usage" = 'Adults: take 10 mL every 4 hours; do not exceed 60 mL/day.'
WHERE id = 109;

-- Product ID 110 - Pepcid
UPDATE products_product 
SET "Recommended_Usage" = 'Adults: take 1 tablet to relieve or prevent heartburn; max 2 tablets/day.'
WHERE id = 110;

-- Product ID 111 - Culturelle
UPDATE products_product 
SET "Recommended_Usage" = 'Adults: take 1 capsule daily with or without food.'
WHERE id = 111;

-- Product ID 112 - Mucinex
UPDATE products_product 
SET "Recommended_Usage" = 'Adults and children 12+: take 1–2 tablets every 12 hours; do not exceed 4 tablets/day. Swallow whole; do not crush or chew.'
WHERE id = 112;

-- Product ID 113 - Afrin
UPDATE products_product 
SET "Recommended_Usage" = 'Use 2–3 sprays per nostril every 10–12 hours; max 2 doses/day.'
WHERE id = 113;

-- Product ID 114 - Band-Aid
UPDATE products_product 
SET "Recommended_Usage" = 'Apply to clean, dry skin. Replace daily or when dirty.'
WHERE id = 114;

-- Product ID 115 - BZK Wipes
UPDATE products_product 
SET "Recommended_Usage" = 'Clean affected area; allow to dry before applying a bandage.'
WHERE id = 115;

-- Product ID 116 - Nature Made Vitamin D3
UPDATE products_product 
SET "Recommended_Usage" = 'Adults: take 1 softgel daily with a meal.'
WHERE id = 116;

-- Product ID 117 - Unisom
UPDATE products_product 
SET "Recommended_Usage" = 'Adults and children 12+: take 1 tablet 30 minutes before bed.'
WHERE id = 117;

-- Product ID 118 - Dramamine
UPDATE products_product 
SET "Recommended_Usage" = 'Take 1–2 tablets 30 minutes before travel; do not exceed 8 tablets/day.'
WHERE id = 118;

-- Product ID 119 - TUMS
UPDATE products_product 
SET "Recommended_Usage" = 'Chew 2–4 tablets as symptoms occur. Do not exceed label maximum.'
WHERE id = 119;

-- Product ID 120 - Systane
UPDATE products_product 
SET "Recommended_Usage" = 'Instill 1–2 drops in affected eye(s) as needed.'
WHERE id = 120;

-- Verify the updates
SELECT id, name, "Recommended_Usage" 
FROM products_product 
WHERE id BETWEEN 101 AND 120
ORDER BY id;

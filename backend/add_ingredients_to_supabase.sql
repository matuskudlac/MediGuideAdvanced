-- SQL Script to add Ingredients column and populate it for existing products in Supabase
-- Run this in your Supabase SQL Editor

-- Step 1: Add the Ingredients column if it doesn't exist
ALTER TABLE products_product 
ADD COLUMN IF NOT EXISTS "Ingredients" TEXT;

-- Step 2: Update products with their ingredients based on the CSV data
-- Product ID 101 - Advil
UPDATE products_product 
SET "Ingredients" = 'Ibuprofen 200 mg (NSAID) plus inactive ingredients such as croscarmellose sodium, microcrystalline cellulose, iron oxides, magnesium stearate, and pharmaceutical glaze.'
WHERE id = 101;

-- Product ID 102 - Tylenol
UPDATE products_product 
SET "Ingredients" = 'Acetaminophen 500 mg plus cellulose, croscarmellose sodium, povidone, titanium dioxide, and magnesium stearate.'
WHERE id = 102;

-- Product ID 103 - Halls
UPDATE products_product 
SET "Ingredients" = 'Menthol 7.5 mg plus sugars, honey, citric acid, flavoring, and color additives.'
WHERE id = 103;

-- Product ID 104 - Nature Made Vitamin C
UPDATE products_product 
SET "Ingredients" = 'Vitamin C (ascorbic acid) 1000 mg plus cellulose gel, croscarmellose sodium, magnesium stearate, and silicon dioxide.'
WHERE id = 104;

-- Product ID 105 - Natrol Melatonin
UPDATE products_product 
SET "Ingredients" = 'Melatonin 5 mg plus natural flavors, sucralose, stearic acid, silicon dioxide, and other dissolving agents.'
WHERE id = 105;

-- Product ID 106 - Claritin
UPDATE products_product 
SET "Ingredients" = 'Loratadine 10 mg plus starches, lactose, and magnesium stearate.'
WHERE id = 106;

-- Product ID 107 - Vitafusion
UPDATE products_product 
SET "Ingredients" = 'Vitamins A/C/D/E/B6/B12, biotin, zinc, plus gelatin/pectin, natural flavors, and sweeteners.'
WHERE id = 107;

-- Product ID 108 - Nature Made Fish Oil
UPDATE products_product 
SET "Ingredients" = 'Fish Oil 1200 mg (EPA/DHA) plus gelatin, glycerin, tocopherols, and purified water.'
WHERE id = 108;

-- Product ID 109 - Robitussin
UPDATE products_product 
SET "Ingredients" = 'Dextromethorphan HBr 10 mg, Guaifenesin 100 mg per 5 mL plus sweeteners and stabilizers.'
WHERE id = 109;

-- Product ID 110 - Pepcid
UPDATE products_product 
SET "Ingredients" = 'Famotidine 20 mg plus microcrystalline cellulose, talc, and starches.'
WHERE id = 110;

-- Product ID 111 - Culturelle
UPDATE products_product 
SET "Ingredients" = 'Lactobacillus rhamnosus GG (10 billion CFU) plus potato starch, HPMC capsule, magnesium stearate.'
WHERE id = 111;

-- Product ID 112 - Mucinex
UPDATE products_product 
SET "Ingredients" = 'Guaifenesin 600 mg (ER) plus carbomer, magnesium stearate, microcrystalline cellulose, and color additives.'
WHERE id = 112;

-- Product ID 113 - Afrin
UPDATE products_product 
SET "Ingredients" = 'Oxymetazoline HCl 0.05% plus preservatives and stabilizers.'
WHERE id = 113;

-- Product ID 114 - Band-Aid
UPDATE products_product 
SET "Ingredients" = 'Flexible fabric/plastic backing, nonstick pad, acrylic adhesive.'
WHERE id = 114;

-- Product ID 115 - BZK Wipes
UPDATE products_product 
SET "Ingredients" = 'Benzalkonium chloride solution plus water, wetting agents, stabilizers.'
WHERE id = 115;

-- Product ID 116 - Nature Made Vitamin D3
UPDATE products_product 
SET "Ingredients" = 'Vitamin D3 50 mcg (2000 IU) plus soybean oil, gelatin, glycerin, water.'
WHERE id = 116;

-- Product ID 117 - Unisom
UPDATE products_product 
SET "Ingredients" = 'Doxylamine succinate 25 mg plus cellulose, magnesium stearate, and sodium starch glycolate.'
WHERE id = 117;

-- Product ID 118 - Dramamine
UPDATE products_product 
SET "Ingredients" = 'Dimenhydrinate 50 mg plus starches, magnesium stearate, lactose.'
WHERE id = 118;

-- Product ID 119 - TUMS
UPDATE products_product 
SET "Ingredients" = 'Calcium carbonate 750 mg plus sweeteners, flavors, colors.'
WHERE id = 119;

-- Product ID 120 - Systane
UPDATE products_product 
SET "Ingredients" = 'Glycerin 0.3%, Hypromellose 0.2% plus buffering agents, purified water.'
WHERE id = 120;

-- Verify the updates
SELECT id, name, "Ingredients" 
FROM products_product 
WHERE id BETWEEN 101 AND 120
ORDER BY id;

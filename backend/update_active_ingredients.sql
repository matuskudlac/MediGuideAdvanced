-- SQL Script to update ingredients with only active ingredients
-- Manually extracted from the original data
-- Run this in your Supabase SQL Editor

-- Product ID 101 - Advil
UPDATE products_product 
SET ingredients = 'Ibuprofen 200 mg (NSAID)'
WHERE id = 101;

-- Product ID 102 - Tylenol
UPDATE products_product 
SET ingredients = 'Acetaminophen 500 mg'
WHERE id = 102;

-- Product ID 103 - Halls
UPDATE products_product 
SET ingredients = 'Menthol 7.5 mg'
WHERE id = 103;

-- Product ID 104 - Nature Made Vitamin C
UPDATE products_product 
SET ingredients = 'Vitamin C (ascorbic acid) 1000 mg'
WHERE id = 104;

-- Product ID 105 - Natrol Melatonin
UPDATE products_product 
SET ingredients = 'Melatonin 5 mg'
WHERE id = 105;

-- Product ID 106 - Claritin
UPDATE products_product 
SET ingredients = 'Loratadine 10 mg'
WHERE id = 106;

-- Product ID 107 - Vitafusion
UPDATE products_product 
SET ingredients = 'Vitamins A, C, D, E, B6, B12, Biotin, Zinc'
WHERE id = 107;

-- Product ID 108 - Nature Made Fish Oil
UPDATE products_product 
SET ingredients = 'Fish Oil 1200 mg (EPA/DHA)'
WHERE id = 108;

-- Product ID 109 - Robitussin
UPDATE products_product 
SET ingredients = 'Dextromethorphan HBr 10 mg, Guaifenesin 100 mg per 5 mL'
WHERE id = 109;

-- Product ID 110 - Pepcid
UPDATE products_product 
SET ingredients = 'Famotidine 20 mg'
WHERE id = 110;

-- Product ID 111 - Culturelle
UPDATE products_product 
SET ingredients = 'Lactobacillus rhamnosus GG (10 billion CFU)'
WHERE id = 111;

-- Product ID 112 - Mucinex
UPDATE products_product 
SET ingredients = 'Guaifenesin 600 mg (ER)'
WHERE id = 112;

-- Product ID 113 - Afrin
UPDATE products_product 
SET ingredients = 'Oxymetazoline HCl 0.05%'
WHERE id = 113;

-- Product ID 114 - Band-Aid
UPDATE products_product 
SET ingredients = 'Flexible fabric/plastic backing, nonstick pad, acrylic adhesive'
WHERE id = 114;

-- Product ID 115 - BZK Wipes
UPDATE products_product 
SET ingredients = 'Benzalkonium chloride solution'
WHERE id = 115;

-- Product ID 116 - Nature Made Vitamin D3
UPDATE products_product 
SET ingredients = 'Vitamin D3 50 mcg (2000 IU)'
WHERE id = 116;

-- Product ID 117 - Unisom
UPDATE products_product 
SET ingredients = 'Doxylamine succinate 25 mg'
WHERE id = 117;

-- Product ID 118 - Dramamine
UPDATE products_product 
SET ingredients = 'Dimenhydrinate 50 mg'
WHERE id = 118;

-- Product ID 119 - TUMS
UPDATE products_product 
SET ingredients = 'Calcium carbonate 750 mg'
WHERE id = 119;

-- Product ID 120 - Systane
UPDATE products_product 
SET ingredients = 'Glycerin 0.3%, Hypromellose 0.2%'
WHERE id = 120;

-- Verify the updates
SELECT id, name, ingredients 
FROM products_product 
WHERE id BETWEEN 101 AND 120
ORDER BY id;

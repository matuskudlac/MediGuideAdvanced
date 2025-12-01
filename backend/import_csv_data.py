"""
Import products from Products_Final.csv into the database
Usage: python import_csv_data.py
"""

import os
import sys
import django

# Setup Django environment
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mediguide.settings')
django.setup()

import csv
from products.models import Category, Product
from datetime import datetime

# First, create categories based on the CSV
print("Creating categories...")
categories_map = {
    1: "Pain Relief",
    2: "Cold & Flu",
    3: "Vitamins & Supplements",
    4: "Sleep Aid",
    5: "Allergy Relief",
    6: "Digestive Health",
    7: "First Aid"
}

for cat_id, cat_name in categories_map.items():
    category, created = Category.objects.get_or_create(
        id=cat_id,
        defaults={"name": cat_name, "description": f"{cat_name} products"}
    )
    if created:
        print(f"✓ Created category: {category.name}")
    else:
        print(f"- Category already exists: {category.name}")

# Import products from CSV
print("\nImporting products from CSV...")
csv_file = 'Products_Final.csv'

with open(csv_file, 'r', encoding='utf-8') as file:
    reader = csv.DictReader(file)
    
    for row in reader:
        product, created = Product.objects.update_or_create(
            id=int(row['Product_ID']),
            defaults={
                'name': row['Name'],
                'description': row['Description'],
                'category_id': int(row['Category_ID']),
                'price': float(row['Price']),
                'stock_quantity': int(row['Stock']),
                'manufacturer': row['Brand'],
                'dosage': row['Size'],
                'ingredients': row['Ingredients'],  # This is the key field!
                'image': row['Image_URL'],
                'is_active': row['is_active'].upper() == 'TRUE',
                'requires_prescription': False,  # Add logic if needed
            }
        )
        
        if created:
            print(f"✓ Created product: {product.name}")
        else:
            print(f"↻ Updated product: {product.name}")

print("\n✅ CSV import complete!")
print(f"Total categories: {Category.objects.count()}")
print(f"Total products: {Product.objects.count()}")

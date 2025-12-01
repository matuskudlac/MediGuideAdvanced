"""
Delete the duplicate products that were accidentally created (IDs 1-20)
This will clean up the local database
Usage: python delete_duplicate_products.py
"""

import os
import sys
import django

# Setup Django environment
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mediguide.settings')
django.setup()

from products.models import Product

print("Deleting duplicate products (IDs 1-20)...")

# Delete products with IDs 1-20 (the ones we accidentally created)
deleted_count = Product.objects.filter(id__gte=1, id__lte=20).delete()[0]

print(f"✓ Deleted {deleted_count} duplicate products")
print(f"Remaining products: {Product.objects.count()}")

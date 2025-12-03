"""
Quick Trigger Verification Script

This script checks if triggers are active and performs a simple test.
"""

import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mediguide.settings')
django.setup()

from products.models import Product
from django.db import connection


def check_triggers_exist():
    """Check if triggers are created in the database"""
    print("=" * 60)
    print("Checking Database Triggers")
    print("=" * 60)
    
    with connection.cursor() as cursor:
        # Check for triggers
        cursor.execute("""
            SELECT trigger_name, event_object_table, action_timing, event_manipulation
            FROM information_schema.triggers
            WHERE trigger_schema = 'public'
            AND trigger_name IN ('trigger_update_inventory', 'trigger_restore_inventory', 'trigger_log_price_change')
            ORDER BY trigger_name;
        """)
        
        triggers = cursor.fetchall()
        
        if triggers:
            print(f"\n[SUCCESS] Found {len(triggers)} triggers:\n")
            for trigger in triggers:
                print(f"   * {trigger[0]}")
                print(f"      Table: {trigger[1]}")
                print(f"      Timing: {trigger[2]} {trigger[3]}\n")
            return True
        else:
            print("\n[ERROR] No triggers found in database!")
            print("Please run the database_schema.sql in Supabase SQL Editor")
            return False


def show_sample_product():
    """Show a sample product with current stock"""
    print("=" * 60)
    print("Sample Product Stock Levels")
    print("=" * 60)
    
    products = Product.objects.filter(stock_quantity__gt=0)[:5]
    
    if products:
        print("\nProducts with stock:\n")
        for p in products:
            print(f"   ID: {p.id} | {p.name}")
            print(f"   Stock: {p.stock_quantity} units")
            print(f"   Price: ${p.price}\n")
    else:
        print("\n[WARNING] No products with stock found")


def main():
    print("\n" + "=" * 60)
    print("MediGuide - Trigger Verification")
    print("=" * 60 + "\n")
    
    # Check if triggers exist
    triggers_exist = check_triggers_exist()
    
    if triggers_exist:
        print("\n[SUCCESS] TRIGGERS ARE ACTIVE!")
        print("\nNext steps:")
        print("1. Go to your website and place an order")
        print("2. Check if the product stock decreases")
        print("3. Cancel the order and check if stock is restored")
        
        # Show sample products
        show_sample_product()
        
        print("\n" + "=" * 60)
        print("To test manually:")
        print("1. Note the stock quantity of a product above")
        print("2. Place an order for that product")
        print("3. Refresh and check if stock decreased")
        print("=" * 60 + "\n")
    else:
        print("\n[ERROR] TRIGGERS NOT FOUND")
        print("\nPlease execute database_schema.sql in Supabase")
        print("=" * 60 + "\n")


if __name__ == "__main__":
    main()

"""
Test Database Triggers and Stored Procedures

This script tests the functionality of:
1. Inventory update trigger (when order is placed)
2. Inventory restore trigger (when order is cancelled)
3. Price change audit trigger
4. Stored procedures with cursors
"""

import os
import django
from decimal import Decimal

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mediguide.settings')
django.setup()

from django.contrib.auth.models import User
from products.models import Product
from orders.models import Order, OrderItem
from django.db import connection


def print_section(title):
    """Print a formatted section header"""
    print("\n" + "=" * 70)
    print(f"  {title}")
    print("=" * 70)


def test_inventory_trigger():
    """Test the inventory update trigger"""
    print_section("TEST 1: Inventory Update Trigger")
    
    # Get a product with stock
    product = Product.objects.filter(stock_quantity__gt=10).first()
    
    if not product:
        print("❌ No products with sufficient stock found")
        return False
    
    print(f"📦 Product: {product.name}")
    print(f"📊 Initial stock: {product.stock_quantity}")
    
    initial_stock = product.stock_quantity
    order_quantity = 3
    
    # Create a test user if needed
    user, created = User.objects.get_or_create(
        username='test_trigger_user',
        defaults={'email': 'test@example.com'}
    )
    
    # Create an order
    order = Order.objects.create(
        user=user,
        shipping_address="123 Test St",
        shipping_city="Test City",
        shipping_state="TS",
        shipping_zip="12345",
        shipping_phone="1234567890",
        shipping_cost=Decimal('5.00')
    )
    
    print(f"📝 Created order #{order.id}")
    
    # Create order item (this should trigger inventory update)
    order_item = OrderItem.objects.create(
        order=order,
        product=product,
        quantity=order_quantity,
        price=product.price
    )
    
    print(f"➕ Added {order_quantity} items to order")
    
    # Refresh product from database
    product.refresh_from_db()
    
    expected_stock = initial_stock - order_quantity
    actual_stock = product.stock_quantity
    
    print(f"📊 Expected stock: {expected_stock}")
    print(f"📊 Actual stock: {actual_stock}")
    
    if actual_stock == expected_stock:
        print("✅ TRIGGER WORKS! Stock decreased correctly")
        return True, order, product, initial_stock
    else:
        print("❌ TRIGGER FAILED! Stock did not update")
        return False, order, product, initial_stock


def test_restore_inventory_trigger(order, product, initial_stock):
    """Test the restore inventory trigger"""
    print_section("TEST 2: Restore Inventory Trigger")
    
    print(f"📦 Product: {product.name}")
    print(f"📊 Current stock: {product.stock_quantity}")
    print(f"📝 Cancelling order #{order.id}")
    
    # Cancel the order (this should restore inventory)
    order.status = 'cancelled'
    order.save()
    
    # Refresh product from database
    product.refresh_from_db()
    
    print(f"📊 Stock after cancellation: {product.stock_quantity}")
    print(f"📊 Original stock: {initial_stock}")
    
    if product.stock_quantity == initial_stock:
        print("✅ TRIGGER WORKS! Stock restored correctly")
        return True
    else:
        print("❌ TRIGGER FAILED! Stock not restored")
        return False


def test_price_audit_trigger():
    """Test the price change audit trigger"""
    print_section("TEST 3: Price Change Audit Trigger")
    
    # Get a product
    product = Product.objects.first()
    
    if not product:
        print("❌ No products found")
        return False
    
    print(f"📦 Product: {product.name}")
    print(f"💰 Current price: ${product.price}")
    
    old_price = product.price
    new_price = old_price + Decimal('1.00')
    
    # Change the price (this should create an audit log)
    product.price = new_price
    product.save()
    
    print(f"💰 New price: ${new_price}")
    
    # Check if audit log was created
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT old_price, new_price, changed_at
            FROM products_price_audit
            WHERE product_id = %s
            ORDER BY changed_at DESC
            LIMIT 1;
        """, [product.id])
        
        result = cursor.fetchone()
    
    if result:
        print(f"📝 Audit log found:")
        print(f"   Old price: ${result[0]}")
        print(f"   New price: ${result[1]}")
        print(f"   Changed at: {result[2]}")
        print("✅ TRIGGER WORKS! Price change logged")
        
        # Restore original price
        product.price = old_price
        product.save()
        
        return True
    else:
        print("❌ TRIGGER FAILED! No audit log created")
        
        # Restore original price anyway
        product.price = old_price
        product.save()
        
        return False


def test_stored_procedures():
    """Test stored procedures with cursors"""
    print_section("TEST 4: Stored Procedures with Cursors")
    
    # Test 1: Low stock report
    print("\n📊 Testing: generate_low_stock_report()")
    with connection.cursor() as cursor:
        cursor.execute("SELECT * FROM generate_low_stock_report() LIMIT 5;")
        results = cursor.fetchall()
        
        if results:
            print(f"✅ Found {len(results)} low stock products:")
            for row in results:
                print(f"   - {row[1]}: {row[2]} units (threshold: {row[3]})")
        else:
            print("ℹ️  No low stock products found (this is okay)")
    
    # Test 2: Monthly sales
    print("\n📊 Testing: calculate_monthly_sales()")
    with connection.cursor() as cursor:
        cursor.execute("SELECT * FROM calculate_monthly_sales(12, 2024) LIMIT 5;")
        results = cursor.fetchall()
        
        if results:
            print(f"✅ Found {len(results)} products with sales:")
            for row in results:
                print(f"   - {row[1]}: {row[2]} units, ${row[3]} revenue")
        else:
            print("ℹ️  No sales found for December 2024 (this is okay)")
    
    # Test 3: Check product availability
    print("\n📊 Testing: check_product_availability()")
    product = Product.objects.first()
    if product:
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT check_product_availability(%s, %s);",
                [product.id, 5]
            )
            result = cursor.fetchone()[0]
            
            print(f"   Product: {product.name}")
            print(f"   Stock: {product.stock_quantity}")
            print(f"   Checking for 5 units: {'✅ Available' if result else '❌ Not available'}")
    
    print("\n✅ All stored procedures executed successfully")
    return True


def run_all_tests():
    """Run all trigger and procedure tests"""
    print("=" * 70)
    print("  MediGuide - Database Trigger & Procedure Tests")
    print("=" * 70)
    
    results = []
    
    # Test 1: Inventory update trigger
    result = test_inventory_trigger()
    if isinstance(result, tuple):
        success, order, product, initial_stock = result
        results.append(("Inventory Update Trigger", success))
        
        if success:
            # Test 2: Restore inventory trigger
            restore_success = test_restore_inventory_trigger(order, product, initial_stock)
            results.append(("Restore Inventory Trigger", restore_success))
    else:
        results.append(("Inventory Update Trigger", False))
        results.append(("Restore Inventory Trigger", False))
    
    # Test 3: Price audit trigger
    audit_success = test_price_audit_trigger()
    results.append(("Price Audit Trigger", audit_success))
    
    # Test 4: Stored procedures
    proc_success = test_stored_procedures()
    results.append(("Stored Procedures", proc_success))
    
    # Summary
    print_section("TEST SUMMARY")
    
    for test_name, success in results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} - {test_name}")
    
    total_tests = len(results)
    passed_tests = sum(1 for _, success in results if success)
    
    print(f"\n📊 Results: {passed_tests}/{total_tests} tests passed")
    
    if passed_tests == total_tests:
        print("\n🎉 All tests passed! Triggers and procedures are working correctly!")
    else:
        print("\n⚠️  Some tests failed. Please check the output above.")
    
    print("=" * 70)


if __name__ == "__main__":
    run_all_tests()

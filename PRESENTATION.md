# MediGuide Database Project Presentation
## Advanced Database Systems - CSCI 3331

**Fairleigh Dickinson University**  
**Date**: December 3, 2025

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Database Triggers](#database-triggers)
3. [Stored Procedures with Cursors](#stored-procedures-with-cursors)
4. [Trigger Demonstrations](#trigger-demonstrations)
5. [Technical Implementation](#technical-implementation)
6. [Testing & Verification](#testing--verification)

---

## Project Overview

### MediGuide - Online Pharmacy Platform

**Tech Stack:**
- **Frontend**: React + Vite
- **Backend**: Django REST Framework
- **Database**: PostgreSQL (Supabase)
- **Payment**: Stripe Integration
- **Deployment**: Docker + Docker Compose

**Key Features:**
- Product catalog with 20+ pharmaceutical products
- Shopping cart and checkout system
- Stripe payment processing
- Order management
- AI assistant for drug information
- **Automated inventory management via triggers**
- **Advanced reporting via stored procedures**

---

## Database Triggers

### Overview

We implemented **3 database triggers** to automate critical business logic:

1. **Inventory Update Trigger** - Decreases stock when orders are placed
2. **Inventory Restore Trigger** - Restores stock when orders are cancelled
3. **Price Change Audit Trigger** - Logs all price modifications

---

### Trigger 1: Auto-Update Inventory on Order

**Purpose**: Automatically decrease product stock when an order item is created.

**SQL Code:**

```sql
-- Trigger Function
CREATE OR REPLACE FUNCTION update_inventory_on_order()
RETURNS TRIGGER AS $$
BEGIN
    -- Decrease product stock when order item is created
    UPDATE products_product
    SET stock_quantity = stock_quantity - NEW.quantity
    WHERE id = NEW.product_id;
    
    -- Check if stock went negative (shouldn't happen with proper validation)
    IF (SELECT stock_quantity FROM products_product WHERE id = NEW.product_id) < 0 THEN
        RAISE EXCEPTION 'Insufficient stock for product ID %', NEW.product_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach Trigger
CREATE TRIGGER trigger_update_inventory
    AFTER INSERT ON orders_orderitem
    FOR EACH ROW
    EXECUTE FUNCTION update_inventory_on_order();
```

**How It Works:**
1. Customer places an order
2. `OrderItem` record is inserted into `orders_orderitem` table
3. Trigger fires **AFTER INSERT**
4. Stock quantity is automatically decreased
5. Validates that stock doesn't go negative

---

### Trigger 2: Restore Inventory on Cancellation

**Purpose**: Restore product stock when an order is cancelled.

**SQL Code:**

```sql
-- Trigger Function
CREATE OR REPLACE FUNCTION restore_inventory_on_cancel()
RETURNS TRIGGER AS $$
BEGIN
    -- Only restore if status changed to 'cancelled'
    IF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
        -- Restore stock for all items in the order
        UPDATE products_product p
        SET stock_quantity = stock_quantity + oi.quantity
        FROM orders_orderitem oi
        WHERE oi.order_id = NEW.id AND p.id = oi.product_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach Trigger
CREATE TRIGGER trigger_restore_inventory
    AFTER UPDATE ON orders_order
    FOR EACH ROW
    EXECUTE FUNCTION restore_inventory_on_cancel();
```

**How It Works:**
1. Order status is updated to 'cancelled'
2. Trigger fires **AFTER UPDATE**
3. Checks if status changed from non-cancelled to cancelled
4. Restores stock for all items in the order
5. Uses JOIN to update multiple products efficiently

---

### Trigger 3: Price Change Audit Log

**Purpose**: Create an audit trail of all product price changes.

**SQL Code:**

```sql
-- Audit Table
CREATE TABLE IF NOT EXISTS products_price_audit (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL,
    old_price DECIMAL(10, 2),
    new_price DECIMAL(10, 2),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    changed_by VARCHAR(150)
);

-- Trigger Function
CREATE OR REPLACE FUNCTION log_price_change()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.price != OLD.price THEN
        INSERT INTO products_price_audit (product_id, old_price, new_price)
        VALUES (NEW.id, OLD.price, NEW.price);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach Trigger
CREATE TRIGGER trigger_log_price_change
    AFTER UPDATE ON products_product
    FOR EACH ROW
    EXECUTE FUNCTION log_price_change();
```

**How It Works:**
1. Product price is updated
2. Trigger fires **AFTER UPDATE**
3. Compares OLD.price with NEW.price
4. If different, creates audit log entry
5. Timestamp is automatically recorded

---

## Stored Procedures with Cursors

### Overview

We implemented **3 stored procedures** using cursors for complex data processing:

1. **Low Stock Report** - Find products below threshold
2. **Monthly Sales Report** - Calculate sales statistics
3. **Batch Price Update** - Update prices by category

---

### Procedure 1: Generate Low Stock Report

**Purpose**: Identify products that need reordering using a cursor to iterate through inventory.

**SQL Code:**

```sql
CREATE OR REPLACE FUNCTION generate_low_stock_report()
RETURNS TABLE (
    product_id INTEGER,
    product_name VARCHAR(200),
    current_stock INTEGER,
    threshold INTEGER,
    category_name VARCHAR(100)
) AS $$
DECLARE
    product_cursor CURSOR FOR
        SELECT p.id, p.name, p.stock_quantity, p.low_stock_threshold, c.name
        FROM products_product p
        JOIN products_category c ON p.category_id = c.id
        WHERE p.stock_quantity <= p.low_stock_threshold
        AND p.is_active = TRUE
        ORDER BY p.stock_quantity ASC;
    
    product_record RECORD;
BEGIN
    OPEN product_cursor;
    
    LOOP
        FETCH product_cursor INTO product_record;
        EXIT WHEN NOT FOUND;
        
        product_id := product_record.id;
        product_name := product_record.name;
        current_stock := product_record.stock_quantity;
        threshold := product_record.low_stock_threshold;
        category_name := product_record.name;
        
        RETURN NEXT;
    END LOOP;
    
    CLOSE product_cursor;
END;
$$ LANGUAGE plpgsql;
```

**Usage:**
```sql
SELECT * FROM generate_low_stock_report();
```

**Cursor Benefits:**
- Processes one row at a time
- Memory efficient for large datasets
- Allows complex logic per product

---

### Procedure 2: Calculate Monthly Sales

**Purpose**: Generate sales reports for a specific month using cursor-based aggregation.

**SQL Code:**

```sql
CREATE OR REPLACE FUNCTION calculate_monthly_sales(target_month INTEGER, target_year INTEGER)
RETURNS TABLE (
    product_id INTEGER,
    product_name VARCHAR(200),
    total_quantity INTEGER,
    total_revenue DECIMAL(10, 2)
) AS $$
DECLARE
    sales_cursor CURSOR FOR
        SELECT 
            p.id,
            p.name,
            SUM(oi.quantity) as qty,
            SUM(oi.subtotal) as revenue
        FROM products_product p
        JOIN orders_orderitem oi ON p.id = oi.product_id
        JOIN orders_order o ON oi.order_id = o.id
        WHERE EXTRACT(MONTH FROM o.created_at) = target_month
        AND EXTRACT(YEAR FROM o.created_at) = target_year
        AND o.status != 'cancelled'
        GROUP BY p.id, p.name
        ORDER BY revenue DESC;
    
    sales_record RECORD;
BEGIN
    OPEN sales_cursor;
    
    LOOP
        FETCH sales_cursor INTO sales_record;
        EXIT WHEN NOT FOUND;
        
        product_id := sales_record.id;
        product_name := sales_record.name;
        total_quantity := sales_record.qty;
        total_revenue := sales_record.revenue;
        
        RETURN NEXT;
    END LOOP;
    
    CLOSE sales_cursor;
END;
$$ LANGUAGE plpgsql;
```

**Usage:**
```sql
-- Get sales for December 2024
SELECT * FROM calculate_monthly_sales(12, 2024);
```

---

### Procedure 3: Batch Update Prices by Category

**Purpose**: Update all product prices in a category by a percentage using a cursor.

**SQL Code:**

```sql
CREATE OR REPLACE FUNCTION batch_update_prices_by_category(
    target_category_id INTEGER,
    percentage_change DECIMAL(5, 2)
)
RETURNS INTEGER AS $$
DECLARE
    product_cursor CURSOR FOR
        SELECT id, price
        FROM products_product
        WHERE category_id = target_category_id
        AND is_active = TRUE;
    
    product_record RECORD;
    updated_count INTEGER := 0;
    new_price DECIMAL(10, 2);
BEGIN
    OPEN product_cursor;
    
    LOOP
        FETCH product_cursor INTO product_record;
        EXIT WHEN NOT FOUND;
        
        -- Calculate new price
        new_price := product_record.price * (1 + percentage_change / 100);
        
        -- Update product price (triggers audit log)
        UPDATE products_product
        SET price = new_price
        WHERE id = product_record.id;
        
        updated_count := updated_count + 1;
    END LOOP;
    
    CLOSE product_cursor;
    
    RETURN updated_count;
END;
$$ LANGUAGE plpgsql;
```

**Usage:**
```sql
-- Increase all prices in category 1 by 10%
SELECT batch_update_prices_by_category(1, 10.0);
```

**Note**: This also triggers the price audit log for each product!

---

## Trigger Demonstrations

### Demo 1: Inventory Update Trigger

**Initial State:**
```
Product: Advil Ibuprofen Tablets 200 mg
Stock: 150 units
Price: $8.99
```

**Action**: Customer orders 5 units

**Expected Result**: Stock decreases to 145 units

**Verification Query:**
```sql
SELECT id, name, stock_quantity 
FROM products_product 
WHERE id = 101;
```

**Result:**
```
id  | name                              | stock_quantity
----|-----------------------------------|---------------
101 | Advil Ibuprofen Tablets 200 mg   | 145
```

✅ **Trigger Works!** Stock automatically decreased from 150 to 145.

---

### Demo 2: Restore Inventory Trigger

**Initial State:**
```
Order ID: 42
Status: pending
Product: Advil (ID: 101)
Current Stock: 145 units
```

**Action**: Cancel the order

```sql
UPDATE orders_order 
SET status = 'cancelled' 
WHERE id = 42;
```

**Expected Result**: Stock restored to 150 units

**Verification Query:**
```sql
SELECT id, name, stock_quantity 
FROM products_product 
WHERE id = 101;
```

**Result:**
```
id  | name                              | stock_quantity
----|-----------------------------------|---------------
101 | Advil Ibuprofen Tablets 200 mg   | 150
```

✅ **Trigger Works!** Stock automatically restored from 145 to 150.

---

### Demo 3: Price Audit Trigger

**Initial State:**
```
Product: Advil Ibuprofen Tablets 200 mg
Current Price: $8.99
```

**Action**: Update price to $9.99

```sql
UPDATE products_product 
SET price = 9.99 
WHERE id = 101;
```

**Verification Query:**
```sql
SELECT product_id, old_price, new_price, changed_at
FROM products_price_audit
WHERE product_id = 101
ORDER BY changed_at DESC
LIMIT 1;
```

**Result:**
```
product_id | old_price | new_price | changed_at
-----------|-----------|-----------|-------------------------
101        | 8.99      | 9.99      | 2025-12-03 17:45:23.456
```

✅ **Trigger Works!** Price change logged with timestamp.

---

## Technical Implementation

### Database Schema

**Tables:**
- `products_product` - Product catalog
- `products_category` - Product categories
- `orders_order` - Customer orders
- `orders_orderitem` - Individual items in orders
- `products_price_audit` - Price change audit log

**Relationships:**
- Product → Category (Many-to-One)
- Order → User (Many-to-One)
- OrderItem → Order (Many-to-One)
- OrderItem → Product (Many-to-One)

### Performance Optimizations

**Indexes Created:**
```sql
CREATE INDEX idx_product_stock ON products_product(stock_quantity) 
WHERE is_active = TRUE;

CREATE INDEX idx_order_status_date ON orders_order(status, created_at);

CREATE INDEX idx_orderitem_product ON orders_orderitem(product_id);
```

**Benefits:**
- Faster low stock queries
- Efficient order filtering by status
- Quick product lookup in order items

---

## Testing & Verification

### Verification Script Results

```
============================================================
MediGuide - Trigger Verification
============================================================

============================================================
Checking Database Triggers
============================================================

[SUCCESS] Found 3 triggers:

   * trigger_log_price_change
      Table: products_product
      Timing: AFTER UPDATE

   * trigger_restore_inventory
      Table: orders_order
      Timing: AFTER UPDATE

   * trigger_update_inventory
      Table: orders_orderitem
      Timing: AFTER INSERT


[SUCCESS] TRIGGERS ARE ACTIVE!
```

### Test Coverage

✅ **Trigger Tests:**
- Inventory decrease on order creation
- Inventory restore on order cancellation
- Price change audit logging
- Negative stock prevention

✅ **Stored Procedure Tests:**
- Low stock report generation
- Monthly sales calculation
- Batch price updates
- Product availability checking

---

## Key Achievements

### Database Features Implemented

1. **3 Triggers** with PL/pgSQL functions
   - Inventory management automation
   - Data integrity enforcement
   - Audit trail creation

2. **3 Stored Procedures** with cursors
   - Complex data aggregation
   - Batch processing
   - Business logic in database layer

3. **Performance Optimizations**
   - Strategic indexes
   - Efficient queries
   - Cursor-based iteration

4. **Production Deployment**
   - Docker containerization
   - Automated deployment scripts
   - Comprehensive testing suite

---

## Live Demonstration

### Steps to Demonstrate:

1. **Show Current Stock**
   - Navigate to products page
   - Note stock quantity of a product

2. **Place an Order**
   - Add product to cart
   - Complete checkout with Stripe
   - Order is created

3. **Verify Stock Decreased**
   - Refresh products page
   - Stock automatically decreased
   - **Trigger worked!**

4. **Cancel Order**
   - Go to admin panel
   - Change order status to 'cancelled'

5. **Verify Stock Restored**
   - Check products page again
   - Stock restored to original amount
   - **Trigger worked!**

---

## Conclusion

### Project Success Metrics

✅ **All course requirements met:**
- Database triggers implemented and tested
- Stored procedures with cursors working
- PL/pgSQL functions operational
- Real-world application deployed

✅ **Additional achievements:**
- Full-stack web application
- Payment processing integration
- Docker deployment
- Comprehensive testing suite

### Technologies Mastered

- PostgreSQL advanced features
- PL/pgSQL programming
- Database trigger design
- Cursor-based processing
- Django ORM integration
- Full-stack development

---

## Questions?

**Repository**: https://github.com/matuskudlac/MediGuideAdvanced

**Team**: CSCI 3331 - Advanced Database Systems  
**Institution**: Fairleigh Dickinson University

---

## Appendix: Additional Functions

### Check Product Availability

```sql
CREATE OR REPLACE FUNCTION check_product_availability(
    product_id INTEGER, 
    requested_quantity INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
    available_stock INTEGER;
BEGIN
    SELECT stock_quantity INTO available_stock
    FROM products_product
    WHERE id = product_id AND is_active = TRUE;
    
    RETURN available_stock >= requested_quantity;
END;
$$ LANGUAGE plpgsql;
```

### Get Customer Order History

```sql
CREATE OR REPLACE FUNCTION get_customer_order_history(customer_id INTEGER)
RETURNS TABLE (
    order_id INTEGER,
    order_date TIMESTAMP,
    status VARCHAR(20),
    total DECIMAL(10, 2),
    item_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        o.id,
        o.created_at,
        o.status,
        o.total,
        COUNT(oi.id)
    FROM orders_order o
    LEFT JOIN orders_orderitem oi ON o.id = oi.order_id
    WHERE o.user_id = customer_id
    GROUP BY o.id, o.created_at, o.status, o.total
    ORDER BY o.created_at DESC;
END;
$$ LANGUAGE plpgsql;
```

---

**End of Presentation**

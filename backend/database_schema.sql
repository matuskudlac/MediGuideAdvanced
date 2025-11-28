-- MediGuide Database Schema - PostgreSQL/PL/pgSQL
-- Advanced Database Course Project
-- This file contains triggers, cursors, and stored procedures

-- ============================================
-- TRIGGERS (Course Requirement)
-- ============================================

-- 1. Trigger: Auto-update inventory when order is placed
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

-- Attach trigger to orders_orderitem table
-- Note: This will be created after Django migrations
-- DROP TRIGGER IF EXISTS trigger_update_inventory ON orders_orderitem;
-- CREATE TRIGGER trigger_update_inventory
--     AFTER INSERT ON orders_orderitem
--     FOR EACH ROW
--     EXECUTE FUNCTION update_inventory_on_order();


-- 2. Trigger: Restore inventory when order is cancelled
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

-- DROP TRIGGER IF EXISTS trigger_restore_inventory ON orders_order;
-- CREATE TRIGGER trigger_restore_inventory
--     AFTER UPDATE ON orders_order
--     FOR EACH ROW
--     EXECUTE FUNCTION restore_inventory_on_cancel();


-- 3. Trigger: Audit log for price changes
CREATE TABLE IF NOT EXISTS products_price_audit (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL,
    old_price DECIMAL(10, 2),
    new_price DECIMAL(10, 2),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    changed_by VARCHAR(150)
);

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

-- DROP TRIGGER IF EXISTS trigger_log_price_change ON products_product;
-- CREATE TRIGGER trigger_log_price_change
--     AFTER UPDATE ON products_product
--     FOR EACH ROW
--     EXECUTE FUNCTION log_price_change();


-- ============================================
-- STORED PROCEDURES WITH CURSORS (Course Requirement)
-- ============================================

-- 1. Procedure: Generate low stock report using cursor
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

-- Usage: SELECT * FROM generate_low_stock_report();


-- 2. Procedure: Calculate monthly sales using cursor
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

-- Usage: SELECT * FROM calculate_monthly_sales(11, 2024);


-- 3. Procedure: Batch update product prices by category
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
        
        -- Update product price
        UPDATE products_product
        SET price = new_price
        WHERE id = product_record.id;
        
        updated_count := updated_count + 1;
    END LOOP;
    
    CLOSE product_cursor;
    
    RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

-- Usage: SELECT batch_update_prices_by_category(1, 10.0); -- Increase prices by 10%


-- ============================================
-- ADDITIONAL USEFUL FUNCTIONS
-- ============================================

-- Function: Get customer order history
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


-- Function: Check product availability
CREATE OR REPLACE FUNCTION check_product_availability(product_id INTEGER, requested_quantity INTEGER)
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


-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Note: Django creates some indexes automatically, but these are additional ones

-- CREATE INDEX IF NOT EXISTS idx_product_stock ON products_product(stock_quantity) WHERE is_active = TRUE;
-- CREATE INDEX IF NOT EXISTS idx_order_status_date ON orders_order(status, created_at);
-- CREATE INDEX IF NOT EXISTS idx_orderitem_product ON orders_orderitem(product_id);


-- ============================================
-- NOTES FOR IMPLEMENTATION
-- ============================================

-- 1. Run Django migrations first: python manage.py migrate
-- 2. Then execute this SQL file in your PostgreSQL database
-- 3. Uncomment the CREATE TRIGGER statements after tables are created
-- 4. Test triggers and procedures with sample data
-- 5. The trigger functions demonstrate:
--    - Inventory management automation
--    - Data integrity enforcement
--    - Audit logging
-- 6. The cursor procedures demonstrate:
--    - Batch processing
--    - Complex reporting
--    - Data aggregation

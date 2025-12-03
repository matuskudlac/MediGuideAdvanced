"""
Deploy Database Triggers and Stored Procedures to PostgreSQL

This script executes the database_schema.sql file to create:
- Trigger functions
- Triggers
- Stored procedures with cursors
- Audit tables
"""

import os
import psycopg2
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def deploy_database_schema():
    """Deploy the database schema including triggers and procedures"""
    
    # Get database URL from environment
    database_url = os.getenv('DATABASE_URL')
    
    if not database_url:
        print("❌ ERROR: DATABASE_URL not found in .env file")
        return False
    
    try:
        # Connect to database
        print("🔌 Connecting to database...")
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor()
        
        # Read the SQL file
        sql_file_path = os.path.join(os.path.dirname(__file__), 'database_schema.sql')
        print(f"📖 Reading SQL file: {sql_file_path}")
        
        with open(sql_file_path, 'r', encoding='utf-8') as f:
            sql_content = f.read()
        
        # Execute the SQL
        print("⚙️  Executing SQL statements...")
        cursor.execute(sql_content)
        conn.commit()
        
        print("✅ Database schema deployed successfully!")
        
        # Verify triggers were created
        print("\n🔍 Verifying triggers...")
        cursor.execute("""
            SELECT trigger_name, event_object_table, action_timing, event_manipulation
            FROM information_schema.triggers
            WHERE trigger_schema = 'public'
            AND trigger_name LIKE 'trigger_%'
            ORDER BY trigger_name;
        """)
        
        triggers = cursor.fetchall()
        if triggers:
            print(f"✅ Found {len(triggers)} triggers:")
            for trigger in triggers:
                print(f"   - {trigger[0]} on {trigger[1]} ({trigger[2]} {trigger[3]})")
        else:
            print("⚠️  No triggers found")
        
        # Verify stored procedures
        print("\n🔍 Verifying stored procedures...")
        cursor.execute("""
            SELECT routine_name, routine_type
            FROM information_schema.routines
            WHERE routine_schema = 'public'
            AND routine_type = 'FUNCTION'
            AND routine_name IN (
                'update_inventory_on_order',
                'restore_inventory_on_cancel',
                'log_price_change',
                'generate_low_stock_report',
                'calculate_monthly_sales',
                'batch_update_prices_by_category',
                'get_customer_order_history',
                'check_product_availability'
            )
            ORDER BY routine_name;
        """)
        
        procedures = cursor.fetchall()
        if procedures:
            print(f"✅ Found {len(procedures)} functions/procedures:")
            for proc in procedures:
                print(f"   - {proc[0]} ({proc[1]})")
        else:
            print("⚠️  No procedures found")
        
        # Check if audit table exists
        print("\n🔍 Verifying audit table...")
        cursor.execute("""
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
            AND table_name = 'products_price_audit';
        """)
        
        if cursor.fetchone():
            print("✅ products_price_audit table exists")
        else:
            print("⚠️  products_price_audit table not found")
        
        cursor.close()
        conn.close()
        
        print("\n✅ Deployment complete!")
        return True
        
    except psycopg2.Error as e:
        print(f"❌ Database error: {e}")
        return False
    except FileNotFoundError:
        print(f"❌ SQL file not found: {sql_file_path}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False


if __name__ == "__main__":
    print("=" * 60)
    print("MediGuide - Database Schema Deployment")
    print("=" * 60)
    print()
    
    success = deploy_database_schema()
    
    if success:
        print("\n" + "=" * 60)
        print("✅ All triggers and procedures are now active!")
        print("=" * 60)
        print("\nNext steps:")
        print("1. Test triggers by creating an order")
        print("2. Run test_triggers.py to verify functionality")
        print("3. Check inventory updates in the database")
    else:
        print("\n" + "=" * 60)
        print("❌ Deployment failed. Please check the errors above.")
        print("=" * 60)

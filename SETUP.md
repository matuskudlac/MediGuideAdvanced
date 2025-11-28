# MediGuide Setup Guide

## Prerequisites
- Python 3.10+ installed
- Node.js 16+ installed
- PostgreSQL database (Supabase account)

## Backend Setup

### 1. Navigate to backend directory
```bash
cd backend
```

### 2. Create and activate virtual environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure environment variables
1. Copy `.env.example` to `.env`:
   ```bash
   copy .env.example .env  # Windows
   cp .env.example .env    # macOS/Linux
   ```

2. Edit `.env` and fill in your Supabase credentials:
   - Get your Supabase project URL and keys from: https://app.supabase.com
   - Navigate to: Project Settings → API
   - Copy the following:
     - `SUPABASE_URL`: Project URL
     - `SUPABASE_KEY`: anon/public key
     - `DB_HOST`: Database host (Settings → Database → Connection string)
     - `DB_PASSWORD`: Your database password

### 5. Run migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. Create superuser (for admin panel)
```bash
python manage.py createsuperuser
```
Follow the prompts to create an admin account.

### 7. (Optional) Load database triggers and procedures
```bash
# Connect to your PostgreSQL database and run:
psql -h <DB_HOST> -U postgres -d postgres -f database_schema.sql
```

### 8. Run development server
```bash
python manage.py runserver
```

Backend will be available at: http://localhost:8000
Admin panel: http://localhost:8000/admin

---

## Frontend Setup

### 1. Navigate to frontend directory
```bash
cd frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. (Optional) Configure environment variables
```bash
copy .env.example .env  # Windows
cp .env.example .env    # macOS/Linux
```

### 4. Run development server
```bash
npm run dev
```

Frontend will be available at: http://localhost:5173

---

## Testing the Application

### 1. Access the admin panel
- Go to http://localhost:8000/admin
- Login with your superuser credentials
- Add some categories and products

### 2. Test the API
- Products API: http://localhost:8000/api/products/
- Categories API: http://localhost:8000/api/categories/
- Orders API: http://localhost:8000/api/orders/

### 3. Test the frontend
- Go to http://localhost:5173
- Browse products
- View product details

---

## Database Features (Course Requirements)

### Triggers
The database includes the following triggers:
1. **Inventory Update**: Automatically decreases stock when an order is placed
2. **Inventory Restore**: Restores stock when an order is cancelled
3. **Price Audit**: Logs all price changes

### Cursors & Stored Procedures
1. **Low Stock Report**: `SELECT * FROM generate_low_stock_report();`
2. **Monthly Sales**: `SELECT * FROM calculate_monthly_sales(11, 2024);`
3. **Batch Price Update**: `SELECT batch_update_prices_by_category(1, 10.0);`

To execute these in your database:
```bash
# Connect to PostgreSQL
psql -h <your-supabase-host> -U postgres -d postgres

# Run a procedure
SELECT * FROM generate_low_stock_report();
```

---

## Project Structure

```
mediguide/
├── backend/
│   ├── mediguide/          # Django project settings
│   ├── products/           # Products app (models, views, admin)
│   ├── orders/             # Orders app
│   ├── users/              # User profiles
│   ├── database_schema.sql # Triggers & procedures
│   └── manage.py
│
└── frontend/
    ├── src/
    │   ├── api/            # API client
    │   ├── components/     # React components
    │   ├── pages/          # Page components
    │   └── App.jsx
    └── package.json
```

---

## Common Issues

### Backend won't start
- Make sure virtual environment is activated
- Check that all dependencies are installed: `pip install -r requirements.txt`
- Verify database credentials in `.env`

### Frontend won't start
- Delete `node_modules` and run `npm install` again
- Check that backend is running on port 8000

### CORS errors
- Make sure `django-cors-headers` is installed
- Check that frontend URL is in `CORS_ALLOWED_ORIGINS` in settings.py

---

## Next Steps

1. **Add sample data** via admin panel
2. **Implement cart functionality** (currently placeholder)
3. **Add user authentication** (login/register)
4. **Integrate Google AI Studio** for AI assistant (optional)
5. **Deploy to production** (Render, Railway, or Vercel)

---

## Team Development Tips

- **Person 1**: Focus on database (triggers, procedures, sample data)
- **Person 2**: Focus on backend API and business logic
- **Person 3**: Focus on frontend UI and user experience

Use Git for version control and create branches for each feature!

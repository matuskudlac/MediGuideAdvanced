# MediGuide - Quick Reference Guide

## 🚀 Quick Start Commands

### Backend
```bash
cd backend
venv\Scripts\activate          # Activate virtual environment
python manage.py runserver     # Start server (http://localhost:8000)
python manage.py createsuperuser  # Create admin account
python manage.py shell < create_sample_data.py  # Load sample data
```

### Frontend
```bash
cd frontend
npm run dev                    # Start dev server (http://localhost:5173)
npm run build                  # Build for production
```

---

## 📁 Important Files

### Backend
- `backend/mediguide/settings.py` - Django configuration
- `backend/mediguide/urls.py` - URL routing
- `backend/products/models.py` - Product models
- `backend/orders/models.py` - Order models
- `backend/database_schema.sql` - Triggers & procedures
- `backend/.env` - Environment variables (create from .env.example)

### Frontend
- `frontend/src/App.jsx` - Main app component
- `frontend/src/api/client.js` - API configuration
- `frontend/src/pages/` - Page components
- `frontend/.env` - Environment variables (optional)

---

## 🔗 Important URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000/api/
- **Admin Panel**: http://localhost:8000/admin
- **API Products**: http://localhost:8000/api/products/
- **API Categories**: http://localhost:8000/api/categories/
- **API Orders**: http://localhost:8000/api/orders/

---

## 🗄️ Database Commands

### Django Migrations
```bash
python manage.py makemigrations  # Create migration files
python manage.py migrate         # Apply migrations
python manage.py showmigrations  # Show migration status
```

### PostgreSQL (Supabase)
```bash
# Connect to database
psql -h <supabase-host> -U postgres -d postgres

# Run triggers/procedures
\i database_schema.sql

# Test procedures
SELECT * FROM generate_low_stock_report();
SELECT * FROM calculate_monthly_sales(11, 2024);
SELECT batch_update_prices_by_category(1, 10.0);
```

---

## 🎨 Admin Panel Quick Guide

### Access
1. Go to http://localhost:8000/admin
2. Login with superuser credentials
3. Navigate to Products, Orders, or Users

### Adding Products
1. Click "Products" → "Add Product"
2. Fill in required fields:
   - Name
   - Description
   - Category
   - Price
   - Stock Quantity
3. Optional: Add image, dosage, manufacturer
4. Check "Requires prescription" if needed
5. Save

### Managing Orders
1. Click "Orders" → View list
2. Click order to see details
3. Use actions dropdown to:
   - Mark as Processing
   - Mark as Shipped
   - Mark as Delivered

---

## 🔧 Common Tasks

### Add New API Endpoint
1. Create serializer in `serializers.py`
2. Create viewset in `views.py`
3. Register in `urls.py` router
4. Test at http://localhost:8000/api/

### Add New React Page
1. Create component in `src/pages/`
2. Add route in `App.jsx`
3. Add navigation link in `Navbar.jsx`

### Update Database Schema
1. Modify models in `models.py`
2. Run `python manage.py makemigrations`
3. Run `python manage.py migrate`
4. Update admin.py if needed

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if virtual environment is activated
venv\Scripts\activate

# Reinstall dependencies
pip install -r requirements.txt

# Check database connection
python manage.py check
```

### Frontend won't start
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install

# Check if backend is running
curl http://localhost:8000/api/products/
```

### CORS errors
- Verify `CORS_ALLOWED_ORIGINS` in `settings.py`
- Make sure frontend URL is included
- Check that `corsheaders` is in `INSTALLED_APPS`

### Database errors
- Check `.env` file has correct credentials
- Verify Supabase database is running
- Test connection: `python manage.py dbshell`

---

## 📊 Database Schema Quick Reference

### Main Models
```
Category
├── id
├── name
└── description

Product
├── id
├── name
├── description
├── category (FK)
├── price
├── stock_quantity
├── dosage
└── requires_prescription

Order
├── id
├── user (FK)
├── status
├── shipping_address
└── total

OrderItem
├── id
├── order (FK)
├── product (FK)
├── quantity
└── price
```

---

## 🧪 Testing Checklist

### Backend
- [ ] Admin panel accessible
- [ ] Can create products
- [ ] Can create orders
- [ ] API returns products
- [ ] Triggers working (check inventory after order)

### Frontend
- [ ] Home page loads
- [ ] Products page shows items
- [ ] Product detail page works
- [ ] Navigation works
- [ ] Styling looks good

### Database
- [ ] Migrations applied
- [ ] Sample data loaded
- [ ] Triggers created
- [ ] Procedures working

---

## 📝 Git Workflow

```bash
# Clone repository
git clone <repo-url>

# Create feature branch
git checkout -b feature/your-feature

# Make changes and commit
git add .
git commit -m "Add feature description"

# Push to remote
git push origin feature/your-feature

# Create pull request on GitHub
```

---

## 🎯 Project Milestones

### Week 1
- [x] Project setup
- [x] Django models
- [x] React components
- [ ] Supabase configuration
- [ ] Sample data

### Before Submission
- [ ] All triggers working
- [ ] All procedures tested
- [ ] Frontend fully functional
- [ ] Admin panel configured
- [ ] Documentation complete
- [ ] Code commented
- [ ] Presentation ready

---

## 📞 Team Contacts

**Person 1 (Database)**
- Responsibilities: Database schema, triggers, procedures
- Files: `database_schema.sql`, models

**Person 2 (Backend)**
- Responsibilities: Django API, business logic
- Files: `views.py`, `serializers.py`, `urls.py`

**Person 3 (Frontend)**
- Responsibilities: React UI, styling
- Files: `src/pages/`, `src/components/`, CSS files

---

## 🎓 Course Requirements Checklist

- [x] PostgreSQL database
- [x] PL/pgSQL usage
- [x] Triggers (minimum 1) - We have 3
- [x] Cursors (minimum 1) - We have 3
- [x] Stored procedures
- [x] Frontend interface
- [x] Backend implementation
- [ ] Working demonstration
- [ ] Documentation

---

## 📚 Useful Resources

- Django Docs: https://docs.djangoproject.com/
- DRF Tutorial: https://www.django-rest-framework.org/tutorial/quickstart/
- React Docs: https://react.dev/
- PostgreSQL PL/pgSQL: https://www.postgresql.org/docs/current/plpgsql.html
- Supabase Docs: https://supabase.com/docs

---

## 💡 Tips

1. **Test frequently**: Run both servers and test after each change
2. **Use admin panel**: Easiest way to add/edit data during development
3. **Check browser console**: For frontend errors
4. **Check terminal**: For backend errors
5. **Commit often**: Small, frequent commits are better
6. **Ask for help**: Don't spend hours stuck on one issue

---

Good luck with your project! 🚀

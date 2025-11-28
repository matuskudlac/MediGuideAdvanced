# MediGuide - Project Summary

## Overview
MediGuide is a modern online pharmacy platform built for the CSCI 3331 Advanced Database course project. The application demonstrates advanced database concepts including triggers, cursors, and stored procedures using PostgreSQL.

## Tech Stack

### Backend
- **Framework**: Django 5.0.1
- **API**: Django REST Framework 3.14
- **Database**: PostgreSQL (via Supabase)
- **Language**: Python 3.13

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Styling**: Vanilla CSS with modern design

### Database
- **DBMS**: PostgreSQL 
- **Hosting**: Supabase
- **Features**: Triggers, Cursors, PL/pgSQL Functions

## Key Features

### 1. Product Management
- Product catalog with categories
- Inventory tracking
- Stock level monitoring
- Prescription requirements
- Image uploads

### 2. Order Management
- Shopping cart (to be implemented)
- Order placement and tracking
- Order status updates
- Shipping information

### 3. Admin Panel
- Django Admin interface
- Product management
- Order management
- User management
- Inventory control

### 4. Database Features (Course Requirements)

#### Triggers
1. **Inventory Update Trigger**: Automatically decreases product stock when an order is placed
2. **Inventory Restore Trigger**: Restores stock when an order is cancelled
3. **Price Audit Trigger**: Logs all price changes to an audit table

#### Stored Procedures with Cursors
1. **Low Stock Report**: Generates a report of products below their stock threshold
2. **Monthly Sales Analysis**: Calculates sales statistics for a given month
3. **Batch Price Update**: Updates prices for all products in a category

## Project Structure

```
mediguide/
├── backend/
│   ├── mediguide/              # Django project
│   │   ├── settings.py         # Configuration
│   │   └── urls.py             # URL routing
│   ├── products/               # Products app
│   │   ├── models.py           # Product & Category models
│   │   ├── admin.py            # Admin configuration
│   │   ├── views.py            # API views
│   │   └── serializers.py      # DRF serializers
│   ├── orders/                 # Orders app
│   │   ├── models.py           # Order & OrderItem models
│   │   ├── admin.py            # Admin configuration
│   │   ├── views.py            # API views
│   │   └── serializers.py      # DRF serializers
│   ├── users/                  # User profiles
│   │   ├── models.py           # UserProfile model
│   │   └── admin.py            # Admin configuration
│   ├── database_schema.sql     # Triggers & procedures
│   ├── requirements.txt        # Python dependencies
│   └── manage.py               # Django CLI
│
├── frontend/
│   ├── src/
│   │   ├── api/                # API client
│   │   │   └── client.js       # Axios configuration
│   │   ├── components/         # React components
│   │   │   └── Navbar.jsx      # Navigation bar
│   │   ├── pages/              # Page components
│   │   │   ├── Home.jsx        # Landing page
│   │   │   ├── Products.jsx    # Product listing
│   │   │   ├── ProductDetail.jsx
│   │   │   └── Cart.jsx        # Shopping cart
│   │   ├── App.jsx             # Main app component
│   │   └── main.jsx            # Entry point
│   ├── package.json            # Node dependencies
│   └── vite.config.js          # Vite configuration
│
├── README.md                   # Project overview
└── SETUP.md                    # Setup instructions
```

## API Endpoints

### Products
- `GET /api/products/` - List all products
- `GET /api/products/{id}/` - Get product details
- `GET /api/categories/` - List all categories

### Orders
- `GET /api/orders/` - List user's orders
- `POST /api/orders/` - Create new order
- `GET /api/orders/{id}/` - Get order details

## Database Schema

### Main Tables
1. **products_category**: Product categories
2. **products_product**: Products/medications
3. **orders_order**: Customer orders
4. **orders_orderitem**: Individual items in orders
5. **users_userprofile**: Extended user information
6. **products_price_audit**: Price change audit log

### Relationships
- Product → Category (Many-to-One)
- Order → User (Many-to-One)
- OrderItem → Order (Many-to-One)
- OrderItem → Product (Many-to-One)
- UserProfile → User (One-to-One)

## Course Requirements Checklist

- [x] PostgreSQL database
- [x] PL/pgSQL usage
- [x] Triggers (3 implemented)
- [x] Cursors (3 procedures with cursors)
- [x] Stored procedures/functions
- [x] Frontend interface (React)
- [x] Backend API (Django REST Framework)
- [x] Admin panel (Django Admin)
- [ ] AI Assistant (Optional - Google AI Studio)

## Development Timeline (1 Week)

### Day 1-2: Setup & Database
- [x] Project structure
- [x] Django models
- [x] Database schema
- [x] Triggers and procedures
- [ ] Supabase configuration
- [ ] Sample data

### Day 3-4: Backend API
- [x] REST API endpoints
- [x] Serializers
- [x] Admin panel configuration
- [ ] Testing API endpoints

### Day 5-6: Frontend
- [x] React components
- [x] Page layouts
- [x] API integration
- [ ] Cart functionality
- [ ] User authentication

### Day 7: Testing & Documentation
- [ ] End-to-end testing
- [ ] Documentation
- [ ] Presentation preparation
- [ ] Deployment (optional)

## Team Responsibilities

### Person 1: Database & Backend
- Set up Supabase database
- Create triggers and stored procedures
- Add sample data
- Test database functions

### Person 2: Backend API & Logic
- Configure Django settings
- Implement API endpoints
- Set up admin panel
- Business logic implementation

### Person 3: Frontend Development
- Build React components
- Implement UI/UX
- API integration
- Styling and responsiveness

## Future Enhancements

1. **User Authentication**: Login/Register functionality
2. **Shopping Cart**: Full cart implementation with localStorage
3. **Payment Integration**: Stripe or PayPal
4. **AI Assistant**: Google AI Studio integration for drug information
5. **Search & Filters**: Advanced product search
6. **Reviews & Ratings**: Customer feedback system
7. **Email Notifications**: Order confirmations
8. **Mobile App**: React Native version

## Resources

- **Django Docs**: https://docs.djangoproject.com/
- **DRF Docs**: https://www.django-rest-framework.org/
- **React Docs**: https://react.dev/
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **Supabase Docs**: https://supabase.com/docs

## License
Educational project for CSCI 3331 - Advanced Database Systems

# MediGuide - Online Drug Store with AI Assistant

A modern online pharmacy platform with an intelligent AI assistant, built with React, Django, and PostgreSQL.

## Tech Stack

- **Frontend**: React with Vite, Nginx (production)
- **Backend**: Django + Django REST Framework
- **Database**: PostgreSQL (Supabase)
- **Payment Processing**: Stripe
- **Deployment**: Docker & Docker Compose
- **Admin Panel**: Django Admin
- **AI**: Google AI Studio / Gemini API (optional)

## Project Structure

```
mediguide/
├── backend/              # Django REST API
│   ├── mediguide/        # Django project settings
│   ├── products/         # Products app
│   ├── orders/           # Orders app
│   ├── users/            # User management
│   ├── Dockerfile        # Backend Docker configuration
│   └── requirements.txt
│
├── frontend/             # React application
│   ├── src/
│   ├── public/
│   ├── Dockerfile        # Frontend Docker configuration
│   ├── nginx.conf        # Nginx configuration
│   └── package.json
│
└── docker-compose.yml    # Docker orchestration
```

## Quick Start with Docker (Recommended)

### Prerequisites
- Docker Desktop installed
- Supabase account with database credentials
- Stripe account (for payment processing)

### Environment Setup

1. **Root `.env` file** (for Docker Compose):
   ```env
   VITE_API_URL=http://localhost:8000
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

2. **Backend `.env` file** (`backend/.env`):
   ```env
   DATABASE_URL=your_supabase_connection_string
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   GOOGLE_API_KEY=your_google_ai_key (optional)
   ```

3. **Frontend `.env.production` file** (`frontend/.env.production`):
   ```env
   VITE_API_URL=http://localhost:8000
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

### Running with Docker

```bash
# Build and start all services
docker-compose up --build

# Run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Access the application:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Admin Panel**: http://localhost:8000/admin

## Development Setup (Without Docker)

### Backend Setup

1. **Create virtual environment**:
   ```bash
   cd backend
   python -m venv venv
   venv\Scripts\activate  # Windows
   source venv/bin/activate  # Linux/Mac
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment variables**:
   - Copy `.env.example` to `.env`
   - Fill in your Supabase credentials
   - Add Stripe API keys
   - Add Google AI API key (optional)

4. **Run migrations**:
   ```bash
   python manage.py migrate
   ```

5. **Create superuser**:
   ```bash
   python manage.py createsuperuser
   ```

6. **Run development server**:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. **Install dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment**:
   - Create `.env.local` file
   - Add `VITE_API_URL=http://localhost:8000`
   - Add `VITE_STRIPE_PUBLISHABLE_KEY=your_key`

3. **Run development server**:
   ```bash
   npm run dev
   ```

## Features

- 🛒 **Product Catalog**: Browse 20+ pharmaceutical products with detailed information
- 🔍 **Search & Filter**: Find products by name, category, or active ingredients
- 🛍️ **Shopping Cart**: Add products to cart with quick "Add to Cart" buttons
- 💳 **Stripe Checkout**: Secure payment processing with Stripe
- 👤 **User Authentication**: Register, login, and manage user profiles
- 📦 **Order Management**: Track order history and status
- 🤖 **AI Assistant**: Get drug information and recommendations (optional)
- 🔐 **Admin Panel**: Manage inventory, orders, and users
- 📊 **Database Triggers**: Automatic inventory updates and audit logging
- 🐳 **Docker Support**: Easy deployment with Docker Compose

## Database Features (Course Requirements)

### Triggers
1. **Auto-update inventory**: Decreases stock when orders are placed
2. **Restore inventory**: Restores stock when orders are cancelled
3. **Price change audit**: Logs all product price changes

### Stored Procedures with Cursors
1. **Low stock report**: Generate reports for products below threshold
2. **Monthly sales**: Calculate sales statistics by month
3. **Batch price updates**: Update prices by category with percentage change

### Additional Functions
- Customer order history retrieval
- Product availability checking
- Complex sales analytics

See `backend/database_schema.sql` for complete implementation.

## API Endpoints

- `GET /api/products/` - List all products
- `GET /api/products/{id}/` - Product details
- `POST /api/orders/` - Create order
- `POST /api/orders/create-payment-intent/` - Create Stripe payment
- `GET /api/orders/` - List user orders

## Development URLs

- **Frontend**: http://localhost:5173 (dev) / http://localhost:3000 (Docker)
- **Backend API**: http://localhost:8000
- **Admin Panel**: http://localhost:8000/admin
- **API Documentation**: http://localhost:8000/api/

## Production Deployment

The application is containerized and ready for deployment:

1. Update environment variables for production
2. Configure your domain in `frontend/nginx.conf`
3. Use `docker-compose up -d` to deploy
4. Set up SSL certificates (recommended: Let's Encrypt)

## Team

Group project for CSCI 3331 - Advanced Database Systems  
Fairleigh Dickinson University

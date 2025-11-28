# MediGuide - Online Drug Store with AI Assistant

A modern online pharmacy platform with an intelligent AI assistant, built with React, Django, and PostgreSQL.

## Tech Stack

- **Frontend**: React with Vite
- **Backend**: Django + Django REST Framework
- **Database**: PostgreSQL (Supabase)
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
│   └── requirements.txt
│
└── frontend/             # React application
    ├── src/
    ├── public/
    └── package.json
```

## Setup Instructions

### Backend Setup

1. **Create virtual environment**:
   ```bash
   cd backend
   python -m venv venv
   venv\Scripts\activate  # Windows
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment variables**:
   - Copy `.env.example` to `.env`
   - Fill in your Supabase credentials
   - Add your Google AI API key (optional)

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

2. **Run development server**:
   ```bash
   npm run dev
   ```

## Features

- 🛒 Product catalog and search
- 🛍️ Shopping cart and checkout
- 👤 User authentication and profiles
- 📦 Order management
- 🤖 AI assistant for drug information (optional)
- 🔐 Admin panel for inventory management
- 📊 Database triggers and stored procedures

## Database Features (Course Requirements)

- **Triggers**: Automatic inventory updates, order status tracking
- **Cursors**: Batch processing, complex queries
- **PL/pgSQL Functions**: Business logic in database layer

## Development

- Backend API: http://localhost:8000
- Frontend: http://localhost:5173
- Admin Panel: http://localhost:8000/admin

## Team

Group project for CSCI 3331 - Advanced Database Systems

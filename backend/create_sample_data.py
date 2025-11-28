"""
Sample data script for MediGuide
Run this after migrations to populate the database with sample products
Usage: python manage.py shell < create_sample_data.py
"""

from products.models import Category, Product
from django.contrib.auth.models import User

# Create categories
categories_data = [
    {"name": "Pain Relief", "description": "Medications for pain management"},
    {"name": "Vitamins & Supplements", "description": "Nutritional supplements and vitamins"},
    {"name": "Cold & Flu", "description": "Medications for cold and flu symptoms"},
    {"name": "Digestive Health", "description": "Medications for digestive issues"},
    {"name": "Allergy Relief", "description": "Antihistamines and allergy medications"},
    {"name": "First Aid", "description": "First aid supplies and topical treatments"},
]

print("Creating categories...")
for cat_data in categories_data:
    category, created = Category.objects.get_or_create(
        name=cat_data["name"],
        defaults={"description": cat_data["description"]}
    )
    if created:
        print(f"✓ Created category: {category.name}")
    else:
        print(f"- Category already exists: {category.name}")

# Create sample products
products_data = [
    # Pain Relief
    {
        "name": "Ibuprofen",
        "description": "Nonsteroidal anti-inflammatory drug (NSAID) used to reduce fever and treat pain or inflammation.",
        "category": "Pain Relief",
        "price": 8.99,
        "stock_quantity": 150,
        "manufacturer": "Generic Pharma",
        "dosage": "200mg",
        "requires_prescription": False,
    },
    {
        "name": "Acetaminophen",
        "description": "Pain reliever and fever reducer. Commonly used for headaches, muscle aches, and arthritis.",
        "category": "Pain Relief",
        "price": 7.49,
        "stock_quantity": 200,
        "manufacturer": "HealthCare Inc",
        "dosage": "500mg",
        "requires_prescription": False,
    },
    {
        "name": "Aspirin",
        "description": "Used to reduce pain, fever, or inflammation. Also used to prevent heart attacks.",
        "category": "Pain Relief",
        "price": 6.99,
        "stock_quantity": 180,
        "manufacturer": "MediCare",
        "dosage": "325mg",
        "requires_prescription": False,
    },
    
    # Vitamins & Supplements
    {
        "name": "Vitamin D3",
        "description": "Supports bone health, immune function, and overall wellness.",
        "category": "Vitamins & Supplements",
        "price": 12.99,
        "stock_quantity": 100,
        "manufacturer": "VitaHealth",
        "dosage": "2000 IU",
        "requires_prescription": False,
    },
    {
        "name": "Multivitamin",
        "description": "Complete daily multivitamin with essential vitamins and minerals.",
        "category": "Vitamins & Supplements",
        "price": 15.99,
        "stock_quantity": 120,
        "manufacturer": "NutriPlus",
        "dosage": "Daily",
        "requires_prescription": False,
    },
    {
        "name": "Omega-3 Fish Oil",
        "description": "Supports heart health, brain function, and reduces inflammation.",
        "category": "Vitamins & Supplements",
        "price": 18.99,
        "stock_quantity": 80,
        "manufacturer": "OceanHealth",
        "dosage": "1000mg",
        "requires_prescription": False,
    },
    
    # Cold & Flu
    {
        "name": "DayQuil",
        "description": "Non-drowsy cold and flu relief for daytime use.",
        "category": "Cold & Flu",
        "price": 11.99,
        "stock_quantity": 90,
        "manufacturer": "Vicks",
        "dosage": "Liquid",
        "requires_prescription": False,
    },
    {
        "name": "NyQuil",
        "description": "Nighttime cold and flu relief that helps you sleep.",
        "category": "Cold & Flu",
        "price": 11.99,
        "stock_quantity": 85,
        "manufacturer": "Vicks",
        "dosage": "Liquid",
        "requires_prescription": False,
    },
    {
        "name": "Cough Syrup",
        "description": "Relieves cough and chest congestion.",
        "category": "Cold & Flu",
        "price": 9.49,
        "stock_quantity": 110,
        "manufacturer": "Robitussin",
        "dosage": "100ml",
        "requires_prescription": False,
    },
    
    # Digestive Health
    {
        "name": "Pepto-Bismol",
        "description": "Relieves heartburn, indigestion, nausea, and upset stomach.",
        "category": "Digestive Health",
        "price": 10.49,
        "stock_quantity": 70,
        "manufacturer": "Procter & Gamble",
        "dosage": "Liquid",
        "requires_prescription": False,
    },
    {
        "name": "Probiotics",
        "description": "Supports digestive health and immune system.",
        "category": "Digestive Health",
        "price": 24.99,
        "stock_quantity": 60,
        "manufacturer": "BioHealth",
        "dosage": "30 capsules",
        "requires_prescription": False,
    },
    
    # Allergy Relief
    {
        "name": "Claritin",
        "description": "24-hour non-drowsy allergy relief.",
        "category": "Allergy Relief",
        "price": 16.99,
        "stock_quantity": 95,
        "manufacturer": "Bayer",
        "dosage": "10mg",
        "requires_prescription": False,
    },
    {
        "name": "Zyrtec",
        "description": "Fast-acting allergy relief for indoor and outdoor allergies.",
        "category": "Allergy Relief",
        "price": 17.99,
        "stock_quantity": 88,
        "manufacturer": "Johnson & Johnson",
        "dosage": "10mg",
        "requires_prescription": False,
    },
    
    # First Aid
    {
        "name": "Neosporin",
        "description": "Antibiotic ointment for minor cuts, scrapes, and burns.",
        "category": "First Aid",
        "price": 7.99,
        "stock_quantity": 130,
        "manufacturer": "Johnson & Johnson",
        "dosage": "1oz",
        "requires_prescription": False,
    },
    {
        "name": "Band-Aids Variety Pack",
        "description": "Assorted adhesive bandages for wound care.",
        "category": "First Aid",
        "price": 5.99,
        "stock_quantity": 200,
        "manufacturer": "Band-Aid",
        "dosage": "50 count",
        "requires_prescription": False,
    },
    
    # Prescription medications (examples)
    {
        "name": "Amoxicillin",
        "description": "Antibiotic used to treat bacterial infections.",
        "category": "Pain Relief",  # You might want a "Prescription" category
        "price": 12.99,
        "stock_quantity": 50,
        "manufacturer": "Generic Pharma",
        "dosage": "500mg",
        "requires_prescription": True,
    },
]

print("\nCreating products...")
for prod_data in products_data:
    category = Category.objects.get(name=prod_data["category"])
    product, created = Product.objects.get_or_create(
        name=prod_data["name"],
        defaults={
            "description": prod_data["description"],
            "category": category,
            "price": prod_data["price"],
            "stock_quantity": prod_data["stock_quantity"],
            "manufacturer": prod_data["manufacturer"],
            "dosage": prod_data["dosage"],
            "requires_prescription": prod_data["requires_prescription"],
            "is_active": True,
        }
    )
    if created:
        print(f"✓ Created product: {product.name} ({product.dosage})")
    else:
        print(f"- Product already exists: {product.name}")

print("\n✅ Sample data creation complete!")
print(f"Total categories: {Category.objects.count()}")
print(f"Total products: {Product.objects.count()}")

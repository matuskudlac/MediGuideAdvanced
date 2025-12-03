import os
import django
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mediguide.settings')
django.setup()

from products.models import Product

total = Product.objects.count()
active = Product.objects.filter(is_active=True).count()
print(f"Total products: {total}")
print(f"Active products: {active}")
print(f"Page size setting: {settings.REST_FRAMEWORK['PAGE_SIZE']}")

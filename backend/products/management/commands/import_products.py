import csv
from django.core.management.base import BaseCommand
from products.models import Category, Product


# Category mapping from Category_ID to category name
CATEGORY_MAP = {
    '1': 'Pain Relief',
    '2': 'Cold & Flu',
    '3': 'Vitamins & Supplements',
    '4': 'Sleep Aid',
    '5': 'Allergy Relief',
    '6': 'Digestive Health',
    '7': 'First Aid',
}


class Command(BaseCommand):
    help = 'Import products from CSV file'

    def add_arguments(self, parser):
        parser.add_argument('csv_file', type=str, help='Path to the CSV file')

    def handle(self, *args, **kwargs):
        csv_file = kwargs['csv_file']
        
        self.stdout.write(self.style.SUCCESS(f'Importing products from {csv_file}...'))
        
        imported_count = 0
        skipped_count = 0
        
        with open(csv_file, 'r', encoding='utf-8') as file:
            # Use DictReader to automatically map column names
            reader = csv.DictReader(file)
            
            for row in reader:
                try:
                    # Get category name from Category_ID
                    category_id = row.get('Category_ID', '1')
                    category_name = CATEGORY_MAP.get(category_id, 'General')
                    
                    # Get or create category
                    category, _ = Category.objects.get_or_create(
                        name=category_name,
                        defaults={'description': f'{category_name} products'}
                    )
                    
                    # Parse price (remove $ if present)
                    price_str = row.get('Price', '0').replace('$', '').strip()
                    price = float(price_str) if price_str else 0.0
                    
                    # Parse stock
                    stock = int(row.get('Stock', 0))
                    
                    # Parse is_active
                    is_active = row.get('is_active', 'TRUE').upper() == 'TRUE'
                    
                    # Extract size/dosage from Size column
                    size = row.get('Size', '')
                    
                    # Convert Imgur URL to direct image URL
                    image_url = row.get('Image_URL', '')
                    if image_url and 'imgur.com/' in image_url:
                        # Extract image ID from URL
                        image_id = image_url.split('/')[-1]
                        # Convert to direct image URL
                        image_url = f'https://i.imgur.com/{image_id}.jpg'
                    
                    # Create or update product using Name as unique identifier
                    product, created = Product.objects.update_or_create(
                        name=row['Name'],
                        defaults={
                            'description': row.get('Description', ''),
                            'category': category,
                            'price': price,
                            'stock_quantity': stock,
                            'low_stock_threshold': 10,  # Default threshold
                            'manufacturer': row.get('Brand', ''),
                            'dosage': size,
                            'requires_prescription': False,  # None in your CSV require prescription
                            'is_active': is_active,
                            'image': image_url,  # Store converted direct image URL
                        }
                    )
                    
                    if created:
                        imported_count += 1
                        self.stdout.write(f'✓ Created: {product.name} (${product.price})')
                    else:
                        imported_count += 1
                        self.stdout.write(f'↻ Updated: {product.name} (${product.price})')
                        
                except Exception as e:
                    skipped_count += 1
                    self.stdout.write(self.style.ERROR(f'✗ Error importing {row.get("Name", "unknown")}: {str(e)}'))
        
        self.stdout.write(self.style.SUCCESS(f'\n✅ Import complete!'))
        self.stdout.write(f'Imported/Updated: {imported_count}')
        self.stdout.write(f'Skipped: {skipped_count}')
        self.stdout.write(f'Total categories: {Category.objects.count()}')
        self.stdout.write(f'Total products: {Product.objects.count()}')

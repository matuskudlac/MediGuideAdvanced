from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal


class Category(models.Model):
    """Product categories (e.g., Pain Relief, Vitamins, Prescription)"""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['name']

    def __str__(self):
        return self.name


class Product(models.Model):
    """Drug/Medicine products"""
    name = models.CharField(max_length=200)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    
    # Pricing
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal('0.01'))])
    
    # Inventory
    stock_quantity = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    low_stock_threshold = models.IntegerField(default=10, validators=[MinValueValidator(0)])
    
    # Product details
    manufacturer = models.CharField(max_length=200, blank=True)
    dosage = models.CharField(max_length=100, blank=True, help_text="e.g., 500mg, 10ml")
    requires_prescription = models.BooleanField(default=False)
    
    # Images
    image = models.URLField(max_length=500, blank=True, help_text="External image URL (e.g., Imgur)")
    
    # Status
    is_active = models.BooleanField(default=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['category']),
            models.Index(fields=['is_active']),
        ]

    def __str__(self):
        return f"{self.name} ({self.dosage})"

    @property
    def is_low_stock(self):
        """Check if product is low on stock"""
        return self.stock_quantity <= self.low_stock_threshold

    @property
    def is_in_stock(self):
        """Check if product is available"""
        return self.stock_quantity > 0

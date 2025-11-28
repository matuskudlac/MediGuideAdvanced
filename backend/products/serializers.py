from rest_framework import serializers
from .models import Category, Product


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'created_at']


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    is_low_stock = serializers.BooleanField(read_only=True)
    is_in_stock = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'category', 'category_name',
            'price', 'stock_quantity', 'low_stock_threshold',
            'manufacturer', 'dosage', 'requires_prescription',
            'image', 'is_active', 'is_low_stock', 'is_in_stock',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

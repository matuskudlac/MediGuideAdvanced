from rest_framework import serializers
from .models import Order, OrderItem
from products.serializers import ProductSerializer


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'quantity', 'price', 'subtotal']
        read_only_fields = ['subtotal']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'id', 'user', 'username', 'status',
            'shipping_address', 'shipping_city', 'shipping_state',
            'shipping_zip', 'shipping_phone',
            'subtotal', 'tax', 'shipping_cost', 'total',
            'notes', 'items', 'created_at', 'updated_at'
        ]
        read_only_fields = ['subtotal', 'tax', 'total', 'created_at', 'updated_at']

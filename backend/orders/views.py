from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import Order, OrderItem
from .serializers import OrderSerializer, OrderItemSerializer
from mediguide.stripe_utils import create_payment_intent
from decimal import Decimal


@api_view(['POST'])
@permission_classes([AllowAny])  # Allow unauthenticated users for now
def create_payment_intent_view(request):
    """
    Create a Stripe Payment Intent for checkout
    Expected request body:
    {
        "cart_items": [{"product_id": 1, "quantity": 2, "price": 10.99}, ...],
        "shipping_cost": 5.00
    }
    """
    try:
        cart_items = request.data.get('cart_items', [])
        shipping_cost = Decimal(str(request.data.get('shipping_cost', 0)))
        
        if not cart_items:
            return Response(
                {'error': 'Cart is empty'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Calculate totals
        subtotal = sum(Decimal(str(item['price'])) * item['quantity'] for item in cart_items)
        tax = subtotal * Decimal('0.08')  # 8% tax
        total = subtotal + tax + shipping_cost
        
        # Convert to cents for Stripe
        amount_cents = int(total * 100)
        
        # Create payment intent
        intent = create_payment_intent(
            amount=amount_cents,
            metadata={
                'subtotal': str(subtotal),
                'tax': str(tax),
                'shipping': str(shipping_cost),
                'total': str(total),
            }
        )
        
        return Response({
            'client_secret': intent.client_secret,
            'amount': amount_cents,
            'subtotal': float(subtotal),
            'tax': float(tax),
            'shipping': float(shipping_cost),
            'total': float(total),
        })
        
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


class OrderViewSet(viewsets.ModelViewSet):
    """
    API endpoint for orders
    """
    serializer_class = OrderSerializer
    permission_classes = [permissions.AllowAny]  # Temporarily allow any for testing
    
    def get_queryset(self):
        # Users can only see their own orders
        if self.request.user.is_authenticated:
            return Order.objects.filter(user=self.request.user).prefetch_related('items')
        return Order.objects.all()  # For testing, show all orders
    
    def perform_create(self, serializer):
        # Automatically set the user to the current user if authenticated
        # Otherwise use the user from request data
        if self.request.user.is_authenticated:
            serializer.save(user=self.request.user)
        else:
            serializer.save()

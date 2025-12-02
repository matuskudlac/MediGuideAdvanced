"""
Stripe configuration and helper functions
"""
import stripe
import os
from django.conf import settings

# Initialize Stripe with secret key
stripe.api_key = settings.STRIPE_SECRET_KEY

def create_payment_intent(amount, currency='usd', metadata=None):
    """
    Create a Stripe PaymentIntent
    
    Args:
        amount: Amount in cents (e.g., 1000 = $10.00)
        currency: Currency code (default: 'usd')
        metadata: Optional dict of metadata to attach to the payment
    
    Returns:
        PaymentIntent object
    """
    try:
        intent = stripe.PaymentIntent.create(
            amount=amount,
            currency=currency,
            metadata=metadata or {},
            automatic_payment_methods={'enabled': True},
        )
        return intent
    except stripe.error.StripeError as e:
        raise Exception(f"Stripe error: {str(e)}")

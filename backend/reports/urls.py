"""
URL configuration for reports app
"""

from django.urls import path
from .views import LowStockReportView, MonthlySalesReportView, BatchPriceUpdateView

urlpatterns = [
    path('low-stock/', LowStockReportView.as_view(), name='low-stock-report'),
    path('monthly-sales/', MonthlySalesReportView.as_view(), name='monthly-sales-report'),
    path('batch-price-update/', BatchPriceUpdateView.as_view(), name='batch-price-update'),
]

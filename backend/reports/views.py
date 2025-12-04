"""
Admin Reports API Views

This module provides API endpoints for executing stored procedures
and generating reports in various formats (JSON, CSV, PDF).
"""

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from rest_framework import status
from django.http import HttpResponse
from django.db import connection
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.units import inch
import csv
import io


class LowStockReportView(APIView):
    """
    Execute generate_low_stock_report() stored procedure
    Returns products with stock below threshold
    """
    permission_classes = [IsAdminUser]
    
    def get(self, request):
        format_type = request.query_params.get('report_format', 'json')
        
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT * FROM generate_low_stock_report();")
                columns = [col[0] for col in cursor.description]
                results = [dict(zip(columns, row)) for row in cursor.fetchall()]
            
            if format_type == 'csv':
                return self._generate_csv(results, columns, 'low_stock_report.csv')
            elif format_type == 'pdf':
                return self._generate_pdf(results, columns, 'Low Stock Report', 'low_stock_report.pdf')
            else:
                return Response({
                    'success': True,
                    'data': results,
                    'count': len(results)
                })
                
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def _generate_csv(self, data, columns, filename):
        """Generate CSV file from data"""
        output = io.StringIO()
        writer = csv.DictWriter(output, fieldnames=columns)
        writer.writeheader()
        writer.writerows(data)
        
        response = HttpResponse(output.getvalue(), content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        return response
    
    def _generate_pdf(self, data, columns, title, filename):
        """Generate PDF file from data"""
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter)
        elements = []
        
        # Title
        styles = getSampleStyleSheet()
        title_para = Paragraph(f"<b>{title}</b>", styles['Title'])
        elements.append(title_para)
        elements.append(Spacer(1, 0.3*inch))
        
        # Table data
        table_data = [columns]
        for row in data:
            table_data.append([str(row.get(col, '')) for col in columns])
        
        # Create table
        table = Table(table_data)
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        elements.append(table)
        doc.build(elements)
        
        buffer.seek(0)
        response = HttpResponse(buffer.getvalue(), content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        return response


class MonthlySalesReportView(APIView):
    """
    Execute calculate_monthly_sales(month, year) stored procedure
    Returns sales data for specified month
    """
    permission_classes = [IsAdminUser]
    
    def get(self, request):
        month = request.query_params.get('month')
        year = request.query_params.get('year')
        format_type = request.query_params.get('report_format', 'json')
        
        if not month or not year:
            return Response({
                'success': False,
                'error': 'Month and year parameters are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            month = int(month)
            year = int(year)
            
            if not (1 <= month <= 12):
                return Response({
                    'success': False,
                    'error': 'Month must be between 1 and 12'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            with connection.cursor() as cursor:
                cursor.execute(
                    "SELECT * FROM calculate_monthly_sales(%s, %s);",
                    [month, year]
                )
                columns = [col[0] for col in cursor.description]
                results = [dict(zip(columns, row)) for row in cursor.fetchall()]
            
            if format_type == 'csv':
                return self._generate_csv(results, columns, f'monthly_sales_{month}_{year}.csv')
            elif format_type == 'pdf':
                return self._generate_pdf(
                    results, columns,
                    f'Monthly Sales Report - {month}/{year}',
                    f'monthly_sales_{month}_{year}.pdf'
                )
            else:
                return Response({
                    'success': True,
                    'data': results,
                    'count': len(results),
                    'month': month,
                    'year': year
                })
                
        except ValueError:
            return Response({
                'success': False,
                'error': 'Invalid month or year format'
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def _generate_csv(self, data, columns, filename):
        """Generate CSV file from data"""
        output = io.StringIO()
        writer = csv.DictWriter(output, fieldnames=columns)
        writer.writeheader()
        writer.writerows(data)
        
        response = HttpResponse(output.getvalue(), content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        return response
    
    def _generate_pdf(self, data, columns, title, filename):
        """Generate PDF file from data"""
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter)
        elements = []
        
        # Title
        styles = getSampleStyleSheet()
        title_para = Paragraph(f"<b>{title}</b>", styles['Title'])
        elements.append(title_para)
        elements.append(Spacer(1, 0.3*inch))
        
        # Table data
        table_data = [columns]
        for row in data:
            table_data.append([str(row.get(col, '')) for col in columns])
        
        # Create table
        table = Table(table_data)
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        elements.append(table)
        doc.build(elements)
        
        buffer.seek(0)
        response = HttpResponse(buffer.getvalue(), content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        return response


class BatchPriceUpdateView(APIView):
    """
    Execute batch_update_prices_by_category(category_id, percentage) stored procedure
    Updates prices for all products in a category
    """
    permission_classes = [IsAdminUser]
    
    def post(self, request):
        category_id = request.data.get('category_id')
        percentage = request.data.get('percentage')
        
        if category_id is None or percentage is None:
            return Response({
                'success': False,
                'error': 'category_id and percentage are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            category_id = int(category_id)
            percentage = float(percentage)
            
            with connection.cursor() as cursor:
                cursor.execute(
                    "SELECT batch_update_prices_by_category(%s, %s);",
                    [category_id, percentage]
                )
                updated_count = cursor.fetchone()[0]
            
            return Response({
                'success': True,
                'updated_count': updated_count,
                'category_id': category_id,
                'percentage_change': percentage
            })
                
        except ValueError:
            return Response({
                'success': False,
                'error': 'Invalid category_id or percentage format'
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

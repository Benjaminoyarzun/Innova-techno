import json
import logging
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from django.conf import settings
from django.http import JsonResponse
from rest_framework import viewsets, generics
from .models import Producto, Categoria
from .serializers import ProductSerializer, CategorySerializer
from decimal import Decimal
import uuid

logger = logging.getLogger(__name__)

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategorySerializer

class ProductListView(generics.ListAPIView):
    queryset = Producto.objects.all()
    serializer_class = ProductSerializer

class CategoryListView(generics.ListAPIView):
    queryset = Categoria.objects.all()
    serializer_class = CategorySerializer


# ESTA ES LA PARTE FEA

@csrf_exempt
def send_purchase_email(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            customer_name = data.get('name')
            customer_email = data.get('email')
            customer_phone = data.get('phone')
            cart = data.get('cart')
            print(data)

            # Log received data for debugging
            logger.debug(f"Received data: {data}")

            # Check for missing required fields
            if not customer_name or not customer_email or not customer_phone or not cart:
                return JsonResponse({'error': 'Missing required fields'}, status=400)

            # Calculate total cost
            total_cost = sum( float(item['price']) * float(item['quantity']) for item in cart)

            # Construct email message
            message = f"Customer Name: {customer_name}\nCustomer Email: {customer_email}\nCustomer Phone: {customer_phone}\n\nPurchase details:\n"
            for item in cart:
                message += f"Product: {item['name']}\nPrice: {item['price']}\nQuantity: {item['quantity']}\n\n"
            message += f"Total Cost: ${total_cost}\n"

            # Send email
            send_mail(
                'Purchase Confirmation',
                message,
                settings.DEFAULT_FROM_EMAIL,
                ['benjaoyarzun5@gmail.com'],
            )
            
            send_mail(
                'Purchase Confirmation',
                message +("Estos son los detalles de tu compra, en breve nos comunicaremos contigo para ultimar detalles del pedido"),
                settings.DEFAULT_FROM_EMAIL,
                [customer_email],
            )


            
            return JsonResponse({'message': 'Email sent successfully'})
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            logger.error(f"Error sending email: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Invalid request'}, status=400)

logger = logging.getLogger(__name__)

@csrf_exempt
def send_single_purchase_email(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            customer_name = data.get('name')
            customer_email = data.get('email')
            customer_phone = data.get('phone')
            product_id = data.get('product_id')
            quantity = data.get('quantity')

            # Log received data for debugging
            logger.debug(f"Received data: {data}")
            print(f"Received data: {data}")  # Log data to console

            # Check for missing required fields
            if not customer_name or not customer_email or not customer_phone or not product_id or not quantity:
                return JsonResponse({'error': 'Missing required fields'}, status=400)

            product = Producto.objects.get(id=product_id)
            total_cost = product.price * quantity

            # Construct email message
            message = f"Customer Name: {customer_name}\nCustomer Email: {customer_email}\nCustomer Phone: {customer_phone}\n\nPurchase details:\n"
            message += f"Product: {product.name}\nPrice: {product.price}\nQuantity: {quantity}\nTotal Cost: {total_cost}\n\n"

            # Send email to admin
            send_mail(
                'Purchase Confirmation',
                message,
                settings.DEFAULT_FROM_EMAIL,
                ['benjaoyarzun5@gmail.com'],
            )

            # Send confirmation email to customer
            send_mail(
                'Purchase Confirmation - Customer Copy',
                'Your purchase was successful. Here are the details:\n' + message,
                settings.DEFAULT_FROM_EMAIL,
                [customer_email],
            )

            return JsonResponse({'message': 'Email sent successfully'})
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Producto.DoesNotExist:
            return JsonResponse({'error': 'Product not found'}, status=404)
        except Exception as e:
            logger.error(f"Error sending email: {str(e)}")
            print(f"Error sending email: {str(e)}")  # Log error to console
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Invalid request'}, status=400)
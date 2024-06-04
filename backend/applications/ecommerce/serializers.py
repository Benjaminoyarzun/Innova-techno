# serializers.py

from rest_framework import serializers
from .models import Producto, Categoria

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ('id', 'name')

class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    image = serializers.ImageField(use_url=True)

    class Meta:
        model = Producto
        fields = ('id', 'name', 'description', 'price', 'category', 'discount_price', 'product_code', 'on_sale', 'image', 'discount_percentage', "in_stock")

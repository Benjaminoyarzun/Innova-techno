from django.contrib import admin
from .models import Producto, Categoria

# Desregistrar el modelo si ya está registrado
if admin.site.is_registered(Categoria):
    admin.site.unregister(Categoria)

if admin.site.is_registered(Producto):
    admin.site.unregister(Producto)

@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']

@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'category', 'on_sale', 'in_stock', 'discount_percentage']
    search_fields = ['name', 'category__name']
    list_filter = ['on_sale', 'in_stock', 'category']
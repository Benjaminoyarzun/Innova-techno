from django.db import models
from decimal import Decimal, InvalidOperation

class Categoria(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Producto(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    category = models.ForeignKey(Categoria, on_delete=models.CASCADE)
    product_code = models.CharField(max_length=255)
    image = models.ImageField(upload_to='products/', null=True, blank=True)
    in_stock = models.BooleanField(default=True)
    on_sale = models.BooleanField(default=False)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    def save(self, *args, **kwargs):
        if self.on_sale and self.discount_percentage > 0:
            self.discount_price = self.price - (self.price * self.discount_percentage / 100)
        else:
            self.discount_price = None  # Aquí aseguramos que el precio con descuento se limpie si no está en oferta
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
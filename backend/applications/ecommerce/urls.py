# urls.py

from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductListView, CategoryListView, CategoryViewSet, send_purchase_email, send_single_purchase_email

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)

urlpatterns = [
    path('api/products/', ProductListView.as_view(), name='product_list'),
    path('api/categories/', CategoryListView.as_view(), name='category-list'),
    path('api/send_purchase_email/', send_purchase_email, name='send_purchase_email'),
    path('api/send_single_purchase_email/', send_single_purchase_email, name='send_single_purchase_email'),
    path('', include(router.urls)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

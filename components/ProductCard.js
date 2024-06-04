// ProductCard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Link } from '@nextui-org/react';
import NextLink from 'next/link';
import { useCart } from '../config/CartContext';
import { useRouter } from 'next/router';

export const ProductCard = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const { cart, addToCart, removeFromCart } = useCart();
  const [quantities, setQuantities] = useState({});
  const router = useRouter();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await axios.get('http://localhost:8000/api/products/?format=json');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }

    async function fetchCategories() {
      try {
        const response = await axios.get('http://localhost:8000/api/categories/');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }

    fetchProducts();
    fetchCategories();
  }, []);

  const handleQuantityChange = (productId, value) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: value,
    }));
  };
  console.log("Quantities", quantities)

  const handleAddToCart = (product) => {
    const quantity = quantities[product.id] || 0;
    console.log("quantity", quantity)
    if (quantity > 0) {
      addToCart(product, quantity);
    } else {
      alert("Please enter a quantity greater than 0");
    }
  };

  const handleBuyNow = (product) => {
    const quantity = quantities[product.id] || 0;
    if (quantity > 0) {
      router.push({
        pathname: '/single-purchase',
        query: { product_id: product.id, quantity },
      });
    } else {
      alert("Please enter a quantity greater than 0");
    }
  };

  const isProductInCart = (productId) => {
    return cart.some((product) => product.id === productId);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const filteredProducts = selectedCategory
    ? products.filter(product => product.category.name === selectedCategory)
    : products;

  return (
    <div>
      <h1>Productos</h1>
      <select onChange={handleCategoryChange} value={selectedCategory}>
        <option value="">Todas</option>
        {categories.map(category => (
          <option key={category.id} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>
      <ul>
        {Array.isArray(filteredProducts) && filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                <p>{product.name}</p>
              </CardHeader>
              <Divider />
              <CardBody>
                <p>
                  Precio: $
                  {product.on_sale ? (
                    <>
                      <span style={{ textDecoration: 'line-through' }}>{product.price}</span> $
                      {product.discount_price}
                    </>
                  ) : (
                    product.price
                  )}
                </p>
                <p>Categoria: {product.category.name}</p>
                <p>Codigo de producto: {product.product_code}</p>
                <p>
                  <img src={product.image} alt={product.name} />
                </p>
                
                <input
                  type='number'
                  min="0"
                  max="10"
                  value={quantities[product.id] || 0}
                  onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
                />
              </CardBody>
              <CardFooter>
                <div className='flex gap-4'>
                  {product.in_stock ? (
                    <>
                      <Button
                        onClick={() => handleBuyNow(product)}
                        color="primary"
                        showAnchorIcon
                        variant="solid"
                      >
                        Comprar
                      </Button>
                      <Button
                        onClick={() => handleAddToCart(product)}
                        isDisabled={isProductInCart(product.id)}
                      >
                        Agregar al carrito
                      </Button>
                      {isProductInCart(product.id) && (
                        <Button
                          onClick={() => removeFromCart(product.id)}
                          color="error"
                        >
                          Eliminar del carrito
                        </Button>
                      )}
                    </>
                  ) : (
                    <p>No disponible</p>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))
        ) : (
          <li>Parece que hubo un error !!</li>
        )}
      </ul>
    </div>
  );
}
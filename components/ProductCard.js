// ProductCard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, CardBody, CardFooter, CardHeader, Chip, Divider, Link, Select, SelectItem, Spacer } from '@nextui-org/react';
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

  const handleCategoryChange = (selectedKeys) => {
    const category = selectedKeys.keys().next().value; // Obtener el valor seleccionado del Set
    setSelectedCategory(category); // Actualiza el estado con el valor seleccionado
  };

  const filteredProducts = selectedCategory
    ? products.filter(product => product.category.name === selectedCategory)
    : products;

  return (
    <div>
      <h1>Productos</h1>
{/* seccion del select */}

<Select
        items={categories}
        label="Seleccionar Categoría"
        placeholder="Seleccionar categoría"
        onSelectionChange={handleCategoryChange} // Maneja el cambio de categoría
        selectedKeys={selectedCategory ? new Set([selectedCategory]) : new Set()} // Mantiene el estado seleccionado
        className="max-w-xs"
      >
        {category => <SelectItem key={category.name}>{category.name}</SelectItem>}
      </Select>
     
     {/* aca arranca el mapeo de los productos con cards */} 
      <ul>
        {Array.isArray(filteredProducts) && filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Card key={product.id} className='my-5 max-w-screen-md'>
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
                      <Spacer/>
                      <Chip>En descuento!!</Chip>
                    </>
                  ) : (
                    product.price
                  )}
                </p>
                <p>Categoria: {product.category.name}</p>
                <p>Codigo de producto: {product.product_code}</p>
                <p>
                  <img src={product.image} alt={product.name} className='max-w-96 max-h-96' />
                </p>
                <Spacer y={3}/>
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

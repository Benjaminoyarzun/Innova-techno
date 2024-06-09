import React from 'react';
import { useRouter } from 'next/router';
import DefaultLayout from "@/layouts/default";
import { useCart } from '../config/CartContext';
import { Card, CardBody, CardHeader, Divider, Button } from '@nextui-org/react';

const CartPage = () => {
  const { cart, removeFromCart } = useCart();
  const router = useRouter();
  const calculateTotal = () => {
    return cart.reduce((total, product) => total + (product.discount_price || product.price) * product.quantity, 0).toFixed(2);
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };
  

  console.log("Cart",cart)
  return (
    <DefaultLayout title="Tu carrito" >
      <h1>Tu Carrito</h1>
      <ul>
        {cart.length > 0 ? (
          cart.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                <p>{product.name}</p>
              </CardHeader>
              <Divider />
              <CardBody>
                <p>${product.discount_price !== null ? product.discount_price : product.price}</p>
                <p>Categoria: {product.category?.name}</p>
                <p>[Código de producto]: {product.product_code}</p>
                <p>Cantidad: {product.quantity}</p>
                <Button
                  onClick={() => removeFromCart(product.id)}
                  color="error"
                >
                  Eliminar del carrito
                </Button>
              </CardBody>
            </Card>
          ))
        ) : (
          <li>El carrito está vacío</li>
        )}
      </ul>
      {cart.length > 0 && (
        <>
          <h2>Total: ${calculateTotal()}</h2>
          <Button onClick={handleCheckout} color="success">Finalizar Compra</Button>
        </>
      )}
    </DefaultLayout>
  );
}

export default CartPage;

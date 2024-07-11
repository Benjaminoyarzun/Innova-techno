import React from "react";
import { useRouter } from "next/router";
import DefaultLayout from "@/layouts/default";
import { useTheme } from "next-themes";
import { useCart } from "../config/CartContext";
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Button,
  Image,
} from "@nextui-org/react";
import { EmptyCartIcon } from "../components/icons";

const CartPage = () => {
  const { cart, removeFromCart } = useCart();
  const router = useRouter();
  const { theme } = useTheme();

  const calculateTotal = () => {
    return cart
      .reduce(
        (total, product) =>
          total + (product.discount_price || product.price) * product.quantity,
        0
      )
      .toFixed(2);
  };
  /*   const totalPrice = (product.discount_price || product.price) * quantity; */

  const handleCheckout = () => {
    router.push("/checkout");
  };

  console.log("Cart", cart);
  return (
    <DefaultLayout title="Tu carrito">
      <h1 className="font-bold text-4xl mb-3">Tu carrito</h1>
      <ul>
        {cart.length > 0 ? (
          cart.map((product) => (
            <Card key={product.id} className="my-5 max-w-screen-md">
              <CardHeader>
                <p>{product.name}</p>
              </CardHeader>
              <Divider />
              <CardBody>
                <p>
                  <strong>precio:</strong> $
                  {Math.round(
                    product.discount_price !== null
                      ? product.discount_price
                      : product.price
                  )}
                </p>
                <p>
                  <strong>Categoria:</strong> {product.category?.name}
                </p>
                <p>
                  <strong>Cantidad:</strong> {product.quantity}
                </p>
                <p>
                  <strong>Precio por cantidad:</strong> $
                  {Math.round(
                    (product.discount_price !== null
                      ? product.discount_price
                      : product.price) * product.quantity.toFixed(2)
                  )}
                </p>
                <Button
                  onClick={() => removeFromCart(product.id)}
                  color="danger"
                  radius="lg"
                  className="mt-3"
                >
                  Eliminar del carrito
                </Button>
              </CardBody>
            </Card>
          ))
        ) : (
          <div className="h-full w-full flex flex-col items-center mt-4">
            <EmptyCartIcon />
            <p className="text-2xl font-bold flex justify-center mt-8">
              Tu carrito está vacío
            </p>
          </div>
        )}
      </ul>
      {cart.length > 0 && (
        <>
          <h2 className="mb-1">
            <strong>Total:</strong> ${Math.round(calculateTotal())}
          </h2>
          <Button
            onClick={handleCheckout}
            color="success"
            variant={theme == "dark" ? "shadow" : "solid"}
            className="font-semibold text-white"
            radius="full"
          >
            Finalizar Compra
          </Button>
        </>
      )}
    </DefaultLayout>
  );
};

export default CartPage;

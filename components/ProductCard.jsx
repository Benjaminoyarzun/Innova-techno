// ProductCard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ScrollShadow,
  Select,
  SelectItem,
  Spacer,
} from "@nextui-org/react";
import NextLink from "next/link";
import { useCart } from "../config/CartContext";
import { useRouter } from "next/router";
import Image from "next/image"; // Importando el componente Image de Next.js
import { SadFace } from "./icons";



export const ProductCard = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const { cart, addToCart, removeFromCart } = useCart();
  const [quantities, setQuantities] = useState({});
  const router = useRouter();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/products/?format=json"
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }

    async function fetchCategories() {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/categories/"
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
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
  console.log("Quantities", quantities);

  const handleAddToCart = (product) => {
    const quantity = quantities[product.id] || 0;
    console.log("quantity", quantity);
    if (quantity > 0) {
      addToCart(product, quantity);
    } else {
      const span = document.createElement("span");
      span.innerText = "Ingrese una cantidad mayor a 0";
      span.style.color = "red";
      span.classList.add("animate-pulse", "font-bold");

      const input = document.querySelector(`#quantity-${product.id}`);
      if (input) {
        input.parentNode.appendChild(span);
        setTimeout(() => {
          span.classList.add("transition-opacity", "duration-500", "opacity-0");
          setTimeout(() => {
            span.remove();
          }, 500); // Elimina el span después de 0.5 segundos
        }, 2000); // Después de 2 segundos, agrega la clase para desvanecer el span
      }
    }
  };

  const handleBuyNow = (product) => {
    const quantity = quantities[product.id] || 0;
    if (quantity > 0) {
      router.push({
        pathname: "/single-purchase",
        query: { product_id: product.id, quantity },
      });
    } else {
      const span = document.createElement("span");
      span.innerText = "Ingrese una cantidad mayor a 0";
      span.style.color = "red";
      span.classList.add("animate-pulse", "font-medium", "flex", "flex-col" );

      const input = document.querySelector(`#quantity-${product.id}`);
      if (input) {
        input.parentNode.appendChild(span);
        setTimeout(() => {
          span.classList.add("transition-opacity", "duration-500", "opacity-0");
          setTimeout(() => {
            span.remove();
          }, 500); // Elimina el span después de 0.5 segundos
        }, 2000); // Después de 2 segundos, agrega la clase para desvanecer el span
      }
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
    ? products.filter((product) => product.category.name === selectedCategory)
    : products;

  return (
    <div>
      <h1 className="font-bold text-4xl mb-3">Productos</h1>
      {/* seccion del select */}
      <Select
        items={categories}
        label="Seleccionar Categoría"
        placeholder="Seleccionar categoría"
        onSelectionChange={handleCategoryChange} // Maneja el cambio de categoría
        selectedKeys={
          selectedCategory ? new Set([selectedCategory]) : new Set()
        } // Mantiene el estado seleccionado
        className="max-w-xs"
      >
        {(category) => (
          <SelectItem key={category.name}>{category.name}</SelectItem>
        )}
      </Select>

      {/* aca arranca el mapeo de los productos con cards */}
      <ul>
        {Array.isArray(filteredProducts) && filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Card key={product.id} className="my-5 max-w-screen-md">
              <CardHeader>
                <p className="font-bold">{product.name}</p>
              </CardHeader>
              <Divider />

              {/* CardBody */}
              <CardBody>
                <div className="flex flex-col md:flex-row md:justify-between">
                  {/* INFO PRODUCTO */}
                  <div className="flex flex-col w-[300px]">
                    {/* CATEGORIA */}
                    {/*            <p>
                      {" "}
                      <strong>Categoria:</strong> {product.category.name}
                    </p> */}
                    {/* PRODUCT CODE */}        
                    <div className="md:h-[90%]">
                      {/* PRECIO */}
                      <p>
                        <div>
                          {/* LOGICA DE PRECIO */}
                          {product.on_sale ? (
                            // precios y chip de descuento
                            <p className="flex">
                              <span className="text-2xl font-bold text-[#ff0000]">
                                ${product.discount_price}
                              </span>
                              <span className=" line-through text-gray-500 ml-1 text-sm">
                                ${product.price}
                              </span>
                              <Spacer />
                              {/* chip de en descuento */}
                              <Chip color="primary" size="sm">
                                En descuento!!
                              </Chip>
                            </p>
                          ) : (
                            <span className="text-2xl font-bold text-[#ff0000]">
                              ${product.price}
                            </span>
                          )}
                        </div>
                      </p>
                      
                      {/* DESCRIPCION */}
                      <div className="">
                        <ScrollShadow size={100} hideScrollBar={true} className="w-[250px] md:w-[400px] h-[150px]" >
                          <p >{product.description}</p>
                        </ScrollShadow>
                      </div>
                    </div>

                    {/* CANTIDAD */}
                    <Spacer y={3} />
                    <div className="flex flex-col mb-4 text-xl">
                      <p className=" mb-2">Cantidad:</p>
                      <input
                        id={`quantity-${product.id}`}
                        type="number"
                        min="0"
                        max="100"
                        value={quantities[product.id] || 0}
                        onChange={(e) =>
                          handleQuantityChange(
                            product.id,
                            parseInt(e.target.value)
                          )
                        }
                        className="rounded-lg px-2 w-auto max-w-[90px] border-2 "
                      />
                      <style jsx>{`
                        /* Chrome, Safari, Edge, Opera */
                        input[type="number"]::-webkit-outer-spin-button,
                        input[type="number"]::-webkit-inner-spin-button {
                          -webkit-appearance: none;
                          margin: 0;
                        }

                        /* Firefox */
                        input[type="number"] {
                          -moz-appearance: textfield;
                        }
                      `}</style>
                    </div>
                  </div>
                  {/* IMAGEN */}
                  <div className="flex mt-2">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="object-cover rounded-3xl"
                    />
                  </div>
                </div>
              </CardBody>
              <CardFooter className="grid">
                <div className="grid gap-4 columns-2 row-span-2 col-span-2 md:flex md:flex-row md:gap-4">
                  {product.in_stock ? (
                    <>
                      <Button
                        onClick={() => handleBuyNow(product)}
                        color="primary"
                        showAnchorIcon
                        variant="shadow"
                        className="font-medium"
                        id="spbuy"
                      >
                        Comprar
                      </Button>
                      <Button
                        onClick={() => handleAddToCart(product)}
                        isDisabled={isProductInCart(product.id)}
                        variant="solid"
                        className="font-medium"
                        id="addtocart"
                      >
                        Agregar al carrito
                      </Button>

                      {isProductInCart(product.id) && (
                        <Button
                          color="danger"
                          onClick={() => removeFromCart(product.id)}
                          className="font-medium"
                          id="removefromcart"
                        >
                          Eliminar del carrito
                        </Button>
                      )}
                    </>
                  ) : (
                    <Button color="danger" isDisabled className="font-medium">
                      Sin stock
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className='h-full w-full flex flex-col items-center mt-4'>
            <SadFace/>
            <p className='text-2xl font-bold flex justify-center mt-8'>No se encontraron productos</p>
          </div>
        )}
      </ul>
    </div>
  );
};

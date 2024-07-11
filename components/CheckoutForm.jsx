import axios from "axios";
import { useRouter } from "next/router";
import { useCart } from "../config/CartContext";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Input, Button } from "@nextui-org/react";
import Swal from "sweetalert2";
import { useTheme } from "next-themes";

const CheckoutForm = () => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const { cart, clearCart } = useCart();
  const router = useRouter();
  const { theme } = useTheme();

  const validateName = (name) => {
    const re = /^[a-zA-Z\s]+[^ ]$/;
    return re.test(String(name)) && name.includes(" ");
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePhone = (phone) => {
    const re = /^[0-9]{10}$/;
    return re.test(String(phone));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    let newErrors = { ...errors };

    switch (name) {
      case "name":
        newErrors.name = validateName(value)
          ? ""
          : "Ingrese un nombre y apellido válidos";
        break;
      case "email":
        newErrors.email = validateEmail(value)
          ? ""
          : "Ingrese un correo electrónico válido";
        break;
      case "phone":
        newErrors.phone = validatePhone(value)
          ? ""
          : "Ingrese un número de teléfono válido de 10 dígitos";
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let newErrors = { name: "", email: "", phone: "" };
    let valid = true;

    if (!formData.name) {
      newErrors.name = "El campo Nombre es obligatorio";
      valid = false;
    }

    if (!formData.email) {
      newErrors.email = "El campo Email es obligatorio";
      valid = false;
    }

    if (!formData.phone) {
      newErrors.phone = "El campo Teléfono es obligatorio";
      valid = false;
    }

    if (!valid) {
      setErrors(newErrors);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor, complete todos los campos.",
        confirmButtonColor: theme === "light" ? "#3085d6" : "#d33",
      });
      return;
    }

    if (!validateName(formData.name)) {
      newErrors.name = "Ingrese un nombre y apellido válidos";
      valid = false;
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = "Ingrese un correo electrónico válido";
      valid = false;
    }

    if (!validatePhone(formData.phone)) {
      newErrors.phone = "Ingrese un número de teléfono válido de 10 dígitos";
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) {
      return;
    }

    if (cart.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Su carrito está vacío.",
        confirmButtonColor: theme === "light" ? "#3085d6" : "#d33",
      });
      return;
    }

    const swalTheme =
      theme === "light"
        ? {
            confirmButtonColor: "green",
            cancelButtonColor: "red",
            confirmButtonText: "Sí, enviar",
            cancelButtonText: "No, revisar",
            background: "white",
            color: "#000000",
            html: `<p style="color:#000000;"><strong>Nombre:</strong> ${formData.name}</p>
               <p style="color:#000000;"><strong>Email:</strong> ${formData.email}</p>
               <p style="color:#000000;"><strong>Teléfono:</strong> ${formData.phone}</p>`,
          }
        : {
            confirmButtonColor: "green",
            cancelButtonColor: "blue",
            confirmButtonText: "Si, enviar",
            cancelButtonText: "No, revisar",
            background: "black",
            color: "#ffffff",
            html: `<p style="color:#ffffff;"><strong>Nombre:</strong> ${formData.name}</p>
               <p style="color:#ffffff;"><strong>Email:</strong> ${formData.email}</p>
               <p style="color:#ffffff;"><strong>Teléfono:</strong> ${formData.phone}</p>`,
          };

    Swal.fire({
      title: "¿Los datos ingresados son correctos?",
      showCancelButton: true,
      ...swalTheme,
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Procesando su orden...",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
          background: swalTheme.background,
          color: swalTheme.color,
        });

        const purchaseId = uuidv4();
        
        try {
          
          const response = await axios.post(
           `${process.env.NEXT_PUBLIC_API_BASE_URL}/${process.env.NEXT_PUBLIC_CART_SEND_PATH}`,
            {
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              purchase_id: purchaseId,
              cart: cart.map((item) => ({
                id: item.id,
                name: item.name,
                price: item.discount_price || item.price,
                quantity: item.quantity,
              })),
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          
          if (response.status === 200) {
            Swal.fire({
              icon: "success",
              title: "¡Pedido procesado!",
              text: "Revise su correo para ver los detalles de su envío. Uno de nuestros vendedores se comunicará con usted al numero proporcionado para corroborar el pedido.",
              showConfirmButton: true,
              confirmButtonColor: swalTheme.confirmButtonColor,
              confirmButtonText: "Ok",
              background: swalTheme.background,
              color: swalTheme.color,
            }).then(() => {
              clearCart();
              router.push("/");
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Purchase Error",
              text: "Error de reserva",
              color: swalTheme.color,
              confirmButtonColor: swalTheme.confirmButtonColor,
              confirmButtonText: "Ok",
              background: swalTheme.background,
              color: swalTheme.color,
            });
          }
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Server Error",
            text: "Error en peticion HTTP",
            color: swalTheme.color,
            confirmButtonColor: swalTheme.confirmButtonColor,
            confirmButtonText: "Ok",
            background: swalTheme.background,
            color: swalTheme.color,
          });
        }
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div>
        <Input
          label="Nombre"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          isInvalid={!!errors.name}
          errorMessage={errors.name}
          required
        />
      </div>
      <div>
        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          isInvalid={!!errors.email}
          errorMessage={errors.email}
          required
        />
      </div>
      <div>
        <Input
          label="Teléfono"
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          isInvalid={!!errors.phone}
          errorMessage={errors.phone}
          required
        />
      </div>
      <Button
        className="font-semibold text-white"
        size="lg"
        color="success"
        radius="full"
        variant={theme == "dark" ? "shadow" : "solid"}
        type="submit"
      >
        Comprar
      </Button>
    </form>
  );
};

export default CheckoutForm;

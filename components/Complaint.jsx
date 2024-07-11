import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Input, Button } from "@nextui-org/react";
import Swal from "sweetalert2";
import { useTheme } from "next-themes";

const ComplaintForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    comment: "",
    purchaseId: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    comment: "",
    purchaseId: "",
  });
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

  const validateComment = (comment) => {
    const re = /^[^\s][a-zA-Z0-9\s]*$/;
    return re.test(String(comment));
  };

  const validatePurchaseId = (purchaseId) => {
    const re =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
    return re.test(String(purchaseId));
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
      case "comment":
        newErrors.comment = validateComment(value) ? "" : "Escriba un mensaje";
        break;
      case "purchaseId":
        newErrors.purchaseId = validatePurchaseId(value)
          ? ""
          : "Ingrese un ID de compra válido";
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let newErrors = {
      name: "",
      email: "",
      phone: "",
      comment: "",
      purchaseId: "",
    };
    let valid = true;

    // Validaciones de campos obligatorios
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

    if (!formData.comment) {
      newErrors.comment = "Ingresa un comentario o queja";
      valid = false;
    }

    if (!formData.purchaseId) {
      newErrors.purchaseId = "Ingrese un ID de compra";
      valid = false;
    }

    // Validaciones adicionales
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
    if (!validateComment(formData.comment)) {
      newErrors.phone = "Ingrese una queja o comentario";
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) {
      return;
    }
    const complaintId = uuidv4(); // Generar un ID único para la queja

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
             <p style="color:#000000;"><strong>Teléfono:</strong> ${formData.phone}</p>
             <p style="color:#000000;"><strong>Comentario:</strong> ${formData.comment}</p>
             <p style="color:#000000;"><strong>ID de compra:</strong> ${formData.purchaseId}</p>`,
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
             <p style="color:#ffffff;"><strong>Teléfono:</strong> ${formData.phone}</p>
             <p style="color:#ffffff;"><strong>Comentario:</strong> ${formData.comment}</p>
             <p style="color:#ffffff;"><strong>ID de compra:</strong> ${formData.purchaseId}</p>`,
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

        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/${process.env.NEXT_PUBLIC_COMPLAINT_PATH}`,
            {
              id: complaintId,
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              comment: formData.comment,
              purchase_id: formData.purchaseId,
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
              title: "Comentario procesado",
              text: "  Nos comunicaremos a la brevedad al numero proporcionado para abarcar su queja. Revise su mail para encontrar los datos de esta queja, incluida su ID.De no recibir respuesta en 2 semanas, mande un mensaje al numero en la parte inferior central de la pagina.",
              showConfirmButton: true,
              confirmButtonColor: swalTheme.confirmButtonColor,
              confirmButtonText: "Ok",
              background: swalTheme.background,
              color: swalTheme.color,
            }).then(() => {
              router.push("/");
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "error de queja",
              confirmButtonColor: swalTheme.confirmButtonColor,
              confirmButtonText: "Ok",
              background: swalTheme.background,
              color: swalTheme.color,
            });
          }
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "error del server",
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
    <div className="flex flex-col h-4/5">
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
        <div>
          <Input
            label="Comentario"
            type="text"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            isInvalid={!!errors.comment}
            errorMessage={errors.comment}
            required
          />
        </div>
        <div>
          <Input
            label="ID de Compra"
            type="text"
            name="purchaseId"
            value={formData.purchaseId}
            onChange={handleChange}
            isInvalid={!!errors.purchaseId}
            errorMessage={errors.purchaseId}
            required
          />
        </div>
        <Button
          className="font-semibold text-white"
          size="lg"
          radius="full"
          color="success"
          variant={theme == "dark" ? "shadow" : "solid"}
          type="submit"
        >
          Enviar comentario
        </Button>
      </form>
    </div>
  );
};

export default ComplaintForm;

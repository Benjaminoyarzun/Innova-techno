import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const SingleProductCheckoutForm = ({ productId }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [processing, setProcessing] = useState(false);
  const router = useRouter();
  useEffect(() => {
    console.log('Product ID:', productId); // Verificar que el productId se pasa correctamente
  }, [productId]);



  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (quantity <= 0) {
      alert('La cantidad debe ser mayor a 0.');
      setProcessing(false);
      return;
    }

    const formData = {
      name,
      email,
      phone,
      /* product_id: productId, */
      quantity,
    };

    console.log('Form data:', formData); // Verificar los datos

    try {
      const response = await axios.post('http://localhost:8000/api/send_single_purchase_email/', formData);

      if (response.status === 200) {
        alert('Compra realizada con éxito');
        router.push('/');
      } else {
        alert('Error al realizar la compra');
      }
    } catch (error) {
      console.error('Error sending purchase email:', error);
      alert('Error al enviar el correo de compra');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div>
      <h1>Formulario de Compra</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Teléfono:</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={processing}>
          {processing ? 'Procesando su orden...' : 'Comprar'}
        </button>
      </form>
      {processing && <p>Procesando su orden...</p>}
    </div>
  );
};

export default SingleProductCheckoutForm;

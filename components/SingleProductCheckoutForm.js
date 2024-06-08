// SingleProductCheckoutForm.js
import axios from 'axios';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const SingleProductCheckoutForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [product, setProduct] = useState(null);
  const router = useRouter();
  const { product_id, quantity } = router.query;

  useEffect(() => {
    if (product_id) {
      async function fetchProduct() {
        try {
          const response = await axios.get(`http://localhost:8000/api/products/${product_id}/`);
          setProduct(response.data);
        } catch (error) {
          console.error('Error fetching product:', error);
        }
      }
      fetchProduct();
    }
  }, [product_id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name || !formData.email || !formData.phone) {
      alert('Please fill in all the fields');
      return;
    }

    const purchaseId = uuidv4();

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/send_single_purchase_email/', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        product_id: product_id,
        quantity: quantity,
        purchase_id: purchaseId,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        alert('Purchase successful');
        router.push('/');
      } else {
        alert('Error: ' + response.data.error);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  if (!product) return <div>Loading...</div>;

  const totalPrice = (product.discount_price || product.price) * quantity;

  return (
    <div>
      <h1>Formulario de Compra</h1>
      <div>
        <p>Producto: {product.name}</p>
        <p>Precio Unitario: ${product.discount_price || product.price}</p>
        <p>Cantidad: {quantity}</p>
        <p>Precio Total: ${totalPrice}</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Teléfono:</label>
          <input
            type="text"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
        </div>
        <button type="submit">Comprar</button>
      </form>
    </div>
  );
};

export default SingleProductCheckoutForm;

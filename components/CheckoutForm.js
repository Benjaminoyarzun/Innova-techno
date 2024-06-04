import axios from 'axios';
import { useRouter } from 'next/router';
import { useCart } from '../config/CartContext';
import { useState } from 'react';

const CheckoutForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const { cart, clearCart } = useCart();
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name || !formData.email || !formData.phone) {
      alert('Please fill in all the fields');
      return;
    }

    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }

    console.log("Form data: ", formData);
    console.log("Cart data: ", cart);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/send_purchase_email/', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        cart: cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.discount_price || item.price,
          quantity: item.quantity,
        })),
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log("response is: ", response);

      if (response.status === 200) {
        alert('Purchase successful');
        clearCart();
        router.push('/');
      } else {
        console.error('Purchase error:', response.data);
        alert('Error: ' + response.data.error);
      }
    } catch (error) {
      console.error('Error sending purchase email:', error);
      alert('Error: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Name"
        required
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="Email"
        required
      />
      <input
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        placeholder="Phone"
        required
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default CheckoutForm;
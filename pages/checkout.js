// pages/checkout.js

import React from 'react';
import DefaultLayout from "@/layouts/default";
import CheckoutForm from '../components/CheckoutForm';

const CheckoutPage = () => {
  return (
    <DefaultLayout title="Ingresa tus datos!!">
      <h1>Checkout</h1>
      <CheckoutForm />
    </DefaultLayout>
  );
}

export default CheckoutPage;

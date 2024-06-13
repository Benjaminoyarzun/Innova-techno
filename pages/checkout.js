// pages/checkout.js

import React from 'react';
import DefaultLayout from "@/layouts/default";
import CheckoutForm from '../components/CheckoutForm';

const CheckoutPage = () => {
  return (
    <DefaultLayout title="Ingresa tus datos!!">
      <h1 className='flex justify-center font-bold text-3xl mb-4 '> Checkout</h1>
      <CheckoutForm />
    </DefaultLayout>
  );
}

export default CheckoutPage;

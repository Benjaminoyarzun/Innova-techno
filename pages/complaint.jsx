// pages/single-purchase.js

import React from 'react';
import { useRouter } from 'next/router';
import SingleProductCheckoutForm from '../components/SingleProductCheckoutForm';
import DefaultLayout from "@/layouts/default";
import ComplaintForm from '../components/Complaint';
const ComplaintPage = () => {
  const router = useRouter();
  const { productId, quantity } = router.query;

  return (
    <DefaultLayout title='Ingresa tus datos!!' >
      <h1 className='flex justify-center font-bold text-3xl mb-4 '>Puedes dejarnos una queja o comentario!</h1>
      <ComplaintForm/>

      
    </DefaultLayout>
  );
};

export default ComplaintPage;

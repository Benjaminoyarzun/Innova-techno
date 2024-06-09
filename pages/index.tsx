import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DefaultLayout from "@/layouts/default";
import { ProductCard } from '@/components/ProductCard'; 
export default function IndexPage() {
  

  return (
    <DefaultLayout title='Innova Techno'>
      
      
      <ProductCard/>

    </DefaultLayout>
  );
}
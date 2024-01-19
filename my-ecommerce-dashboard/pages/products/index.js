import React from 'react';
import ProductList from '../../components/Products/ProductList';
import Layout from '@/app/layout';
import Link from 'next/link';
import { Button } from '@mui/material';

const ProductsPage = () => {
  return (
    <Layout>
        
      <h2>Product List</h2>
      <ProductList />
    </Layout>
  );
};

export default ProductsPage;

import React from 'react';
import { useRouter } from 'next/router';
import ProductDetail from '../../components/Products/ProductDetail';
import Layout from '@/app/layout';

const ProductDetailPage = () => {
  const router = useRouter();
  const { productId } = router.query;

  return (
    <Layout>
      <h2>Product Details</h2>
      {productId && <ProductDetail productId={productId} />}
    </Layout>
  );
};

export default ProductDetailPage;

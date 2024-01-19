import React from 'react';
import { useRouter } from 'next/router';
import OrderDetail from '../../components/Orders/OrderDetail';
import Layout from '@/app/layout';

const OrderDetailPage = () => {
  const router = useRouter();
  const { orderId } = router.query;
console.log()
  return (
    <Layout>
      <h2></h2>
      {orderId && <OrderDetail orderId={orderId} />}
    </Layout>
  );
};

export default OrderDetailPage;

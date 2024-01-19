import React from 'react';
import OrderList from '../../components/Orders/OrderList';
import Layout from '@/app/layout';

const OrdersPage = () => {
  return (
    <Layout>
    <div>
      <OrderList />
    </div>
    </Layout>
  );
};

export default OrdersPage;

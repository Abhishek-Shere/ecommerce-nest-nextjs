import React from 'react';
import OrderForm from '../../components/Orders/OrderForm';
import Layout from '@/app/layout';

const NewOrderPage = () => {
  return (
    <Layout>
      <h2>Create a New Order</h2>
      <OrderForm />
    </Layout>
  );
};

export default NewOrderPage;

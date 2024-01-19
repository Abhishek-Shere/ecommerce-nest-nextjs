import Layout from '@/app/layout';
import React, { useState } from 'react';

const OrderForm = () => {
  const [customer, setCustomer] = useState('');
  const [total, setTotal] = useState('');

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log('Order created:', { customer, total });
  };

  return (
    <>
      <h2>Create a New Order</h2>
      <form onSubmit={handleFormSubmit}>
        <label>Customer:</label>
        <input type="text" value={customer} onChange={(e) => setCustomer(e.target.value)} />

        <label>Total:</label>
        <input type="text" value={total} onChange={(e) => setTotal(e.target.value)} />

        <button type="submit">Create Order</button>
      </form>
    </>
  );
};

export default OrderForm;

import Image from 'next/image';
import Layout from '@/app/layout';
import ProductList from '@/components/Products/ProductList';

export default function Home() {
  return (
    <Layout>
    <main>
    <h2>Product List</h2>
      <ProductList />
    </main>
    </Layout>
  );
}

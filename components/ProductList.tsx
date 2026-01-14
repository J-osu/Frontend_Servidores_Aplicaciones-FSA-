'use client';

import { useEffect, useState } from 'react';
import { fetchProducts, deleteProduct } from '@/lib/api';

export default function ProductList() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await deleteProduct(id);
      loadProducts(); // Reload list
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  if (loading) return <div>Loading products...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded shadow">
            <h3 className="font-bold">{product.name}</h3>
            <p className="text-sm text-gray-600">{product.description}</p>
            <p className="font-mono mt-2">${product.price}</p>
            <div className="mt-4 flex gap-2">
              <button 
                onClick={() => handleDelete(product.id, product.name)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function fetchProducts() {
  const res = await fetch(`${API_URL}/products/list_products`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function fetchCategories() {
  const res = await fetch(`${API_URL}/products/list_categories`);
  // Note: Adjust endpoint if it differs, based on controller it is list_categories
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

export async function createProduct(data: any) {
  console.log('Creating product with data:', JSON.stringify(data, null, 2));
  const res = await fetch(`${API_URL}/products/create_product`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorBody = await res.text();
    console.error('Failed to create product. Status:', res.status, 'Body:', errorBody);
    throw new Error(`Failed to create product: ${errorBody}`);
  }
  return res.json();
}

export async function deleteProduct(id: string) {
    // Note: The controller uses query params for delete: ?id=...
  const res = await fetch(`${API_URL}/products/delete_product?id=${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete product');
  return res.json();
}

export async function createCategory(data: any) {
  const res = await fetch(`${API_URL}/products/create_category`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create category');
  return res.json();
}

export async function deleteCategory(id: string) {
  const res = await fetch(`${API_URL}/products/delete_category?id=${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete category');
  return res.json();
}

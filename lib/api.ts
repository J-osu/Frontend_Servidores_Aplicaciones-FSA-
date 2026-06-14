import { apiPost, apiGet, apiPut, apiDelete } from './api-client';

export async function loginUser(email: string, password: string) {
  return apiPost('/auth/login', { email, password });
}

export async function fetchProducts() {
  return apiGet('/products/list_products');
}

export async function fetchCategories() {
  return apiGet('/products/list_categories');
}

export async function createProduct(data: any) {
  return apiPost('/products/create_product', data);
}

export async function updateProduct(id: string, data: any) {
  return apiPut(`/products/update_product/${id}`, data);
}

export async function deleteProduct(id: string) {
  return apiDelete(`/products/delete_product?id=${id}`);
}

export async function createCategory(data: any) {
  return apiPost('/products/create_category', data);
}

export async function deleteCategory(id: string) {
  return apiDelete(`/products/delete_category?id=${id}`);
}

export async function fetchUsers() {
  return apiGet('/users/listar_usuarios');
}

export async function getUsersCount() {
  const users = await fetchUsers();
  return users.length;
}

export async function fetchUserById(id: string) {
  return apiGet(`/users/${id}`);
}

export async function createUser(data: any) {
  return apiPost('/users/create_user', data);
}

export async function updateUser(id: string, data: any) {
  return apiPut(`/users/${id}`, data);
}

export async function deleteUser(id: string) {
  return apiDelete(`/users/${id}`);
}

export async function fetchOrders() {
  return apiGet('/orders/list_orders');
}

export async function getPendingOrdersCount() {
  const orders = await fetchOrders();
  return orders.filter((order: any) => order.status !== 'completed' && order.status !== 'cancelled').length;
}

export async function fetchOrdersByUser(userId: string) {
  return apiGet(`/orders/user/${userId}`);
}

export async function fetchOrderById(id: string) {
  return apiGet(`/orders/${id}`);
}

export async function updateOrderStatus(id: string, status: string) {
  return apiPut('/orders/update_status', { id, status });
}

export async function fetchProfiles() {
  return apiGet('/profile/list_profiles');
}

export async function createProfile(data: any) {
  return apiPost('/profile/create_profile', data);
}

export async function updateProfile(id: string, data: any) {
  return apiPut(`/profile/${id}`, data);
}

export async function deleteProfile(id: string) {
  return apiDelete(`/profile/${id}`);
}

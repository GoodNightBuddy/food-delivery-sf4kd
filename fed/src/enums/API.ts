export enum API {
  shops = 'shops',
  shopProducts = 'shops/products',
  users = 'users',
  cart = 'cart',
  orders = 'orders',
  slash = '/',
}

const API_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://food-delivery-back-end.onrender.com'
    : 'http://localhost:3001';

export const getAPIEndpoint = (endpoint: API): string => {
  return `${API_URL}${API.slash}${endpoint}`;
};

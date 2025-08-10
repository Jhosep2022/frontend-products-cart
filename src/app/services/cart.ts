import { api } from '@/app/lib/fetcher';
import { Cart } from '@/app/types';

export const getCart = () => api<Cart>('/cart');

export const addToCart = (productId: number, quantity = 1) =>
  api<{ message: string }>('/cart', {
    method: 'POST',
    body: JSON.stringify({ productId, quantity }),
  });

export const clearCart = () =>
  api<{ message: string }>('/cart', { method: 'DELETE' });

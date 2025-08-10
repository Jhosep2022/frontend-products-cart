import { api } from '@/app/lib/fetcher';
import { Product } from '@/app/types';

export const listProducts = () => api<Product[]>('/products');

'use client';

import { useEffect, useState } from 'react';
import { Product, Cart } from '@/app/types';
import { listProducts } from '@/app/services/products';
import { addToCart, clearCart, getCart } from '@/app/services/cart';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Cart>({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const [p, c] = await Promise.all([listProducts(), getCart()]);
    setProducts(p);
    setCart(c);
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async (id: number) => {
    setLoading(true);
    try {
      await addToCart(id, 1);
      setCart(await getCart());
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    await clearCart();
    setCart(await getCart());
  };

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-semibold mb-3">Productos</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {products.map(p => (
            <li key={p.id} className="rounded-2xl border p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">{p.name}</p>
                <p className="text-sm opacity-70">${p.price}</p>
              </div>
              <button
                onClick={() => handleAdd(p.id)}
                disabled={loading}
                className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
              >
                {loading ? 'Agregando...' : 'Agregar'}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">Carrito</h2>
          <button onClick={handleClear} className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50">
            Limpiar
          </button>
        </div>

        {cart.items.length === 0 ? (
          <p className="text-sm opacity-70">Aún no hay productos.</p>
        ) : (
          <div className="space-y-2">
            <ul className="divide-y rounded-2xl border">
              {cart.items.map(it => (
                <li key={it.id} className="flex items-center justify-between p-3">
                  <div>
                    <p className="font-medium">{it.name}</p>
                    <p className="text-xs opacity-70">${it.price} x {it.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold">${it.lineTotal}</p>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between p-2">
              <span className="text-sm opacity-70">Total</span>
              <span className="font-bold">${cart.total}</span>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

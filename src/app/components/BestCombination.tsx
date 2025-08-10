'use client';

import { useMemo, useState } from 'react';

type Product = { id: number; name: string; price: number };

const DEFAULT_PRODUCTS: Product[] = [
  { id: 1, name: 'Producto 1', price: 60 },
  { id: 2, name: 'Producto 2', price: 100 },
  { id: 3, name: 'Producto 3', price: 120 },
  { id: 4, name: 'Producto 4', price: 70 },
];


function findBestCombination(products: Product[], budget: number): Product[] {
  if (budget <= 0 || products.length === 0) return [];

  const decimals = Math.max(
    0,
    ...products.map(p => {
      const s = p.price.toString();
      return s.includes('.') ? s.split('.')[1].length : 0;
    }),
  );
  const scale = Math.pow(10, decimals);
  const scaledBudget = Math.floor(budget * scale);

  const ps = products.map(p => ({
    ...p,
    w: Math.floor(p.price * scale),
  }));

  const dp: { total: number; ids: number[] }[] = Array(scaledBudget + 1)
    .fill(0)
    .map(() => ({ total: 0, ids: [] }));

  for (const p of ps) {
    for (let b = scaledBudget; b >= p.w; b--) {
      const candidateTotal = dp[b - p.w].total + p.w;
      if (candidateTotal > dp[b].total) {
        dp[b] = {
          total: candidateTotal,
          ids: [...dp[b - p.w].ids, p.id],
        };
      }
    }
  }

  const best = dp[scaledBudget];
  const idSet = new Set(best.ids);
  return products.filter(p => idSet.has(p.id));
}

export default function BestCombination() {
  const [budget, setBudget] = useState<number>(150);
  const [products] = useState<Product[]>(DEFAULT_PRODUCTS);

  const selection = useMemo(
    () => findBestCombination(products, budget),
    [products, budget]
  );

  const total = selection.reduce((s, p) => s + p.price, 0);

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Mejor combinación dentro del presupuesto</h2>

      <div className="flex items-center gap-3">
        <label className="text-sm opacity-80">Presupuesto:</label>
        <input
          type="number"
          min={0}
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          className="w-32 rounded-lg border px-3 py-2 text-sm"
        />
      </div>

      <div className="grid gap-2">
        <p className="text-sm font-medium">Productos disponibles</p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {products.map(p => (
            <li key={p.id} className="rounded-xl border p-3 flex items-center justify-between">
              <span>{p.name}</span>
              <span className="text-sm opacity-70">${p.price}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Selección óptima (≤ ${budget})</p>
        {selection.length === 0 ? (
          <p className="text-sm opacity-70">No hay combinación que cumpla el presupuesto.</p>
        ) : (
          <>
            <ul className="divide-y rounded-xl border">
              {selection.map(p => (
                <li key={p.id} className="flex items-center justify-between p-3">
                  <span>{p.name}</span>
                  <span className="text-sm opacity-70">${p.price}</span>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between p-2">
              <span className="text-sm opacity-70">Total</span>
              <span className="font-semibold">${total}</span>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

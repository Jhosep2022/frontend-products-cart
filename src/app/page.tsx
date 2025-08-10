'use client';

import { useState } from 'react';
import Products from '@/app/components/Products';
import BestCombination from '@/app/components/BestCombination';

type TabKey = 'products' | 'best';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'products', label: 'Productos' },
  { key: 'best', label: 'Mejor combinación' },
];

export default function Page() {
  const [tab, setTab] = useState<TabKey>('products');

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <header className="space-y-3">
        <h1 className="text-2xl font-bold">Tienda (Demo)</h1>

        <nav className="flex gap-2 rounded-2xl border p-1" role="tablist" aria-label="Vistas">
          {TABS.map(t => (
            <button
              key={t.key}
              role="tab"
              aria-selected={tab === t.key}
              onClick={() => setTab(t.key)}
              className={[
                'w-full rounded-xl px-4 py-2 text-sm transition',
                tab === t.key
                  ? 'bg-gray-900 text-white'
                  : 'hover:bg-gray-100'
              ].join(' ')}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      <section>
        {tab === 'products' ? <Products /> : <BestCombination />}
      </section>
    </main>
  );
}

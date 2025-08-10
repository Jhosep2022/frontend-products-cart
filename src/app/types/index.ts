export type Product = { id: number; name: string; price: number };

export type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  lineTotal: number;
};

export type Cart = { items: CartItem[]; total: number };

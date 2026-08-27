import { Order, OrderPayload } from '../types';

const BASE = import.meta.env.VITE_API_BASE_URL || '';
const ORDERS_STORAGE_KEY = 'ssg_mock_orders';

function getStoredOrders(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveStoredOrders(orders: Order[]) {
  try { localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders)); } catch {}
}

export async function createOrder(payload: OrderPayload): Promise<Order> {
  if (!BASE) {
    await new Promise((res) => setTimeout(res, 400));
    const orderId = `SSG-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: Order = {
      id: orderId, shopId: payload.shopId, customer: payload.customer,
      deliveryAddress: payload.deliveryAddress, deliveryMethod: payload.deliveryMethod,
      paymentMethod: payload.paymentMethod, items: payload.items,
      subtotal: payload.subtotal, deliveryFee: payload.deliveryFee, total: payload.total,
      status: 'CONFIRMED', notes: payload.notes, createdAt: new Date().toISOString(),
      source: 'ONLINE', estimatedDelivery: payload.deliveryMethod === 'PICKUP' ? 'Ready in 2 hours' : '1–2 business days',
    };
    saveStoredOrders([newOrder, ...getStoredOrders()]);
    return newOrder;
  }

  const res = await fetch(`${BASE}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to create order');
  }
  const data = await res.json();
  return data.order ?? data;
}

export async function fetchOrderById(id: string): Promise<Order> {
  if (!BASE) {
    const found = getStoredOrders().find((o) => o.id === id);
    if (found) return found;
    return {
      id, shopId: 'shop-guwahati-panbazar',
      customer: { name: 'Prakash Mahela', phone: '+91 98640 12345', email: 'prakash@example.com' },
      deliveryAddress: { line1: 'House No. 12, Panbazar Main Road', city: 'Guwahati', state: 'Assam', pincode: '781001', landmark: 'Near Don Bosco School' },
      deliveryMethod: 'DELIVERY', paymentMethod: 'COD',
      items: [{ productId: 'prod-hc-math-5', name: 'Holy Cross Mathematics — Class 5', price: 340, quantity: 1 }],
      subtotal: 340, deliveryFee: 0, total: 340, status: 'CONFIRMED',
      createdAt: new Date().toISOString(), source: 'ONLINE', estimatedDelivery: '1–2 business days',
    };
  }

  const res = await fetch(`${BASE}/api/orders/${id}`);
  if (!res.ok) throw new Error(`Order ${id} not found`);
  const data = await res.json();
  return data.order ?? data;
}

export async function trackOrderByQuery(query: string): Promise<Order | null> {
  if (!BASE) {
    const cleanQ = query.trim().toLowerCase();
    return getStoredOrders().find((o) => o.id.toLowerCase() === cleanQ || o.customer.phone.replace(/\s+/g, '').includes(cleanQ.replace(/\s+/g, ''))) || null;
  }
  const res = await fetch(`${BASE}/api/orders/track?q=${encodeURIComponent(query)}`);
  if (!res.ok) return null;
  const data = await res.json();
  return data.order ?? null;
}

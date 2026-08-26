import { Order, OrderPayload } from '../types';

const ORDERS_STORAGE_KEY = 'ssg_mock_orders';

function getStoredOrders(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredOrders(orders: Order[]) {
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error('Failed to save order to localStorage', e);
  }
}

export async function createOrder(payload: OrderPayload): Promise<Order> {
  await new Promise((res) => setTimeout(res, 400));

  const randomNum = Math.floor(100000 + Math.random() * 900000);
  const orderId = `SSG-${randomNum}`;

  const deliveryDays = payload.deliveryMethod === 'PICKUP' ? 'Ready in 2 hours' : '1–2 business days';

  const newOrder: Order = {
    id: orderId,
    shopId: payload.shopId,
    customer: payload.customer,
    deliveryAddress: payload.deliveryAddress,
    deliveryMethod: payload.deliveryMethod,
    paymentMethod: payload.paymentMethod,
    items: payload.items,
    subtotal: payload.subtotal,
    deliveryFee: payload.deliveryFee,
    total: payload.total,
    status: 'CONFIRMED',
    notes: payload.notes,
    createdAt: new Date().toISOString(),
    source: 'ONLINE',
    estimatedDelivery: deliveryDays,
  };

  const current = getStoredOrders();
  saveStoredOrders([newOrder, ...current]);

  return newOrder;
}

export async function fetchOrderById(id: string): Promise<Order> {
  await new Promise((res) => setTimeout(res, 120));
  const current = getStoredOrders();
  const found = current.find((o) => o.id === id);
  if (found) return found;

  // Fallback demo order if refreshed on direct URL
  return {
    id,
    shopId: 'shop-guwahati-panbazar',
    customer: {
      name: 'Prakash Mahela',
      phone: '+91 98640 12345',
      email: 'prakash@example.com',
    },
    deliveryAddress: {
      line1: 'House No. 12, Panbazar Main Road',
      city: 'Guwahati',
      state: 'Assam',
      pincode: '781001',
      landmark: 'Near Don Bosco School',
    },
    deliveryMethod: 'DELIVERY',
    paymentMethod: 'COD',
    items: [
      {
        productId: 'prod-hc-math-5',
        name: 'Holy Cross Mathematics & Geometry — Class 5',
        price: 340,
        quantity: 1,
      },
      {
        productId: 'prod-classmate-reg-pack',
        name: 'Classmate Long Notebook Registers (Pack of 6)',
        price: 460,
        quantity: 1,
      },
    ],
    subtotal: 800,
    deliveryFee: 0,
    total: 800,
    status: 'CONFIRMED',
    createdAt: new Date().toISOString(),
    source: 'ONLINE',
    estimatedDelivery: '1–2 business days',
  };
}

export async function trackOrderByQuery(query: string): Promise<Order | null> {
  await new Promise((res) => setTimeout(res, 200));
  const current = getStoredOrders();
  const cleanQ = query.trim().toLowerCase();
  const order = current.find(
    (o) => o.id.toLowerCase() === cleanQ || o.customer.phone.replace(/\s+/g, '').includes(cleanQ.replace(/\s+/g, ''))
  );
  return order || null;
}

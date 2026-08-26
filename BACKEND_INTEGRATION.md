# Saraswati Student Gallery (SSG) — Backend Integration Guide

This document defines the API contracts, data models, and webhook pipelines required to connect the SSG frontend to a production backend.

---

## 1. Architecture Overview

```
Frontend (React 19 + Tailwind v4 + Vite)
   │
   ├── REST API calls via /src/api/*
   │     ├── /api/shops
   │     ├── /api/schools
   │     ├── /api/categories
   │     ├── /api/products
   │     └── /api/orders
   │
   └── Direct WhatsApp Deep-linking
         └── wa.me/{shop_whatsapp}?text={encoded_message}
```

---

## 2. API Endpoints Contract

### 2.1 Shops
- **`GET /api/shops`**
  - **Query parameters**: `?lat=25.9044&lng=93.7272` (optional, for distance sorting)
  - **Response**: `Shop[]`
- **`GET /api/shops/:id`**
  - **Response**: `Shop`

### 2.2 Schools
- **`GET /api/schools`**
  - **Query parameters**: `?shopId=shop-dimapur-main&city=Dimapur&board=CBSE`
  - **Response**: `School[]`
- **`GET /api/schools/:slug`**
  - **Response**: `School`

### 2.3 Categories
- **`GET /api/categories`**
  - **Query parameters**: `?shopId=shop-dimapur-main`
  - **Response**: `Category[]`
- **`GET /api/categories/:slug`**
  - **Response**: `Category`

### 2.4 Products
- **`GET /api/products`**
  - **Query parameters**:
    - `shopId` (string, required)
    - `schoolId` (string, optional)
    - `categoryId` (string, optional)
    - `classes` (string comma-separated, e.g. `Class 5,Class 6`)
    - `inStockOnly` (boolean)
    - `priceMin` (number)
    - `priceMax` (number)
    - `search` (string)
    - `sort` (`featured` | `price_asc` | `price_desc` | `newest`)
    - `page` (number, default: 1)
    - `limit` (number, default: 20)
  - **Response**: `{ products: Product[], total: number, page: number, totalPages: number }`
- **`GET /api/products/:slug`**
  - **Response**: `Product`

### 2.5 Orders
- **`POST /api/orders`**
  - **Request Body**:
    ```json
    {
      "shopId": "shop-dimapur-main",
      "customer": {
        "fullName": "Aloto Yeptho",
        "phone": "9876543210",
        "email": "aloto@example.com"
      },
      "address": {
        "line1": "House #42, Duncan Basti",
        "city": "Dimapur",
        "pincode": "797112",
        "state": "Nagaland",
        "landmark": "Near Police Point"
      },
      "items": [
        {
          "productId": "prod-hc-c5-bundle",
          "name": "Class 5 Complete Textbook Bundle",
          "price": 1420,
          "quantity": 1
        }
      ],
      "deliveryMethod": "DELIVERY",
      "paymentMethod": "COD",
      "subtotal": 1420,
      "deliveryFee": 0,
      "total": 1420,
      "notes": "Please deliver before 4 PM"
    }
    ```
  - **Response**: `Order` (Status 201)
- **`GET /api/orders/:id`**
  - **Response**: `Order`

---

## 3. Database Schema (PostgreSQL / Relational)

```sql
-- SHOPS TABLE
CREATE TABLE shops (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  pincode VARCHAR(10) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  whatsapp VARCHAR(20) NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  open_hours VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SCHOOLS TABLE
CREATE TABLE schools (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  logo TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  address TEXT,
  board VARCHAR(50) NOT NULL, -- 'CBSE', 'STATE', 'ICSE'
  classes_offered TEXT[] NOT NULL,
  associated_shop_ids TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CATEGORIES TABLE
CREATE TABLE categories (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  image TEXT NOT NULL,
  description TEXT,
  display_order INT DEFAULT 0
);

-- PRODUCTS TABLE
CREATE TABLE products (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  sku VARCHAR(64) UNIQUE NOT NULL,
  category_id VARCHAR(64) REFERENCES categories(id),
  school_id VARCHAR(64) REFERENCES schools(id),
  classes TEXT[] DEFAULT '{}',
  brand VARCHAR(100),
  price NUMERIC(10,2) NOT NULL,
  mrp NUMERIC(10,2) NOT NULL,
  images TEXT[] NOT NULL,
  swatches TEXT[] DEFAULT '{}',
  description TEXT,
  specifications JSONB DEFAULT '[]',
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- INVENTORY BY SHOP TABLE
CREATE TABLE product_stock (
  product_id VARCHAR(64) REFERENCES products(id),
  shop_id VARCHAR(64) REFERENCES shops(id),
  stock_quantity INT NOT NULL DEFAULT 0,
  PRIMARY KEY (product_id, shop_id)
);

-- ORDERS TABLE
CREATE TABLE orders (
  id VARCHAR(64) PRIMARY KEY, -- format: SSG-2026-XXXX
  shop_id VARCHAR(64) REFERENCES shops(id),
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  customer_email VARCHAR(255),
  delivery_method VARCHAR(20) NOT NULL, -- 'DELIVERY' or 'PICKUP'
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  address_city VARCHAR(100) NOT NULL,
  address_pincode VARCHAR(10) NOT NULL,
  address_state VARCHAR(100) NOT NULL,
  address_landmark TEXT,
  subtotal NUMERIC(10,2) NOT NULL,
  delivery_fee NUMERIC(10,2) NOT NULL,
  total NUMERIC(10,2) NOT NULL,
  payment_method VARCHAR(20) NOT NULL, -- 'COD' or 'UPI_QR'
  payment_status VARCHAR(20) DEFAULT 'PENDING',
  status VARCHAR(50) DEFAULT 'PENDING',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ORDER ITEMS TABLE
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id VARCHAR(64) REFERENCES orders(id) ON DELETE CASCADE,
  product_id VARCHAR(64) REFERENCES products(id),
  product_name VARCHAR(255) NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  quantity INT NOT NULL
);
```

---

## 4. WhatsApp Business Cloud API Integration Blueprint

When an order is created (`POST /api/orders`), the backend triggers an automated WhatsApp message to both the customer and the shop manager:

```typescript
// Sample webhook dispatch snippet
async function sendOrderConfirmationWhatsApp(order: Order, shop: Shop) {
  const customerPhone = '91' + order.customer.phone.replace(/\D/g, '');
  const templatePayload = {
    messaging_product: 'whatsapp',
    to: customerPhone,
    type: 'template',
    template: {
      name: 'ssg_order_confirmed_2026',
      language: { code: 'en' },
      components: [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: order.customer.fullName },
            { type: 'text', text: order.id },
            { type: 'text', text: `Rs. ${order.total}` },
            { type: 'text', text: shop.name },
          ],
        },
      ],
    },
  };

  await fetch(`https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.WHATSAPP_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(templatePayload),
  });
}
```

---

## 5. Environment Variables Checklist

```env
DATABASE_URL="postgresql://user:password@localhost:5432/ssg_db"
WHATSAPP_PHONE_NUMBER_ID="your_phone_id"
WHATSAPP_API_TOKEN="your_access_token"
RAZORPAY_KEY_ID="rzp_live_xxx"
RAZORPAY_KEY_SECRET="your_razorpay_secret"
ADMIN_API_SECRET="your_secure_admin_token"
```

# API Contract

## 1. Overview
This document outlines the API endpoints, authentication requirements, and request/response/error examples based on the domain models and business constraints for the Orbit LMS system.

## 2. Endpoints Summary

| Method | Path | Input | Output | Auth |
| --- | --- | --- | --- | --- |
| POST | `/api/assistant/message` | `{sessionId,message}` | Assistant turn + tool result summary | CUSTOMER |
| GET | `/api/products` | `q,category,maxPrice` | `Product[]` | PUBLIC/AUTH |
| POST | `/api/cart/items` | `{productId,quantity}` | `Cart` | CUSTOMER |
| PATCH | `/api/cart/items/:id` | `{quantity}` | `Cart` | CUSTOMER |
| GET | `/api/cart` | - | `Cart` | CUSTOMER |
| POST | `/api/orders/draft` | - | `OrderDraft + confirmationToken` | CUSTOMER |
| POST | `/api/orders/confirm` | `{draftId,confirmationToken}` | `Order` | CUSTOMER |
| GET | `/api/orders/:id` | - | `Order` | OWNER/ADMIN |
| PATCH | `/api/admin/products/:id/stock` | `{quantity}` | `Inventory` | ADMIN |

## 3. Endpoints Details & Examples

### 3.1. Assistant Message
**POST** `/api/assistant/message`
**Auth:** CUSTOMER

**Request:**
```json
{
  "sessionId": "ses_123",
  "message": "I want to buy the latest math course"
}
```

**Response (200 OK):**
```json
{
  "transcript": "Okay, I've added the latest math course to your cart.",
  "intent": "ADD_TO_CART",
  "tool_name": "ADD_TO_CART",
  "status": "success",
  "tool_result": {
    "cartId": "cart_123"
  }
}
```

### 3.2. List Products
**GET** `/api/products`
**Auth:** PUBLIC/AUTH
**Query Parameters:** `q`, `category`, `maxPrice`

**Request:**
`GET /api/products?category=MATH&maxPrice=100`

**Response (200 OK):**
```json
[
  {
    "id": "prod_1",
    "sku": "MATH-101",
    "name": "Basic Math",
    "description": "Introduction to mathematics",
    "price": 49.99,
    "active": true
  }
]
```

### 3.3. Add Item to Cart
**POST** `/api/cart/items`
**Auth:** CUSTOMER

**Request:**
```json
{
  "productId": "prod_1",
  "quantity": 1
}
```

**Response (200 OK):**
```json
{
  "id": "cart_123",
  "user_id": "usr_123",
  "status": "open",
  "items": [
    {
      "product_id": "prod_1",
      "quantity": 1,
      "unit_price_snapshot": 49.99
    }
  ]
}
```

**Error (400 Bad Request - Invalid Quantity):**
```json
{
  "error": "BAD_REQUEST",
  "message": "Quantity must be greater than 0"
}
```

**Error (409 Conflict - Out of Stock):**
```json
{
  "error": "OUT_OF_STOCK",
  "message": "Not enough inventory for product MATH-101"
}
```

### 3.4. Update Cart Item
**PATCH** `/api/cart/items/:id`
**Auth:** CUSTOMER

**Request:**
```json
{
  "quantity": 2
}
```

**Response (200 OK):**
```json
{
  "id": "cart_123",
  "user_id": "usr_123",
  "status": "open",
  "items": [
    {
      "product_id": "prod_1",
      "quantity": 2,
      "unit_price_snapshot": 49.99
    }
  ]
}
```

**Error (400 Bad Request - Invalid Quantity):**
```json
{
  "error": "BAD_REQUEST",
  "message": "Quantity must be greater than 0"
}
```

### 3.5. Get Cart
**GET** `/api/cart`
**Auth:** CUSTOMER

**Response (200 OK):**
```json
{
  "id": "cart_123",
  "user_id": "usr_123",
  "status": "open",
  "items": [
    {
      "product_id": "prod_1",
      "quantity": 2,
      "unit_price_snapshot": 49.99
    }
  ]
}
```

### 3.6. Create Order Draft
**POST** `/api/orders/draft`
**Auth:** CUSTOMER

**Response (200 OK):**
```json
{
  "id": "draft_123",
  "user_id": "usr_123",
  "status": "draft",
  "total": 99.98,
  "confirmationToken": "tok_abc123"
}
```

**Error (400 Bad Request - Empty Cart):**
```json
{
  "error": "EMPTY_CART",
  "message": "Cannot create order draft from an empty cart"
}
```

### 3.7. Confirm Order
**POST** `/api/orders/confirm`
**Auth:** CUSTOMER

**Request:**
```json
{
  "draftId": "draft_123",
  "confirmationToken": "tok_abc123"
}
```

**Response (200 OK):**
```json
{
  "id": "ord_123",
  "user_id": "usr_123",
  "status": "confirmed",
  "subtotal": 99.98,
  "total": 99.98,
  "confirmed_at": "2026-09-21T10:00:00Z"
}
```

**Error (400 Bad Request - Invalid Token):**
```json
{
  "error": "INVALID_TOKEN",
  "message": "Confirmation token is invalid or expired"
}
```

### 3.8. Get Order
**GET** `/api/orders/:id`
**Auth:** OWNER/ADMIN

**Response (200 OK):**
```json
{
  "id": "ord_123",
  "user_id": "usr_123",
  "status": "confirmed",
  "subtotal": 99.98,
  "total": 99.98,
  "confirmed_at": "2026-09-21T10:00:00Z",
  "items": [
    {
      "product_id": "prod_1",
      "name_snapshot": "Basic Math",
      "unit_price": 49.99,
      "quantity": 2
    }
  ]
}
```

**Error (404 Not Found):**
```json
{
  "error": "NOT_FOUND",
  "message": "Order not found"
}
```

### 3.9. Update Product Stock
**PATCH** `/api/admin/products/:id/stock`
**Auth:** ADMIN

**Request:**
```json
{
  "quantity": 150
}
```

**Response (200 OK):**
```json
{
  "product_id": "prod_1",
  "quantity": 150,
  "updated_at": "2026-09-21T10:30:00Z"
}
```

**Error (400 Bad Request - Invalid Quantity):**
```json
{
  "error": "BAD_REQUEST",
  "message": "Inventory quantity cannot be negative"
}
```

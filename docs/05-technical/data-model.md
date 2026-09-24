# Data Model

## 1. Overview

This data model supports Orbit LMS with focus on learning content, assignment submissions, role-based access, AI Tutor voice flow, audit events, and order/cart/product domain services.

## 2. Entity definitions

| Entity | Fields | Rules |
| --- | --- | --- |
| User | id, email, role, created_at | role ∈ {CUSTOMER, ADMIN} |
| Product | id, sku, name, description, price, active | price >= 0; SKU unique |
| Inventory | product_id, quantity, updated_at | quantity >= 0 |
| Cart | id, user_id, status | 1 active cart per user |
| CartItem | cart_id, product_id, quantity, unit_price_snapshot | quantity > 0; validate stock |
| Order | id, user_id, status, subtotal, total, confirmed_at | created only after confirm |
| OrderItem | order_id, product_id, name_snapshot, unit_price, quantity | immutable snapshot |
| VoiceSession | id, user_id, started_at | no raw audio by default |
| VoiceTurn | session_id, transcript, intent, tool_name, status | redact sensitive fields |
| AuditEvent | actor_id, action, target, metadata, created_at | append-only for critical events |

## 3. Keys and relations

### User
- Primary key: `id`
- Unique field: `email`
- Role check: `role` in `CUSTOMER` or `ADMIN`

### Product
- Primary key: `id`
- Unique field: `sku`
- Product status: active/inactive

### Inventory
- Composite relation: one `Product` has one `Inventory` record
- Foreign key: `product_id -> Product.id`
- `quantity` must be non-negative

### Cart
- Primary key: `id`
- Foreign key: `user_id -> User.id`
- One active cart per user (`status = open`)

### CartItem
- Foreign keys: `cart_id -> Cart.id`, `product_id -> Product.id`
- quantity > 0
- stock validation must be performed when adding or updating cart item

### Order
- Primary key: `id`
- Foreign key: `user_id -> User.id`
- Status lifecycle: draft → confirmed → completed/cancelled
- Must be created only after confirmation from order flow

### OrderItem
- Foreign keys: `order_id -> Order.id`, `product_id -> Product.id`
- Snapshots must be immutable once order is created

### VoiceSession
- Primary key: `id`
- Foreign key: `user_id -> User.id`
- Store session metadata only; do not store raw audio by default

### VoiceTurn
- Foreign key: `session_id -> VoiceSession.id`
- Stores transcript and structured intent, tool, status metadata
- Sensitive fields must be redacted before logging

### AuditEvent
- Primary key: `id`
- Foreign keys: `actor_id -> User.id`
- Append-only log for critical actions and system events

## 4. Domain constraints

1. `Product.price >= 0`.
2. `Product.sku` must be unique.
3. `Inventory.quantity >= 0`.
4. `CartItem.quantity > 0`.
5. `CartItem` must validate stock before write.
6. One active cart per user.
7. `Order` can only be created after confirm event.
8. `OrderItem` stores immutable snapshot of product details at order creation.
9. `VoiceTurn` should not expose sensitive fields or raw audio.
10. `AuditEvent` writes only append-only critical metadata, not secrets.

## 5. Audit fields

Every critical entity should include common audit fields:

| Field | Meaning |
| --- | --- |
| `created_at` | Time of entity creation |
| `updated_at` | Last update time |
| `created_by` | User or service that created the record |
| `updated_by` | User or service that changed the record |
| `version` | Optimistic locking version |

## 6. Security and audit flow

- LLM must not access DB directly.
- Tool calls must be validated before domain service execution.
- Product/Cart/Order services are source-of-truth for domain data.
- Audit log captures tool name, arguments, status, latency, and order creation event metadata.
- Secrets and raw voice/audio should never be stored in the audit log.

## 7. Example ERD summary

```text
User 1---1 Cart 1---* CartItem *---1 Product
User 1---* Order 1---* OrderItem *---1 Product
User 1---* VoiceSession 1---* VoiceTurn
User 1---* AuditEvent
Product 1---1 Inventory
```

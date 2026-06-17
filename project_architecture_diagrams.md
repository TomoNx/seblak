# SeblakPOS: Architectural Diagrams & Specifications

This document provides visual models of the SeblakPOS architecture, database relationships (ERD), and execution sequences.

---

## 1. System Component Diagram (MVC & Layered Architecture)

This diagram visualizes how the Frontend (React SPA) and Backend (Express.js) components are layered and how data flows between them.

```mermaid
graph TD
    subgraph "Frontend Client (React SPA)"
        View[UI Views: KioskView, KasirView, AdminStatsView]
        Components[UI Components: MenuGrid, CartSidebar, EditOrderItemsModal, etc.]
        Hooks[Custom Hooks: useOrders, useMenuData, useLocalStorageSync]
        API[API Service Layer: src/services/api.ts]
    end

    subgraph "Backend Server (Express.js)"
        Routes[Router Layer: server/routes/*]
        Controllers[Controller Layer: server/controllers/*]
        Models[Model Layer: server/models/*]
        Utils[Price Calculator: server/utils/priceCalculator.ts]
        DBManager[Database Manager: server/db/manager.ts]
    end

    subgraph "Data Storage"
        SQLite[(SQLite DB: seblak.db)]
        JSONFallback[(JSON File Fallback: seblak_db.json)]
    end

    %% Interactions
    View --> Components
    Components --> Hooks
    Hooks --> API
    API -- "HTTP REST Requests" --> Routes
    Routes --> Controllers
    Controllers --> Models
    Controllers -. "Validates/Calculates Price" .-> Utils
    Models --> DBManager
    DBManager --> SQLite
    DBManager -. "If sqlite3 fails" .-> JSONFallback
```

---

## 2. Entity Relationship Diagram (ERD)

The application uses SQLite as a relational data store consisting of two main tables: `orders` (for transactions) and `kv_store` (acting as a document/setting registry store with JSON payloads).

```mermaid
erDiagram
    orders {
        TEXT id PK "Format: SEB-XXXX"
        TEXT queueNumber "2-digit queue number"
        TEXT customerName "Customer's name"
        TEXT items "JSON String of OrderItem[]"
        REAL totalPrice "Final computed total price"
        TEXT paymentMethod "Tunai | QRIS | Debit | null"
        TEXT status "draft | pending_payment | paid | completed | cancelled"
        TEXT createdAt "ISO 8601 Timestamp"
        TEXT paidAt "ISO 8601 Timestamp (optional)"
        TEXT completedAt "ISO 8601 Timestamp (optional)"
    }

    kv_store {
        TEXT key PK "Configuration key (e.g. toppings, presets, settings)"
        TEXT value "JSON String of the configuration payload"
    }

    %% Document relations inside kv_store values (logical references)
    presets_document }o--|| broths_document : "Logical defaultBroth reference"
    presets_document }o--o{ toppings_document : "Logical defaultToppings reference"
    orders_items_document }o--o{ toppings_document : "Mapped toppings display price"
```

### JSON Schema Structures inside Database Fields

#### A. Mapped Order `items` Column (inside `orders` table)
```json
[
  {
    "name": "Seblak Ndower Sosis Bakso",
    "type": "preset",
    "brothName": "Kuah Cikur Original (Juara)",
    "level": 4,
    "toppings": [
      { "name": "Kerupuk Kuning Sigung", "quantity": 1, "price": 0 },
      { "name": "Makaroni Spiral", "quantity": 1, "price": 0 },
      { "name": "Sosis Sapi Premium (4 pcs)", "quantity": 1, "price": 0 },
      { "name": "Bakso Sapi Slice (3 pcs)", "quantity": 1, "price": 0 },
      { "name": "Cuanki Tahu Spons (2 pcs)", "quantity": 1, "price": 0 },
      { "name": "Kol Segar Irisan", "quantity": 1, "price": 0 }
    ],
    "pricePerUnit": 17500,
    "quantity": 1,
    "notes": ""
  }
]
```

#### B. Mapped Configurations (inside `kv_store` value for key `'toppings'`)
```json
[
  {
    "id": "t_kerupuk_kuning",
    "name": "Kerupuk Kuning Sigung",
    "category": "karbo",
    "price": 1500,
    "stock": 50,
    "description": "Kerupuk seblak klasik, kenyal dan lembut"
  }
]
```

---

## 3. Sequence Diagram: Kiosk Order Creation Flow

Shows the step-by-step transaction sequence when a customer places an order via the Self-Service Kiosk.

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Kiosk Customer
    participant K as KioskView
    participant H as useOrders Hook
    participant API as api.ts Client
    participant R as orders Route (Router)
    participant C as orderController
    participant PC as priceCalculator
    participant M as orderModel
    participant DB as db/manager

    Customer->>K: Select items, add customer name, click Checkout
    K->>K: Map cart items to raw payload format
    K->>H: call addOrder(newOrderPayload)
    H->>API: call createOrder(newOrderPayload)
    API->>R: POST /api/orders (JSON body)
    R->>C: invoke create(req, res)
    C->>DB: Fetch toppings, broths, presets config
    DB-->>C: Return configs
    C->>PC: calculateItemUnitPrice() & getToppingDisplayPrice()
    PC-->>C: Return processed items and totalPrice
    C->>M: call createOrder(finalizedOrder)
    M->>DB: INSERT INTO orders values
    DB-->>M: Success
    C->>M: call getOrderById(orderId)
    M->>DB: SELECT * FROM orders WHERE id = ?
    DB-->>M: Return created order record
    M-->>C: Return order object
    C-->>API: JSON Response (201 Created with complete order)
    API-->>H: Resolve Promise<Order>
    H->>H: Update local state & save to LocalStorage
    H-->>K: Return savedOrder object
    K->>K: Set step to 'checkout_success'
    K-->>Customer: Display print receipt & queue number
```

---

## 4. Sequence Diagram: Cashier Order Items Edit Flow

Shows the transaction sequence when the cashier edits order items and toppings.

```mermaid
sequenceDiagram
    autonumber
    actor Cashier as Cashier Admin
    participant M as EditOrderItemsModal
    participant H as useOrders Hook
    participant API as api.ts Client
    participant R as orders Route (Router)
    participant C as orderController
    participant PC as priceCalculator
    participant Mo as orderModel
    participant DB as db/manager

    Cashier->>M: Add toppings/adjust quantities, click Save Changes
    M->>H: call updateOrder(updatedOrderPayload)
    H->>API: call updateOrder(orderId, updatedOrderPayload)
    API->>R: PUT /api/orders/:id (JSON body)
    R->>C: invoke update(req, res)
    C->>Mo: call getOrderById(orderId)
    Mo->>DB: SELECT * FROM orders WHERE id = ?
    DB-->>Mo: Return existing order record
    Mo-->>C: Return order object
    C->>DB: Fetch configuration items
    DB-->>C: Return configs
    C->>PC: Recalculate item unit prices & total price
    PC-->>C: Return processed items & new totalPrice
    C->>Mo: call updateOrder(orderId, updatedOrder)
    Mo->>DB: UPDATE orders SET ... WHERE id = ?
    DB-->>Mo: Success
    C->>Mo: call getOrderById(orderId)
    Mo->>DB: SELECT * FROM orders WHERE id = ?
    DB-->>Mo: Return updated order record
    Mo-->>C: Return order object
    C-->>API: JSON Response (200 OK with complete updated order)
    API-->>H: Resolve Promise<Order>
    H->>H: Replace order in state & LocalStorage
    H-->>M: State propagates re-render
    M->>M: Close modal
    M-->>Cashier: Display updated order and receipt summary on dashboard
```

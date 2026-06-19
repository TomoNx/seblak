# SeblakPOS: Architectural Diagrams & Specifications

This document provides visual models of the SeblakPOS architecture, database relationships (ERD), use cases, and execution sequences.

---

## 1. System Component Diagram (MVC & Layered Architecture)

This diagram visualizes how the Frontend (React SPA) and Backend (Express.js) components are layered, and how they communicate with the database.

```mermaid
graph TD
    subgraph "Frontend Client (React SPA)"
        View["UI Views: KioskView, KasirView, AdminStatsView"]
        Components["UI Components: MenuGrid, CartSidebar, EditOrderItemsModal, etc."]
        Hooks["Custom Hooks: useOrders, useMenuData, useLocalStorageSync"]
        API["API Service Layer: src/services/api.ts"]
    end

    subgraph "Backend Server (Express.js)"
        Routes["Router Layer: server/routes/*"]
        Controllers["Controller Layer: server/controllers/*"]
        Models["Model Layer: server/models/*"]
        Utils["Price Calculator: server/utils/priceCalculator.ts"]
        DBManager["Database Manager: server/db/manager.ts"]
    end

    subgraph "Data Storage"
        MySQL["MySQL / MariaDB Database"]
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
    DBManager --> MySQL
```

![MVC System Component Diagram](assets/mvc_system_component_diagram.png)

---

## 2. Use Case Diagram

The use cases model the interactions between Kiosk Customers, Cashier Staff, and the SeblakPOS system.

```mermaid
graph LR
    %% Actors
    CustomerNode["Customer (Self-Service)"]
    CashierNode["Cashier Staff"]

    subgraph "SeblakPOS Application Boundary"
        %% Customer Use Cases
        UC_Browse["Browse Menu presets & snacks"]
        UC_CustomOrder["Customize Seblak (Broth, Toppings, Spicy Level)"]
        UC_SelectOrderType["Select Order Type (Dine-in / Take-away)"]
        UC_Checkout["Checkout Order (Enter Name, Generate ID)"]
        UC_ScanQR["Simulate QRIS Payment via Phone"]

        %% Cashier Use Cases
        UC_ViewQueue["View Order List & Statuses"]
        UC_EditOrder["Edit Order Items & Toppings (If unpaid)"]
        UC_ConfirmPayment["Process Cash/QRIS Payment"]
        UC_PrintReceipt["Print Thermal Struk (Browser Printing)"]

        %% Admin/Management Use Cases (Handled by Cashier)
        UC_Analytics["View Financial & Menu Analytics"]
        UC_ManageMenu["Manage Menu Configurations (Stock, Prices, Toppings)"]
    end

    %% Relations Customer
    CustomerNode --> UC_Browse
    CustomerNode --> UC_CustomOrder
    CustomerNode --> UC_SelectOrderType
    CustomerNode --> UC_Checkout
    CustomerNode --> UC_ScanQR

    %% Relations Cashier
    CashierNode --> UC_ViewQueue
    CashierNode --> UC_EditOrder
    CashierNode --> UC_ConfirmPayment
    CashierNode --> UC_PrintReceipt
    CashierNode --> UC_Analytics
    CashierNode --> UC_ManageMenu
```

![Use Case Diagram](assets/use_case_diagram.png)

---

## 3. Entity Relationship Diagram (ERD)

The application uses MySQL/MariaDB as a relational data store. Orders are stored in a relational normalized format across three main transactional tables (`orders`, `order_items`, and `order_item_toppings`), while the menu categories, toppings, presets, snacks, and settings are managed in config tables.

```mermaid
erDiagram
    menu_categories {
        varchar id PK
        varchar name
    }

    topping_categories {
        varchar id PK
        varchar name
    }

    broths {
        varchar id PK
        varchar name
        text description
        decimal price
    }

    toppings {
        varchar id PK
        varchar name
        varchar category_id FK
        decimal price
        int stock
        text description
        boolean is_active
    }

    presets {
        varchar id PK
        varchar name
        text description
        decimal base_price
        int default_level
        varchar default_broth_id FK
        varchar image
        boolean is_popular
    }

    preset_toppings {
        varchar preset_id PK, FK
        varchar topping_id PK, FK
    }

    snacks_drinks {
        varchar id PK
        varchar name
        varchar category_id FK
        decimal price
        text description
        varchar image
        boolean is_popular
    }

    shop_settings {
        varchar id PK "settings_default"
        varchar shop_name
        text shop_address
        varchar shop_phone
        text qris_image
        varchar admin_pin
    }

    orders {
        varchar id PK "Format: SEB-XXXX"
        varchar queue_number "Legacy column, holds empty string"
        varchar customer_name
        decimal total_price
        varchar payment_method "Tunai | QRIS | Debit | NULL"
        varchar status "draft | pending_payment | paid | completed | cancelled"
        datetime created_at
        datetime paid_at "NULL"
        datetime completed_at "NULL"
        varchar order_type "'dine_in' | 'take_away'"
    }

    order_items {
        int id PK "AUTO_INCREMENT"
        varchar order_id FK
        varchar name
        varchar type "'preset' | 'custom' | 'snack' | 'drink'"
        varchar broth_name
        int level
        decimal price_per_unit
        int quantity
        text notes
    }

    order_item_toppings {
        int id PK "AUTO_INCREMENT"
        int order_item_id FK
        varchar name
        int quantity
        decimal price
    }

    %% Relationships
    topping_categories ||--o{ toppings : "categorizes"
    menu_categories ||--o{ snacks_drinks : "categorizes"
    broths ||--o{ presets : "has default"
    presets ||--o{ preset_toppings : "includes default"
    toppings ||--o{ preset_toppings : "is included in default"
    orders ||--|{ order_items : "contains"
    order_items ||--o{ order_item_toppings : "has customized"
```

![Entity Relationship Diagram](assets/entity_relationship_diagram.png)

---

## 4. Sequence Diagram: Kiosk Order Creation Flow

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
    participant DB as MySQL DB

    Customer->>K: Select items & spicy level
    Customer->>K: Select Order Type (Dine-in / Take-away)
    Customer->>K: Enter Customer Name & click Checkout
    K->>K: Map cart items to payload (including orderType)
    K->>H: call addOrder(newOrderPayload)
    H->>API: call createOrder(newOrderPayload)
    API->>R: POST /api/orders (JSON body)
    R->>C: invoke create(req, res)
    C->>C: processOrderItems(items)
    C->>DB: Fetch active menu configurations (toppings, presets, broths)
    DB-->>C: Return configuration rows
    C->>PC: calculateItemUnitPrice() & getToppingDisplayPrice()
    PC-->>C: Return calculated unit prices & item totals
    C->>M: call createOrder(finalizedOrder)
    M->>DB: INSERT INTO orders & order_items & order_item_toppings (Transaction)
    DB-->>M: Transaction Success
    C->>M: call getOrderById(orderId)
    M->>DB: SELECT from orders joined with items & toppings
    DB-->>M: Return joined order record
    M-->>C: Return complete order object
    C-->>API: JSON Response (201 Created)
    API-->>H: Resolve Promise<Order>
    H->>H: Sync order state & update LocalStorage
    H-->>K: Return savedOrder object
    K->>K: Set step to 'checkout_success'
    K-->>Customer: Display Success Panel & print-ready Receipt
```

![Kiosk Order Creation Flow Diagram Image](assets/kiosk_order_creation_flow.png)

---

## 5. Sequence Diagram: Cashier Order Items Edit Flow & Print Flow

Shows the transaction sequence when the cashier edits order items/toppings, pays, or prints receipts.

```mermaid
sequenceDiagram
    autonumber
    actor Cashier as Cashier Admin
    participant V as KasirView
    participant O as OrderDetailPanel
    participant M as EditOrderItemsModal
    participant H as useOrders Hook
    participant API as api.ts Client
    participant R as orders Route (Router)
    participant C as orderController
    participant PC as priceCalculator
    participant Mo as orderModel
    participant DB as MySQL DB

    Cashier->>V: Select order (unpaid status)
    V->>O: Display Order details
    O->>O: Enable Edit button (since status is pending_payment)
    Cashier->>O: Click Edit Order
    O->>M: Open Edit Modal
    Cashier->>M: Adjust toppings/quantities, click Save Changes
    M->>H: call updateOrder(updatedOrderPayload)
    H->>API: call updateOrder(orderId, updatedOrderPayload)
    API->>R: PUT /api/orders/:id (JSON body)
    R->>C: invoke update(req, res)
    C->>Mo: call getOrderById(orderId)
    Mo->>DB: SELECT order, items, toppings
    DB-->>Mo: Return existing records
    C->>C: processOrderItems(updatedItems)
    C->>PC: Recalculate unit prices & total price
    PC-->>C: Return processed items & new totalPrice
    C->>Mo: call updateOrder(orderId, updatedOrder)
    Mo->>DB: UPDATE orders & DELETE/INSERT order_items & order_item_toppings
    DB-->>Mo: Transaction Success
    C->>Mo: call getOrderById(orderId)
    Mo->>DB: SELECT updated order, items, toppings
    DB-->>Mo: Return updated records
    C-->>API: JSON Response (200 OK with updated order)
    API-->>H: Resolve Promise<Order>
    H->>H: Update state & LocalStorage
    H-->>M: Close modal
    M-->>V: Propagate update & re-render view
    Cashier->>O: Click Print Struk
    O->>O: Call window.print()
    O-->>Cashier: Open browser print dialog (showing only the styled receipt)
```

![Cashier Order Edit & Print Flow Diagram Image](assets/cashier_order_edit_print_flow.png)

import { pool } from "../db/manager";

export async function getAllOrders(): Promise<any[]> {
  const [orderRows] = await pool.query("SELECT * FROM orders ORDER BY created_at DESC");
  const orders = orderRows as any[];

  if (orders.length === 0) return [];

  // Ambil semua items untuk order ini
  const orderIds = orders.map(o => o.id);
  const [itemRows] = await pool.query(
    "SELECT * FROM order_items WHERE order_id IN (?)",
    [orderIds]
  );
  const items = itemRows as any[];

  // Ambil semua topping untuk items ini
  let toppings: any[] = [];
  if (items.length > 0) {
    const itemIds = items.map(i => i.id);
    const [toppingRows] = await pool.query(
      "SELECT * FROM order_item_toppings WHERE order_item_id IN (?)",
      [itemIds]
    );
    toppings = toppingRows as any[];
  }

  // Petakan topping ke item masing-masing
  const itemsMap = items.reduce((acc, item) => {
    item.toppings = toppings
      .filter(t => t.order_item_id === item.id)
      .map(t => ({ 
        name: t.name, 
        quantity: t.quantity, 
        price: parseFloat(t.price) 
      }));
    
    if (!acc[item.order_id]) acc[item.order_id] = [];
    acc[item.order_id].push({
      name: item.name,
      type: item.type,
      brothName: item.broth_name,
      level: item.level,
      pricePerUnit: parseFloat(item.price_per_unit),
      quantity: item.quantity,
      notes: item.notes,
      toppings: item.toppings
    });
    return acc;
  }, {} as Record<string, any[]>);

  // Satukan data ke objek Order
  return orders.map(o => ({
    id: o.id,
    queueNumber: o.queue_number,
    customerName: o.customer_name,
    totalPrice: parseFloat(o.total_price),
    paymentMethod: o.payment_method,
    status: o.status,
    createdAt: o.created_at.toISOString ? o.created_at.toISOString() : new Date(o.created_at).toISOString(),
    paidAt: o.paid_at ? (o.paid_at.toISOString ? o.paid_at.toISOString() : new Date(o.paid_at).toISOString()) : undefined,
    completedAt: o.completed_at ? (o.completed_at.toISOString ? o.completed_at.toISOString() : new Date(o.completed_at).toISOString()) : undefined,
    items: itemsMap[o.id] || []
  }));
}

export async function getOrderById(id: string): Promise<any | null> {
  const [orderRows] = await pool.query("SELECT * FROM orders WHERE id = ?", [id]);
  const orders = orderRows as any[];
  if (orders.length === 0) return null;
  const o = orders[0];

  const [itemRows] = await pool.query("SELECT * FROM order_items WHERE order_id = ?", [id]);
  const items = itemRows as any[];

  let toppings: any[] = [];
  if (items.length > 0) {
    const itemIds = items.map(i => i.id);
    const [toppingRows] = await pool.query(
      "SELECT * FROM order_item_toppings WHERE order_item_id IN (?)",
      [itemIds]
    );
    toppings = toppingRows as any[];
  }

  const itemsMapped = items.map(item => ({
    name: item.name,
    type: item.type,
    brothName: item.broth_name,
    level: item.level,
    pricePerUnit: parseFloat(item.price_per_unit),
    quantity: item.quantity,
    notes: item.notes,
    toppings: toppings
      .filter(t => t.order_item_id === item.id)
      .map(t => ({ 
        name: t.name, 
        quantity: t.quantity, 
        price: parseFloat(t.price) 
      }))
  }));

  return {
    id: o.id,
    queueNumber: o.queue_number,
    customerName: o.customer_name,
    totalPrice: parseFloat(o.total_price),
    paymentMethod: o.payment_method,
    status: o.status,
    createdAt: o.created_at.toISOString ? o.created_at.toISOString() : new Date(o.created_at).toISOString(),
    paidAt: o.paid_at ? (o.paid_at.toISOString ? o.paid_at.toISOString() : new Date(o.paid_at).toISOString()) : undefined,
    completedAt: o.completed_at ? (o.completed_at.toISOString ? o.completed_at.toISOString() : new Date(o.completed_at).toISOString()) : undefined,
    items: itemsMapped
  };
}

export async function createOrder(order: any): Promise<void> {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    await conn.query(
      `INSERT INTO orders (id, queue_number, customer_name, total_price, payment_method, status, created_at, paid_at, completed_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        order.id, order.queueNumber, order.customerName, order.totalPrice,
        order.paymentMethod || null, order.status,
        new Date(order.createdAt),
        order.paidAt ? new Date(order.paidAt) : null,
        order.completedAt ? new Date(order.completedAt) : null
      ]
    );

    for (const item of order.items) {
      const [itemResult] = await conn.query(
        `INSERT INTO order_items (order_id, name, type, broth_name, level, price_per_unit, quantity, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          order.id, item.name, item.type,
          item.brothName || '', item.level || 0,
          item.pricePerUnit, item.quantity, item.notes || ''
        ]
      );
      const orderItemId = (itemResult as any).insertId;

      if (item.toppings && item.toppings.length > 0) {
        for (const t of item.toppings) {
          await conn.query(
            `INSERT INTO order_item_toppings (order_item_id, name, quantity, price)
             VALUES (?, ?, ?, ?)`,
            [orderItemId, t.name, t.quantity, t.price]
          );
        }
      }
    }

    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

export async function updateOrder(id: string, order: any): Promise<void> {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    await conn.query(
      `UPDATE orders
       SET queue_number = ?, customer_name = ?, total_price = ?,
           payment_method = ?, status = ?, created_at = ?, paid_at = ?, completed_at = ?
       WHERE id = ?`,
      [
        order.queueNumber, order.customerName, order.totalPrice,
        order.paymentMethod || null, order.status,
        new Date(order.createdAt),
        order.paidAt ? new Date(order.paidAt) : null,
        order.completedAt ? new Date(order.completedAt) : null,
        id
      ]
    );

    // Hapus items lama (akan meng-cascade hapus topping secara otomatis)
    await conn.query("DELETE FROM order_items WHERE order_id = ?", [id]);

    for (const item of order.items) {
      const [itemResult] = await conn.query(
        `INSERT INTO order_items (order_id, name, type, broth_name, level, price_per_unit, quantity, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id, item.name, item.type,
          item.brothName || '', item.level || 0,
          item.pricePerUnit, item.quantity, item.notes || ''
        ]
      );
      const orderItemId = (itemResult as any).insertId;

      if (item.toppings && item.toppings.length > 0) {
        for (const t of item.toppings) {
          await conn.query(
            `INSERT INTO order_item_toppings (order_item_id, name, quantity, price)
             VALUES (?, ?, ?, ?)`,
            [orderItemId, t.name, t.quantity, t.price]
          );
        }
      }
    }

    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

export async function deleteOrder(id: string): Promise<void> {
  await pool.query("DELETE FROM orders WHERE id = ?", [id]);
}

export async function resetOrders(): Promise<void> {
  await pool.query("DELETE FROM orders");
}

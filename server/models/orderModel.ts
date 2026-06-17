import { dbRun, dbAll, dbGet } from "../db/manager";

export async function getAllOrders(): Promise<any[]> {
  const rows = await dbAll(`SELECT * FROM orders ORDER BY createdAt DESC`);
  return rows.map((r: any) => ({
    ...r,
    items: JSON.parse(r.items as string)
  }));
}

export async function getOrderById(id: string): Promise<any | null> {
  const row = await dbGet(`SELECT * FROM orders WHERE id = ?`, [id]);
  if (!row) return null;
  return {
    ...row,
    items: JSON.parse((row as any).items as string)
  };
}

export async function createOrder(order: any): Promise<void> {
  await dbRun(
    `INSERT INTO orders (id, queueNumber, customerName, items, totalPrice, paymentMethod, status, createdAt, paidAt, completedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      order.id, order.queueNumber, order.customerName,
      JSON.stringify(order.items), order.totalPrice,
      order.paymentMethod || null, order.status, order.createdAt,
      order.paidAt || null, order.completedAt || null
    ]
  );
}

export async function updateOrder(id: string, order: any): Promise<void> {
  await dbRun(
    `UPDATE orders
     SET queueNumber = ?, customerName = ?, items = ?, totalPrice = ?,
         paymentMethod = ?, status = ?, createdAt = ?, paidAt = ?, completedAt = ?
     WHERE id = ?`,
    [
      order.queueNumber, order.customerName,
      JSON.stringify(order.items), order.totalPrice,
      order.paymentMethod || null, order.status, order.createdAt,
      order.paidAt || null, order.completedAt || null, id
    ]
  );
}

export async function deleteOrder(id: string): Promise<void> {
  await dbRun(`DELETE FROM orders WHERE id = ?`, [id]);
}

export async function resetOrders(): Promise<void> {
  await dbRun(`DELETE FROM orders`);
}

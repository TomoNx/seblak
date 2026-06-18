import { Request, Response } from "express";
import * as orderModel from "../models/orderModel";
import * as configModel from "../models/configModel";
import { calculateItemUnitPrice, getToppingDisplayPrice } from "../utils/priceCalculator";
import { OrderCreateSchema, OrderUpdateSchema, OrderItemInput } from "../validations/orderSchema";

async function processOrderItems(rawItems: OrderItemInput[]): Promise<{ items: any[], totalPrice: number }> {
  const toppings = await configModel.getConfig('toppings') || [];
  const broths = await configModel.getConfig('broths') || [];
  const presets = await configModel.getConfig('presets') || [];
  const snacksAndDrinks = await configModel.getConfig('snacksAndDrinks') || [];

  let totalPrice = 0;

  const processedItems = rawItems.map((item) => {
    if (item.type === 'snack' || item.type === 'drink') {
      const match = snacksAndDrinks.find((sd: any) => sd.name === item.name);
      const pricePerUnit = match ? match.price : (item.pricePerUnit || 0);
      totalPrice += pricePerUnit * item.quantity;
      return {
        name: item.name,
        type: item.type,
        brothName: '',
        level: 0,
        toppings: [],
        pricePerUnit,
        quantity: item.quantity,
        notes: item.notes || ''
      };
    }

    const itemType = item.type; // Narrowed to 'custom' | 'preset'
    const preset = presets.find((p: any) => p.name === item.name);
    const basePrice = itemType === 'custom' ? 6000 : (preset ? preset.basePrice : 0);

    const clientBroth = item.brothName || (item.broth ? (item.broth.name || item.broth.id) : null);
    const brothObj = broths.find((b: any) => 
      (clientBroth && (b.name === clientBroth || b.id === clientBroth))
    ) || broths.find((b: any) => b.id === (preset ? preset.defaultBroth : 'b_cikur_ori')) || broths[0];
    const brothName = brothObj ? brothObj.name : '';

    const toppingsEntries = (item.toppings || []).map((t) => {
      const tid = t.topping ? t.topping.id : t.id;
      const topDef = toppings.find((td: any) => 
        (tid && td.id === tid) || 
        (t.name && td.name === t.name)
      );
      return topDef ? { topping: topDef, quantity: t.quantity } : null;
    }).filter(Boolean) as { topping: any; quantity: number }[];

    const unitPrice = calculateItemUnitPrice(
      itemType,
      basePrice,
      brothObj,
      toppingsEntries,
      preset
    );

    const toppingsMapped = toppingsEntries.map(t => {
      const displayPrice = getToppingDisplayPrice(
        t.topping.id,
        t.topping.price,
        itemType,
        preset
      );
      return { name: t.topping.name, quantity: t.quantity, price: displayPrice };
    });

    totalPrice += unitPrice * item.quantity;

    return {
      name: item.name,
      type: item.type,
      brothName,
      level: item.level || 0,
      toppings: toppingsMapped,
      pricePerUnit: unitPrice,
      quantity: item.quantity,
      notes: item.notes || ''
    };
  });

  return { items: processedItems, totalPrice };
}

export async function getAll(_req: Request, res: Response) {
  try {
    const orders = await orderModel.getAllOrders();
    res.json(orders);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function create(req: Request, res: Response) {
  try {
    const validation = OrderCreateSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.format() });
    }
    const order = validation.data;

    const { items: processedItems, totalPrice } = await processOrderItems(order.items);
    const orderId = order.id || `SEB-${Math.floor(1000 + Math.random() * 9000)}`;
    const queueNumber = order.queueNumber || String(Math.floor(1 + Math.random() * 99)).padStart(2, '0');
    const createdAt = order.createdAt || new Date().toISOString();
    const status = order.status || "pending_payment";

    const newOrder = {
      id: orderId,
      queueNumber,
      customerName: order.customerName,
      items: processedItems,
      totalPrice,
      paymentMethod: order.paymentMethod || null,
      status,
      createdAt,
      paidAt: order.paidAt || null,
      completedAt: order.completedAt || null
    };

    await orderModel.createOrder(newOrder);

    const created = await orderModel.getOrderById(orderId);
    res.status(201).json(created);
  } catch (err: any) {
    console.error("Error creating order:", err);
    res.status(500).json({ error: err.message });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validation = OrderUpdateSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.format() });
    }
    const order = validation.data;

    const existing = await orderModel.getOrderById(id);
    if (!existing) {
      return res.status(404).json({ error: "Order not found." });
    }

    let processedItems = existing.items;
    let totalPrice = existing.totalPrice;

    if (order.items) {
      const result = await processOrderItems(order.items);
      processedItems = result.items;
      totalPrice = result.totalPrice;
    }

    const queueNumber = order.queueNumber !== undefined ? order.queueNumber : existing.queueNumber;
    const customerName = order.customerName !== undefined ? order.customerName : existing.customerName;
    const paymentMethod = order.paymentMethod !== undefined ? order.paymentMethod : existing.paymentMethod;
    const status = order.status !== undefined ? order.status : existing.status;
    const createdAt = order.createdAt !== undefined ? order.createdAt : existing.createdAt;
    const paidAt = order.paidAt !== undefined ? order.paidAt : existing.paidAt;
    const completedAt = order.completedAt !== undefined ? order.completedAt : existing.completedAt;

    const updatedOrder = {
      queueNumber,
      customerName,
      items: processedItems,
      totalPrice,
      paymentMethod,
      status,
      createdAt,
      paidAt,
      completedAt
    };

    await orderModel.updateOrder(id, updatedOrder);

    const updated = await orderModel.getOrderById(id);
    res.json(updated);
  } catch (err: any) {
    console.error("Error updating order:", err);
    res.status(500).json({ error: err.message });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await orderModel.deleteOrder(id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

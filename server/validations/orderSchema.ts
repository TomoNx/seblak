import { z } from "zod";

const ToppingEntrySchema = z.object({
  id: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  price: z.number().optional().nullable(),
  quantity: z.number().int().min(1, "Kuantitas topping minimal 1"),
  topping: z.object({
    id: z.string().optional().nullable(),
    name: z.string().optional().nullable(),
    price: z.number().optional().nullable()
  }).optional().nullable()
});

const OrderItemSchema = z.object({
  name: z.string().min(1, "Nama item tidak boleh kosong"),
  type: z.enum(['custom', 'preset', 'snack', 'drink']),
  brothName: z.string().optional().nullable(),
  broth: z.object({
    id: z.string().optional().nullable(),
    name: z.string().optional().nullable()
  }).optional().nullable(),
  level: z.number().int().min(0).max(10).optional().nullable(),
  toppings: z.array(ToppingEntrySchema).optional().nullable(),
  quantity: z.number().int().min(1, "Jumlah item minimal 1"),
  notes: z.string().optional().nullable(),
  pricePerUnit: z.number().optional().nullable()
});

export const OrderCreateSchema = z.object({
  id: z.string().optional().nullable(),
  queueNumber: z.string().optional().nullable(),
  customerName: z.string().min(1, "Nama pelanggan tidak boleh kosong"),
  items: z.array(OrderItemSchema).min(1, "Pesanan harus berisi minimal 1 item"),
  paymentMethod: z.enum(['Tunai', 'QRIS', 'Debit']).optional().nullable(),
  status: z.enum(['draft', 'pending_payment', 'paid', 'completed', 'cancelled']).optional().nullable(),
  createdAt: z.string().optional().nullable(),
  paidAt: z.string().optional().nullable(),
  completedAt: z.string().optional().nullable(),
  totalPrice: z.number().optional().nullable(),
  orderType: z.enum(['dine_in', 'take_away']).optional().nullable()
});

export const OrderUpdateSchema = OrderCreateSchema.partial();

export type OrderCreateInput = z.infer<typeof OrderCreateSchema>;
export type OrderUpdateInput = z.infer<typeof OrderUpdateSchema>;
export type OrderItemInput = z.infer<typeof OrderItemSchema>;
export type ToppingEntryInput = z.infer<typeof ToppingEntrySchema>;

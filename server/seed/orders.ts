/**
 * Default seed data for demonstration orders.
 * These orders are inserted when the database is empty to showcase the POS functionality.
 */

export const SEEDED_ORDERS = [
  {
    id: 'SEB-1025',
    queueNumber: '12',
    customerName: 'Budi Santoso',
    items: [
      {
        name: 'Custom Seblak DIY',
        type: 'custom',
        brothName: 'Kuah Cikur Original (Juara)',
        level: 3,
        toppings: [
          { name: 'Kwetiau Kenyal', quantity: 1, price: 2500 },
          { name: 'Dumpling Keju (1 pc)', quantity: 2, price: 4000 },
          { name: 'Chikuwa Ring (3 pcs)', quantity: 1, price: 3000 },
          { name: 'Sosis Sapi Premium (4 pcs)', quantity: 1, price: 3000 },
          { name: 'Telur Ayam Orak-arik', quantity: 1, price: 4500 }
        ],
        pricePerUnit: 21000,
        quantity: 1,
        notes: 'Minta daun bawang dipisah ya mba'
      }
    ],
    totalPrice: 21000,
    paymentMethod: 'QRIS',
    status: 'completed',
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    paidAt: new Date(Date.now() - 4.5 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 1 * 60 * 1000).toISOString()
  },
  {
    id: 'SEB-1390',
    queueNumber: '13',
    customerName: 'Rian Prasetyo',
    items: [
      {
        name: 'Seblak Ndower Sosis Bakso',
        type: 'preset',
        brothName: 'Kuah Cikur Original (Juara)',
        level: 4,
        toppings: [
          { name: 'Kerupuk Kuning Sigung', quantity: 1, price: 0 },
          { name: 'Makaroni Spiral', quantity: 1, price: 0 },
          { name: 'Sosis Sapi Premium (4 pcs)', quantity: 1, price: 0 },
          { name: 'Bakso Sapi Slice (3 pcs)', quantity: 1, price: 0 },
          { name: 'Cuanki Tahu Spons (2 pcs)', quantity: 1, price: 0 },
          { name: 'Kol Segar Irisan', quantity: 1, price: 0 }
        ],
        pricePerUnit: 17500,
        quantity: 2,
        notes: 'Yang satu level 4 super pedas lada, yang satu level 1 saja'
      }
    ],
    totalPrice: 35000,
    paymentMethod: 'QRIS',
    status: 'paid',
    createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    paidAt: new Date(Date.now() - 10 * 60 * 1000).toISOString()
  },
  {
    id: 'SEB-8231',
    queueNumber: '99',
    customerName: 'Santi Kemang',
    items: [
      {
        name: 'Seblak Seafood Suki Mewah',
        type: 'preset',
        brothName: 'Kuah Creamy Keju Susu',
        level: 3,
        toppings: [
          { name: 'Kwetiau Kenyal', quantity: 1, price: 0 },
          { name: 'Chikuwa Ring (3 pcs)', quantity: 1, price: 0 },
          { name: 'Crab Stick Slice (2 pcs)', quantity: 1, price: 0 },
          { name: 'Dumpling Keju (1 pc)', quantity: 1, price: 0 },
          { name: 'Telur Puyuh Rebus (3 pcs)', quantity: 1, price: 0 },
          { name: 'Jamur Kuping Iris', quantity: 1, price: 0 }
        ],
        pricePerUnit: 24500,
        quantity: 1,
        notes: 'Pilus cikur nya dibanyakin ya tehh'
      }
    ],
    totalPrice: 24500,
    paymentMethod: 'Debit',
    status: 'completed',
    createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    paidAt: new Date(Date.now() - 38 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString()
  }
];

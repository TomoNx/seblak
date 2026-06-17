/**
 * Default seed data for client-side fallback.
 *
 * Re-exports types and formatters from their canonical locations.
 * Menu data here is used as offline fallback when the server is unavailable.
 */

import { Topping, Broth, PresetMenu, SnackOrDrink } from './types';

// Re-export for backward compatibility during migration
export type { SnackOrDrink } from './types';
export { formatRupiah } from './utils/formatters';

export const TOPPINGS: Topping[] = [
  // Karbohidrat / Kerupuk
  { id: 't_kerupuk_kuning', name: 'Kerupuk Kuning Sigung', category: 'karbo', price: 1500, stock: 50, description: 'Kerupuk seblak klasik, kenyal dan lembut' },
  { id: 't_kerupuk_pelangi', name: 'Kerupuk Bawang Pelangi', category: 'karbo', price: 1500, stock: 45, description: 'Kerupuk warna-warni rasa bawang gurih' },
  { id: 't_kerupuk_orange', name: 'Kerupuk Potato Orange', category: 'karbo', price: 1500, stock: 40, description: 'Kerupuk kentang oren renyah saat kering, kenyal saat matang' },
  { id: 't_makaroni', name: 'Makaroni Spiral', category: 'karbo', price: 2000, stock: 60, description: 'Makaroni pilihan yang mekar sempurna' },
  { id: 't_kwetiau', name: 'Kwetiau Kenyal', category: 'karbo', price: 2500, stock: 35, description: 'Kwetiau basah yang lembut dan kenyal' },
  { id: 't_mie', name: 'Mie Keriting', category: 'karbo', price: 2500, stock: 50, description: 'Mie instan keriting penggugah selera' },

  // Protein / Daging & Seafood
  { id: 't_bakso', name: 'Bakso Sapi Slice (3 pcs)', category: 'protein', price: 3000, stock: 40, description: 'Irisan bakso sapi asli yang gurih berdaging' },
  { id: 't_sosis', name: 'Sosis Sapi Premium (4 pcs)', category: 'protein', price: 3000, stock: 40, description: 'Sosis sapi iris premium berkualitas' },
  { id: 't_ceker', name: 'Ceker Jumbo Empuk (2 pcs)', category: 'protein', price: 4000, stock: 25, description: 'Ceker ayam yang direbus lama hingga empuk dan lumer' },
  { id: 't_dumpling_keju', name: 'Dumpling Keju (1 pc)', category: 'protein', price: 4000, stock: 30, description: 'Bakso ikan premium dengan isi keju meleleh di dalamnya' },
  { id: 't_dumpling_ayam', name: 'Dumpling Ayam (1 pc)', category: 'protein', price: 3500, stock: 30, description: 'Bakso ikan premium isi daging ayam cincang lezat' },
  { id: 't_chikuwa', name: 'Chikuwa Ring (3 pcs)', category: 'protein', price: 3000, stock: 35, description: 'Olahan ikan khas jepang berbentuk tabung berlubang' },
  { id: 't_crabstick', name: 'Crab Stick Slice (2 pcs)', category: 'protein', price: 3500, stock: 25, description: 'Stik kepiting olahan premium bertekstur lembut' },
  { id: 't_telur_puyuh', name: 'Telur Puyuh Rebus (3 pcs)', category: 'protein', price: 3500, stock: 20, description: 'Telur puyuh segar, penambah rasa gurih alami' },
  { id: 't_telur_ayam', name: 'Telur Ayam Orak-arik', category: 'protein', price: 4500, stock: 50, description: 'Telur ayam kocok segar, dicampur langsung ke dalam kuah' },

  // Cuanki & Keringan Tradisional
  { id: 't_batagor', name: 'Batagor Kering (3 pcs)', category: 'cuanki', price: 2000, stock: 80, description: 'Batagor mini kering khas Bandung, menyerap kuah cikur' },
  { id: 't_cuanki_lidah', name: 'Cuanki Lidah (2 pcs)', category: 'cuanki', price: 2500, stock: 60, description: 'Garing krispi, sangat nikmat saat sudah menyerap kuah seblak' },
  { id: 't_cuanki_tahu', name: 'Cuanki Tahu Spons (2 pcs)', category: 'cuanki', price: 2500, stock: 55, description: 'Tahu kering berpori yang sangat kaya rasa kuah kencur' },
  { id: 't_pilus', name: 'Pilus Cikur Krenyes', category: 'cuanki', price: 2000, stock: 70, description: 'Pilus renyah aroma kencur, wajib ditabur saat selesai disajikan' },

  // Sayuran
  { id: 't_pakcoy', name: 'Sayur Pakcoy Segar', category: 'extra', price: 1500, stock: 40, description: 'Pakcoy hijau segar pelengkap gizi' },
  { id: 't_jamur', name: 'Jamur Kuping Iris', category: 'extra', price: 2000, stock: 25, description: 'Jamur kuping hitam bertekstur kenyal kriuk' },
  { id: 't_kol', name: 'Kol Segar Irisan', category: 'extra', price: 1500, stock: 30, description: 'Sayuran kol menambah kepekatan kuah seblak' }
];

export const BROTHS: Broth[] = [
  { id: 'b_cikur_ori', name: 'Kuah Cikur Original (Juara)', description: 'Kuah kencur & bawang putih tradisional Sunda, wangi aromatik, kental dan hangat.', price: 0 },
  { id: 'b_samyang', name: 'Kuah Dara Pedas Samyang', description: 'Kuah pedas tebal dengan bumbu mie korea, gurih manis membakar lidah (Tambahan Rp 2.000).', price: 2000 },
  { id: 'b_creamy_keju', name: 'Kuah Creamy Keju Susu', description: 'Memadukan gurihnya susu evaporasi dan keju cheddar leleh. Gurih kental penyeimbang pedas (Tambahan Rp 3.000).', price: 3000 },
  { id: 'b_nyemek', name: 'Saus Nyemek Daun Jeruk', description: 'Kuah kental sedikit (nyemek) dengan paduan aroma segar jeruk purut dan rempah pekat.', price: 1000 },
  { id: 'b_kering', name: 'Seblak Kering Jebred (No Kuah)', description: 'Ditumis kering keringan dengan bumbu seblak pekat, wangi minyak kencur dan daun bawang.', price: 0 }
];

export const PRESETS: PresetMenu[] = [
  {
    id: 'p_seblak_rakyat',
    name: 'Seblak Rakyat Murmer',
    description: 'Pilihan ekonomis tapi nikmat! Dilengkapi kerupuk pelangi basah, mie, makaroni, telur orak-arik & batagor kering khas.',
    basePrice: 12000,
    defaultToppings: ['t_kerupuk_pelangi', 't_makaroni', 't_mie', 't_telur_ayam', 't_batagor'],
    defaultLevel: 2,
    defaultBroth: 'b_cikur_ori',
    image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&q=80&w=400',
    isPopular: false
  },
  {
    id: 'p_seblak_ndower',
    name: 'Seblak Ndower Sosis Bakso',
    description: 'Sangat direkomendasikan bagi pecinta pedas kenyal. Kombinasi sosis beef, bakso sapi slice, makaroni, cuanki tahu, kol, dan kuah cikur pedas mantap.',
    basePrice: 17500,
    defaultToppings: ['t_kerupuk_kuning', 't_makaroni', 't_sosis', 't_bakso', 't_cuanki_tahu', 't_kol'],
    defaultLevel: 4,
    defaultBroth: 'b_cikur_ori',
    image: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&q=80&w=400',
    isPopular: true
  },
  {
    id: 'p_seblak_seafood',
    name: 'Seblak Seafood Suki Mewah',
    description: 'Sensasi kuah seblak berpadu dengan topping suki kelas bintang: Dumpling keju, chikuwa, crab stick, jamur kuping, kwetiau, telur puyuh, kuah creamy keju.',
    basePrice: 24500,
    defaultToppings: ['t_kwetiau', 't_chikuwa', 't_crabstick', 't_dumpling_keju', 't_telur_puyuh', 't_jamur'],
    defaultLevel: 3,
    defaultBroth: 'b_creamy_keju',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=400',
    isPopular: true
  },
  {
    id: 'p_seblak_mukbang',
    name: 'Seblak Mukbang Ceker Lumer',
    description: 'Porsi melimpah ruah bikin kenyang maksimal. Nikmati 2 pcs ceker ayam lembut lumer, batagor kering, telur orak-arik, dumpling ayam, sosis, mie dan pelengkap pilus cikur!',
    basePrice: 28000,
    defaultToppings: ['t_mie', 't_ceker', 't_telur_ayam', 't_dumpling_ayam', 't_sosis', 't_batagor', 't_pilus', 't_pakcoy'],
    defaultLevel: 3,
    defaultBroth: 'b_cikur_ori',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=400',
    isPopular: true
  }
];

export const SPICE_LEVELS = [
  { level: 0, name: 'Level 0: Polos', color: 'bg-slate-100 text-slate-700 hover:bg-slate-200', desc: 'Rasa gurih murni tanpa cabai sedikitpun' },
  { level: 1, name: 'Level 1: Si Hejo', color: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200', desc: 'Pedas tipis-tipis ramah lambung' },
  { level: 2, name: 'Level 2: Sedang Seuhah', color: 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200', desc: 'Pedas sedang yang nikmat merangsang air liur' },
  { level: 3, name: 'Level 3: Lada Cikur', color: 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200', desc: 'Mulai keringatan, rasa pedasnya nendang abis!' },
  { level: 4, name: 'Level 4: Ndower Gila', color: 'bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-200', desc: 'Bikin bibir merah merona, keringat bercucuran!' },
  { level: 5, name: 'Level 5: Neraka Jebred', color: 'bg-red-500 text-white border-red-600 hover:bg-red-600 animate-pulse', desc: 'Keberanian mutlak! Pedas murni dari cabai rawit pilihan!' }
];

export const SNACKS_AND_DRINKS: SnackOrDrink[] = [
  // Minuman
  {
    id: 'd_teh_manis',
    name: 'Es Teh Manis Jumbo',
    category: 'drink',
    price: 4000,
    description: 'Es teh manis segar ukuran jumbo, pereda pedas paling ampuh.',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=450',
    isPopular: true
  },
  {
    id: 'd_jeruk_peras',
    name: 'Es Jeruk Peras Murni',
    category: 'drink',
    price: 6000,
    description: 'Jeruk peras murni segar asli, manis asam menyegarkan tenggorokan.',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=450',
    isPopular: false
  },
  {
    id: 'd_air_mineral',
    name: 'Air Mineral Dingin',
    category: 'drink',
    price: 3000,
    description: 'Air mineral kemasan botol dingin dan steril.',
    image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&q=80&w=450'
  },
  {
    id: 'd_badak_sarsaparilla',
    name: 'Soda Badak Medan',
    category: 'drink',
    price: 8000,
    description: 'Soda jadul legendaris rasa sarsaparilla asli Medan, nikmat melegakan.',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=450',
    isPopular: true
  },
  // Cemilan Lainnya
  {
    id: 's_cireng',
    name: 'Cireng Rujak Garing',
    category: 'snack',
    price: 10000,
    description: 'Cireng renyah di luar, kenyal hangat di dalam dengan bumbu rujak pedas manis.',
    image: 'https://images.unsplash.com/photo-1505394033774-8ff6222b84f6?auto=format&fit=crop&q=80&w=450',
    isPopular: true
  },
  {
    id: 's_tempe_mendoan',
    name: 'Tempe Mendoan (4 pcs)',
    category: 'snack',
    price: 9000,
    description: 'Tempe mendoan lebar gurih wangi dengan sambal kecap cabai rawit.',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=450'
  },
  {
    id: 's_kerupuk_kaleng',
    name: 'Kerupuk Putih Kaleng',
    category: 'snack',
    price: 2000,
    description: 'Kerupuk putih legendaris yang renyah gurih, teman sejati makan seblak.',
    image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&q=80&w=450'
  }
];

/**
 * Default seed data for menu configuration.
 * Single source of truth used by both server seeding and client fallback.
 */

export const SEEDED_TOPPINGS = [
  { id: 't_kerupuk_kuning', name: 'Kerupuk Kuning Sigung', category: 'karbo', price: 1500, stock: 50, description: 'Kerupuk seblak klasik, kenyal dan lembut' },
  { id: 't_kerupuk_pelangi', name: 'Kerupuk Bawang Pelangi', category: 'karbo', price: 1500, stock: 45, description: 'Kerupuk warna-warni rasa bawang gurih' },
  { id: 't_kerupuk_orange', name: 'Kerupuk Potato Orange', category: 'karbo', price: 1500, stock: 40, description: 'Kerupuk kentang oren renyah saat kering, kenyal saat matang' },
  { id: 't_makaroni', name: 'Makaroni Spiral', category: 'karbo', price: 2000, stock: 60, description: 'Makaroni pilihan yang mekar sempurna' },
  { id: 't_kwetiau', name: 'Kwetiau Kenyal', category: 'karbo', price: 2500, stock: 35, description: 'Kwetiau basah yang lembut dan kenyal' },
  { id: 't_mie', name: 'Mie Keriting', category: 'karbo', price: 2500, stock: 50, description: 'Mie instan keriting penggugah selera' },
  { id: 't_bakso', name: 'Bakso Sapi Slice (3 pcs)', category: 'protein', price: 3000, stock: 40, description: 'Irisan bakso sapi asli yang gurih berdaging' },
  { id: 't_sosis', name: 'Sosis Sapi Premium (4 pcs)', category: 'protein', price: 3000, stock: 40, description: 'Sosis sapi iris premium berkualitas' },
  { id: 't_ceker', name: 'Ceker Jumbo Empuk (2 pcs)', category: 'protein', price: 4000, stock: 25, description: 'Ceker ayam yang direbus lama hingga empuk dan lumer' },
  { id: 't_dumpling_keju', name: 'Dumpling Keju (1 pc)', category: 'protein', price: 4000, stock: 30, description: 'Bakso ikan premium dengan isi keju meleleh di dalamnya' },
  { id: 't_dumpling_ayam', name: 'Dumpling Ayam (1 pc)', category: 'protein', price: 3500, stock: 30, description: 'Bakso ikan premium isi daging ayam cincang lezat' },
  { id: 't_chikuwa', name: 'Chikuwa Ring (3 pcs)', category: 'protein', price: 3000, stock: 35, description: 'Olahan ikan khas jepang berbentuk tabung berlubang' },
  { id: 't_crabstick', name: 'Crab Stick Slice (2 pcs)', category: 'protein', price: 3500, stock: 25, description: 'Stik kepiting olahan premium bertekstur lembut' },
  { id: 't_telur_puyuh', name: 'Telur Puyuh Rebus (3 pcs)', category: 'protein', price: 3500, stock: 20, description: 'Telur puyuh segar, penambah rasa gurih alami' },
  { id: 't_telur_ayam', name: 'Telur Ayam Orak-arik', category: 'protein', price: 4500, stock: 50, description: 'Telur ayam kocok segar, dicampur langsung ke dalam kuah' },
  { id: 't_batagor', name: 'Batagor Kering (3 pcs)', category: 'cuanki', price: 2000, stock: 80, description: 'Batagor mini kering khas Bandung, menyerap kuah cikur' },
  { id: 't_cuanki_lidah', name: 'Cuanki Lidah (2 pcs)', category: 'cuanki', price: 2500, stock: 60, description: 'Garing krispi, sangat nikmat saat sudah menyerap kuah seblak' },
  { id: 't_cuanki_tahu', name: 'Cuanki Tahu Spons (2 pcs)', category: 'cuanki', price: 2500, stock: 55, description: 'Tahu kering berpori yang sangat kaya rasa kuah kencur' },
  { id: 't_pilus', name: 'Pilus Cikur Krenyes', category: 'cuanki', price: 2000, stock: 70, description: 'Pilus renyah aroma kencur, wajib ditabur saat selesai disajikan' },
  { id: 't_pakcoy', name: 'Sayur Pakcoy Segar', category: 'extra', price: 1500, stock: 40, description: 'Pakcoy hijau segar pelengkap gizi' },
  { id: 't_jamur', name: 'Jamur Kuping Iris', category: 'extra', price: 2000, stock: 25, description: 'Jamur kuping hitam bertekstur kenyal kriuk' },
  { id: 't_kol', name: 'Kol Segar Irisan', category: 'extra', price: 1500, stock: 30, description: 'Sayuran kol menambah kepekatan kuah seblak' }
];

export const SEEDED_BROTHS = [
  { id: 'b_cikur_ori', name: 'Kuah Cikur Original (Juara)', description: 'Kuah kencur & bawang putih tradisional Sunda, wangi aromatik, kental dan hangat.', price: 0 },
  { id: 'b_samyang', name: 'Kuah Dara Pedas Samyang', description: 'Kuah pedas tebal dengan bumbu mie korea, gurih manis membakar lidah (Tambahan Rp 2.000).', price: 2000 },
  { id: 'b_creamy_keju', name: 'Kuah Creamy Keju Susu', description: 'Memadukan gurihnya susu evaporasi dan keju cheddar leleh. Gurih kental penyeimbang pedas (Tambahan Rp 3.000).', price: 3000 },
  { id: 'b_nyemek', name: 'Saus Nyemek Daun Jeruk', description: 'Kuah kental sedikit (nyemek) dengan paduan aroma segar jeruk purut dan rempah pekat.', price: 1000 },
  { id: 'b_kering', name: 'Seblak Kering Jebred (No Kuah)', description: 'Ditumis kering keringan dengan bumbu seblak pekat, wangi minyak kencur dan daun bawang.', price: 0 }
];

export const SEEDED_PRESETS = [
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

export const SEEDED_SNACKS_AND_DRINKS = [
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

export const SEEDED_TOPPING_CATEGORIES = [
  { id: 'karbo', name: 'Karbohidrat (Mie, Makaroni, Aci)' },
  { id: 'protein', name: 'Protein (Daging, Sosis, Telur)' },
  { id: 'cuanki', name: 'Keringan & Cuanki' },
  { id: 'extra', name: 'Sayuran & Ekstra' }
];

export const SEEDED_MENU_CATEGORIES = [
  { id: 'seblak', name: 'Seblak Juara' },
  { id: 'snack', name: 'Cemilan Pendamping' },
  { id: 'drink', name: 'Minuman Dingin' }
];

export const SEEDED_SETTINGS = {
  qrisImage: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=seblak-pos-payment-gateway',
  shopName: 'SEBLAK MALIOBORO JUARA',
  shopAddress: 'Jln. Malioboro No. 25, Yogyakarta',
  shopPhone: '08123456789',
  adminPin: '123456'
};

/** All KV config keys and their default seed values */
export const ALL_SEED_CONFIGS = [
  { key: 'toppings', defaultVal: SEEDED_TOPPINGS },
  { key: 'broths', defaultVal: SEEDED_BROTHS },
  { key: 'presets', defaultVal: SEEDED_PRESETS },
  { key: 'snacksAndDrinks', defaultVal: SEEDED_SNACKS_AND_DRINKS },
  { key: 'toppingCategories', defaultVal: SEEDED_TOPPING_CATEGORIES },
  { key: 'menuCategories', defaultVal: SEEDED_MENU_CATEGORIES },
  { key: 'settings', defaultVal: SEEDED_SETTINGS }
] as const;

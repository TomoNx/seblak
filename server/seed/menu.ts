/**
 * Default seed data for menu configuration.
 * Single source of truth used by both server seeding and client fallback.
 */

export const SEEDED_TOPPINGS = [
  // Karbo
  { id: 't_mie', name: 'Mie', category: 'karbo', price: 7000, stock: 100, description: 'Mie instan keriting' },
  { id: 't_kwetiau', name: 'Kwetiau', category: 'karbo', price: 7000, stock: 80, description: 'Kwetiau kenyal dan lembut' },
  { id: 't_bihun', name: 'Bihun', category: 'karbo', price: 7000, stock: 80, description: 'Bihun halus' },
  { id: 't_makaroni', name: 'Makaroni', category: 'karbo', price: 7000, stock: 90, description: 'Makaroni spiral' },
  { id: 't_topoki', name: 'Topoki (6 pcs)', category: 'karbo', price: 8000, stock: 50, description: 'Kue beras khas Korea' },
  
  // Protein
  { id: 't_salmon_ball', name: 'Salmon Ball (2 pcs)', category: 'protein', price: 8000, stock: 60, description: 'Bakso rasa salmon' },
  { id: 't_telur', name: 'Telur (Ceplok/Acak)', category: 'protein', price: 8000, stock: 100, description: 'Telur ayam goreng ceplok atau diacak langsung' },
  { id: 't_chikuwa', name: 'Cikuwa (3 pcs)', category: 'protein', price: 8000, stock: 80, description: 'Olahan ikan chikuwa ring' },
  { id: 't_fish_roll', name: 'Fish Roll (3 pcs)', category: 'protein', price: 8000, stock: 60, description: 'Olahan ikan fish roll' },
  { id: 't_crab_nugget', name: 'Crab Nugget (3 pcs)', category: 'protein', price: 8000, stock: 60, description: 'Nugget rasa kepiting' },
  { id: 't_dumpling_ayam', name: 'Dumpling Ayam (2 pcs)', category: 'protein', price: 8000, stock: 70, description: 'Dumpling dengan isi ayam' },
  { id: 't_dumpling_keju', name: 'Dumpling Keju (2 pcs)', category: 'protein', price: 8000, stock: 70, description: 'Dumpling dengan isi keju meleleh' },
  { id: 't_bakso_sapi', name: 'Bakso Sapi (3 pcs)', category: 'protein', price: 8000, stock: 80, description: 'Bakso daging sapi asli' },
  { id: 't_bakso_ikan', name: 'Bakso Ikan (3 pcs)', category: 'protein', price: 8000, stock: 80, description: 'Bakso olahan daging ikan' },
  { id: 't_bakso_mini', name: 'Bakso Mini (3 pcs)', category: 'protein', price: 8000, stock: 85, description: 'Bakso sapi ukuran mini' },
  { id: 't_baso_aci', name: 'Baso Aci (3 pcs)', category: 'protein', price: 8000, stock: 90, description: 'Baso aci kenyal bumbu gurih' },
  { id: 't_telur_asin', name: 'Telor Asin (1 butir)', category: 'protein', price: 11000, stock: 30, description: 'Telur asin utuh matang' },
  { id: 't_sosis', name: 'Sosis (2 pcs)', category: 'protein', price: 9000, stock: 75, description: 'Sosis sapi iris premium' },
  { id: 't_ekado', name: 'Ekado (2 pcs)', category: 'protein', price: 12000, stock: 40, description: 'Olahan ikan dibungkus kembang tahu' },
  { id: 't_siomay_ayam', name: 'Siomay Ayam (2 pcs)', category: 'protein', price: 12000, stock: 50, description: 'Siomay dimsum isi ayam' },
  { id: 't_baso_jumbo', name: 'Baso Jumbo (Urat/Cincang)', category: 'protein', price: 20000, stock: 25, description: 'Bakso sapi ukuran besar pilihan urat atau isi cincang' },

  // Cuanki
  { id: 't_cireng', name: 'Cireng', category: 'cuanki', price: 7000, stock: 70, description: 'Aci digoreng' },
  { id: 't_tahu_baso', name: 'Tahu Baso (2 pcs)', category: 'cuanki', price: 9000, stock: 50, description: 'Tahu dengan isi adonan baso' },
  { id: 't_batagor_lidah', name: 'Batagor Lidah (2 pcs)', category: 'cuanki', price: 8000, stock: 65, description: 'Cuanki lidah kering gurih' },

  // Extra
  { id: 't_kikil', name: 'Kikil', category: 'extra', price: 8000, stock: 40, description: 'Kikil sapi empuk bumbu rempah' },
  { id: 't_enoki', name: 'Sayur Enoki', category: 'extra', price: 8000, stock: 40, description: 'Jamur enoki segar' },
  { id: 't_ceker', name: 'Ceker (2 pcs)', category: 'extra', price: 8000, stock: 35, description: 'Ceker ayam empuk lumer' },
  { id: 't_tulang', name: 'Tulang', category: 'extra', price: 8000, stock: 30, description: 'Tulang muda gurih' },
  { id: 't_sayap', name: 'Sayap (1 pcs)', category: 'extra', price: 12000, stock: 30, description: 'Sayap ayam bumbu ungkep' },
  { id: 't_kulit_ayam', name: 'Kulit Ayam', category: 'extra', price: 10000, stock: 45, description: 'Kulit ayam goreng krispi' }
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
    defaultToppings: ['t_kerupuk', 't_makaroni', 't_mie', 't_telur', 't_batagor_lidah'],
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
    defaultToppings: ['t_kerupuk', 't_makaroni', 't_sosis', 't_bakso_sapi', 't_cireng', 't_kikil'],
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
    defaultToppings: ['t_kwetiau', 't_chikuwa', 't_crab_nugget', 't_dumpling_keju', 't_dumpling_ayam', 't_enoki'],
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
    defaultToppings: ['t_mie', 't_ceker', 't_telur', 't_dumpling_ayam', 't_sosis', 't_batagor_lidah', 't_tahu_baso', 't_enoki'],
    defaultLevel: 3,
    defaultBroth: 'b_cikur_ori',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=400',
    isPopular: true
  }
];

export const SEEDED_SNACKS_AND_DRINKS = [
  // Chilli Oil Menu (Snack)
  {
    id: 's_pangsit_chilli_oil',
    name: 'Pangsit Chilli Oil',
    category: 'snack',
    price: 12000,
    description: 'Pangsit kukus lembut disiram bumbu chilli oil wangi pedas gurih.',
    image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&q=80&w=450',
    isPopular: true
  },
  {
    id: 's_mie_chilli_oil',
    name: 'Mie Chilli Oil',
    category: 'snack',
    price: 18000,
    description: 'Mie kenyal gurih diaduk dengan bumbu chilli oil khas pedas mantap.',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=450',
    isPopular: true
  },
  // Minuman (Drink)
  {
    id: 'd_jeruk_nipis',
    name: 'Jeruk Nipis',
    category: 'drink',
    price: 14000,
    description: 'Minuman jeruk nipis asam manis segar dingin.',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=450'
  },
  {
    id: 'd_es_cappucino_cincau',
    name: 'Es Cappucino Cincau',
    category: 'drink',
    price: 12000,
    description: 'Es kopi cappuccino creamy dipadu dengan serutan cincau hitam manis.',
    image: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&q=80&w=450',
    isPopular: true
  },
  {
    id: 'd_es_lychee_tea',
    name: 'Es Lychee Tea',
    category: 'drink',
    price: 14000,
    description: 'Es teh rasa leci dengan tambahan buah leci asli.',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=450'
  },
  {
    id: 'd_es_jeruk',
    name: 'Es Jeruk',
    category: 'drink',
    price: 14000,
    description: 'Es jeruk peras segar manis murni.',
    image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&q=80&w=450'
  },
  {
    id: 'd_es_jelly',
    name: 'Es Jelly',
    category: 'drink',
    price: 14000,
    description: 'Es susu segar manis dengan aneka jelly kenyal warna-warni.',
    image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&q=80&w=450'
  },
  {
    id: 'd_es_lychee_yakult',
    name: 'Es Lychee Yakult',
    category: 'drink',
    price: 14000,
    description: 'Perpaduan segar buah leci manis dan yakult yang asam segar dingin.',
    image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&q=80&w=450',
    isPopular: true
  },
  {
    id: 'd_es_lemon_tea',
    name: 'Es Lemon Tea',
    category: 'drink',
    price: 13000,
    description: 'Es teh lemon segar asam manis melegakan tenggorokan.',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=450',
    isPopular: true
  },
  {
    id: 'd_air_mineral',
    name: 'Air Mineral',
    category: 'drink',
    price: 7000,
    description: 'Air mineral botol dingin.',
    image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&q=80&w=450'
  },
  {
    id: 'd_es_teh_manis',
    name: 'Es Teh Manis',
    category: 'drink',
    price: 6000,
    description: 'Es teh manis segar aromatik.',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=450'
  },
  {
    id: 'd_es_teh_tawar',
    name: 'Es Teh Tawar',
    category: 'drink',
    price: 4000,
    description: 'Es teh tawar dingin.',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=450'
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

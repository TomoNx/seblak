import React, { useState, useMemo, useEffect } from 'react';
import { Topping, Broth, PresetMenu } from '../../types';
import { SnackOrDrink, formatRupiah } from '../../data';
import { 
  Package, Layers, Flame, Coffee, Tags, Settings, 
  Search, Plus, QrCode, Edit3, Trash2, X 
} from 'lucide-react';

interface MenuManagerProps {
  toppings: Topping[];
  onSaveToppings?: (data: Topping[]) => void;
  broths: Broth[];
  onSaveBroths?: (data: Broth[]) => void;
  presets: PresetMenu[];
  onSavePresets?: (data: PresetMenu[]) => void;
  snacksAndDrinks: SnackOrDrink[];
  onSaveSnacksAndDrinks?: (data: SnackOrDrink[]) => void;
  toppingCategories: { id: string; name: string }[];
  onSaveToppingCategories?: (data: { id: string; name: string }[]) => void;
  menuCategories: { id: string; name: string }[];
  onSaveMenuCategories?: (data: { id: string; name: string }[]) => void;
  settings: { qrisImage: string; shopName: string; shopAddress?: string; shopPhone?: string; adminPin?: string };
  onSaveSettings?: (data: { qrisImage: string; shopName: string; shopAddress?: string; shopPhone?: string; adminPin?: string }) => void;
}

export default function MenuManager({
  toppings, onSaveToppings,
  broths, onSaveBroths,
  presets, onSavePresets,
  snacksAndDrinks, onSaveSnacksAndDrinks,
  toppingCategories, onSaveToppingCategories,
  menuCategories, onSaveMenuCategories,
  settings, onSaveSettings
}: MenuManagerProps) {
  const [menuManageTab, setMenuManageTab] = useState<'presets' | 'toppings' | 'broths' | 'snacks_drinks' | 'categories' | 'settings'>('presets');
  const [menuSearchQuery, setMenuSearchQuery] = useState<string>('');

  const [editingGroupId, setEditingGroupId] = useState<'presets' | 'toppings' | 'broths' | 'snacks_drinks' | 'categories' | 'settings' | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const [menuForm, setMenuForm] = useState<any>({
    id: '', name: '', description: '', price: 0, basePrice: 0, stock: 10,
    category: '', image: '', defaultToppings: [], defaultLevel: 2, defaultBroth: ''
  });

  const [categoryForm, setCategoryForm] = useState<{ id: string; name: string; type: 'topping' | 'menu' }>({
    id: '', name: '', type: 'topping'
  });

  const [settingsForm, setSettingsForm] = useState({
    qrisImage: settings.qrisImage || '',
    shopName: settings.shopName || '',
    shopAddress: settings.shopAddress || '',
    shopPhone: settings.shopPhone || '',
    adminPin: settings.adminPin || '123456'
  });

  useEffect(() => {
    if (settings) {
      setSettingsForm({
        qrisImage: settings.qrisImage || '',
        shopName: settings.shopName || '',
        shopAddress: settings.shopAddress || '',
        shopPhone: settings.shopPhone || '',
        adminPin: settings.adminPin || '123456'
      });
    }
  }, [settings]);

  const filteredMenuItems = useMemo(() => {
    const q = menuSearchQuery.toLowerCase();
    if (menuManageTab === 'presets') {
      return presets.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    } else if (menuManageTab === 'toppings') {
      return toppings.filter(t => {
        const cat = toppingCategories.find(c => c.id === t.category)?.name || t.category;
        return t.name.toLowerCase().includes(q) || cat.toLowerCase().includes(q);
      });
    } else if (menuManageTab === 'broths') {
      return broths.filter(b => b.name.toLowerCase().includes(q) || b.description.toLowerCase().includes(q));
    } else if (menuManageTab === 'snacks_drinks') {
      return snacksAndDrinks.filter(s => {
        const cat = menuCategories.find(c => c.id === s.category)?.name || s.category;
        return s.name.toLowerCase().includes(q) || cat.toLowerCase().includes(q);
      });
    } else if (menuManageTab === 'categories') {
      const tc = toppingCategories.map(c => ({ id: c.id, name: c.name, type: 'toppings' }));
      const mc = menuCategories.map(c => ({ id: c.id, name: c.name, type: 'menu' }));
      return [...tc, ...mc].filter(c => c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q));
    } else {
      return [settings];
    }
  }, [menuManageTab, menuSearchQuery, presets, toppings, broths, snacksAndDrinks, toppingCategories, menuCategories, settings]);

  const startEditMenu = (group: 'presets' | 'toppings' | 'broths' | 'snacks_drinks', item: any) => {
    setEditingGroupId(group);
    setEditingItemId(item.id);
    if (group === 'presets') {
      setMenuForm({
        id: item.id, name: item.name, description: item.description, basePrice: item.basePrice,
        defaultToppings: item.defaultToppings || [], defaultLevel: item.defaultLevel ?? 2,
        defaultBroth: item.defaultBroth || '', image: item.image || ''
      });
    } else if (group === 'toppings') {
      setMenuForm({
        id: item.id, name: item.name, category: item.category, price: item.price, stock: item.stock ?? 10, description: item.description || ''
      });
    } else if (group === 'broths') {
      setMenuForm({
        id: item.id, name: item.name, description: item.description, price: item.price
      });
    } else if (group === 'snacks_drinks') {
      setMenuForm({
        id: item.id, name: item.name, category: item.category, price: item.price, description: item.description || '', image: item.image || ''
      });
    }
  };

  const startAddNewMenu = () => {
    setEditingGroupId(menuManageTab as any);
    setEditingItemId('new_item');
    if (menuManageTab === 'presets') {
      setMenuForm({
        id: `PRES-${Math.floor(100 + Math.random() * 900)}`, name: '', description: '', basePrice: 15500,
        defaultToppings: [], defaultLevel: 2, defaultBroth: broths[0]?.id || 'broth-cikur',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80'
      });
    } else if (menuManageTab === 'toppings') {
      setMenuForm({
        id: `TOP-${Math.floor(100 + Math.random() * 900)}`, name: '', category: 'karbo', price: 3000, stock: 50, description: ''
      });
    } else if (menuManageTab === 'broths') {
      setMenuForm({
        id: `BROTH-${Math.floor(100 + Math.random() * 900)}`, name: '', description: '', price: 0
      });
    } else if (menuManageTab === 'snacks_drinks') {
      setMenuForm({
        id: `SND-${Math.floor(100 + Math.random() * 900)}`, name: '', category: 'drink', price: 5000, description: '',
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&q=80'
      });
    }
  };

  const handleSaveMenuForm = () => {
    if (!menuForm.name.trim()) {
      alert('⚠️ Nama menu wajib diisi!');
      return;
    }

    if (editingGroupId === 'presets') {
      const isNew = editingItemId === 'new_item';
      let list = [...presets];
      const payload: PresetMenu = {
        id: menuForm.id, name: menuForm.name, description: menuForm.description, basePrice: Number(menuForm.basePrice),
        defaultToppings: menuForm.defaultToppings, defaultLevel: Number(menuForm.defaultLevel),
        defaultBroth: menuForm.defaultBroth, image: menuForm.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80'
      };
      if (isNew) { list.push(payload); } else { list = list.map(item => item.id === editingItemId ? payload : item); }
      onSavePresets?.(list);
    } else if (editingGroupId === 'toppings') {
      const isNew = editingItemId === 'new_item';
      let list = [...toppings];
      const payload: Topping = {
        id: menuForm.id, name: menuForm.name, category: menuForm.category, price: Number(menuForm.price),
        stock: Number(menuForm.stock), description: menuForm.description
      };
      if (isNew) { list.push(payload); } else { list = list.map(item => item.id === editingItemId ? payload : item); }
      onSaveToppings?.(list);
    } else if (editingGroupId === 'broths') {
      const isNew = editingItemId === 'new_item';
      let list = [...broths];
      const payload: Broth = {
        id: menuForm.id, name: menuForm.name, description: menuForm.description, price: Number(menuForm.price)
      };
      if (isNew) { list.push(payload); } else { list = list.map(item => item.id === editingItemId ? payload : item); }
      onSaveBroths?.(list);
    } else if (editingGroupId === 'snacks_drinks') {
      const isNew = editingItemId === 'new_item';
      let list = [...snacksAndDrinks];
      const payload: SnackOrDrink = {
        id: menuForm.id, name: menuForm.name, category: menuForm.category, price: Number(menuForm.price),
        description: menuForm.description, image: menuForm.image || 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&q=80'
      };
      if (isNew) { list.push(payload); } else { list = list.map(item => item.id === editingItemId ? payload : item); }
      onSaveSnacksAndDrinks?.(list);
    }

    setEditingGroupId(null);
    setEditingItemId(null);
  };

  const handleDeleteMenuItem = (group: 'presets' | 'toppings' | 'broths' | 'snacks_drinks', item: any) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus "${item.name}" dari katalog menu seblak?`)) return;

    if (group === 'presets') onSavePresets?.(presets.filter(p => p.id !== item.id));
    else if (group === 'toppings') onSaveToppings?.(toppings.filter(t => t.id !== item.id));
    else if (group === 'broths') onSaveBroths?.(broths.filter(b => b.id !== item.id));
    else if (group === 'snacks_drinks') onSaveSnacksAndDrinks?.(snacksAndDrinks.filter(s => s.id !== item.id));

    if (editingGroupId === group && editingItemId === item.id) {
      setEditingGroupId(null);
      setEditingItemId(null);
    }
  };

  const startAddNewCategory = () => {
    setEditingGroupId('categories');
    setEditingItemId('new_category');
    setCategoryForm({ id: `CAT-${Math.floor(100 + Math.random() * 900)}`, name: '', type: 'topping' });
  };

  const startEditCategory = (item: any) => {
    setEditingGroupId('categories');
    setEditingItemId(item.id);
    setCategoryForm({ id: item.id, name: item.name, type: item.type === 'toppings' ? 'topping' : 'menu' });
  };

  const handleSaveCategoryForm = () => {
    if (!categoryForm.name.trim()) { alert('⚠️ Nama kategori wajib diisi!'); return; }
    if (categoryForm.type === 'topping') {
      let list = [...toppingCategories];
      const payload = { id: categoryForm.id, name: categoryForm.name };
      const isNew = editingItemId === 'new_category';
      if (isNew) list.push(payload); else list = list.map(c => c.id === editingItemId ? payload : c);
      onSaveToppingCategories?.(list);
    } else {
      let list = [...menuCategories];
      const payload = { id: categoryForm.id, name: categoryForm.name };
      const isNew = editingItemId === 'new_category';
      if (isNew) list.push(payload); else list = list.map(c => c.id === editingItemId ? payload : c);
      onSaveMenuCategories?.(list);
    }
    setEditingGroupId(null);
    setEditingItemId(null);
  };

  const handleDeleteCategory = (catId: string, catType: 'topping' | 'menu') => {
    if (!confirm(`Apakah Anda yakin ingin menghapus kategori ini? Topping/menu yang memakai kategori ini mungkin perlu disesuaikan.`)) return;
    if (catType === 'topping') onSaveToppingCategories?.(toppingCategories.filter(c => c.id !== catId));
    else onSaveMenuCategories?.(menuCategories.filter(c => c.id !== catId));
    setEditingGroupId(null);
    setEditingItemId(null);
  };

  const handleSaveSettingsForm = () => {
    if (!settingsForm.shopName.trim()) { alert('⚠️ Nama toko wajib diisi!'); return; }
    onSaveSettings?.({
      qrisImage: settingsForm.qrisImage, shopName: settingsForm.shopName, shopAddress: settingsForm.shopAddress,
      shopPhone: settingsForm.shopPhone, adminPin: settingsForm.adminPin || '123456'
    });
    alert('✅ Pengaturan Toko & Gambar QRIS berhasil disimpan!');
    setEditingGroupId(null);
    setEditingItemId(null);
  };

  const handleQRISUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setSettingsForm(prev => ({ ...prev, qrisImage: reader.result as string }));
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (menuManageTab === 'settings') {
      setEditingGroupId('settings');
      setEditingItemId('merchant_settings');
    }
  }, [menuManageTab]);

  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-4">
        {/* Dynamic Group selecting sub-tabs */}
        <div className="flex items-center gap-2 bg-slate-200 p-1 rounded-xl border border-slate-300 shadow-inner overflow-x-auto shrink-0">
          <button
            onClick={() => { setMenuManageTab('presets'); setEditingGroupId(null); setEditingItemId(null); }}
            className={`flex-1 min-w-[100px] py-2 px-2.5 text-xs font-black rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-transparent ${
              menuManageTab === 'presets' ? 'bg-white text-slate-950 shadow-sm border-slate-200' : 'text-slate-650 hover:text-slate-900'
            }`}
          >
            <Package className="w-3.5 h-3.5 text-orange-600" /> Paket Seblak
          </button>
          <button
            onClick={() => { setMenuManageTab('toppings'); setEditingGroupId(null); setEditingItemId(null); }}
            className={`flex-1 min-w-[100px] py-2 px-2.5 text-xs font-black rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-transparent ${
              menuManageTab === 'toppings' ? 'bg-white text-slate-950 shadow-sm border-slate-200' : 'text-slate-650 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-emerald-600" /> Topping Custom
          </button>
          <button
            onClick={() => { setMenuManageTab('broths'); setEditingGroupId(null); setEditingItemId(null); }}
            className={`flex-1 min-w-[100px] py-2 px-2.5 text-xs font-black rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-transparent ${
              menuManageTab === 'broths' ? 'bg-white text-slate-950 shadow-sm border-slate-200' : 'text-slate-650 hover:text-slate-900'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-red-650" /> Varian Kuah
          </button>
          <button
            onClick={() => { setMenuManageTab('snacks_drinks'); setEditingGroupId(null); setEditingItemId(null); }}
            className={`flex-1 min-w-[100px] py-2 px-2.5 text-xs font-black rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-transparent ${
              menuManageTab === 'snacks_drinks' ? 'bg-white text-slate-950 shadow-sm border-slate-200' : 'text-slate-650 hover:text-slate-900'
            }`}
          >
            <Coffee className="w-3.5 h-3.5 text-blue-600" /> Cemilan & Minuman
          </button>
          <button
            onClick={() => { setMenuManageTab('categories'); setEditingGroupId(null); setEditingItemId(null); }}
            className={`flex-1 min-w-[100px] py-2 px-2.5 text-xs font-black rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-transparent ${
              menuManageTab === 'categories' ? 'bg-white text-slate-950 shadow-sm border-slate-200' : 'text-slate-650 hover:text-slate-900'
            }`}
          >
            <Tags className="w-3.5 h-3.5 text-pink-600" /> Daftar Kategori
          </button>
          <button
            onClick={() => { setMenuManageTab('settings'); setEditingGroupId(null); setEditingItemId(null); }}
            className={`flex-1 min-w-[100px] py-2 px-2.5 text-xs font-black rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-transparent ${
              menuManageTab === 'settings' ? 'bg-white text-slate-950 shadow-sm border-slate-200' : 'text-slate-650 hover:text-slate-900'
            }`}
          >
            <Settings className="w-3.5 h-3.5 text-purple-600" /> QRIS & Toko Settings
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 shrink-0">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={`Cari dari katalog...`}
              value={menuSearchQuery}
              onChange={(e) => setMenuSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs font-medium outline-none focus:border-amber-500 shadow-sm text-slate-800"
            />
          </div>
          <button
            type="button"
            onClick={menuManageTab === 'categories' ? startAddNewCategory : startAddNewMenu}
            className="bg-amber-500 hover:bg-amber-600 font-extrabold text-slate-950 text-xs px-4 py-2.5 rounded-xl shadow-sm hover:shadow transition-all shrink-0 flex items-center justify-center gap-1 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-slate-950 stroke-[2.5px]" /> Tambah Baru
          </button>
        </div>

        {filteredMenuItems.length === 0 ? (
          <div className="bg-white rounded-xl border border-dotted border-slate-300 p-8 text-center flex-1 flex flex-col items-center justify-center text-slate-450">
            <Package className="w-9 h-9 text-slate-300 mb-2" />
            <p className="text-xs font-extrabold text-slate-500">Katalog Kosong</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-8">
            {menuManageTab === 'settings' ? (
              <div className="col-span-full bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-32 h-32 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-2 mx-auto sm:mx-0">
                    {settings.qrisImage ? (
                      <img src={settings.qrisImage} alt="QRIS Merchant" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                    ) : <QrCode className="w-12 h-12 text-slate-300" />}
                  </div>
                  <div className="space-y-2 flex-1 text-center sm:text-left select-none">
                    <span className="inline-block text-[9px] bg-purple-100 text-purple-700 px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider">Informasi Utama Toko</span>
                    <h3 className="font-extrabold text-slate-950 text-base">{settings.shopName || 'SEBLAK BELUM DIFINALISASI'}</h3>
                    <p className="text-xs text-slate-500 font-medium">📍 Alamat: {settings.shopAddress || '-'}</p>
                    <p className="text-xs text-slate-500 font-medium">📞 No. HP: {settings.shopPhone || '-'}</p>
                  </div>
                </div>
              </div>
            ) : menuManageTab === 'categories' ? (
              filteredMenuItems.map((item: any) => {
                const isBeingEdited = editingGroupId === 'categories' && editingItemId === item.id;
                return (
                  <div key={item.id} onClick={() => startEditCategory(item)} className={`p-4 rounded-xl border cursor-pointer transition-all flex justify-between items-start gap-3 ${isBeingEdited ? 'bg-amber-500/15 border-amber-500 shadow-md ring-1 ring-amber-400' : 'bg-white border-slate-200 hover:border-slate-350 shadow-sm'}`}>
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-mono font-bold px-1 bg-slate-100 rounded text-slate-500 uppercase">{item.id}</span>
                        <span className={`text-[8px] px-1.5 py-0.2 rounded font-black uppercase tracking-wider ${item.type === 'toppings' ? 'bg-emerald-50 text-emerald-800' : 'bg-blue-50 text-blue-800'}`}>
                          {item.type === 'toppings' ? 'Topping Category' : 'Menu Category'}
                        </span>
                      </div>
                      <h4 className="font-black text-sm uppercase text-slate-900 truncate pr-2 mt-1">{item.name}</h4>
                    </div>
                    <div className="flex gap-1 items-center shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => startEditCategory(item)} className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 hover:text-amber-800 transition-colors"><Edit3 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDeleteCategory(item.id, item.type === 'toppings' ? 'topping' : 'menu')} className="p-1.5 bg-rose-50 hover:bg-rose-100 rounded text-red-500 hover:text-red-750 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                );
              })
            ) : (
              filteredMenuItems.map((item: any) => {
                const isBeingEdited = editingGroupId === menuManageTab && editingItemId === item.id;
                return (
                  <div key={item.id} onClick={() => startEditMenu(menuManageTab, item)} className={`p-4 rounded-xl border cursor-pointer transition-all flex justify-between items-start gap-3 ${isBeingEdited ? 'bg-amber-500/15 border-amber-500 shadow-md ring-1 ring-amber-400' : 'bg-white border-slate-200 hover:border-slate-350 hover:shadow-sm'}`}>
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-mono font-bold px-1 py-0.2 bg-slate-100 rounded text-slate-500 uppercase">{item.id}</span>
                      </div>
                      <h4 className="font-extrabold text-sm uppercase text-slate-900 leading-snug truncate">{item.name}</h4>
                      <p className="text-[10px] text-slate-400 font-semibold line-clamp-1 leading-normal">{item.description || '-'}</p>
                      <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-100">
                        <span className="font-mono font-black text-amber-700 text-xs">{formatRupiah(item.price || item.basePrice || 0)}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 items-end shrink-0" onClick={(e) => e.stopPropagation()}>
                      {item.image && <div className="w-11 h-11 rounded-lg overflow-hidden border border-slate-150 mb-1 shrink-0 bg-slate-50"><img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" /></div>}
                      <div className="flex gap-1 mt-1">
                        <button onClick={() => startEditMenu(menuManageTab, item)} className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 hover:text-amber-800 transition-colors"><Edit3 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDeleteMenuItem(menuManageTab, item)} className="p-1.5 bg-rose-50 hover:bg-rose-100 rounded text-red-500 hover:text-red-750 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      <div className="w-full md:w-80 lg:w-96 bg-white border-t md:border-t-0 md:border-l border-slate-200 shrink-0 flex flex-col text-slate-850 p-5 shadow-2xl relative z-10 overflow-y-auto text-slate-800">
        {editingGroupId ? (
          <div className="space-y-4 h-full flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-1.5 text-slate-800">
                <Settings className="w-4 h-4 text-amber-600" />
                <div>
                  <h3 className="font-extrabold text-xs uppercase text-slate-800">Form Editor</h3>
                  <p className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">Workbench: {editingGroupId}</p>
                </div>
              </div>
              {editingGroupId !== 'settings' && (
                <button onClick={() => { setEditingGroupId(null); setEditingItemId(null); }} className="p-1 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer"><X className="w-4 h-4" /></button>
              )}
            </div>

            <div className="flex-1 space-y-4 pr-0.5 text-xs">
              {editingGroupId !== 'categories' && editingGroupId !== 'settings' && (
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Nama Menu / Item</label>
                  <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-2 text-xs font-bold outline-none focus:border-amber-500" value={menuForm.name} onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })} />
                </div>
              )}

              {editingGroupId === 'toppings' && (
                <>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Kategori Topping</label>
                    <select value={menuForm.category} onChange={(e) => setMenuForm({ ...menuForm, category: e.target.value })} className="w-full bg-white border border-slate-200 rounded px-2.5 py-2 text-xs font-bold outline-none focus:border-amber-500">
                      {toppingCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Harga (Rp)</label>
                      <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-2 text-xs font-bold font-mono outline-none focus:border-amber-500" value={menuForm.price} onChange={(e) => setMenuForm({ ...menuForm, price: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Stok</label>
                      <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-2 text-xs font-bold font-mono outline-none focus:border-amber-500" value={menuForm.stock} onChange={(e) => setMenuForm({ ...menuForm, stock: e.target.value })} />
                    </div>
                  </div>
                </>
              )}

              {editingGroupId === 'broths' && (
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Harga Tambahan Kuah (Rp)</label>
                  <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-2 text-xs font-bold font-mono outline-none focus:border-amber-500" value={menuForm.price} onChange={(e) => setMenuForm({ ...menuForm, price: e.target.value })} />
                </div>
              )}

              {editingGroupId === 'snacks_drinks' && (
                <>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Kategori Menu</label>
                    <select value={menuForm.category} onChange={(e) => setMenuForm({ ...menuForm, category: e.target.value })} className="w-full bg-white border border-slate-200 rounded px-2.5 py-2 text-xs font-bold outline-none focus:border-amber-500">
                      {menuCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Harga (Rp)</label>
                    <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-2 text-xs font-bold font-mono outline-none focus:border-amber-500" value={menuForm.price} onChange={(e) => setMenuForm({ ...menuForm, price: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Foto Link URL</label>
                    <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-2 text-xs font-mono outline-none focus:border-amber-500" value={menuForm.image} onChange={(e) => setMenuForm({ ...menuForm, image: e.target.value })} />
                  </div>
                </>
              )}

              {editingGroupId === 'presets' && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Harga Paket (Rp)</label>
                      <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-2 text-xs font-bold font-mono outline-none focus:border-amber-500" value={menuForm.basePrice} onChange={(e) => setMenuForm({ ...menuForm, basePrice: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Pedas (Level)</label>
                      <select value={menuForm.defaultLevel} onChange={(e) => setMenuForm({ ...menuForm, defaultLevel: e.target.value })} className="w-full bg-white border border-slate-200 rounded px-2.5 py-2 text-xs font-bold outline-none focus:border-amber-500">
                        {[0,1,2,3,4,5].map(lvl => <option key={lvl} value={lvl}>Level {lvl}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Kuah Standar</label>
                    <select value={menuForm.defaultBroth} onChange={(e) => setMenuForm({ ...menuForm, defaultBroth: e.target.value })} className="w-full bg-white border border-slate-200 rounded px-2.5 py-2 text-xs font-bold outline-none focus:border-amber-500">
                      {broths.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Foto Link URL</label>
                    <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-2 text-xs font-mono outline-none focus:border-amber-500" value={menuForm.image} onChange={(e) => setMenuForm({ ...menuForm, image: e.target.value })} />
                  </div>
                  <div className="space-y-1.5 border-t border-slate-100 pt-2">
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Topping Bawaan</span>
                    <div className="space-y-1 bg-slate-50 p-2 rounded-xl border border-slate-200 max-h-40 overflow-y-auto">
                      {toppings.map((t) => {
                        const isSelected = menuForm.defaultToppings?.includes(t.id);
                        return (
                          <label key={t.id} className="flex items-center gap-2 cursor-pointer py-1 px-1.5 hover:bg-slate-100 rounded text-[11px] select-none">
                            <input type="checkbox" checked={isSelected} onChange={(e) => {
                              let dt = [...(menuForm.defaultToppings || [])];
                              if (e.target.checked) dt.push(t.id); else dt = dt.filter(id => id !== t.id);
                              setMenuForm({ ...menuForm, defaultToppings: dt });
                            }} className="rounded text-amber-500 w-3.5 h-3.5" />
                            <span className="font-extrabold text-slate-700">{t.name}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              {editingGroupId === 'categories' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">ID Kategori</label>
                    <input type="text" disabled={editingItemId !== 'new_category'} className="disabled:opacity-60 w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-2 text-xs font-bold uppercase outline-none focus:border-amber-500" value={categoryForm.id} onChange={(e) => setCategoryForm({ ...categoryForm, id: e.target.value.toLowerCase().replace(/\s+/g, '_') })} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Nama Kategori</label>
                    <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-2 text-xs font-bold outline-none focus:border-amber-500" value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Jenis</label>
                    <select disabled={editingItemId !== 'new_category'} value={categoryForm.type} onChange={(e) => setCategoryForm({ ...categoryForm, type: e.target.value as 'topping' | 'menu' })} className="disabled:opacity-60 w-full bg-white border border-slate-200 rounded px-2.5 py-2 text-xs font-bold outline-none focus:border-amber-500">
                      <option value="topping">Kategori Topping Kustom</option>
                      <option value="menu">Kategori Menu (Cemilan/Minuman)</option>
                    </select>
                  </div>
                </div>
              )}

              {editingGroupId === 'settings' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Nama Toko</label>
                    <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-2 text-xs font-bold outline-none focus:border-amber-500" value={settingsForm.shopName} onChange={(e) => setSettingsForm({ ...settingsForm, shopName: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Alamat Lengkap</label>
                    <textarea rows={2} className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-2 text-xs font-medium outline-none focus:border-amber-500" value={settingsForm.shopAddress} onChange={(e) => setSettingsForm({ ...settingsForm, shopAddress: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Nomor HP</label>
                    <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-2 text-xs font-medium outline-none focus:border-amber-500" value={settingsForm.shopPhone} onChange={(e) => setSettingsForm({ ...settingsForm, shopPhone: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">PIN Area Staf</label>
                    <input type="text" maxLength={6} className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-2 text-xs font-mono font-bold tracking-widest outline-none focus:border-amber-500" value={settingsForm.adminPin} onChange={(e) => setSettingsForm({ ...settingsForm, adminPin: e.target.value.replace(/\D/g, '') })} />
                  </div>
                  <div className="space-y-2 border-t border-slate-100 pt-3">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Gambar QRIS Toko</label>
                    <div className="flex gap-2">
                      <input type="text" className="flex-1 bg-slate-50 border border-slate-200 rounded px-2.5 py-2 text-[10px] font-mono outline-none focus:border-amber-500" value={settingsForm.qrisImage} onChange={(e) => setSettingsForm({ ...settingsForm, qrisImage: e.target.value })} />
                      <label className="cursor-pointer bg-slate-800 text-white font-bold text-[10px] px-3.5 py-2 rounded flex items-center justify-center shrink-0 hover:bg-slate-900 shadow-sm">
                        Unggah
                        <input type="file" accept="image/*" className="hidden" onChange={handleQRISUpload} />
                      </label>
                    </div>
                    {settingsForm.qrisImage && (
                      <div className="w-32 h-32 border border-slate-200 rounded-lg overflow-hidden p-1.5 flex items-center justify-center bg-white mx-auto shadow-xs">
                        <img src={settingsForm.qrisImage} alt="Preview QRIS" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {editingGroupId !== 'categories' && editingGroupId !== 'settings' && (
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Deskripsi Singkat</label>
                  <textarea rows={2} className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-2 text-xs outline-none focus:border-amber-500" value={menuForm.description} onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })} />
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 flex gap-2">
              {editingGroupId !== 'settings' && (
                <button type="button" onClick={() => { setEditingGroupId(null); setEditingItemId(null); }} className="flex-1 border-2 border-slate-150 hover:bg-slate-50 text-slate-650 font-bold py-2.5 rounded-xl uppercase text-[10px]">Batal</button>
              )}
              <button type="button" onClick={editingGroupId === 'categories' ? handleSaveCategoryForm : editingGroupId === 'settings' ? handleSaveSettingsForm : handleSaveMenuForm} className="flex-1 bg-amber-500 hover:bg-amber-600 font-black py-2.5 rounded-xl uppercase text-[10px] text-slate-950">
                {editingGroupId === 'settings' ? 'Simpan Pengaturan' : 'Simpan Kategori/Menu'}
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-amber-500 border border-slate-100 mb-2 animate-bounce">
              <Settings className="w-5 h-5" />
            </div>
            <p className="text-xs text-slate-500 font-extrabold font-sans">Workbench Kelola Menu</p>
          </div>
        )}
      </div>
    </div>
  );
}

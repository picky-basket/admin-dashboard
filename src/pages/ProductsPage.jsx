import { useEffect, useMemo, useRef, useState } from 'react';
import { useBreakpoint } from '../hooks/useBreakpoint.js';
import { useAppStore } from '../store/appStore.jsx';
import { useExtractedTheme } from '../components/extracted/theme.js';
import { UNITS } from '../components/extracted/constants.js';
import { useProducts, useCategories } from '../api/hooks/useProducts.ts';
import Button from '../components/extracted/ui/Button.jsx';
import Card from '../components/extracted/ui/Card.jsx';
import EmptyState from '../components/extracted/ui/EmptyState.jsx';
import Field from '../components/extracted/ui/Field.jsx';
import Modal from '../components/extracted/ui/Modal.jsx';
import SearchBar from '../components/extracted/ui/SearchBar.jsx';
import SelectFilter from '../components/extracted/ui/SelectFilter.jsx';
import Tag from '../components/extracted/ui/Tag.jsx';

const Btn = Button;

function useT() {
  return useExtractedTheme();
}

const readFile = (file) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result);
    reader.readAsDataURL(file);
  });

function ProductsExtracted({ products, setProducts, categories }) {
  const T = useT();
  const { isMobile } = useBreakpoint();
  const [open, setOpen] = useState(false);
  const [editing, setEdit] = useState(null);
  const [catFilter, setCat] = useState('All');
  const [search, setSearch] = useState('');
  const [stockFilter, setStock] = useState('All');
  const [viewMode, setView] = useState('grid');
  const [preview, setPreview] = useState(null);
  const fileRef = useRef();
  const blank = { name: '', catId: '', price: '', unit: 'kg', stock: '', description: '', image: null };
  const [f, setF] = useState(blank);
  const stockLabel = (s) => (s === 0 ? 'Out of Stock' : s <= 5 ? 'Low Stock' : 'In Stock');

  const shown = useMemo(() => {
    let list = products;
    if (catFilter !== 'All') list = list.filter((p) => p.catId === Number(catFilter));
    if (stockFilter !== 'All') list = list.filter((p) => stockLabel(p.stock) === stockFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q));
    }
    return list;
  }, [products, catFilter, search, stockFilter]);

  const handleImg = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const data = await readFile(file);
    setPreview(data);
    setF((x) => ({ ...x, image: data }));
  };

  const save = () => {
    if (!f.name || !f.catId || !f.price) return;
    const prod = { ...f, price: parseFloat(f.price), stock: parseInt(f.stock, 10) || 0, id: editing?.id || Date.now() };
    setProducts((p) => (editing ? p.map((x) => (x.id === editing.id ? prod : x)) : [...p, prod]));
    setF(blank);
    setPreview(null);
    setOpen(false);
    setEdit(null);
  };

  const remove = (id) => {
    if (window.confirm('Delete product?')) setProducts((p) => p.filter((x) => x.id !== id));
  };

  const edit = (p) => {
    setF({ name: p.name, catId: p.catId, price: p.price, unit: p.unit, stock: p.stock, description: p.description || '', image: p.image || null });
    setPreview(p.image || null);
    setEdit(p);
    setOpen(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: T.text, margin: 0 }}>Products</h2>
          <p style={{ color: T.muted, fontSize: 13, marginTop: 4 }}>{products.length} items · {shown.length} shown</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', width: isMobile ? '100%' : 'auto' }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search products..." />
          <div style={{ display: 'flex', gap: 6 }}>
            <SelectFilter value={stockFilter} onChange={setStock}>
              <option value="All">All Stock</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </SelectFilter>
            {!isMobile ? (
              <div style={{ display: 'flex', gap: 2, background: T.bgAlt, borderRadius: 9, padding: 3, border: `1px solid ${T.border}` }}>
                {['grid', 'list'].map((v) => (
                  <button key={v} onClick={() => setView(v)} style={{ padding: '5px 9px', borderRadius: 7, border: 'none', background: viewMode === v ? T.card : 'transparent', cursor: 'pointer', fontSize: 13, color: viewMode === v ? T.text : T.muted }}>
                    {v === 'grid' ? '⊞' : '☰'}
                  </button>
                ))}
              </div>
            ) : null}
            <Btn onClick={() => { setF(blank); setPreview(null); setEdit(null); setOpen(true); }}>+ Add</Btn>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
        {['All', ...categories.map((c) => String(c.id))].map((id) => {
          const c = categories.find((x) => String(x.id) === id);
          const on = catFilter === id;
          return (
            <button key={id} onClick={() => setCat(id)} style={{ padding: '6px 12px', borderRadius: 20, border: `1.5px solid ${on ? T.teal : T.border}`, background: on ? T.teal : T.card, color: on ? '#fff' : T.muted, fontSize: 12, fontWeight: on ? 700 : 400, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
              {c ? `${c.icon || '🗂️'} ${c.name}` : 'All'}
            </button>
          );
        })}
      </div>
      {shown.length === 0 ? (
        <Card><EmptyState icon="🔍" msg="No products match your filters" /></Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : viewMode === 'list' ? '1fr' : 'repeat(auto-fill,minmax(180px,1fr))', gap: 12 }}>
          {shown.map((p) => {
            const c = categories.find((x) => x.id === p.catId);
            const sl = stockLabel(p.stock);
            if (!isMobile && viewMode === 'list') {
              return (
                <Card key={p.id} style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: c ? `${c.color || T.teal}22` : T.bgAlt, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0, overflow: 'hidden' }}>
                    {p.image ? <img src={p.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : c?.icon || '🛒'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, color: T.text }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: T.muted }}>{c?.name} · per {p.unit}</div>
                  </div>
                  <Tag s={sl} />
                  <div style={{ fontWeight: 700, color: T.teal }}>GHS {p.price}</div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <Btn sm v="outline" onClick={() => edit(p)}>Edit</Btn>
                    <button onClick={() => remove(p.id)} style={{ padding: '6px 9px', borderRadius: 8, border: `1px solid ${T.border}`, background: T.bgAlt, cursor: 'pointer', fontSize: 13 }}>🗑️</button>
                  </div>
                </Card>
              );
            }
            return (
              <Card key={p.id} style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ height: isMobile ? 90 : 110, background: c ? `${c.color || T.teal}18` : T.bgAlt, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                  {p.image ? <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: isMobile ? 34 : 44 }}>{c?.icon || '🛒'}</span>}
                  <div style={{ position: 'absolute', top: 6, right: 6 }}><Tag s={sl} /></div>
                </div>
                <div style={{ padding: '10px 12px' }}>
                  <div style={{ fontWeight: 700, fontSize: isMobile ? 12 : 13, color: T.text }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: T.muted, marginTop: 1, marginBottom: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c?.name || '-'} · {p.unit}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: 16, fontWeight: 800, color: T.teal }}>GHS {p.price}</span>
                    <span style={{ fontSize: 11, color: T.muted }}>×<b style={{ color: p.stock <= 5 ? T.red : T.text }}>{p.stock}</b></span>
                  </div>
                  <div style={{ display: 'flex', gap: 5 }}>
                    <Btn sm v="outline" onClick={() => edit(p)} full>Edit</Btn>
                    <button onClick={() => remove(p.id)} style={{ padding: '5px 8px', borderRadius: 8, border: `1px solid ${T.border}`, background: T.bgAlt, cursor: 'pointer', fontSize: 12 }}>🗑️</button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
      {open ? (
        <Modal title={editing ? 'Edit Product' : 'Add Product'} onClose={() => { setOpen(false); setEdit(null); }}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: T.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Product Photo</label>
            <div onClick={() => fileRef.current.click()} style={{ width: '100%', height: 130, borderRadius: 12, border: `2px dashed ${T.border}`, background: T.bgAlt, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden' }}>
              {preview ? (
                <img src={preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ textAlign: 'center', color: T.muted }}>
                  <div style={{ fontSize: 26, marginBottom: 5 }}>📷</div>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>Tap to upload</div>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImg} style={{ display: 'none' }} />
            {preview ? <button onClick={() => { setPreview(null); setF((x) => ({ ...x, image: null })); }} style={{ marginTop: 4, fontSize: 11, color: T.red, background: 'none', border: 'none', cursor: 'pointer' }}>Remove photo</button> : null}
          </div>
          <Field label="Name" value={f.name} onChange={(v) => setF((x) => ({ ...x, name: v }))} placeholder="e.g. Fresh Tilapia" required />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: T.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 5 }}>Category <span style={{ color: T.red }}>*</span></label>
              <select value={f.catId} onChange={(e) => setF((x) => ({ ...x, catId: Number(e.target.value) }))} style={{ width: '100%', padding: '10px 12px', borderRadius: 9, border: `1.5px solid ${T.border}`, fontSize: 16, fontFamily: 'inherit', background: T.inputBg, color: T.text, outline: 'none' }}>
                <option value="">- choose -</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{(c.icon || '🗂️')} {c.name}</option>)}
              </select>
            </div>
            <Field label="Unit" value={f.unit} onChange={(v) => setF((x) => ({ ...x, unit: v }))} options={UNITS} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Price" value={f.price} onChange={(v) => setF((x) => ({ ...x, price: v }))} type="number" placeholder="0.00" required />
            <Field label="Stock Qty" value={f.stock} onChange={(v) => setF((x) => ({ ...x, stock: v }))} type="number" placeholder="0" />
          </div>
          <Field label="Description" value={f.description} onChange={(v) => setF((x) => ({ ...x, description: v }))} placeholder="Short description" rows={2} />
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 6 }}>
            <Btn v="ghost" onClick={() => { setOpen(false); setEdit(null); }}>Cancel</Btn>
            <Btn onClick={save} disabled={!f.name || !f.catId || !f.price}>{editing ? 'Save Changes' : 'Add Product'}</Btn>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}

export default function ProductsPage() {
  const { setProducts, setCategories } = useAppStore();
  const { data: productsData, isLoading: productsLoading, error: productsError } = useProducts();
  const { data: categoriesData, isLoading: categoriesLoading, error: categoriesError } = useCategories();

  useEffect(() => {
    if (productsData) {
      // Normalize API product structure to match local expectations
      const normalized = productsData.map((p) => ({
        ...p,
        catId: p.categoryId,
        stock: p.isAvailable ? 10 : 0, // API doesn't have stock, use availability as proxy
        image: p.imageUrl,
        id: p.id || p.productId
      }));
      setProducts(normalized);
    }
  }, [productsData, setProducts]);

  useEffect(() => {
    if (categoriesData) {
      // Normalize API category structure
      const normalized = categoriesData.map((c) => ({
        ...c,
        image: c.imageUrl
      }));
      setCategories(normalized);
    }
  }, [categoriesData, setCategories]);

  const { products, categories } = useAppStore();

  if (productsLoading || categoriesLoading) {
    return (
      <div style={{ padding: 20, textAlign: 'center', color: '#999' }}>
        Loading products...
      </div>
    );
  }

  if (productsError || categoriesError) {
    return (
      <div style={{ padding: 20, textAlign: 'center', color: '#d32f2f' }}>
        Failed to load products. Using local data.
      </div>
    );
  }

  return <ProductsExtracted products={products} setProducts={setProducts} categories={categories} />;
}

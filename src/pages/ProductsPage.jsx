import { useEffect, useMemo, useRef, useState } from 'react';
import { useBreakpoint } from '../hooks/useBreakpoint.js';
import { useAppStore } from '../store/appStore.jsx';
import { useExtractedTheme } from '../components/extracted/theme.js';
import { UNITS } from '../components/extracted/constants.js';
import { useProducts, useCategories, useAddProduct, useUpdateProduct } from '../api/hooks/useProducts.ts';
import { getUploadUrl, uploadFileToSignedUrl } from '../api/services/products.ts';
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

function ProductsExtracted({
  products,
  setProducts,
  categories,
  catFilter,
  setCat,
  search,
  setSearch,
  stockFilter,
  setStock,
  sortBy,
  setSortBy,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  viewMode,
  setView,
  showSkeleton
}) {
  const T = useT();
  const { isMobile } = useBreakpoint();
  const [open, setOpen] = useState(false);
  const [editing, setEdit] = useState(null);
  const [preview, setPreview] = useState(null);
  const [pickedFile, setPickedFile] = useState(null);
  const fileRef = useRef();
  const blank = { name: '', catId: '', price: '', unit: 'kg', stock: '', description: '' };
  const [f, setF] = useState(blank);
  const { mutateAsync: addProductMutation, isPending: isAddingProduct } = useAddProduct();
  const { mutateAsync: updateProductMutation, isPending: isUpdatingProduct } = useUpdateProduct();
  const isSaving = isAddingProduct || isUpdatingProduct;
  const stockLabel = (s) => (s === 0 ? 'Out of Stock' : 'In Stock');

  const handleImg = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const data = await readFile(file);
    setPickedFile(file);
    setPreview(data);
  };

  const save = async () => {
    if (!f.name || !f.catId || !f.price) return;

    if (!editing && !pickedFile) {
      window.alert('Please upload a product photo.');
      return;
    }

    try {
      let imageUrl = editing?.image || editing?.imageUrl || '';

      if (pickedFile) {
        const contentType = pickedFile.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const uploadMeta = await getUploadUrl('product_image', contentType);
        await uploadFileToSignedUrl(uploadMeta.signedUrl, pickedFile, contentType);
        imageUrl = uploadMeta.signedUrl.split('?')[0];

        if (!editing) {
          await addProductMutation({
            name: f.name.trim(),
            price: parseFloat(f.price),
            unit: f.unit,
            categoryId: f.catId,
            imagePath: uploadMeta.imagePath,
            description: f.description || undefined,
            stockQuantity: parseInt(f.stock, 10) || undefined
          });
        } else {
          await updateProductMutation({
            productId: editing.id,
            payload: {
              name: f.name.trim(),
              price: parseFloat(f.price),
              unit: f.unit,
              categoryId: f.catId,
              imagePath: uploadMeta.imagePath,
              description: f.description || undefined
            }
          });
        }
      } else if (editing) {
        await updateProductMutation({
          productId: editing.id,
          payload: {
            name: f.name.trim(),
            price: parseFloat(f.price),
            unit: f.unit,
            categoryId: f.catId,
            description: f.description || undefined
          }
        });
      }

      const prod = {
        ...f,
        price: parseFloat(f.price),
        stock: parseInt(f.stock, 10) || 0,
        image: imageUrl,
        imageUrl,
        catId: f.catId,
        id: editing?.id || `tmp-${Date.now()}`
      };
      setProducts((p) => (editing ? p.map((x) => (x.id === editing.id ? prod : x)) : [...p, prod]));
      setF(blank);
      setPreview(null);
      setPickedFile(null);
      setOpen(false);
      setEdit(null);
    } catch {
      window.alert('Failed to save product. Please try again.');
    }
  };

  const remove = (id) => {
    if (window.confirm('Delete product?')) setProducts((p) => p.filter((x) => x.id !== id));
  };

  const edit = (p) => {
    setF({ name: p.name, catId: p.catId, price: p.price, unit: p.unit, stock: p.stock, description: p.description || '' });
    setPreview(p.image || p.imageUrl || null);
    setPickedFile(null);
    setEdit(p);
    setOpen(true);
  };

  const hasActiveFilters = catFilter !== 'All' || stockFilter !== 'All' || sortBy !== 'newest' || search !== '' || minPrice !== '' || maxPrice !== '';

  const resetFilters = () => {
    setCat('All');
    setStock('All');
    setSortBy('newest');
    setSearch('');
    setMinPrice('');
    setMaxPrice('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: T.text, margin: 0 }}>Products</h2>
          <p style={{ color: T.muted, fontSize: 13, marginTop: 4 }}>
            {showSkeleton ? 'Loading product catalog...' : `${products.length} items`}
          </p>
        </div>
        <Btn onClick={() => { setF(blank); setPreview(null); setPickedFile(null); setEdit(null); setOpen(true); }}>+ Add Product</Btn>
      </div>

      <Card style={{ padding: '10px 12px' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: isMobile ? '1 1 100%' : '1 1 160px', minWidth: 140 }}>
            <SearchBar value={search} onChange={setSearch} placeholder="Search products..." />
          </div>
          <select
            value={catFilter}
            onChange={(e) => setCat(e.target.value)}
            style={{ padding: '9px 10px', borderRadius: 9, border: `1.5px solid ${T.border}`, fontSize: 14, fontFamily: 'inherit', background: T.inputBg, color: T.text, outline: 'none', cursor: 'pointer', minHeight: 40 }}
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <SelectFilter value={stockFilter} onChange={setStock}>
            <option value="All">All Stock</option>
            <option value="In Stock">In Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </SelectFilter>
          <SelectFilter value={sortBy} onChange={setSortBy}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
            <option value="name_asc">Name: A–Z</option>
            <option value="name_desc">Name: Z–A</option>
          </SelectFilter>
          <input
            type="number"
            min={0}
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min GHS"
            style={{ width: 82, padding: '9px 10px', borderRadius: 9, border: `1.5px solid ${T.border}`, fontSize: 13, fontFamily: 'inherit', background: T.inputBg, color: T.text, outline: 'none', minHeight: 40, boxSizing: 'border-box' }}
          />
          <input
            type="number"
            min={0}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max GHS"
            style={{ width: 82, padding: '9px 10px', borderRadius: 9, border: `1.5px solid ${T.border}`, fontSize: 13, fontFamily: 'inherit', background: T.inputBg, color: T.text, outline: 'none', minHeight: 40, boxSizing: 'border-box' }}
          />
          <div style={{ display: 'flex', gap: 2, background: T.bgAlt, borderRadius: 9, padding: 3, border: `1px solid ${T.border}` }}>
            {['grid', 'list'].map((v) => (
              <button key={v} onClick={() => setView(v)} style={{ padding: '5px 9px', borderRadius: 7, border: 'none', background: viewMode === v ? T.card : 'transparent', cursor: 'pointer', fontSize: 13, color: viewMode === v ? T.text : T.muted }}>
                {v === 'grid' ? '⊞' : '☰'}
              </button>
            ))}
          </div>
          {hasActiveFilters ? (
            <button
              onClick={resetFilters}
              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 12px', borderRadius: 9, border: `1.5px solid ${T.border}`, background: T.bgAlt, color: T.muted, fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', minHeight: 40 }}
            >
              ✕ Reset filters
            </button>
          ) : null}
        </div>
      </Card>

      {showSkeleton ? (
        <ProductsListSkeleton isMobile={isMobile} viewMode={viewMode} T={T} />
      ) : products.length === 0 ? (
        <Card><EmptyState icon="🔍" msg="No products match your filters" /></Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : viewMode === 'list' ? '1fr' : 'repeat(auto-fill,minmax(180px,1fr))', gap: 12 }}>
          {products.map((p) => {
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
            {preview ? <button onClick={() => { setPreview(null); setPickedFile(null); }} style={{ marginTop: 4, fontSize: 11, color: T.red, background: 'none', border: 'none', cursor: 'pointer' }}>Remove photo</button> : null}
          </div>
          <Field label="Name" value={f.name} onChange={(v) => setF((x) => ({ ...x, name: v }))} placeholder="e.g. Fresh Tilapia" required />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: T.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 5 }}>Category <span style={{ color: T.red }}>*</span></label>
              <select value={f.catId} onChange={(e) => setF((x) => ({ ...x, catId: e.target.value }))} style={{ width: '100%', padding: '10px 12px', borderRadius: 9, border: `1.5px solid ${T.border}`, fontSize: 16, fontFamily: 'inherit', background: T.inputBg, color: T.text, outline: 'none' }}>
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
            <Btn onClick={save} disabled={!f.name || !f.catId || !f.price || isSaving}>{isSaving ? 'Saving...' : editing ? 'Save Changes' : 'Add Product'}</Btn>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}

function ProductsListSkeleton({ isMobile, viewMode, T }) {
  if (!isMobile && viewMode === 'list') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={`product-list-skeleton-${i}`} style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: T.bgAlt, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ height: 11, width: '35%', borderRadius: 8, background: T.bgAlt, marginBottom: 7 }} />
              <div style={{ height: 9, width: '24%', borderRadius: 8, background: T.bgAlt }} />
            </div>
            <div style={{ height: 24, width: 80, borderRadius: 999, background: T.bgAlt }} />
            <div style={{ height: 12, width: 62, borderRadius: 8, background: T.bgAlt }} />
            <div style={{ height: 28, width: 96, borderRadius: 8, background: T.bgAlt }} />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fill,minmax(180px,1fr))', gap: 12 }}>
      {Array.from({ length: isMobile ? 6 : 8 }).map((_, i) => (
        <Card key={`product-grid-skeleton-${i}`} style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ height: isMobile ? 90 : 110, background: T.bgAlt }} />
          <div style={{ padding: '10px 12px' }}>
            <div style={{ height: 11, width: '62%', borderRadius: 8, background: T.bgAlt, marginBottom: 7 }} />
            <div style={{ height: 9, width: '50%', borderRadius: 8, background: T.bgAlt, marginBottom: 10 }} />
            <div style={{ height: 13, width: '46%', borderRadius: 8, background: T.bgAlt, marginBottom: 9 }} />
            <div style={{ height: 28, width: '100%', borderRadius: 8, background: T.bgAlt }} />
          </div>
        </Card>
      ))}
    </div>
  );
}

export default function ProductsPage() {
  const { setProducts, setCategories, products, categories, productsView, setProductsView } = useAppStore();

  const catFilter = productsView?.catFilter ?? 'All';
  const search = productsView?.search ?? '';
  const stockFilter = productsView?.stockFilter ?? 'All';
  const sortBy = productsView?.sortBy ?? 'newest';
  const minPrice = productsView?.minPrice ?? '';
  const maxPrice = productsView?.maxPrice ?? '';
  const viewMode = productsView?.viewMode ?? 'grid';

  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [debouncedMin, setDebouncedMin] = useState('');
  const [debouncedMax, setDebouncedMax] = useState('');

  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search.trim()), 350);
    return () => clearTimeout(id);
  }, [search]);

  useEffect(() => {
    const id = setTimeout(() => { setDebouncedMin(minPrice); setDebouncedMax(maxPrice); }, 500);
    return () => clearTimeout(id);
  }, [minPrice, maxPrice]);

  const apiSort = useMemo(() => {
    switch (sortBy) {
      case 'oldest':     return { sort_by: 'createdAt', sort_order: 'asc' };
      case 'price_asc':  return { sort_by: 'price',     sort_order: 'asc' };
      case 'price_desc': return { sort_by: 'price',     sort_order: 'desc' };
      case 'name_asc':   return { sort_by: 'name',      sort_order: 'asc' };
      case 'name_desc':  return { sort_by: 'name',      sort_order: 'desc' };
      case 'newest':
      default:           return { sort_by: 'createdAt', sort_order: 'desc' };
    }
  }, [sortBy]);

  const productQueryParams = useMemo(() => ({
    category:     catFilter !== 'All' ? catFilter : undefined,
    pageSize:     100,
    search:       debouncedSearch || undefined,
    is_available: stockFilter === 'In Stock' ? true : stockFilter === 'Out of Stock' ? false : undefined,
    min_price:    debouncedMin !== '' ? parseFloat(debouncedMin) : undefined,
    max_price:    debouncedMax !== '' ? parseFloat(debouncedMax) : undefined,
    sort_by:      apiSort.sort_by,
    sort_order:   apiSort.sort_order,
  }), [catFilter, debouncedSearch, stockFilter, debouncedMin, debouncedMax, apiSort]);

  const {
    data: productsData,
    isLoading: productsLoading,
    isFetching: productsFetching,
    error: productsError
  } = useProducts(productQueryParams);
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    isFetching: categoriesFetching,
    error: categoriesError
  } = useCategories();
  const T = useT();

  const setCat = (value) => setProductsView((prev) => ({ ...prev, catFilter: value }));
  const setSearch = (value) => setProductsView((prev) => ({ ...prev, search: value }));
  const setStock = (value) => setProductsView((prev) => ({ ...prev, stockFilter: value }));
  const setSortBy = (value) => setProductsView((prev) => ({ ...prev, sortBy: value }));
  const setMinPrice = (value) => setProductsView((prev) => ({ ...prev, minPrice: value }));
  const setMaxPrice = (value) => setProductsView((prev) => ({ ...prev, maxPrice: value }));
  const setView = (value) => setProductsView((prev) => ({ ...prev, viewMode: value }));

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

  const isInitialLoad = (productsLoading && !productsData) || (categoriesLoading && !categoriesData);
  const isRefreshing = (productsFetching || categoriesFetching) && !isInitialLoad;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {productsError || categoriesError ? (
        <Card style={{ padding: 12, border: `1px solid ${T.red}44`, background: T.redL }}>
          <div style={{ color: T.red, fontSize: 12, fontWeight: 600 }}>Failed to refresh products. Showing latest available results.</div>
        </Card>
      ) : null}
      <ProductsExtracted
        products={products}
        setProducts={setProducts}
        categories={categories}
        catFilter={catFilter}
        setCat={setCat}
        search={search}
        setSearch={setSearch}
        stockFilter={stockFilter}
        setStock={setStock}
        sortBy={sortBy}
        setSortBy={setSortBy}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        viewMode={viewMode}
        setView={setView}
        showSkeleton={isInitialLoad || isRefreshing}
      />
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import { useBreakpoint } from '../hooks/useBreakpoint.js';
import { useAppStore } from '../store/appStore.jsx';
import { useExtractedTheme } from '../components/extracted/theme.js';
import { useDishes, useDeleteDish, useUpdateDish } from '../api/hooks/useDishes.ts';
import { getUploadUrl, uploadFileToSignedUrl } from '../api/services/products.ts';
import Button from '../components/extracted/ui/Button.jsx';
import Card from '../components/extracted/ui/Card.jsx';
import EmptyState from '../components/extracted/ui/EmptyState.jsx';
import Field from '../components/extracted/ui/Field.jsx';
import Modal from '../components/extracted/ui/Modal.jsx';
import SearchBar from '../components/extracted/ui/SearchBar.jsx';

const Btn = Button;

function useT() {
  return useExtractedTheme();
}

const readFileAsDataUrl = (file) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.readAsDataURL(file);
  });

function DishesExtracted({ dishes, setDishes, products, search, setSearch, viewMode, setViewMode, showSkeleton }) {
  const T = useT();
  const { isMobile } = useBreakpoint();
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [preview, setPreview] = useState('');
  const [pickedFile, setPickedFile] = useState(null);
  const [formName, setFormName] = useState('');
  const [dishProducts, setDishProducts] = useState([]);
  const [addProductId, setAddProductId] = useState('');
  const [addQty, setAddQty] = useState(1);
  const fileRef = useRef(null);

  const { mutateAsync: updateDishMutation, isPending: isUpdating } = useUpdateDish();
  const { mutateAsync: deleteDishMutation, isPending: isDeleting } = useDeleteDish();

  const openEdit = (dish) => {
    setEditing(dish);
    setFormName(dish.name);
    setPreview(dish.imageUrl || '');
    setPickedFile(null);
    setDishProducts(
      (dish.products || []).map((p) => ({
        productId: p.productId,
        quantity: p.quantity,
        productName: p.productName || products.find((x) => x.id === p.productId)?.name || p.productId
      }))
    );
    setAddProductId('');
    setAddQty(1);
  };

  const closeEdit = () => {
    setEditing(null);
    setPreview('');
    setPickedFile(null);
  };

  const handleAddProduct = () => {
    if (!addProductId) return;
    if (dishProducts.find((p) => p.productId === addProductId)) return;
    const product = products.find((p) => p.id === addProductId);
    setDishProducts((prev) => [
      ...prev,
      { productId: addProductId, quantity: addQty, productName: product?.name || addProductId }
    ]);
    setAddProductId('');
    setAddQty(1);
  };

  const handleRemoveProduct = (productId) => {
    setDishProducts((prev) => prev.filter((p) => p.productId !== productId));
  };

  const saveEdit = async () => {
    if (!formName.trim() || dishProducts.length === 0) return;

    try {
      const payload = {
        name: formName.trim(),
        products: dishProducts.map(({ productId, quantity }) => ({ productId, quantity }))
      };

      if (pickedFile) {
        const contentType = pickedFile.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const uploadMeta = await getUploadUrl('dish_image', contentType);
        await uploadFileToSignedUrl(uploadMeta.signedUrl, pickedFile, contentType);
        payload.imagePath = uploadMeta.imagePath;
        const updatedImageUrl = uploadMeta.signedUrl.split('?')[0];

        await updateDishMutation({ dishId: editing.id, payload });
        setDishes((prev) =>
          prev.map((d) => (d.id === editing.id ? { ...d, name: payload.name, imageUrl: updatedImageUrl, products: dishProducts } : d))
        );
      } else {
        await updateDishMutation({ dishId: editing.id, payload });
        setDishes((prev) =>
          prev.map((d) => (d.id === editing.id ? { ...d, name: payload.name, products: dishProducts } : d))
        );
      }

      closeEdit();
    } catch {
      window.alert('Failed to update dish. Please try again.');
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteDishMutation(deleteTarget.id);
      setDishes((prev) => prev.filter((d) => d.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch {
      window.alert('Failed to delete dish. Please try again.');
    }
  };

  const availableToAdd = products.filter(
    (p) => !dishProducts.find((dp) => dp.productId === p.id)
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: T.text, margin: 0 }}>Dishes</h2>
          <p style={{ color: T.muted, fontSize: 13, marginTop: 4 }}>
            {showSkeleton ? 'Loading dishes...' : `${dishes.length} dishes`}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search dishes..." />
          {!isMobile ? (
            <div style={{ display: 'flex', gap: 2, background: T.bgAlt, borderRadius: 9, padding: 3, border: `1px solid ${T.border}` }}>
              {['grid', 'list'].map((v) => (
                <button key={v} onClick={() => setViewMode(v)} style={{ padding: '5px 9px', borderRadius: 7, border: 'none', background: viewMode === v ? T.card : 'transparent', cursor: 'pointer', fontSize: 13, color: viewMode === v ? T.text : T.muted }}>
                  {v === 'grid' ? '⊞' : '☰'}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {showSkeleton ? (
        <DishesGridSkeleton />
      ) : dishes.length === 0 ? (
        <Card><EmptyState icon="🍽️" msg="No dishes found" /></Card>
      ) : !isMobile && viewMode === 'list' ? (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 500 }}>
              <thead>
                <tr style={{ background: T.bgAlt }}>
                  {['Dish', 'Ingredients', 'Est. Total', 'Action'].map((h) => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: T.muted, textTransform: 'uppercase', letterSpacing: 0.5, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dishes.map((d, i) => {
                  const totalPrice = (d.products || []).reduce((sum, p) => sum + (p.price || 0) * (p.quantity || 1), 0);
                  return (
                    <tr key={d.id} style={{ borderTop: `1px solid ${T.border}`, background: i % 2 ? T.bgAlt : T.card }}>
                      <td style={{ padding: '10px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 36, height: 36, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: T.bgAlt, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {d.imageUrl ? <img src={d.imageUrl} alt={d.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 18 }}>🍽️</span>}
                          </div>
                          <span style={{ fontWeight: 600, color: T.text }}>{d.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '10px 14px', color: T.muted, fontSize: 12 }}>{(d.products || []).length} ingredient{(d.products || []).length !== 1 ? 's' : ''}</td>
                      <td style={{ padding: '10px 14px', fontWeight: 700, color: T.teal }}>{totalPrice > 0 ? `GHS ${totalPrice}` : '—'}</td>
                      <td style={{ padding: '10px 14px' }}>
                        <div style={{ display: 'flex', gap: 5 }}>
                          <Btn sm v="outline" onClick={() => openEdit(d)}>Edit</Btn>
                          <button onClick={() => setDeleteTarget(d)} disabled={isDeleting} style={{ padding: '6px 9px', borderRadius: 8, border: `1px solid ${T.red}44`, background: T.redL, cursor: isDeleting ? 'not-allowed' : 'pointer', fontSize: 13, opacity: isDeleting ? 0.65 : 1 }}>🗑️</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fill,minmax(200px,1fr))', gap: 12 }}>
          {dishes.map((d) => {
            const totalPrice = (d.products || []).reduce((sum, p) => sum + (p.price || 0) * (p.quantity || 1), 0);
            return (
              <Card key={d.id} style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ height: 110, background: T.bgAlt, overflow: 'hidden', position: 'relative' }}>
                  {d.imageUrl ? (
                    <img src={d.imageUrl} alt={d.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>🍽️</div>
                  )}
                </div>
                <div style={{ padding: '10px 12px' }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: T.text }}>{d.name}</div>
                  <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{(d.products || []).length} ingredient{(d.products || []).length !== 1 ? 's' : ''}</div>
                  {totalPrice > 0 ? <div style={{ fontSize: 12, fontWeight: 700, color: T.teal, marginTop: 2 }}>GHS {totalPrice}</div> : null}
                  <div style={{ display: 'flex', gap: 5, marginTop: 8 }}>
                    <Btn sm v="outline" onClick={() => openEdit(d)} full>Edit</Btn>
                    <button
                      onClick={() => setDeleteTarget(d)}
                      disabled={isDeleting}
                      style={{ padding: '5px 8px', borderRadius: 8, border: `1px solid ${T.red}44`, background: T.redL, cursor: isDeleting ? 'not-allowed' : 'pointer', fontSize: 12, opacity: isDeleting ? 0.65 : 1 }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {editing ? (
        <Modal title={`Edit: ${editing.name}`} onClose={closeEdit} w={520}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: T.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Photo</label>
              <div
                onClick={() => fileRef.current?.click()}
                style={{ width: '100%', height: 130, borderRadius: 12, border: `2px dashed ${T.border}`, background: T.bgAlt, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden' }}
              >
                {preview ? (
                  <img src={preview} alt="Dish" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ textAlign: 'center', color: T.muted }}>
                    <div style={{ fontSize: 24, marginBottom: 6 }}>🖼️</div>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>Tap to upload photo</div>
                    <div style={{ fontSize: 11, marginTop: 3 }}>JPEG or PNG, max 2MB</div>
                  </div>
                )}
              </div>
              {preview ? (
                <button onClick={() => { setPreview(''); setPickedFile(null); }} style={{ marginTop: 4, fontSize: 11, color: T.red, background: 'none', border: 'none', cursor: 'pointer' }}>Remove photo</button>
              ) : null}
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png"
                style={{ display: 'none' }}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setPickedFile(file);
                  setPreview(await readFileAsDataUrl(file));
                }}
              />
            </div>

            <Field label="Dish Name" value={formName} onChange={setFormName} placeholder="e.g. Jollof Rice" required />

            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: T.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
                Ingredients <span style={{ color: T.red }}>*</span>
              </label>

              {dishProducts.length === 0 ? (
                <p style={{ fontSize: 12, color: T.muted, margin: '0 0 8px' }}>No ingredients yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
                  {dishProducts.map((dp) => (
                    <div key={dp.productId} style={{ display: 'flex', alignItems: 'center', gap: 8, background: T.bgAlt, borderRadius: 9, padding: '8px 10px' }}>
                      <div style={{ flex: 1, fontSize: 13, fontWeight: 600, color: T.text }}>{dp.productName}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <button
                          onClick={() => setDishProducts((prev) => prev.map((p) => p.productId === dp.productId ? { ...p, quantity: Math.max(1, p.quantity - 1) } : p))}
                          style={{ width: 24, height: 24, borderRadius: 6, border: `1px solid ${T.border}`, background: T.card, cursor: 'pointer', fontSize: 14, color: T.text, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >−</button>
                        <span style={{ fontSize: 13, fontWeight: 700, color: T.text, minWidth: 20, textAlign: 'center' }}>{dp.quantity}</span>
                        <button
                          onClick={() => setDishProducts((prev) => prev.map((p) => p.productId === dp.productId ? { ...p, quantity: p.quantity + 1 } : p))}
                          style={{ width: 24, height: 24, borderRadius: 6, border: `1px solid ${T.border}`, background: T.card, cursor: 'pointer', fontSize: 14, color: T.text, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >+</button>
                      </div>
                      <button
                        onClick={() => handleRemoveProduct(dp.productId)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.red, fontSize: 16, padding: '0 2px' }}
                      >×</button>
                    </div>
                  ))}
                </div>
              )}

              {availableToAdd.length > 0 ? (
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <select
                    value={addProductId}
                    onChange={(e) => setAddProductId(e.target.value)}
                    style={{ flex: 1, padding: '9px 10px', borderRadius: 9, border: `1.5px solid ${T.border}`, fontSize: 13, fontFamily: 'inherit', background: T.inputBg, color: T.text, outline: 'none' }}
                  >
                    <option value="">— select product —</option>
                    {availableToAdd.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min={1}
                    value={addQty}
                    onChange={(e) => setAddQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    style={{ width: 60, padding: '9px 8px', borderRadius: 9, border: `1.5px solid ${T.border}`, fontSize: 13, fontFamily: 'inherit', background: T.inputBg, color: T.text, outline: 'none', textAlign: 'center' }}
                  />
                  <Btn onClick={handleAddProduct} disabled={!addProductId}>Add</Btn>
                </div>
              ) : null}
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <Btn v="ghost" onClick={closeEdit} disabled={isUpdating}>Cancel</Btn>
              <Btn onClick={saveEdit} disabled={!formName.trim() || dishProducts.length === 0 || isUpdating}>
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </Btn>
            </div>
          </div>
        </Modal>
      ) : null}

      {deleteTarget ? (
        <Modal title="Delete Dish" onClose={() => setDeleteTarget(null)} w={420}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <p style={{ margin: 0, color: T.text, fontSize: 14, lineHeight: 1.45 }}>
              Are you sure you want to delete <strong>{deleteTarget.name}</strong>? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <Btn v="ghost" onClick={() => setDeleteTarget(null)} disabled={isDeleting}>Cancel</Btn>
              <Btn onClick={confirmDelete} disabled={isDeleting}>
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Btn>
            </div>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}

function DishesGridSkeleton() {
  const T = useT();
  const { isMobile } = useBreakpoint();

  return (
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fill,minmax(200px,1fr))', gap: 12 }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={`dish-skeleton-${i}`} style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ height: 110, background: T.bgAlt }} />
          <div style={{ padding: '10px 12px' }}>
            <div style={{ height: 11, width: '60%', borderRadius: 8, background: T.bgAlt, marginBottom: 7 }} />
            <div style={{ height: 9, width: '40%', borderRadius: 8, background: T.bgAlt, marginBottom: 10 }} />
            <div style={{ height: 28, width: '100%', borderRadius: 8, background: T.bgAlt }} />
          </div>
        </Card>
      ))}
    </div>
  );
}

export default function DishesPage() {
  const { dishes, setDishes, products, dishesView, setDishesView } = useAppStore();
  const T = useT();

  const search = dishesView?.search ?? '';
  const viewMode = dishesView?.viewMode ?? 'grid';

  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search.trim()), 350);
    return () => clearTimeout(id);
  }, [search]);

  const { data: dishesData, isLoading, isFetching, error } = useDishes({
    search: debouncedSearch || undefined,
    pageSize: 100
  });

  useEffect(() => {
    if (!dishesData) return;
    setDishes(dishesData.map((d) => ({ ...d, id: d.id || d.dishId })));
  }, [dishesData, setDishes]);

  const setSearch = (value) => setDishesView((prev) => ({ ...prev, search: value }));
  const setViewMode = (value) => setDishesView((prev) => ({ ...prev, viewMode: value }));

  const isInitialLoad = isLoading && !dishesData;
  const isRefreshing = isFetching && !isInitialLoad;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {error ? (
        <Card style={{ padding: 12, border: `1px solid ${T.red}44`, background: T.redL }}>
          <div style={{ color: T.red, fontSize: 12, fontWeight: 600 }}>Failed to refresh dishes. Showing latest available results.</div>
        </Card>
      ) : null}
      <DishesExtracted
        dishes={dishes}
        setDishes={setDishes}
        products={products}
        search={search}
        setSearch={setSearch}
        viewMode={viewMode}
        setViewMode={setViewMode}
        showSkeleton={isInitialLoad || isRefreshing}
      />
    </div>
  );
}

import { useEffect, useMemo, useRef, useState } from 'react';
import { useBreakpoint } from '../hooks/useBreakpoint.js';
import { useAppStore } from '../store/appStore.jsx';
import { useExtractedTheme } from '../components/extracted/theme.js';
import {
  useAddCategory,
  useCategories,
  useDeleteCategory,
  useUpdateCategory
} from '../api/hooks/useProducts.ts';
import {
  getUploadUrl,
  uploadFileToSignedUrl
} from '../api/services/products.ts';
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

const toAllowedImageType = (file) => {
  if (file?.type === 'image/png') return 'image/png';
  return 'image/jpeg';
};

const readFileAsDataUrl = (file) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result);
    reader.readAsDataURL(file);
  });

function CategoriesExtracted({ categories, setCategories, search, setSearch }) {
  const T = useT();
  const { isMobile } = useBreakpoint();
  const [open, setOpen] = useState(false);
  const [editing, setEdit] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const blank = { name: '', imageUrl: '' };
  const [f, setF] = useState(blank);
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState('');
  const fileRef = useRef(null);
  const { mutateAsync: addCategoryMutation, isPending: isAddingCategory } = useAddCategory();
  const { mutateAsync: updateCategoryMutation, isPending: isUpdatingCategory } = useUpdateCategory();
  const { mutateAsync: deleteCategoryMutation, isPending: isDeletingCategory } = useDeleteCategory();
  const isSaving = isAddingCategory || isUpdatingCategory;

  const shown = useMemo(() => {
    if (!search.trim()) return categories;
    const q = search.toLowerCase();
    return categories.filter((c) => c.name.toLowerCase().includes(q));
  }, [categories, search]);

  const save = async () => {
    if (!f.name.trim()) return;

    if (!editing && !selectedImage) {
      window.alert('Please upload a category photo.');
      return;
    }

    try {
      let imagePath;
      let imageUrl = f.imageUrl || '';

      if (selectedImage) {
        const contentType = toAllowedImageType(selectedImage);
        const uploadMeta = await getUploadUrl('category_image', contentType);
        const result = await uploadFileToSignedUrl(uploadMeta.signedUrl, selectedImage, contentType);
        imagePath = uploadMeta.imagePath;
        imageUrl = uploadMeta.signedUrl.split('?')[0] || imageUrl;
      }

      if (editing) {
        const payload = {};
        if (f.name.trim() !== editing.name) payload.name = f.name.trim();
        if (imagePath) payload.imagePath = imagePath;

        if (Object.keys(payload).length > 0) {
          await updateCategoryMutation({ categoryId: editing.id, payload });
        }

        setCategories((prev) =>
          prev.map((category) =>
            category.id === editing.id
              ? {
                  ...category,
                  name: f.name.trim(),
                  imageUrl,
                  image: imageUrl
                }
              : category
          )
        );
      } else {
        await addCategoryMutation({
          name: f.name.trim(),
          imagePath
        });

        setCategories((prev) => [
          ...prev,
          {
            id: `tmp-${Date.now()}`,
            name: f.name.trim(),
            imageUrl,
            image: imageUrl
          }
        ]);
      }

      setF(blank);
      setSelectedImage(null);
      setPreview('');
      setOpen(false);
      setEdit(null);
    } catch {
      window.alert('Failed to save category. Please try again.');
    }
  };

  const requestRemove = (category) => {
    if ((category.productCount ?? 0) > 0) {
      window.alert('Remove all products in this category first.');
      return;
    }

    setDeleteTarget(category);
  };

  const confirmRemove = async () => {
    if (!deleteTarget?.id) return;

    const id = deleteTarget.id;

    if (id.startsWith('tmp-')) {
      setCategories((prev) => prev.filter((category) => category.id !== id));
      setDeleteTarget(null);
      return;
    }

    try {
      await deleteCategoryMutation(id);
      setCategories((prev) => prev.filter((category) => category.id !== id));
      setDeleteTarget(null);
    } catch {
      window.alert('Failed to delete category. Please try again.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: T.text, margin: 0 }}>Categories</h2>
          <p style={{ color: T.muted, fontSize: 13, marginTop: 4 }}>{categories.length} categories</p>
        </div>
        <Btn onClick={() => { setF(blank); setPreview(''); setSelectedImage(null); setEdit(null); setOpen(true); }}>+ Add Category</Btn>
      </div>
      <Card style={{ padding: '10px 12px' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search categories..." />
        </div>
      </Card>
      {shown.length === 0 ? (
        <Card><EmptyState icon="🗂️" msg="No categories found" /></Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fill,minmax(190px,1fr))', gap: 12 }}>
          {shown.map((c) => {
            const count = c.productCount ?? 0;
            return (
              <Card key={c.id} style={{ position: 'relative', overflow: 'hidden', padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 4 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: T.bgAlt, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {c.imageUrl || c.image ? (
                      <img src={c.imageUrl || c.image} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: 16 }}>🗂️</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button onClick={() => { setF({ name: c.name, imageUrl: c.imageUrl || c.image || '' }); setPreview(c.imageUrl || c.image || ''); setSelectedImage(null); setEdit(c); setOpen(true); }} style={{ background: T.bgAlt, border: `1px solid ${T.border}`, borderRadius: 7, padding: '5px 8px', cursor: 'pointer', fontSize: 13 }}>✏️</button>
                    <button disabled={isDeletingCategory} onClick={() => requestRemove(c)} style={{ background: T.redL, border: `1px solid ${T.red}44`, borderRadius: 7, padding: '5px 8px', cursor: isDeletingCategory ? 'not-allowed' : 'pointer', fontSize: 13, opacity: isDeletingCategory ? 0.65 : 1 }}>🗑️</button>
                  </div>
                </div>
                <div style={{ marginTop: 8, fontWeight: 700, fontSize: 13, color: T.text }}>{c.name}</div>
                <div style={{ fontSize: 12, fontWeight: 600, marginTop: 2, color: T.teal }}>{count} product{count !== 1 ? 's' : ''}</div>
              </Card>
            );
          })}
        </div>
      )}
      {open ? (
        <Modal title={editing ? 'Edit Category' : 'Add Category'} onClose={() => { setOpen(false); setEdit(null); setPreview(''); setSelectedImage(null); }}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: T.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Photo</label>
            <div onClick={() => fileRef.current?.click()} style={{ width: '100%', height: 140, borderRadius: 12, border: `2px dashed ${T.border}`, background: T.bgAlt, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden' }}>
              {preview ? (
                <img src={preview} alt="Category" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ textAlign: 'center', color: T.muted }}>
                  <div style={{ fontSize: 24, marginBottom: 6 }}>🖼️</div>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>Tap to upload category photo</div>
                  <div style={{ fontSize: 11, marginTop: 3 }}>JPEG or PNG, max 2MB</div>
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png"
              style={{ display: 'none' }}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                if (!['image/jpeg', 'image/png'].includes(file.type)) {
                  window.alert('Only JPEG and PNG images are allowed.');
                  return;
                }
                setSelectedImage(file);
                const dataUrl = await readFileAsDataUrl(file);
                setPreview(dataUrl);
              }}
            />
          </div>
          <Field label="Category Name" value={f.name} onChange={(v) => setF((x) => ({ ...x, name: v }))} placeholder="e.g. Fresh Vegetables" required />
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <Btn v="ghost" onClick={() => { setOpen(false); setEdit(null); setPreview(''); setSelectedImage(null); }}>Cancel</Btn>
            <Btn onClick={save} disabled={!f.name.trim() || isSaving}>{isSaving ? 'Saving...' : editing ? 'Save Changes' : 'Add'}</Btn>
          </div>
        </Modal>
      ) : null}
      {deleteTarget ? (
        <Modal title="Delete Category" onClose={() => setDeleteTarget(null)} w={420}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <p style={{ margin: 0, color: T.text, fontSize: 14, lineHeight: 1.45 }}>
              Are you sure you want to delete <strong>{deleteTarget.name}</strong>? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <Btn v="ghost" onClick={() => setDeleteTarget(null)} disabled={isDeletingCategory}>Cancel</Btn>
              <Btn onClick={confirmRemove} disabled={isDeletingCategory}>
                {isDeletingCategory ? 'Deleting...' : 'Delete'}
              </Btn>
            </div>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}

function CategoriesGridSkeleton() {
  const T = useT();
  const { isMobile } = useBreakpoint();

  return (
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fill,minmax(190px,1fr))', gap: 12 }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={`category-skeleton-${i}`} style={{ overflow: 'hidden', padding: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 4 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: T.bgAlt }} />
            <div style={{ display: 'flex', gap: 4 }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: T.bgAlt }} />
              <div style={{ width: 28, height: 28, borderRadius: 7, background: T.bgAlt }} />
            </div>
          </div>
          <div style={{ height: 12, width: '62%', borderRadius: 8, background: T.bgAlt, marginTop: 12 }} />
          <div style={{ height: 10, width: '40%', borderRadius: 8, background: T.bgAlt, marginTop: 8 }} />
        </Card>
      ))}
    </div>
  );
}

export default function CategoriesPage() {
  const { categories, setCategories, categoriesView, setCategoriesView } = useAppStore();
  const { data: categoriesData, isLoading, isFetching, error } = useCategories();

  useEffect(() => {
    if (!categoriesData) return;
    const normalized = categoriesData.map((category) => ({
      ...category,
      image: category.imageUrl
    }));
    setCategories(normalized);
  }, [categoriesData, setCategories]);

  const search = categoriesView?.search ?? '';
  const setSearch = (value) => setCategoriesView((prev) => ({ ...prev, search: value }));
  const T = useT();
  const isInitialLoad = isLoading && !categoriesData;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {error ? (
        <Card style={{ padding: 12, border: `1px solid ${T.red}44`, background: T.redL }}>
          <div style={{ color: T.red, fontSize: 12, fontWeight: 600 }}>Failed to refresh categories. Showing latest available results.</div>
        </Card>
      ) : null}
      {isFetching && !isInitialLoad ? (
        <div style={{ color: T.muted, fontSize: 12, fontWeight: 600, padding: '0 2px' }}>Updating categories...</div>
      ) : null}
      {isInitialLoad ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 10 }}>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: T.text, margin: 0 }}>Categories</h2>
              <p style={{ color: T.muted, fontSize: 13, marginTop: 4 }}>Loading categories...</p>
            </div>
          </div>
          <CategoriesGridSkeleton />
        </div>
      ) : (
        <CategoriesExtracted
          categories={categories}
          setCategories={setCategories}
          search={search}
          setSearch={setSearch}
        />
      )}
    </div>
  );
}

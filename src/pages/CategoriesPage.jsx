import { useMemo, useState } from 'react';
import { useBreakpoint } from '../hooks/useBreakpoint.js';
import { useAppStore } from '../store/appStore.jsx';
import { useExtractedTheme } from '../components/extracted/theme.js';
import { EMOJIS } from '../components/extracted/constants.js';
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

function CategoriesExtracted({ categories, setCategories, products }) {
  const T = useT();
  const { isMobile } = useBreakpoint();
  const [open, setOpen] = useState(false);
  const [editing, setEdit] = useState(null);
  const [search, setSearch] = useState('');
  const blank = { name: '', icon: '🥦', color: '#2A9D8F' };
  const [f, setF] = useState(blank);

  const shown = useMemo(() => {
    if (!search.trim()) return categories;
    const q = search.toLowerCase();
    return categories.filter((c) => c.name.toLowerCase().includes(q));
  }, [categories, search]);

  const save = () => {
    if (!f.name.trim()) return;
    setCategories((p) => (editing ? p.map((c) => (c.id === editing.id ? { ...c, ...f } : c)) : [...p, { ...f, id: Date.now() }]));
    setF(blank);
    setOpen(false);
    setEdit(null);
  };

  const remove = (id) => {
    if (products.find((p) => p.catId === id)) return alert('Remove all products in this category first.');
    if (window.confirm('Delete?')) setCategories((p) => p.filter((c) => c.id !== id));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: T.text, margin: 0 }}>Categories</h2>
          <p style={{ color: T.muted, fontSize: 13, marginTop: 4 }}>{categories.length} categories</p>
        </div>
        <div style={{ display: 'flex', gap: 8, width: isMobile ? '100%' : 'auto' }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search..." />
          <Btn onClick={() => { setF(blank); setEdit(null); setOpen(true); }}>+ Add</Btn>
        </div>
      </div>
      {shown.length === 0 ? (
        <Card><EmptyState icon="🗂️" msg="No categories found" /></Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fill,minmax(190px,1fr))', gap: 12 }}>
          {shown.map((c) => {
            const count = products.filter((p) => p.catId === c.id).length;
            return (
              <Card key={c.id} style={{ position: 'relative', overflow: 'hidden', padding: 14 }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: c.color || T.teal }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 4 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `${c.color || T.teal}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{c.icon || '🗂️'}</div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button onClick={() => { setF({ name: c.name, icon: c.icon || '🥦', color: c.color || '#2A9D8F' }); setEdit(c); setOpen(true); }} style={{ background: T.bgAlt, border: `1px solid ${T.border}`, borderRadius: 7, padding: '5px 8px', cursor: 'pointer', fontSize: 13 }}>✏️</button>
                    <button onClick={() => remove(c.id)} style={{ background: T.redL, border: `1px solid ${T.red}44`, borderRadius: 7, padding: '5px 8px', cursor: 'pointer', fontSize: 13 }}>🗑️</button>
                  </div>
                </div>
                <div style={{ marginTop: 8, fontWeight: 700, fontSize: 13, color: T.text }}>{c.name}</div>
                <div style={{ fontSize: 12, fontWeight: 600, marginTop: 2, color: c.color || T.teal }}>{count} product{count !== 1 ? 's' : ''}</div>
              </Card>
            );
          })}
        </div>
      )}
      {open ? (
        <Modal title={editing ? 'Edit Category' : 'Add Category'} onClose={() => { setOpen(false); setEdit(null); }}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: T.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Icon</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {EMOJIS.map((e) => (
                <button key={e} onClick={() => setF((x) => ({ ...x, icon: e }))} style={{ width: 40, height: 40, borderRadius: 9, border: `2px solid ${f.icon === e ? T.teal : T.border}`, background: f.icon === e ? T.tealLt : T.bgAlt, fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{e}</button>
              ))}
            </div>
          </div>
          <Field label="Category Name" value={f.name} onChange={(v) => setF((x) => ({ ...x, name: v }))} placeholder="e.g. Fresh Vegetables" required />
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: T.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Colour</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input type="color" value={f.color} onChange={(e) => setF((x) => ({ ...x, color: e.target.value }))} style={{ width: 48, height: 40, borderRadius: 8, border: `1px solid ${T.border}`, cursor: 'pointer', padding: 2, background: 'transparent' }} />
              <span style={{ fontSize: 12, color: T.muted }}>{f.color}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <Btn v="ghost" onClick={() => { setOpen(false); setEdit(null); }}>Cancel</Btn>
            <Btn onClick={save} disabled={!f.name.trim()}>{editing ? 'Save Changes' : 'Add'}</Btn>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}

export default function CategoriesPage() {
  const { categories, setCategories, products } = useAppStore();
  return <CategoriesExtracted categories={categories} setCategories={setCategories} products={products} />;
}

import { useState, useRef } from "react";
import logo from './logo.png';
```

---

**STEP 3 — Find this block in the code**
Press **Ctrl + F** to open search and paste this:
```
fontSize:34,margin:"0 auto 12px"
// ── Theme Tokens ───────────────────────────────────────────────
const LIGHT = {
  teal:"#2A9D8F", tealDk:"#1f7a6e", tealLt:"#e0f5f3",
  orange:"#E76F51", orangeL:"#fdeee9",
  navy:"#0f1923", navyMid:"#1a2738",
  text:"#1a1a1a", textSub:"#374151", muted:"#6b7280", border:"#e8ecf0",
  bg:"#f4f7f6", bgAlt:"#eef2f1", white:"#ffffff", card:"#ffffff",
  green:"#22c55e", greenL:"#dcfce7",
  red:"#ef4444", redL:"#fee2e2",
  yellow:"#f59e0b", yellowL:"#fef3c7",
  blue:"#3b82f6", blueL:"#dbeafe",
  inputBg:"#ffffff", sidebarBg:"#0f1923", sidebarText:"#94a3b8",
};
const DARK = {
  teal:"#2fcfbe", tealDk:"#25a396", tealLt:"#0d3330",
  orange:"#f4845f", orangeL:"#3a1f16",
  navy:"#070d14", navyMid:"#0e1a27",
  text:"#f0f4f8", textSub:"#cbd5e1", muted:"#64748b", border:"#1e2d3d",
  bg:"#0b1520", bgAlt:"#0f1e2e", white:"#0f1e2e", card:"#111f2e",
  green:"#34d399", greenL:"#052e1c",
  red:"#f87171", redL:"#2d0f0f",
  yellow:"#fbbf24", yellowL:"#2d1f04",
  blue:"#60a5fa", blueL:"#0f1e38",
  inputBg:"#0d1c2b", sidebarBg:"#070d14", sidebarText:"#64748b",
};

const ThemeCtx = createContext(LIGHT);
const useT = () => useContext(ThemeCtx);

const readFile = (f) =>
  new Promise((res) => {
    const r = new FileReader();
    r.onload = (e) => res(e.target.result);
    r.readAsDataURL(f);
  });

// ── Logo SVG (replaces heavy base64 images) ────────────────────
function LogoMark({ size = 34 }) {
  const T = useT();
  return (
    <img src={logo.png} alt="Picky Basket"
  style={{ width:68, height:68, borderRadius:20,
    margin:"0 auto 12px", display:"block",
    objectFit:"contain" }} />
  );
}

// ── Seed Data ──────────────────────────────────────────────────
const SEED_CATS = [
  { id:1, name:"Vegetables",     icon:"🥦", color:"#22c55e" },
  { id:2, name:"Fruits",         icon:"🍎", color:"#f97316" },
  { id:3, name:"Grains & Flour", icon:"🌾", color:"#eab308" },
  { id:4, name:"Fish & Seafood", icon:"🐟", color:"#06b6d4" },
  { id:5, name:"Herbs & Spices", icon:"🌿", color:"#10b981" },
  { id:6, name:"Dairy & Eggs",   icon:"🥚", color:"#f59e0b" },
  { id:7, name:"Meats",          icon:"🥩", color:"#ef4444" },
  { id:8, name:"Essentials",     icon:"🧄", color:"#8b5cf6" },
];

const SEED_PRODUCTS = [
  { id:1, name:"Fresh Tilapia",   catId:4, price:45, unit:"kg",     stock:24, image:null, description:"Daily catch from Tema" },
  { id:2, name:"Asparagus",       catId:1, price:12, unit:"bundle", stock:8,  image:null, description:"Organic fresh bundles" },
  { id:3, name:"Scotch Bonnet",   catId:5, price:4,  unit:"pack",   stock:0,  image:null, description:"Hot scotch bonnet peppers" },
  { id:4, name:"Long Grain Rice", catId:3, price:8,  unit:"500g",   stock:45, image:null, description:"Premium white rice" },
  { id:5, name:"Free Range Eggs", catId:6, price:18, unit:"dozen",  stock:32, image:null, description:"Farm fresh eggs" },
  { id:6, name:"Organic Mango",   catId:2, price:15, unit:"kg",     stock:20, image:null, description:"Sweet seasonal mangoes" },
  { id:7, name:"Chicken Thighs",  catId:7, price:35, unit:"kg",     stock:15, image:null, description:"Fresh boneless thighs" },
  { id:8, name:"Ginger",          catId:5, price:6,  unit:"pack",   stock:60, image:null, description:"Fresh root, 200g" },
];

const SEED_ORDERS = [
  { id:"#PB-4825", customer:"Akosua Mensah",  phone:"0241112222", address:"12 Cantonments Rd", items:[{name:"Fresh Tilapia",qty:1,price:45},{name:"Asparagus",qty:2,price:12}], subtotal:69, fee:15, status:"Pending",    paid:true,  method:"MTN MoMo", time:"5 min ago" },
  { id:"#PB-4824", customer:"Kwame Asante",   phone:"0203334444", address:"45 Airport Res.",   items:[{name:"Long Grain Rice",qty:3,price:8}],                                   subtotal:24, fee:12, status:"Packing",    paid:true,  method:"Card",     time:"18 min ago" },
  { id:"#PB-4823", customer:"Ama Boateng",    phone:"0275556666", address:"8 Osu Rd",          items:[{name:"Free Range Eggs",qty:2,price:18},{name:"Ginger",qty:1,price:6}],    subtotal:42, fee:10, status:"Delivering", paid:true,  method:"MTN MoMo", time:"35 min ago" },
  { id:"#PB-4822", customer:"Yaw Darko",      phone:"0557778888", address:"22 Labone St",      items:[{name:"Scotch Bonnet",qty:2,price:4}],                                     subtotal:8,  fee:12, status:"Delivered",  paid:true,  method:"Vodafone", time:"1 hr ago" },
  { id:"#PB-4821", customer:"Abena Frimpong", phone:"0309990000", address:"5 Ring Rd",         items:[{name:"Chicken Thighs",qty:2,price:35}],                                   subtotal:70, fee:18, status:"Delivered",  paid:true,  method:"Card",     time:"2 hr ago" },
  { id:"#PB-4820", customer:"Nana Agyei",     phone:"0241231231", address:"17 Tema Rd",        items:[{name:"Organic Mango",qty:3,price:15}],                                    subtotal:45, fee:15, status:"Cancelled",  paid:false, method:"MTN MoMo", time:"3 hr ago" },
];

const SEED_CUSTOMERS = [
  { id:1, name:"Akosua Mensah",  email:"akosua@email.com",  phone:"0241112222", orders:14, spent:842,  joined:"Jan 2024", lastSeen:"2 min ago",  status:"Active" },
  { id:2, name:"Kwame Asante",   email:"kwame@email.com",   phone:"0203334444", orders:7,  spent:390,  joined:"Mar 2024", lastSeen:"18 min ago", status:"Active" },
  { id:3, name:"Ama Boateng",    email:"ama@email.com",     phone:"0275556666", orders:22, spent:1430, joined:"Nov 2023", lastSeen:"1 hr ago",   status:"Active" },
  { id:4, name:"Yaw Darko",      email:"yaw@email.com",     phone:"0557778888", orders:3,  spent:120,  joined:"Feb 2024", lastSeen:"3 days ago", status:"Inactive" },
  { id:5, name:"Abena Frimpong", email:"abena@email.com",   phone:"0309990000", orders:18, spent:980,  joined:"Dec 2023", lastSeen:"2 hr ago",   status:"Active" },
];

const UNITS  = ["kg","g","bundle","pack","pcs","dozen","litre","box","sachet","500g","250g"];
const EMOJIS = ["🥦","🍎","🌾","🐟","🌿","🥚","🥩","🧄","🫑","🍋","🥕","🍅","🧅","🍌","🧀","🥜","🌽","🥔","🫐","🍇"];

// ── Shared UI ──────────────────────────────────────────────────
const statusStyle = (s, T) => ({
  "In Stock":    { bg:T.greenL,  fg:T.green  },
  "Low Stock":   { bg:T.yellowL, fg:T.yellow },
  "Out of Stock":{ bg:T.redL,    fg:T.red    },
  "Pending":     { bg:T.yellowL, fg:T.yellow },
  "Packing":     { bg:T.blueL,   fg:T.blue   },
  "Delivering":  { bg:T.tealLt,  fg:T.teal   },
  "Delivered":   { bg:T.greenL,  fg:T.green  },
  "Cancelled":   { bg:T.redL,    fg:T.red    },
  "Active":      { bg:T.greenL,  fg:T.green  },
  "Inactive":    { bg:T.bgAlt,   fg:T.muted  },
  "Settled":     { bg:T.greenL,  fg:T.green  },
  "Refunded":    { bg:T.redL,    fg:T.red    },
}[s] || { bg:T.bgAlt, fg:T.muted });

function Tag({ s }) {
  const T = useT();
  const { bg, fg } = statusStyle(s, T);
  return (
    <span style={{ background:bg, color:fg, padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700, whiteSpace:"nowrap" }}>
      {s}
    </span>
  );
}

function Btn({ children, onClick, v = "primary", sm, full, disabled, style: sx }) {
  const T = useT();
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: v==="primary" ? T.teal : v==="danger" ? T.redL : v==="ghost" ? T.bgAlt : "transparent",
        color:      v==="primary" ? "#fff" : v==="danger" ? T.red  : v==="outline" ? T.teal : T.muted,
        border:     v==="outline" ? `1.5px solid ${T.teal}` : v==="ghost" ? `1px solid ${T.border}` : "none",
        padding: sm ? "6px 14px" : "9px 20px",
        borderRadius: 9, fontSize: sm ? 12 : 13, fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        width: full ? "100%" : "auto",
        opacity: disabled ? 0.5 : 1,
        fontFamily: "'DM Sans',system-ui,sans-serif",
        transition: "all .15s",
        ...sx,
      }}
    >
      {children}
    </button>
  );
}

function Field({ label, value, onChange, type = "text", placeholder, options, rows, required }) {
  const T = useT();
  const base = {
    width:"100%", padding:"9px 12px", borderRadius:9,
    border:`1.5px solid ${T.border}`, fontSize:13,
    fontFamily:"inherit", background:T.inputBg, color:T.text,
    outline:"none", boxSizing:"border-box",
  };
  return (
    <div style={{ marginBottom:13 }}>
      {label && (
        <label style={{ display:"block", fontSize:11, fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:.5, marginBottom:5 }}>
          {label}{required && <span style={{ color:T.red }}> *</span>}
        </label>
      )}
      {options ? (
        <select value={value} onChange={(e) => onChange(e.target.value)} style={base}>
          <option value="">— choose —</option>
          {options.map((o) => <option key={o.v || o} value={o.v || o}>{o.l || o}</option>)}
        </select>
      ) : rows ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows} style={{ ...base, resize:"vertical" }} />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={base} />
      )}
    </div>
  );
}

function SearchBar({ value, onChange, placeholder = "Search…" }) {
  const T = useT();
  return (
    <div style={{ position:"relative", flex:1, minWidth:180 }}>
      <span style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", fontSize:14, color:T.muted, pointerEvents:"none" }}>🔍</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ width:"100%", padding:"8px 12px 8px 32px", borderRadius:9, border:`1.5px solid ${T.border}`, fontSize:13, fontFamily:"inherit", background:T.inputBg, color:T.text, outline:"none", boxSizing:"border-box" }}
      />
      {value && (
        <button onClick={() => onChange("")} style={{ position:"absolute", right:9, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:T.muted, fontSize:16, lineHeight:1, padding:0 }}>×</button>
      )}
    </div>
  );
}

function SelectFilter({ value, onChange, children }) {
  const T = useT();
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ padding:"8px 10px", borderRadius:9, border:`1.5px solid ${T.border}`, fontSize:12, fontFamily:"inherit", background:T.inputBg, color:T.text, outline:"none", cursor:"pointer" }}
    >
      {children}
    </select>
  );
}

function Modal({ title, onClose, children, w = 480 }) {
  const T = useT();
  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.6)", zIndex:999, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}
    >
      <div style={{ background:T.card, borderRadius:18, width:"100%", maxWidth:w, maxHeight:"92vh", overflowY:"auto", boxShadow:"0 32px 80px rgba(0,0,0,.5)", border:`1px solid ${T.border}` }}>
        <div style={{ padding:"16px 20px", borderBottom:`1px solid ${T.border}`, display:"flex", justifyContent:"space-between", alignItems:"center", position:"sticky", top:0, background:T.card, zIndex:1, borderRadius:"18px 18px 0 0" }}>
          <span style={{ fontWeight:800, fontSize:15, color:T.text }}>{title}</span>
          <button onClick={onClose} style={{ background:T.bgAlt, border:"none", width:28, height:28, borderRadius:8, fontSize:18, cursor:"pointer", color:T.muted, display:"flex", alignItems:"center", justifyContent:"center" }}>×</button>
        </div>
        <div style={{ padding:"18px 20px" }}>{children}</div>
      </div>
    </div>
  );
}

function Card({ children, style }) {
  const T = useT();
  return (
    <div style={{ background:T.card, borderRadius:14, border:`1px solid ${T.border}`, padding:18, ...style }}>
      {children}
    </div>
  );
}

function EmptyState({ icon, msg }) {
  const T = useT();
  return (
    <div style={{ textAlign:"center", padding:"48px 20px", color:T.muted }}>
      <div style={{ fontSize:40, marginBottom:10 }}>{icon}</div>
      <div style={{ fontSize:14, fontWeight:600 }}>{msg}</div>
    </div>
  );
}

function DarkToggle({ dark, setDark }) {
  return (
    <button
      onClick={() => setDark((d) => !d)}
      title={dark ? "Light mode" : "Dark mode"}
      style={{ background:"none", border:"none", cursor:"pointer", fontSize:18, padding:"4px 6px", borderRadius:8, lineHeight:1, flexShrink:0 }}
    >
      {dark ? "☀️" : "🌙"}
    </button>
  );
}

// ── Sidebar ────────────────────────────────────────────────────
const NAV = [
  { key:"dash",       icon:"📊", label:"Dashboard" },
  { key:"orders",     icon:"📦", label:"Orders",    badge:true },
  { key:"products",   icon:"🛒", label:"Products" },
  { key:"categories", icon:"🗂️", label:"Categories" },
  { key:"customers",  icon:"👥", label:"Customers" },
  { key:"payments",   icon:"💰", label:"Payments" },
  { key:"settings",   icon:"⚙️", label:"Settings" },
];

function Sidebar({ page, go, pendingCount, collapsed, setCollapsed, dark, setDark }) {
  const T = useT();
  return (
    <aside style={{ width:collapsed ? 64 : 215, background:T.sidebarBg, display:"flex", flexDirection:"column", height:"100vh", position:"sticky", top:0, flexShrink:0, transition:"width .2s ease", overflow:"hidden", borderRight:`1px solid ${T.border}` }}>
      {/* Header */}
      <div style={{ padding:collapsed ? "14px 10px" : "18px 14px 14px", borderBottom:"1px solid rgba(255,255,255,.06)", display:"flex", alignItems:"center", justifyContent:collapsed ? "center" : "space-between", gap:10 }}>
        {!collapsed && (
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <LogoMark size={34} />
            <div>
              <div style={{ color:"#fff", fontWeight:800, fontSize:14, letterSpacing:-.3 }}>Picky Basket</div>
              <div style={{ color:T.teal, fontSize:10, opacity:.9, fontWeight:600 }}>Admin Portal</div>
            </div>
          </div>
        )}
        {collapsed && <LogoMark size={34} />}
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            style={{ background:"rgba(255,255,255,.07)", border:"none", borderRadius:7, padding:"4px 8px", cursor:"pointer", color:"#94a3b8", fontSize:11, flexShrink:0 }}
          >◀</button>
        )}
      </div>
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          style={{ background:"none", border:"none", color:"#94a3b8", cursor:"pointer", padding:"8px 0", fontSize:14, marginTop:4 }}
        >▶</button>
      )}

      {/* Nav */}
      <nav style={{ flex:1, padding:collapsed ? "8px 6px" : "10px 8px", overflowY:"auto" }}>
        {NAV.map((n) => {
          const on = page === n.key;
          return (
            <button
              key={n.key}
              onClick={() => go(n.key)}
              title={collapsed ? n.label : ""}
              style={{
                width:"100%", display:"flex", alignItems:"center", gap:collapsed ? 0 : 10,
                padding:collapsed ? "10px" : "10px 12px", borderRadius:10, border:"none",
                background:on ? T.teal : "transparent",
                color:on ? "#fff" : T.sidebarText,
                cursor:"pointer", marginBottom:2, textAlign:"left", fontFamily:"inherit",
                fontSize:13, fontWeight:on ? 700 : 400, transition:"all .15s",
                justifyContent:collapsed ? "center" : "flex-start", position:"relative",
              }}
            >
              <span style={{ fontSize:16, lineHeight:1, flexShrink:0 }}>{n.icon}</span>
              {!collapsed && <span style={{ flex:1 }}>{n.label}</span>}
              {!collapsed && n.badge && pendingCount > 0 && (
                <span style={{ background:T.orange, color:"#fff", fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:20 }}>{pendingCount}</span>
              )}
              {collapsed && n.badge && pendingCount > 0 && (
                <span style={{ position:"absolute", top:6, right:6, width:8, height:8, borderRadius:"50%", background:T.orange }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding:collapsed ? "10px 6px" : "12px 14px", borderTop:"1px solid rgba(255,255,255,.06)", display:"flex", alignItems:"center", gap:8, justifyContent:collapsed ? "center" : "space-between" }}>
        {!collapsed && (
          <div style={{ display:"flex", alignItems:"center", gap:9, minWidth:0 }}>
            <div style={{ width:30, height:30, borderRadius:8, background:T.teal, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:"#fff", flexShrink:0 }}>A</div>
            <div style={{ minWidth:0 }}>
              <div style={{ color:"#fff", fontSize:12, fontWeight:600, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>Admin</div>
              <div style={{ fontSize:10, color:"#64748b", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>admin@pickybasket.com</div>
            </div>
          </div>
        )}
        <DarkToggle dark={dark} setDark={setDark} />
      </div>
    </aside>
  );
}

// ── Dashboard ──────────────────────────────────────────────────
function Dashboard({ orders, products, customers, go }) {
  const T = useT();
  const revenue   = orders.filter((o) => o.paid && o.status !== "Cancelled").reduce((s, o) => s + o.subtotal + o.fee, 0);
  const pending   = orders.filter((o) => o.status === "Pending").length;
  const lowStock  = products.filter((p) => p.stock <= 5).length;
  const delivered = orders.filter((o) => o.status === "Delivered").length;
  const statOrder = ["Pending","Packing","Delivering","Delivered","Cancelled"];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:10 }}>
        <div>
          <h2 style={{ fontSize:22, fontWeight:800, color:T.text, margin:0, letterSpacing:-.4 }}>Good day, Admin 👋</h2>
          <p style={{ color:T.muted, fontSize:13, marginTop:4 }}>Here's what's happening in your store today.</p>
        </div>
        <Btn onClick={() => go("orders")} sm v="outline">View All Orders</Btn>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
        {[
          { label:"Total Revenue",    value:`₵${revenue.toLocaleString()}`, icon:"💰", color:T.teal,   sub:"From all paid orders" },
          { label:"Pending Orders",   value:pending,                         icon:"⏳", color:T.orange, sub:"Awaiting processing" },
          { label:"Orders Delivered", value:delivered,                       icon:"✅", color:T.green,  sub:"Completed deliveries" },
          { label:"Low on Stock",     value:lowStock,                        icon:"⚠️", color:T.red,    sub:"Items need restocking" },
        ].map((s) => (
          <Card key={s.label} style={{ display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ width:46, height:46, borderRadius:13, background:s.color+"22", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize:24, fontWeight:800, color:T.text, lineHeight:1 }}>{s.value}</div>
              <div style={{ fontSize:12, color:T.muted, marginTop:3, fontWeight:500 }}>{s.label}</div>
              <div style={{ fontSize:10, color:s.color, marginTop:2, fontWeight:600 }}>{s.sub}</div>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        {/* Order Pipeline */}
        <Card>
          <div style={{ fontWeight:700, fontSize:14, color:T.text, marginBottom:14 }}>Order Pipeline</div>
          {statOrder.map((s) => {
            const n = orders.filter((o) => o.status === s).length;
            const { fg } = statusStyle(s, T);
            const pct = orders.length ? Math.round((n / orders.length) * 100) : 0;
            return (
              <div key={s} style={{ marginBottom:10 }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:4 }}>
                  <span style={{ color:fg, fontWeight:600 }}>{s}</span>
                  <span style={{ color:T.muted }}>{n} · {pct}%</span>
                </div>
                <div style={{ height:6, borderRadius:4, background:T.bgAlt, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${pct}%`, background:fg, borderRadius:4, transition:"width .5s ease" }} />
                </div>
              </div>
            );
          })}
        </Card>

        {/* Recent Orders */}
        <Card>
          <div style={{ fontWeight:700, fontSize:14, color:T.text, marginBottom:14 }}>Recent Orders</div>
          {orders.slice(0, 5).map((o, i) => (
            <div key={o.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"8px 0", borderTop:i > 0 ? `1px solid ${T.border}` : "none" }}>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:600, fontSize:13, color:T.text, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{o.customer}</div>
                <div style={{ fontSize:11, color:T.muted }}>{o.id} · {o.time}</div>
              </div>
              <div style={{ fontWeight:700, fontSize:13, color:T.text, whiteSpace:"nowrap" }}>₵{o.subtotal + o.fee}</div>
              <Tag s={o.status} />
            </div>
          ))}
        </Card>
      </div>

      {/* Stock Alerts */}
      {lowStock > 0 && (
        <div style={{ background:T.redL, border:`1px solid ${T.red}44`, borderLeft:`4px solid ${T.red}`, borderRadius:14, padding:18 }}>
          <div style={{ fontWeight:700, fontSize:13, color:T.red, marginBottom:10 }}>⚠️ Stock Alerts — {lowStock} item{lowStock > 1 ? "s" : ""} need attention</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))", gap:8 }}>
            {products.filter((p) => p.stock <= 5).map((p) => (
              <div key={p.id} style={{ display:"flex", justifyContent:"space-between", padding:"7px 10px", background:T.card, borderRadius:9, fontSize:13, border:`1px solid ${T.red}33` }}>
                <span style={{ fontWeight:600, color:T.text }}>{p.name}</span>
                <span style={{ fontWeight:700, color:p.stock === 0 ? T.red : T.yellow }}>{p.stock === 0 ? "Out" : "Low ("+p.stock+")"}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Orders ─────────────────────────────────────────────────────
function Orders({ orders, setOrders }) {
  const T = useT();
  const [tab, setTab]       = useState("All");
  const [open, setOpen]     = useState(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const tabs = ["All","Pending","Packing","Delivering","Delivered","Cancelled"];
  const next = { Pending:"Packing", Packing:"Delivering", Delivering:"Delivered" };

  const filtered = useMemo(() => {
    let list = tab === "All" ? orders : orders.filter((o) => o.status === tab);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((o) => o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) || o.phone.includes(q) || o.address.toLowerCase().includes(q));
    }
    if (sortBy === "highest") list = [...list].sort((a, b) => (b.subtotal + b.fee) - (a.subtotal + a.fee));
    if (sortBy === "lowest")  list = [...list].sort((a, b) => (a.subtotal + a.fee) - (b.subtotal + b.fee));
    return list;
  }, [orders, tab, search, sortBy]);

  const advance = (o) => {
    setOrders((p) => p.map((x) => x.id === o.id ? { ...x, status:next[o.status] } : x));
    setOpen((prev) => prev ? { ...prev, status:next[o.status] } : null);
  };
  const cancel = (o) => {
    setOrders((p) => p.map((x) => x.id === o.id ? { ...x, status:"Cancelled" } : x));
    setOpen(null);
  };

  const th = { padding:"10px 14px", textAlign:"left", fontSize:11, fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:.5 };
  const td = { padding:"10px 14px" };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:10 }}>
        <div>
          <h2 style={{ fontSize:20, fontWeight:800, color:T.text, margin:0 }}>Orders</h2>
          <p style={{ color:T.muted, fontSize:13, marginTop:4 }}>{orders.length} total · {filtered.length} shown</p>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search orders…" />
          <SelectFilter value={sortBy} onChange={setSortBy}>
            <option value="newest">Newest</option>
            <option value="highest">Highest ₵</option>
            <option value="lowest">Lowest ₵</option>
          </SelectFilter>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
        {tabs.map((t) => {
          const cnt = t === "All" ? orders.length : orders.filter((o) => o.status === t).length;
          const on = tab === t;
          return (
            <button key={t} onClick={() => setTab(t)} style={{ padding:"6px 14px", borderRadius:20, border:`1.5px solid ${on ? T.teal : T.border}`, background:on ? T.teal : T.card, color:on ? "#fff" : T.muted, fontSize:12, fontWeight:on ? 700 : 400, cursor:"pointer", fontFamily:"inherit", transition:"all .15s" }}>
              {t} <span style={{ opacity:.7, fontSize:11 }}>({cnt})</span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <Card style={{ padding:0, overflow:"hidden" }}>
        {filtered.length === 0 ? <EmptyState icon="📭" msg="No orders match your search" /> : (
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
            <thead>
              <tr style={{ background:T.bgAlt }}>
                {["Order","Customer","Items","Total","Status","Paid","Action"].map((h) => <th key={h} style={th}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {filtered.map((o, i) => (
                <tr key={o.id} style={{ borderTop:`1px solid ${T.border}`, background:i % 2 ? T.bgAlt : T.card }}>
                  <td style={{ ...td, fontWeight:700, color:T.teal, whiteSpace:"nowrap" }}>{o.id}</td>
                  <td style={td}>
                    <div style={{ fontWeight:600, color:T.text }}>{o.customer}</div>
                    <div style={{ fontSize:11, color:T.muted }}>{o.phone}</div>
                  </td>
                  <td style={{ ...td, color:T.muted, fontSize:12 }}>{o.items.length} item{o.items.length !== 1 ? "s" : ""}</td>
                  <td style={{ ...td, fontWeight:700, color:T.text }}>₵{o.subtotal + o.fee}</td>
                  <td style={td}><Tag s={o.status} /></td>
                  <td style={td}>
                    <div style={{ fontSize:12, color:o.paid ? T.green : T.red, fontWeight:700 }}>{o.paid ? "✓ Paid" : "✗ Unpaid"}</div>
                    <div style={{ fontSize:11, color:T.muted }}>{o.method}</div>
                  </td>
                  <td style={{ ...td, display:"flex", gap:5, flexWrap:"wrap" }}>
                    <Btn sm onClick={() => setOpen(o)}>View</Btn>
                    {next[o.status] && <Btn sm v="outline" onClick={() => advance(o)}>→ {next[o.status]}</Btn>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {/* Order Modal */}
      {open && (
        <Modal title={`Order ${open.id}`} onClose={() => setOpen(null)} w={520}>
          {/* Progress */}
          <div style={{ display:"flex", alignItems:"center", gap:4, marginBottom:18, flexWrap:"wrap" }}>
            {["Pending","Packing","Delivering","Delivered"].map((s, i, arr) => {
              const all = ["Pending","Packing","Delivering","Delivered","Cancelled"];
              const ci = all.indexOf(open.status);
              const ti = all.indexOf(s);
              const done = ci >= ti && open.status !== "Cancelled";
              const isCur = open.status === s;
              return (
                <div key={s} style={{ display:"flex", alignItems:"center", gap:4 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:5, padding:"4px 10px", borderRadius:20, background:done ? T.teal+"22" : T.bgAlt, border:`1.5px solid ${isCur ? T.teal : done ? T.teal+"55" : T.border}` }}>
                    <span style={{ width:7, height:7, borderRadius:"50%", background:done ? T.teal : T.border, flexShrink:0 }} />
                    <span style={{ fontSize:11, fontWeight:isCur ? 700 : 400, color:done ? T.teal : T.muted }}>{s}</span>
                  </div>
                  {i < arr.length - 1 && <span style={{ color:T.border, fontSize:10 }}>›</span>}
                </div>
              );
            })}
            {open.status === "Cancelled" && <Tag s="Cancelled" />}
          </div>

          {/* Details */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
            {[["Customer",open.customer],["Phone",open.phone],["Address",open.address],["Placed",open.time],["Payment",open.method],["Paid",open.paid ? "✓ Yes" : "✗ No"]].map(([l, v]) => (
              <div key={l} style={{ background:T.bgAlt, borderRadius:9, padding:"9px 12px" }}>
                <div style={{ fontSize:10, fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:.5, marginBottom:2 }}>{l}</div>
                <div style={{ fontSize:13, fontWeight:600, color:l === "Paid" ? (open.paid ? T.green : T.red) : T.text }}>{v}</div>
              </div>
            ))}
          </div>

          {/* Items */}
          <div style={{ background:T.bgAlt, borderRadius:10, padding:14, marginBottom:16 }}>
            <div style={{ fontSize:11, fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:.5, marginBottom:10 }}>Order Items</div>
            {open.items.map((it, i) => (
              <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:i < open.items.length - 1 ? `1px solid ${T.border}` : "none", fontSize:13, color:T.text }}>
                <span style={{ fontWeight:500 }}>{it.name} <span style={{ color:T.muted }}>×{it.qty}</span></span>
                <span style={{ fontWeight:700 }}>₵{it.price * it.qty}</span>
              </div>
            ))}
            <div style={{ display:"flex", justifyContent:"space-between", padding:"7px 0 0", fontSize:12, color:T.muted }}><span>Subtotal</span><span>₵{open.subtotal}</span></div>
            <div style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", fontSize:12, color:T.muted }}><span>Delivery fee</span><span>₵{open.fee}</span></div>
            <div style={{ display:"flex", justifyContent:"space-between", padding:"8px 0 0", borderTop:`1px solid ${T.border}`, marginTop:4, fontWeight:800, fontSize:15, color:T.text }}>
              <span>Total</span><span style={{ color:T.teal }}>₵{open.subtotal + open.fee}</span>
            </div>
          </div>

          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {next[open.status] && <Btn onClick={() => advance(open)}>Mark as {next[open.status]} →</Btn>}
            {open.status !== "Cancelled" && open.status !== "Delivered" && <Btn v="danger" onClick={() => cancel(open)}>Cancel Order</Btn>}
            <Btn v="ghost" onClick={() => setOpen(null)}>Close</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Products ───────────────────────────────────────────────────
function Products({ products, setProducts, categories }) {
  const T = useT();
  const [open, setOpen]         = useState(false);
  const [editing, setEdit]      = useState(null);
  const [catFilter, setCat]     = useState("All");
  const [search, setSearch]     = useState("");
  const [stockFilter, setStock] = useState("All");
  const [viewMode, setView]     = useState("grid");
  const [preview, setPreview]   = useState(null);
  const fileRef = useRef();
  const blank = { name:"", catId:"", price:"", unit:"kg", stock:"", description:"", image:null };
  const [f, setF] = useState(blank);
  const stockLabel = (s) => s === 0 ? "Out of Stock" : s <= 5 ? "Low Stock" : "In Stock";

  const shown = useMemo(() => {
    let list = products;
    if (catFilter !== "All") list = list.filter((p) => p.catId === Number(catFilter));
    if (stockFilter !== "All") list = list.filter((p) => stockLabel(p.stock) === stockFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    return list;
  }, [products, catFilter, search, stockFilter]);

  const handleImg = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const d = await readFile(file);
    setPreview(d);
    setF((x) => ({ ...x, image:d }));
  };

  const save = () => {
    if (!f.name || !f.catId || !f.price) return;
    const prod = { ...f, price:parseFloat(f.price), stock:parseInt(f.stock) || 0, id:editing?.id || Date.now() };
    setProducts((p) => editing ? p.map((x) => x.id === editing.id ? prod : x) : [...p, prod]);
    setF(blank); setPreview(null); setOpen(false); setEdit(null);
  };

  const remove = (id) => {
    if (window.confirm("Delete product?")) setProducts((p) => p.filter((x) => x.id !== id));
  };

  const edit = (p) => {
    setF({ name:p.name, catId:p.catId, price:p.price, unit:p.unit, stock:p.stock, description:p.description, image:p.image });
    setPreview(p.image); setEdit(p); setOpen(true);
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:10 }}>
        <div>
          <h2 style={{ fontSize:20, fontWeight:800, color:T.text, margin:0 }}>Products</h2>
          <p style={{ color:T.muted, fontSize:13, marginTop:4 }}>{products.length} items · {shown.length} shown</p>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search products…" />
          <SelectFilter value={stockFilter} onChange={setStock}>
            <option value="All">All Stock</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </SelectFilter>
          <div style={{ display:"flex", gap:2, background:T.bgAlt, borderRadius:9, padding:3, border:`1px solid ${T.border}` }}>
            {["grid","list"].map((v) => (
              <button key={v} onClick={() => setView(v)} style={{ padding:"5px 9px", borderRadius:7, border:"none", background:viewMode === v ? T.card : "transparent", cursor:"pointer", fontSize:13, color:viewMode === v ? T.text : T.muted, boxShadow:viewMode === v ? "0 1px 4px rgba(0,0,0,.15)" : "none", transition:"all .15s" }}>
                {v === "grid" ? "⊞" : "☰"}
              </button>
            ))}
          </div>
          <Btn onClick={() => { setF(blank); setPreview(null); setEdit(null); setOpen(true); }}>+ Add Product</Btn>
        </div>
      </div>

      {/* Category filters */}
      <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
        {["All", ...categories.map((c) => String(c.id))].map((id) => {
          const c = categories.find((x) => String(x.id) === id);
          const on = catFilter === id;
          return (
            <button key={id} onClick={() => setCat(id)} style={{ padding:"6px 13px", borderRadius:20, border:`1.5px solid ${on ? T.teal : T.border}`, background:on ? T.teal : T.card, color:on ? "#fff" : T.muted, fontSize:12, fontWeight:on ? 700 : 400, cursor:"pointer", fontFamily:"inherit" }}>
              {c ? `${c.icon} ${c.name}` : "All"}
            </button>
          );
        })}
      </div>

      {shown.length === 0 ? (
        <Card><EmptyState icon="🔍" msg="No products match your filters" /></Card>
      ) : viewMode === "grid" ? (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))", gap:14 }}>
          {shown.map((p) => {
            const c = categories.find((x) => x.id === p.catId);
            const sl = stockLabel(p.stock);
            return (
              <Card key={p.id} style={{ padding:0, overflow:"hidden" }}>
                <div style={{ height:120, background:c ? c.color+"18" : T.bgAlt, display:"flex", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden" }}>
                  {p.image ? <img src={p.image} alt={p.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} /> : <span style={{ fontSize:46 }}>{c?.icon || "🛒"}</span>}
                  <div style={{ position:"absolute", top:7, right:7 }}><Tag s={sl} /></div>
                </div>
                <div style={{ padding:"11px 13px" }}>
                  <div style={{ fontWeight:700, fontSize:13, color:T.text }}>{p.name}</div>
                  <div style={{ fontSize:11, color:T.muted, marginTop:1, marginBottom:8, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{c?.name || "—"} · per {p.unit}</div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:9 }}>
                    <span style={{ fontSize:18, fontWeight:800, color:T.teal }}>₵{p.price}</span>
                    <span style={{ fontSize:11, color:T.muted }}>Stock: <b style={{ color:p.stock <= 5 ? T.red : T.text }}>{p.stock}</b></span>
                  </div>
                  <div style={{ display:"flex", gap:6 }}>
                    <Btn sm v="outline" onClick={() => edit(p)} full>Edit</Btn>
                    <button onClick={() => remove(p.id)} style={{ padding:"5px 9px", borderRadius:8, border:`1px solid ${T.border}`, background:T.bgAlt, cursor:"pointer", fontSize:13 }}>🗑️</button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card style={{ padding:0, overflow:"hidden" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
            <thead>
              <tr style={{ background:T.bgAlt }}>
                {["Product","Category","Price","Stock","Status","Action"].map((h) => (
                  <th key={h} style={{ padding:"10px 14px", textAlign:"left", fontSize:11, fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:.5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shown.map((p, i) => {
                const c = categories.find((x) => x.id === p.catId);
                return (
                  <tr key={p.id} style={{ borderTop:`1px solid ${T.border}`, background:i % 2 ? T.bgAlt : T.card }}>
                    <td style={{ padding:"10px 14px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <div style={{ width:36, height:36, borderRadius:9, background:c ? c.color+"22" : T.bgAlt, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0, overflow:"hidden" }}>
                          {p.image ? <img src={p.image} style={{ width:"100%", height:"100%", objectFit:"cover" }} alt="" /> : c?.icon || "🛒"}
                        </div>
                        <div>
                          <div style={{ fontWeight:600, color:T.text }}>{p.name}</div>
                          <div style={{ fontSize:11, color:T.muted }}>{p.description}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding:"10px 14px", color:T.muted, fontSize:12 }}>{c?.icon} {c?.name || "—"}</td>
                    <td style={{ padding:"10px 14px", fontWeight:700, color:T.teal }}>₵{p.price}/{p.unit}</td>
                    <td style={{ padding:"10px 14px", fontWeight:600, color:p.stock <= 5 ? T.red : T.text }}>{p.stock}</td>
                    <td style={{ padding:"10px 14px" }}><Tag s={stockLabel(p.stock)} /></td>
                    <td style={{ padding:"10px 14px", display:"flex", gap:6 }}>
                      <Btn sm v="outline" onClick={() => edit(p)}>Edit</Btn>
                      <button onClick={() => remove(p.id)} style={{ padding:"5px 9px", borderRadius:8, border:`1px solid ${T.border}`, background:T.bgAlt, cursor:"pointer", fontSize:13 }}>🗑️</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}

      {/* Product Modal */}
      {open && (
        <Modal title={editing ? "Edit Product" : "Add Product"} onClose={() => { setOpen(false); setEdit(null); }}>
          <div style={{ marginBottom:14 }}>
            <label style={{ display:"block", fontSize:11, fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:.5, marginBottom:6 }}>Product Photo</label>
            <div onClick={() => fileRef.current.click()} style={{ width:"100%", height:140, borderRadius:12, border:`2px dashed ${T.border}`, background:T.bgAlt, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", overflow:"hidden" }}>
              {preview ? <img src={preview} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} /> : (
                <div style={{ textAlign:"center", color:T.muted }}>
                  <div style={{ fontSize:28, marginBottom:5 }}>📷</div>
                  <div style={{ fontSize:12, fontWeight:600 }}>Click to upload</div>
                  <div style={{ fontSize:11 }}>JPG, PNG, WEBP</div>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImg} style={{ display:"none" }} />
            {preview && <button onClick={() => { setPreview(null); setF((x) => ({ ...x, image:null })); }} style={{ marginTop:4, fontSize:11, color:T.red, background:"none", border:"none", cursor:"pointer" }}>Remove photo</button>}
          </div>
          <Field label="Name" value={f.name} onChange={(v) => setF((x) => ({ ...x, name:v }))} placeholder="e.g. Fresh Tilapia" required />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div>
              <label style={{ display:"block", fontSize:11, fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:.5, marginBottom:5 }}>Category <span style={{ color:T.red }}>*</span></label>
              <select value={f.catId} onChange={(e) => setF((x) => ({ ...x, catId:Number(e.target.value) }))} style={{ width:"100%", padding:"9px 12px", borderRadius:9, border:`1.5px solid ${T.border}`, fontSize:13, fontFamily:"inherit", background:T.inputBg, color:T.text, outline:"none" }}>
                <option value="">— choose —</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
              </select>
            </div>
            <Field label="Unit" value={f.unit} onChange={(v) => setF((x) => ({ ...x, unit:v }))} options={UNITS} />
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <Field label="Price (₵)" value={f.price} onChange={(v) => setF((x) => ({ ...x, price:v }))} type="number" placeholder="0.00" required />
            <Field label="Stock Qty"  value={f.stock} onChange={(v) => setF((x) => ({ ...x, stock:v }))} type="number" placeholder="0" />
          </div>
          <Field label="Description" value={f.description} onChange={(v) => setF((x) => ({ ...x, description:v }))} placeholder="Short description" rows={2} />
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:6 }}>
            <Btn v="ghost" onClick={() => { setOpen(false); setEdit(null); }}>Cancel</Btn>
            <Btn onClick={save} disabled={!f.name || !f.catId || !f.price}>{editing ? "Save Changes" : "Add Product"}</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Categories ─────────────────────────────────────────────────
function Categories({ categories, setCategories, products }) {
  const T = useT();
  const [open, setOpen]    = useState(false);
  const [editing, setEdit] = useState(null);
  const [search, setSearch] = useState("");
  const blank = { name:"", icon:"🥦", color:"#2A9D8F" };
  const [f, setF] = useState(blank);

  const shown = useMemo(() => {
    if (!search.trim()) return categories;
    const q = search.toLowerCase();
    return categories.filter((c) => c.name.toLowerCase().includes(q));
  }, [categories, search]);

  const save = () => {
    if (!f.name.trim()) return;
    setCategories((p) => editing ? p.map((c) => c.id === editing.id ? { ...c, ...f } : c) : [...p, { ...f, id:Date.now() }]);
    setF(blank); setOpen(false); setEdit(null);
  };

  const remove = (id) => {
    if (products.find((p) => p.catId === id)) return alert("Remove all products in this category first.");
    if (window.confirm("Delete category?")) setCategories((p) => p.filter((c) => c.id !== id));
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:10 }}>
        <div>
          <h2 style={{ fontSize:20, fontWeight:800, color:T.text, margin:0 }}>Categories</h2>
          <p style={{ color:T.muted, fontSize:13, marginTop:4 }}>{categories.length} categories</p>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search categories…" />
          <Btn onClick={() => { setF(blank); setEdit(null); setOpen(true); }}>+ Add Category</Btn>
        </div>
      </div>

      {shown.length === 0 ? <Card><EmptyState icon="🗂️" msg="No categories found" /></Card> : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:12 }}>
          {shown.map((c) => {
            const count = products.filter((p) => p.catId === c.id).length;
            return (
              <Card key={c.id} style={{ position:"relative", overflow:"hidden", padding:16 }}>
                <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:c.color }} />
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginTop:4 }}>
                  <div style={{ width:46, height:46, borderRadius:12, background:c.color+"22", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>{c.icon}</div>
                  <div style={{ display:"flex", gap:5 }}>
                    <button onClick={() => { setF({ name:c.name, icon:c.icon, color:c.color }); setEdit(c); setOpen(true); }} style={{ background:T.bgAlt, border:`1px solid ${T.border}`, borderRadius:7, padding:"4px 8px", cursor:"pointer", fontSize:12 }}>✏️</button>
                    <button onClick={() => remove(c.id)} style={{ background:T.redL, border:`1px solid ${T.red}44`, borderRadius:7, padding:"4px 8px", cursor:"pointer", fontSize:12 }}>🗑️</button>
                  </div>
                </div>
                <div style={{ marginTop:10, fontWeight:700, fontSize:14, color:T.text }}>{c.name}</div>
                <div style={{ fontSize:12, fontWeight:600, marginTop:2, color:c.color }}>{count} product{count !== 1 ? "s" : ""}</div>
              </Card>
            );
          })}
        </div>
      )}

      {open && (
        <Modal title={editing ? "Edit Category" : "Add Category"} onClose={() => { setOpen(false); setEdit(null); }}>
          <div style={{ marginBottom:14 }}>
            <label style={{ display:"block", fontSize:11, fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:.5, marginBottom:8 }}>Icon</label>
            <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
              {EMOJIS.map((e) => (
                <button key={e} onClick={() => setF((x) => ({ ...x, icon:e }))} style={{ width:38, height:38, borderRadius:9, border:`2px solid ${f.icon === e ? T.teal : T.border}`, background:f.icon === e ? T.tealLt : T.bgAlt, fontSize:18, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>{e}</button>
              ))}
            </div>
          </div>
          <Field label="Category Name" value={f.name} onChange={(v) => setF((x) => ({ ...x, name:v }))} placeholder="e.g. Fresh Vegetables" required />
          <div style={{ marginBottom:14 }}>
            <label style={{ display:"block", fontSize:11, fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:.5, marginBottom:6 }}>Colour</label>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <input type="color" value={f.color} onChange={(e) => setF((x) => ({ ...x, color:e.target.value }))} style={{ width:48, height:34, borderRadius:8, border:`1px solid ${T.border}`, cursor:"pointer", padding:2, background:"transparent" }} />
              <span style={{ fontSize:12, color:T.muted }}>{f.color}</span>
            </div>
          </div>
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
            <Btn v="ghost" onClick={() => { setOpen(false); setEdit(null); }}>Cancel</Btn>
            <Btn onClick={save} disabled={!f.name.trim()}>{editing ? "Save Changes" : "Add"}</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Customers ──────────────────────────────────────────────────
function Customers({ customers, setCustomers, orders }) {
  const T = useT();
  const [open, setOpen]       = useState(null);
  const [search, setSearch]   = useState("");
  const [statusFlt, setStatus] = useState("All");
  const [sortBy, setSortBy]   = useState("spent");

  const shown = useMemo(() => {
    let list = customers;
    if (statusFlt !== "All") list = list.filter((c) => c.status === statusFlt);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q));
    }
    if (sortBy === "spent")  list = [...list].sort((a, b) => b.spent - a.spent);
    if (sortBy === "orders") list = [...list].sort((a, b) => b.orders - a.orders);
    if (sortBy === "name")   list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [customers, search, statusFlt, sortBy]);

  const getCustOrders = (c) => orders.filter((o) => o.customer === c.name);
  const th = { padding:"10px 14px", textAlign:"left", fontSize:11, fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:.5 };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:10 }}>
        <div>
          <h2 style={{ fontSize:20, fontWeight:800, color:T.text, margin:0 }}>Customers</h2>
          <p style={{ color:T.muted, fontSize:13, marginTop:4 }}>{customers.length} registered · {shown.length} shown</p>
        </div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search customers…" />
          <SelectFilter value={statusFlt} onChange={setStatus}>
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </SelectFilter>
          <SelectFilter value={sortBy} onChange={setSortBy}>
            <option value="spent">Most Spent</option>
            <option value="orders">Most Orders</option>
            <option value="name">Name A–Z</option>
          </SelectFilter>
        </div>
      </div>

      {/* Summary */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
        {[
          { label:"Total",    value:customers.length,                              color:T.teal  },
          { label:"Active",   value:customers.filter((c) => c.status === "Active").length,   color:T.green },
          { label:"Inactive", value:customers.filter((c) => c.status === "Inactive").length, color:T.muted },
        ].map((s) => (
          <Card key={s.label} style={{ textAlign:"center", padding:"14px 12px" }}>
            <div style={{ fontSize:26, fontWeight:800, color:s.color }}>{s.value}</div>
            <div style={{ fontSize:12, color:T.muted, marginTop:2 }}>{s.label}</div>
          </Card>
        ))}
      </div>

      {shown.length === 0 ? <Card><EmptyState icon="👥" msg="No customers match your search" /></Card> : (
        <Card style={{ padding:0, overflow:"hidden" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
            <thead>
              <tr style={{ background:T.bgAlt }}>
                {["Customer","Phone","Orders","Spent","Last Seen","Status",""].map((h) => <th key={h} style={th}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {shown.map((c, i) => (
                <tr key={c.id} style={{ borderTop:`1px solid ${T.border}`, background:i % 2 ? T.bgAlt : T.card }}>
                  <td style={{ padding:"10px 14px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                      <div style={{ width:34, height:34, borderRadius:10, background:T.tealLt, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:12, color:T.teal, flexShrink:0 }}>{c.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}</div>
                      <div>
                        <div style={{ fontWeight:600, color:T.text }}>{c.name}</div>
                        <div style={{ fontSize:11, color:T.muted }}>{c.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding:"10px 14px", color:T.muted, fontSize:12 }}>{c.phone}</td>
                  <td style={{ padding:"10px 14px", fontWeight:700, color:T.text }}>{c.orders}</td>
                  <td style={{ padding:"10px 14px", fontWeight:700, color:T.teal }}>₵{c.spent.toLocaleString()}</td>
                  <td style={{ padding:"10px 14px", color:T.muted, fontSize:12 }}>{c.lastSeen}</td>
                  <td style={{ padding:"10px 14px" }}><Tag s={c.status} /></td>
                  <td style={{ padding:"10px 14px" }}><Btn sm onClick={() => setOpen(c)}>View</Btn></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {open && (
        <Modal title="Customer Profile" onClose={() => setOpen(null)} w={500}>
          <div style={{ textAlign:"center", marginBottom:18 }}>
            <div style={{ width:60, height:60, borderRadius:18, background:T.tealLt, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:20, color:T.teal, margin:"0 auto 10px" }}>
              {open.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div style={{ fontSize:18, fontWeight:800, color:T.text }}>{open.name}</div>
            <div style={{ fontSize:13, color:T.muted }}>{open.email}</div>
            <div style={{ marginTop:7 }}><Tag s={open.status} /></div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:9, marginBottom:16 }}>
            {[["Phone",open.phone],["Joined",open.joined],["Last Seen",open.lastSeen],["Total Orders",open.orders],["Total Spent",`₵${open.spent.toLocaleString()}`],["Avg. Order",`₵${open.orders ? Math.round(open.spent / open.orders) : 0}`]].map(([l, v]) => (
              <div key={l} style={{ background:T.bgAlt, borderRadius:9, padding:"9px 12px" }}>
                <div style={{ fontSize:10, fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:.5, marginBottom:2 }}>{l}</div>
                <div style={{ fontSize:13, fontWeight:700, color:T.text }}>{v}</div>
              </div>
            ))}
          </div>
          {getCustOrders(open).length > 0 && (
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:11, fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:.5, marginBottom:8 }}>Recent Orders</div>
              {getCustOrders(open).map((o) => (
                <div key={o.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"7px 0", borderBottom:`1px solid ${T.border}`, fontSize:13 }}>
                  <span style={{ fontWeight:600, color:T.teal }}>{o.id}</span>
                  <span style={{ color:T.muted, fontSize:12 }}>{o.time}</span>
                  <span style={{ fontWeight:700, color:T.text }}>₵{o.subtotal + o.fee}</span>
                  <Tag s={o.status} />
                </div>
              ))}
            </div>
          )}
          <div style={{ display:"flex", gap:8 }}>
            <Btn
              full
              v={open.status === "Active" ? "danger" : "primary"}
              onClick={() => {
                setCustomers((p) => p.map((c) => c.id === open.id ? { ...c, status:c.status === "Active" ? "Inactive" : "Active" } : c));
                setOpen((prev) => ({ ...prev, status:prev.status === "Active" ? "Inactive" : "Active" }));
              }}
            >
              {open.status === "Active" ? "🚫 Suspend Customer" : "✅ Re-activate Customer"}
            </Btn>
            <Btn v="ghost" onClick={() => setOpen(null)}>Close</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Payments ───────────────────────────────────────────────────
function Payments({ orders }) {
  const T = useT();
  const [search, setSearch]     = useState("");
  const [methodFlt, setMethod]  = useState("All");
  const paid    = orders.filter((o) => o.paid && o.status !== "Cancelled");
  const revenue = paid.reduce((s, o) => s + o.subtotal + o.fee, 0);
  const byMethod = ["MTN MoMo","Card","Vodafone"].map((m) => ({
    m,
    n: paid.filter((o) => o.method === m).length,
    total: paid.filter((o) => o.method === m).reduce((s, o) => s + o.subtotal + o.fee, 0),
    pct: paid.length ? Math.round((paid.filter((o) => o.method === m).length / paid.length) * 100) : 0,
  }));
  const shown = useMemo(() => {
    let list = orders;
    if (methodFlt !== "All") list = list.filter((o) => o.method === methodFlt);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((o) => o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q));
    }
    return list;
  }, [orders, search, methodFlt]);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div>
        <h2 style={{ fontSize:20, fontWeight:800, color:T.text, margin:0 }}>Payments</h2>
        <p style={{ color:T.muted, fontSize:13, marginTop:4 }}>Revenue & transaction history</p>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
        {[
          { label:"Total Collected", value:`₵${revenue.toLocaleString()}`, icon:"💰", color:T.teal   },
          { label:"Paid Orders",     value:paid.length,                     icon:"✅", color:T.green  },
          { label:"Avg. Order",      value:`₵${paid.length ? Math.round(revenue / paid.length) : 0}`, icon:"📊", color:T.orange },
        ].map((s) => (
          <Card key={s.label} style={{ display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ width:44, height:44, borderRadius:12, background:s.color+"22", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize:22, fontWeight:800, color:T.text, lineHeight:1 }}>{s.value}</div>
              <div style={{ fontSize:12, color:T.muted, marginTop:3 }}>{s.label}</div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <div style={{ fontWeight:700, fontSize:14, color:T.text, marginBottom:14 }}>By Payment Method</div>
        {byMethod.map(({ m, n, total, pct }) => (
          <div key={m} style={{ marginBottom:12 }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:5 }}>
              <div style={{ fontSize:20, flexShrink:0 }}>{m === "MTN MoMo" ? "📱" : m === "Card" ? "💳" : "📲"}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:3 }}>
                  <span style={{ fontWeight:600, color:T.text }}>{m} <span style={{ color:T.muted, fontWeight:400, fontSize:11 }}>({n} orders)</span></span>
                  <span style={{ fontWeight:700, color:T.teal }}>₵{total.toLocaleString()}</span>
                </div>
                <div style={{ height:5, borderRadius:4, background:T.bgAlt, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${pct}%`, background:T.teal, borderRadius:4 }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </Card>

      <Card style={{ padding:0, overflow:"hidden" }}>
        <div style={{ padding:"12px 16px", borderBottom:`1px solid ${T.border}`, display:"flex", gap:10, alignItems:"center", flexWrap:"wrap" }}>
          <span style={{ fontWeight:700, fontSize:13, flex:1, color:T.text }}>All Transactions</span>
          <SearchBar value={search} onChange={setSearch} placeholder="Search…" />
          <SelectFilter value={methodFlt} onChange={setMethod}>
            <option value="All">All Methods</option>
            <option value="MTN MoMo">MTN MoMo</option>
            <option value="Card">Card</option>
            <option value="Vodafone">Vodafone</option>
          </SelectFilter>
        </div>
        {shown.length === 0 ? <EmptyState icon="💸" msg="No transactions match" /> : (
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
            <thead>
              <tr style={{ background:T.bgAlt }}>
                {["Order","Customer","Amount","Method","Status"].map((h) => (
                  <th key={h} style={{ padding:"9px 14px", textAlign:"left", fontSize:11, fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:.5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shown.map((o, i) => (
                <tr key={o.id} style={{ borderTop:`1px solid ${T.border}`, background:i % 2 ? T.bgAlt : T.card }}>
                  <td style={{ padding:"9px 14px", fontWeight:700, color:T.teal }}>{o.id}</td>
                  <td style={{ padding:"9px 14px", color:T.text }}>{o.customer}</td>
                  <td style={{ padding:"9px 14px", fontWeight:700, color:o.paid ? T.green : T.red }}>{o.paid ? "+" : "-"}₵{o.subtotal + o.fee}</td>
                  <td style={{ padding:"9px 14px", color:T.muted }}>{o.method}</td>
                  <td style={{ padding:"9px 14px" }}><Tag s={o.paid && o.status !== "Cancelled" ? "Settled" : "Refunded"} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}

// ── Settings ───────────────────────────────────────────────────
function Settings({ onLogout, dark, setDark }) {
  const T = useT();
  const [name, setName]   = useState("Picky Basket");
  const [phone, setPhone] = useState("+233 30 000 0001");
  const [email, setEmail] = useState("admin@pickybasket.com");
  const [city, setCity]   = useState("Accra, Ghana");
  const [fee, setFee]     = useState("12");
  const [min, setMin]     = useState("20");
  const [curPw, setCurPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [saved, setSaved] = useState(false);
  const [pwMsg, setPwMsg] = useState("");

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2200); };
  const changePw = () => {
    if (!curPw || !newPw) { setPwMsg("Fill both fields."); return; }
    if (curPw !== "picky2024") { setPwMsg("Current password is wrong."); return; }
    setPwMsg("Password changed ✓");
    setCurPw(""); setNewPw("");
    setTimeout(() => setPwMsg(""), 2500);
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16, maxWidth:540 }}>
      <div>
        <h2 style={{ fontSize:20, fontWeight:800, color:T.text, margin:0 }}>Settings</h2>
        <p style={{ color:T.muted, fontSize:13, marginTop:4 }}>Store & admin configuration</p>
      </div>

      <Card>
        <div style={{ fontWeight:700, fontSize:13, marginBottom:14, color:T.text }}>🎨 Appearance</div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 14px", background:T.bgAlt, borderRadius:10, border:`1px solid ${T.border}` }}>
          <div>
            <div style={{ fontWeight:600, fontSize:13, color:T.text }}>Dark Mode</div>
            <div style={{ fontSize:12, color:T.muted, marginTop:2 }}>Switch between light and dark interface</div>
          </div>
          <button
            onClick={() => setDark((d) => !d)}
            style={{ width:48, height:26, borderRadius:13, border:"none", cursor:"pointer", background:dark ? T.teal : "#cbd5e1", transition:"background .2s", position:"relative", padding:0, flexShrink:0 }}
          >
            <span style={{ position:"absolute", top:3, left:dark ? 22 : 3, width:20, height:20, borderRadius:"50%", background:"#fff", transition:"left .2s", boxShadow:"0 1px 4px rgba(0,0,0,.3)" }} />
          </button>
        </div>
      </Card>

      <Card>
        <div style={{ fontWeight:700, fontSize:13, marginBottom:14, color:T.text }}>🏪 Store Info</div>
        <Field label="Store Name" value={name}  onChange={setName}  />
        <Field label="Phone"      value={phone} onChange={setPhone} />
        <Field label="Email"      value={email} onChange={setEmail} type="email" />
        <Field label="City"       value={city}  onChange={setCity}  />
      </Card>

      <Card>
        <div style={{ fontWeight:700, fontSize:13, marginBottom:14, color:T.text }}>🚚 Delivery Settings</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <Field label="Base Delivery Fee (₵)" value={fee} onChange={setFee} type="number" />
          <Field label="Min. Order Amount (₵)" value={min} onChange={setMin} type="number" />
        </div>
      </Card>

      <Card>
        <div style={{ fontWeight:700, fontSize:13, marginBottom:14, color:T.text }}>🔒 Security</div>
        <Field label="Current Password" value={curPw} onChange={setCurPw} type="password" placeholder="Enter current password" />
        <Field label="New Password"     value={newPw} onChange={setNewPw} type="password" placeholder="Enter new password" />
        {pwMsg && (
          <div style={{ fontSize:12, color:pwMsg.includes("✓") ? T.green : T.red, padding:"6px 10px", background:pwMsg.includes("✓") ? T.greenL : T.redL, borderRadius:8, marginBottom:8 }}>{pwMsg}</div>
        )}
        <Btn v="outline" onClick={changePw}>Update Password</Btn>
      </Card>

      <div style={{ display:"flex", gap:10, alignItems:"center", flexWrap:"wrap" }}>
        <Btn onClick={save}>Save Changes</Btn>
        {saved && <span style={{ fontSize:13, color:T.green, fontWeight:600 }}>✓ Settings saved</span>}
        <Btn v="danger" onClick={onLogout} style={{ marginLeft:"auto" }}>Log Out</Btn>
      </div>
    </div>
  );
}

// ── Login ──────────────────────────────────────────────────────
function Login({ onLogin, dark }) {
  const T = useT();
  const [email, setEmail]     = useState("");
  const [pass, setPass]       = useState("");
  const [err, setErr]         = useState("");
  const [loading, setLoading] = useState(false);

  const go = () => {
    if (!email || !pass) { setErr("Enter email and password."); return; }
    setLoading(true); setErr("");
    setTimeout(() => {
      if (email === "admin@pickybasket.com" && pass === "picky2024") onLogin();
      else { setErr("Wrong email or password."); setLoading(false); }
    }, 600);
  };

  return (
    <div style={{ minHeight:"100vh", background:dark ? "linear-gradient(135deg,#040a10 60%,#0d2420)" : "linear-gradient(135deg,#0f1923 60%,#1f7a6e)", display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ background:T.card, borderRadius:22, padding:"38px 34px", width:"100%", maxWidth:400, boxShadow:"0 32px 80px rgba(0,0,0,.5)", border:`1px solid ${T.border}` }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ display:"flex", justifyContent:"center", marginBottom:14 }}>
<img src={logo} alt="Picky Basket" style={{ width:68, height:68, borderRadius:20, margin:"0 auto 12px", display:"block", objectFit:"contain" }} />          </div>
          <div style={{ fontSize:24, fontWeight:800, color:T.text, letterSpacing:-.5 }}>Picky Basket</div>
          <div style={{ fontSize:13, color:T.muted, marginTop:3, fontWeight:500 }}>Admin Portal</div>
        </div>
        <Field label="Email"    value={email} onChange={setEmail} type="email"    placeholder="admin@pickybasket.com" />
        <Field label="Password" value={pass}  onChange={setPass}  type="password" placeholder="••••••••" />
        {err && <div style={{ fontSize:13, color:T.red, padding:"8px 12px", background:T.redL, borderRadius:8, marginBottom:12, fontWeight:500 }}>{err}</div>}
        <Btn full onClick={go} disabled={loading}>{loading ? "Signing in…" : "Sign In"}</Btn>
        <div
          onClick={() => { setEmail("admin@pickybasket.com"); setPass("picky2024"); onLogin(); }}
          style={{ marginTop:12, padding:11, background:T.tealLt, borderRadius:10, fontSize:12, color:T.teal, textAlign:"center", cursor:"pointer", border:`1px dashed ${T.teal}`, fontWeight:700 }}
        >
          👆 Demo: Click to sign in instantly
        </div>
      </div>
    </div>
  );
}

// ── Root ───────────────────────────────────────────────────────
export default function App() {
  const [loggedIn, setLoggedIn]   = useState(false);
  const [page, setPage]           = useState("dash");
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark]           = useState(false);
  const [categories, setCategories] = useState(SEED_CATS);
  const [products, setProducts]     = useState(SEED_PRODUCTS);
  const [orders, setOrders]         = useState(SEED_ORDERS);
  const [customers, setCustomers]   = useState(SEED_CUSTOMERS);

  const theme   = dark ? DARK : LIGHT;
  const pending = orders.filter((o) => o.status === "Pending").length;

  return (
    <ThemeCtx.Provider value={theme}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-thumb { background: ${dark ? "#1e3a4a" : "#cbd5e1"}; border-radius: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        button:hover { opacity: .87; }
        select option { background: ${theme.inputBg}; color: ${theme.text}; }
        input::placeholder, textarea::placeholder { color: ${theme.muted} !important; opacity: 1; }
      `}</style>

      {!loggedIn ? (
        <Login onLogin={() => setLoggedIn(true)} dark={dark} />
      ) : (
        <div style={{ display:"flex", minHeight:"100vh", background:theme.bg, fontFamily:"'DM Sans','Inter',system-ui,sans-serif", color:theme.text, transition:"background .25s,color .25s" }}>
          <Sidebar page={page} go={setPage} pendingCount={pending} collapsed={collapsed} setCollapsed={setCollapsed} dark={dark} setDark={setDark} />
          <main style={{ flex:1, padding:26, overflowY:"auto", minWidth:0 }}>
            {page === "dash"       && <Dashboard  orders={orders} products={products} customers={customers} go={setPage} />}
            {page === "orders"     && <Orders     orders={orders} setOrders={setOrders} />}
            {page === "products"   && <Products   products={products} setProducts={setProducts} categories={categories} />}
            {page === "categories" && <Categories categories={categories} setCategories={setCategories} products={products} />}
            {page === "customers"  && <Customers  customers={customers} setCustomers={setCustomers} orders={orders} />}
            {page === "payments"   && <Payments   orders={orders} />}
            {page === "settings"   && <Settings   onLogout={() => setLoggedIn(false)} dark={dark} setDark={setDark} />}
          </main>
        </div>
      )}
    </ThemeCtx.Provider>
  );
}
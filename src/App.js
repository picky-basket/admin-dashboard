=import { useState, useRef } from "react";
import logo from "./logo.png";

// ── Theme ──────────────────────────────────────────────────────
const T = {
  teal:"#2A9D8F", tealDk:"#1f7a6e", tealLt:"#e0f5f3",
  orange:"#E76F51", orangeL:"#fdeee9",
  navy:"#1a2332",
  text:"#1a1a1a", muted:"#6b7280", border:"#e8ecf0",
  bg:"#f4f7f6", white:"#ffffff",
  green:"#22c55e", greenL:"#dcfce7",
  red:"#ef4444", redL:"#fee2e2",
  yellow:"#f59e0b", yellowL:"#fef3c7",
  blue:"#3b82f6", blueL:"#dbeafe",
};

const readFile = f => new Promise(res => {
  const r = new FileReader(); r.onload = e => res(e.target.result); r.readAsDataURL(f);
});

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
  { id:"#PB-4825", customer:"Akosua Mensah",  phone:"0241112222", address:"12 Cantonments Rd", items:[{name:"Fresh Tilapia",qty:1,price:45},{name:"Asparagus",qty:2,price:12}], subtotal:69, fee:15, status:"Pending",   paid:true,  method:"MTN MoMo",  time:"5 min ago" },
  { id:"#PB-4824", customer:"Kwame Asante",   phone:"0203334444", address:"45 Airport Res.",   items:[{name:"Long Grain Rice",qty:3,price:8}],                                   subtotal:24, fee:12, status:"Packing",   paid:true,  method:"Card",      time:"18 min ago" },
  { id:"#PB-4823", customer:"Ama Boateng",    phone:"0275556666", address:"8 Osu Rd",          items:[{name:"Free Range Eggs",qty:2,price:18},{name:"Ginger",qty:1,price:6}],    subtotal:42, fee:10, status:"Delivering",paid:true,  method:"MTN MoMo",  time:"35 min ago" },
  { id:"#PB-4822", customer:"Yaw Darko",      phone:"0557778888", address:"22 Labone St",      items:[{name:"Scotch Bonnet",qty:2,price:4}],                                     subtotal:8,  fee:12, status:"Delivered", paid:true,  method:"Vodafone",  time:"1 hr ago" },
  { id:"#PB-4821", customer:"Abena Frimpong", phone:"0309990000", address:"5 Ring Rd",         items:[{name:"Chicken Thighs",qty:2,price:35}],                                   subtotal:70, fee:18, status:"Delivered", paid:true,  method:"Card",      time:"2 hr ago" },
  { id:"#PB-4820", customer:"Nana Agyei",     phone:"0241231231", address:"17 Tema Rd",        items:[{name:"Organic Mango",qty:3,price:15}],                                    subtotal:45, fee:15, status:"Cancelled", paid:false, method:"MTN MoMo",  time:"3 hr ago" },
];

const SEED_CUSTOMERS = [
  { id:1, name:"Akosua Mensah",  email:"akosua@email.com",  phone:"0241112222", orders:14, spent:842,  joined:"Jan 2024", lastSeen:"2 min ago",  status:"Active" },
  { id:2, name:"Kwame Asante",   email:"kwame@email.com",   phone:"0203334444", orders:7,  spent:390,  joined:"Mar 2024", lastSeen:"18 min ago", status:"Active" },
  { id:3, name:"Ama Boateng",    email:"ama@email.com",     phone:"0275556666", orders:22, spent:1430, joined:"Nov 2023", lastSeen:"1 hr ago",   status:"Active" },
  { id:4, name:"Yaw Darko",      email:"yaw@email.com",     phone:"0557778888", orders:3,  spent:120,  joined:"Feb 2024", lastSeen:"3 days ago", status:"Inactive" },
  { id:5, name:"Abena Frimpong", email:"abena@email.com",   phone:"0309990000", orders:18, spent:980,  joined:"Dec 2023", lastSeen:"2 hr ago",   status:"Active" },
];

const UNITS = ["kg","g","bundle","pack","pcs","dozen","litre","box","sachet","500g","250g"];
const EMOJIS = ["🥦","🍎","🌾","🐟","🌿","🥚","🥩","🧄","🫑","🍋","🥕","🍅","🧅","🍌","🧀","🥜","🌽","🥔","🫐","🍇"];

// ── Tiny helpers ───────────────────────────────────────────────
const statusStyle = s => ({
  "In Stock":    {bg:T.greenL,  fg:T.green},
  "Low Stock":   {bg:T.yellowL, fg:T.yellow},
  "Out of Stock":{bg:T.redL,    fg:T.red},
  "Pending":     {bg:T.yellowL, fg:T.yellow},
  "Packing":     {bg:T.blueL,   fg:T.blue},
  "Delivering":  {bg:"#ede9fe", fg:"#7c3aed"},
  "Delivered":   {bg:T.greenL,  fg:T.green},
  "Cancelled":   {bg:T.redL,    fg:T.red},
  "Active":      {bg:T.greenL,  fg:T.green},
  "Inactive":    {bg:"#f3f4f6", fg:T.muted},
  "Settled":     {bg:T.greenL,  fg:T.green},
  "Refunded":    {bg:T.redL,    fg:T.red},
}[s]||{bg:T.bg, fg:T.muted});

const Tag = ({s}) => { const {bg,fg}=statusStyle(s); return <span style={{background:bg,color:fg,padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700}}>{s}</span>; };

const Btn = ({children,onClick,v="primary",sm,full,disabled}) => (
  <button onClick={onClick} disabled={disabled} style={{
    background: v==="primary"?T.teal : v==="danger"?T.redL : v==="ghost"?T.bg : "transparent",
    color:      v==="primary"?"#fff"  : v==="danger"?T.red  : T.muted,
    border:     v==="outline"?`1.5px solid ${T.teal}`:v==="ghost"?`1px solid ${T.border}`:"none",
    padding: sm?"6px 14px":"9px 20px", borderRadius:9, fontSize:sm?12:13, fontWeight:600,
    cursor:disabled?"not-allowed":"pointer", width:full?"100%":"auto", opacity:disabled?0.5:1,
    fontFamily:"inherit", transition:"opacity .15s",
  }}>{children}</button>
);

const Field = ({label,value,onChange,type="text",placeholder,options,rows,required}) => (
  <div style={{marginBottom:13}}>
    {label && <label style={{display:"block",fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:.5,marginBottom:5}}>{label}{required&&<span style={{color:T.red}}> *</span>}</label>}
    {options ? (
      <select value={value} onChange={e=>onChange(e.target.value)} style={{width:"100%",padding:"9px 12px",borderRadius:9,border:`1.5px solid ${T.border}`,fontSize:13,fontFamily:"inherit",background:T.white,color:T.text,outline:"none"}}>
        <option value="">— choose —</option>
        {options.map(o=><option key={o.v||o} value={o.v||o}>{o.l||o}</option>)}
      </select>
    ) : rows ? (
      <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows} style={{width:"100%",padding:"9px 12px",borderRadius:9,border:`1.5px solid ${T.border}`,fontSize:13,fontFamily:"inherit",background:T.white,color:T.text,outline:"none",resize:"vertical"}}/>
    ) : (
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{width:"100%",padding:"9px 12px",borderRadius:9,border:`1.5px solid ${T.border}`,fontSize:13,fontFamily:"inherit",background:T.white,color:T.text,outline:"none"}}/>
    )}
  </div>
);

const Modal = ({title,onClose,children,w=480}) => (
  <div onClick={e=>{if(e.target===e.currentTarget)onClose();}} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
    <div style={{background:T.white,borderRadius:16,width:"100%",maxWidth:w,maxHeight:"92vh",overflowY:"auto",boxShadow:"0 24px 80px rgba(0,0,0,.2)"}}>
      <div style={{padding:"16px 20px",borderBottom:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,background:T.white,zIndex:1}}>
        <span style={{fontWeight:700,fontSize:15,color:T.text}}>{title}</span>
        <button onClick={onClose} style={{background:"none",border:"none",fontSize:22,cursor:"pointer",color:T.muted,lineHeight:1}}>×</button>
      </div>
      <div style={{padding:"18px 20px"}}>{children}</div>
    </div>
  </div>
);

const Card = ({children,style}) => <div style={{background:T.white,borderRadius:14,border:`1px solid ${T.border}`,padding:18,...style}}>{children}</div>;

// ── Sidebar ────────────────────────────────────────────────────
const NAV = [
  {key:"dash",      icon:"📊", label:"Dashboard"},
  {key:"orders",    icon:"📦", label:"Orders",    badge:true},
  {key:"products",  icon:"🛒", label:"Products"},
  {key:"categories",icon:"🗂️", label:"Categories"},
  {key:"customers", icon:"👥", label:"Customers"},
  {key:"payments",  icon:"💰", label:"Payments"},
  {key:"settings",  icon:"⚙️", label:"Settings"},
];

function Sidebar({page,go,pendingCount}) {
  return (
    <aside style={{width:210,background:T.navy,display:"flex",flexDirection:"column",height:"100vh",position:"sticky",top:0,flexShrink:0}}>
      <div style={{padding:"18px 14px 14px",borderBottom:"1px solid rgba(255,255,255,.07)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:36,height:36,borderRadius:10,overflow:"hidden",background:T.teal,flexShrink:0}}>
            <img src={logo} alt="" style={{width:"100%",height:"100%",objectFit:"contain"}}/>
          </div>
          <div>
            <div style={{color:"#fff",fontWeight:800,fontSize:14}}>Picky Basket</div>
            <div style={{color:T.teal,fontSize:10,opacity:.8}}>Admin</div>
          </div>
        </div>
      </div>

      <nav style={{flex:1,padding:"10px 8px",overflowY:"auto"}}>
        {NAV.map(n=>{
          const on = page===n.key;
          return (
            <button key={n.key} onClick={()=>go(n.key)} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:10,border:"none",background:on?T.teal:"transparent",color:on?"#fff":"#94a3b8",cursor:"pointer",marginBottom:2,textAlign:"left",fontFamily:"inherit",fontSize:13,fontWeight:on?700:400,transition:"all .15s"}}>
              <span style={{fontSize:16,lineHeight:1}}>{n.icon}</span>
              <span style={{flex:1}}>{n.label}</span>
              {n.badge && pendingCount>0 && <span style={{background:T.orange,color:"#fff",fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:20,lineHeight:1}}>{pendingCount}</span>}
            </button>
          );
        })}
      </nav>

      <div style={{padding:"12px 14px",borderTop:"1px solid rgba(255,255,255,.07)"}}>
        <div style={{fontSize:11,color:"#94a3b8"}}>Logged in as</div>
        <div style={{color:"#fff",fontSize:12,fontWeight:600,marginTop:2}}>Admin</div>
      </div>
    </aside>
  );
}

// ── Dashboard ──────────────────────────────────────────────────
function Dashboard({orders,products,customers}) {
  const revenue  = orders.filter(o=>o.paid&&o.status!=="Cancelled").reduce((s,o)=>s+o.subtotal+o.fee,0);
  const pending  = orders.filter(o=>o.status==="Pending").length;
  const lowStock = products.filter(p=>p.stock<=5).length;
  const today    = orders.filter(o=>o.status==="Delivered").length;

  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div>
        <h2 style={{fontSize:20,fontWeight:800,color:T.text,margin:0}}>Dashboard</h2>
        <p style={{color:T.muted,fontSize:13,marginTop:4}}>Your store at a glance</p>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14}}>
        {[
          {label:"Total Revenue",  value:`₵${revenue}`, icon:"💰", color:T.teal},
          {label:"Pending Orders", value:pending,        icon:"⏳", color:T.orange},
          {label:"Delivered Today",value:today,          icon:"✅", color:T.green},
          {label:"Low on Stock",   value:lowStock,       icon:"⚠️", color:T.red},
        ].map(s=>(
          <Card key={s.label} style={{display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:44,height:44,borderRadius:12,background:s.color+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{s.icon}</div>
            <div>
              <div style={{fontSize:22,fontWeight:800,color:T.text,lineHeight:1}}>{s.value}</div>
              <div style={{fontSize:12,color:T.muted,marginTop:3}}>{s.label}</div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <div style={{fontWeight:700,fontSize:14,color:T.text,marginBottom:14}}>Recent Orders</div>
        {orders.slice(0,5).map((o,i)=>(
          <div key={o.id} style={{display:"flex",alignItems:"center",gap:14,padding:"10px 0",borderTop:i>0?`1px solid ${T.border}`:"none"}}>
            <div style={{flex:1}}>
              <div style={{fontWeight:600,fontSize:13}}>{o.customer}</div>
              <div style={{fontSize:12,color:T.muted}}>{o.id} · {o.time}</div>
            </div>
            <div style={{fontWeight:700,fontSize:14}}>₵{o.subtotal+o.fee}</div>
            <Tag s={o.status}/>
          </div>
        ))}
      </Card>

      {lowStock>0 && (
        <Card style={{borderLeft:`4px solid ${T.red}`}}>
          <div style={{fontWeight:700,fontSize:13,color:T.red,marginBottom:10}}>⚠️ Stock Alerts</div>
          {products.filter(p=>p.stock<=5).map(p=>(
            <div key={p.id} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderTop:`1px solid ${T.border}`,fontSize:13}}>
              <span>{p.name}</span>
              <span style={{fontWeight:700,color:p.stock===0?T.red:T.yellow}}>{p.stock===0?"Out of stock":`${p.stock} left`}</span>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

// ── Orders ─────────────────────────────────────────────────────
function Orders({orders,setOrders}) {
  const [tab,setTab]   = useState("All");
  const [open,setOpen] = useState(null);
  const tabs = ["All","Pending","Packing","Delivering","Delivered","Cancelled"];
  const list = tab==="All" ? orders : orders.filter(o=>o.status===tab);
  const next = {Pending:"Packing", Packing:"Delivering", Delivering:"Delivered"};

  return (
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div>
        <h2 style={{fontSize:20,fontWeight:800,color:T.text,margin:0}}>Orders</h2>
        <p style={{color:T.muted,fontSize:13,marginTop:4}}>{orders.length} total orders</p>
      </div>

      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
        {tabs.map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{padding:"6px 14px",borderRadius:20,border:`1.5px solid ${tab===t?T.teal:T.border}`,background:tab===t?T.teal:T.white,color:tab===t?"#fff":T.muted,fontSize:12,fontWeight:tab===t?700:400,cursor:"pointer",fontFamily:"inherit"}}>
            {t}{t!=="All"?` (${orders.filter(o=>o.status===t).length})`:""}
          </button>
        ))}
      </div>

      <Card style={{padding:0,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{background:T.bg}}>
            {["Order","Customer","Total","Status","Paid",""].map(h=><th key={h} style={{padding:"10px 14px",textAlign:"left",fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:.5}}>{h}</th>)}
          </tr></thead>
          <tbody>
            {list.map((o,i)=>(
              <tr key={o.id} style={{borderTop:`1px solid ${T.border}`,background:i%2?T.bg:T.white}}>
                <td style={{padding:"10px 14px",fontWeight:700,color:T.teal}}>{o.id}</td>
                <td style={{padding:"10px 14px"}}>
                  <div style={{fontWeight:600}}>{o.customer}</div>
                  <div style={{fontSize:11,color:T.muted}}>{o.phone}</div>
                </td>
                <td style={{padding:"10px 14px",fontWeight:700}}>₵{o.subtotal+o.fee}</td>
                <td style={{padding:"10px 14px"}}><Tag s={o.status}/></td>
                <td style={{padding:"10px 14px"}}>
                  <div style={{fontSize:12,color:o.paid?T.green:T.red,fontWeight:700}}>{o.paid?"✓ Paid":"✗ Unpaid"}</div>
                  <div style={{fontSize:11,color:T.muted}}>{o.method}</div>
                </td>
                <td style={{padding:"10px 14px"}}><Btn sm onClick={()=>setOpen(o)}>View</Btn></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {open && (
        <Modal title={`Order ${open.id}`} onClose={()=>setOpen(null)}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
            {[["Customer",open.customer],["Phone",open.phone],["Address",open.address],["Time",open.time]].map(([l,v])=>(
              <div key={l} style={{background:T.bg,borderRadius:9,padding:"10px 13px"}}>
                <div style={{fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:.5,marginBottom:3}}>{l}</div>
                <div style={{fontSize:13,fontWeight:600}}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{background:T.bg,borderRadius:10,padding:14,marginBottom:16}}>
            <div style={{fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:.5,marginBottom:10}}>Items</div>
            {open.items.map((it,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:i<open.items.length-1?`1px solid ${T.border}`:"none",fontSize:13}}>
                <span>{it.name} × {it.qty}</span><span style={{fontWeight:700}}>₵{it.price*it.qty}</span>
              </div>
            ))}
            <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0 0",fontSize:13,color:T.muted}}><span>Delivery fee</span><span>₵{open.fee}</span></div>
            <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0 0",borderTop:`1px solid ${T.border}`,marginTop:6,fontWeight:800,fontSize:15}}><span>Total</span><span style={{color:T.teal}}>₵{open.subtotal+open.fee}</span></div>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {next[open.status] && (
              <Btn onClick={()=>{setOrders(p=>p.map(o=>o.id===open.id?{...o,status:next[open.status]}:o));setOpen(null);}}>
                Mark as {next[open.status]}
              </Btn>
            )}
            {open.status!=="Cancelled"&&open.status!=="Delivered"&&(
              <Btn v="danger" onClick={()=>{setOrders(p=>p.map(o=>o.id===open.id?{...o,status:"Cancelled"}:o));setOpen(null);}}>Cancel</Btn>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Products ───────────────────────────────────────────────────
function Products({products,setProducts,categories}) {
  const [open,setOpen]    = useState(false);
  const [editing,setEdit] = useState(null);
  const [cat,setCat]      = useState("All");
  const [preview,setPreview] = useState(null);
  const fileRef = useRef();
  const blank = {name:"",catId:"",price:"",unit:"kg",stock:"",description:"",image:null};
  const [f,setF] = useState(blank);

  const shown = cat==="All" ? products : products.filter(p=>p.catId===Number(cat));

  const handleImg = async e => {
    const file = e.target.files[0]; if(!file) return;
    const d = await readFile(file); setPreview(d); setF(x=>({...x,image:d}));
  };

  const save = () => {
    if(!f.name||!f.catId||!f.price) return;
    const stock = parseInt(f.stock)||0;
    const prod = {...f, price:parseFloat(f.price), stock, id:editing?.id||Date.now()};
    setProducts(p => editing ? p.map(x=>x.id===editing.id?prod:x) : [...p,prod]);
    setF(blank); setPreview(null); setOpen(false); setEdit(null);
  };

  const remove = id => { if(window.confirm("Delete product?")) setProducts(p=>p.filter(x=>x.id!==id)); };
  const edit = p => { setF({name:p.name,catId:p.catId,price:p.price,unit:p.unit,stock:p.stock,description:p.description,image:p.image}); setPreview(p.image); setEdit(p); setOpen(true); };
  const stockLabel = s => s===0?"Out of Stock":s<=5?"Low Stock":"In Stock";

  return (
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <h2 style={{fontSize:20,fontWeight:800,color:T.text,margin:0}}>Products</h2>
          <p style={{color:T.muted,fontSize:13,marginTop:4}}>{products.length} items in your catalog</p>
        </div>
        <Btn onClick={()=>{setF(blank);setPreview(null);setEdit(null);setOpen(true);}}>+ Add Product</Btn>
      </div>

      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
        <button onClick={()=>setCat("All")} style={{padding:"6px 13px",borderRadius:20,border:`1.5px solid ${cat==="All"?T.teal:T.border}`,background:cat==="All"?T.teal:T.white,color:cat==="All"?"#fff":T.muted,fontSize:12,fontWeight:cat==="All"?700:400,cursor:"pointer",fontFamily:"inherit"}}>All</button>
        {categories.map(c=>(
          <button key={c.id} onClick={()=>setCat(String(c.id))} style={{padding:"6px 13px",borderRadius:20,border:`1.5px solid ${cat===String(c.id)?T.teal:T.border}`,background:cat===String(c.id)?T.teal:T.white,color:cat===String(c.id)?"#fff":T.muted,fontSize:12,fontWeight:cat===String(c.id)?700:400,cursor:"pointer",fontFamily:"inherit"}}>{c.icon} {c.name}</button>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:14}}>
        {shown.map(p=>{
          const c = categories.find(x=>x.id===p.catId);
          const sl = stockLabel(p.stock);
          return (
            <Card key={p.id} style={{padding:0,overflow:"hidden"}}>
              <div style={{height:120,background:c?c.color+"18":T.bg,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
                {p.image ? <img src={p.image} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/> : <span style={{fontSize:46}}>{c?.icon||"🛒"}</span>}
                <div style={{position:"absolute",top:7,right:7}}><Tag s={sl}/></div>
              </div>
              <div style={{padding:"11px 13px"}}>
                <div style={{fontWeight:700,fontSize:13,color:T.text}}>{p.name}</div>
                <div style={{fontSize:11,color:T.muted,marginTop:1,marginBottom:8}}>{c?.name} · per {p.unit}</div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:9}}>
                  <span style={{fontSize:18,fontWeight:800,color:T.teal}}>₵{p.price}</span>
                  <span style={{fontSize:11,color:T.muted}}>Stock: <b style={{color:p.stock<=5?T.red:T.text}}>{p.stock}</b></span>
                </div>
                <div style={{display:"flex",gap:6}}>
                  <Btn sm v="outline" onClick={()=>edit(p)} full>Edit</Btn>
                  <button onClick={()=>remove(p.id)} style={{padding:"5px 9px",borderRadius:8,border:`1px solid ${T.border}`,background:T.bg,cursor:"pointer",fontSize:13}}>🗑️</button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {open && (
        <Modal title={editing?"Edit Product":"Add Product"} onClose={()=>{setOpen(false);setEdit(null);}}>
          <div style={{marginBottom:14}}>
            <label style={{display:"block",fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:.5,marginBottom:6}}>Product Photo</label>
            <div onClick={()=>fileRef.current.click()} style={{width:"100%",height:150,borderRadius:12,border:`2px dashed ${T.border}`,background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",overflow:"hidden"}}>
              {preview ? <img src={preview} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/> : (
                <div style={{textAlign:"center",color:T.muted}}>
                  <div style={{fontSize:28,marginBottom:5}}>📷</div>
                  <div style={{fontSize:12,fontWeight:600}}>Click to upload</div>
                  <div style={{fontSize:11}}>JPG, PNG, WEBP</div>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImg} style={{display:"none"}}/>
            {preview&&<button onClick={()=>{setPreview(null);setF(x=>({...x,image:null}));}} style={{marginTop:4,fontSize:11,color:T.red,background:"none",border:"none",cursor:"pointer"}}>Remove photo</button>}
          </div>
          <Field label="Name" value={f.name} onChange={v=>setF(x=>({...x,name:v}))} placeholder="e.g. Fresh Tilapia" required/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div>
              <label style={{display:"block",fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:.5,marginBottom:5}}>Category <span style={{color:T.red}}>*</span></label>
              <select value={f.catId} onChange={e=>setF(x=>({...x,catId:Number(e.target.value)}))} style={{width:"100%",padding:"9px 12px",borderRadius:9,border:`1.5px solid ${T.border}`,fontSize:13,fontFamily:"inherit",background:T.white,color:T.text,outline:"none"}}>
                <option value="">— choose —</option>
                {categories.map(c=><option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
              </select>
            </div>
            <Field label="Unit" value={f.unit} onChange={v=>setF(x=>({...x,unit:v}))} options={UNITS}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <Field label="Price (₵)" value={f.price} onChange={v=>setF(x=>({...x,price:v}))} type="number" placeholder="0.00" required/>
            <Field label="Stock Qty" value={f.stock} onChange={v=>setF(x=>({...x,stock:v}))} type="number" placeholder="0"/>
          </div>
          <Field label="Description" value={f.description} onChange={v=>setF(x=>({...x,description:v}))} placeholder="Short description" rows={2}/>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:6}}>
            <Btn v="ghost" onClick={()=>{setOpen(false);setEdit(null);}}>Cancel</Btn>
            <Btn onClick={save} disabled={!f.name||!f.catId||!f.price}>{editing?"Save":"Add Product"}</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Categories ─────────────────────────────────────────────────
function Categories({categories,setCategories,products}) {
  const [open,setOpen]    = useState(false);
  const [editing,setEdit] = useState(null);
  const blank = {name:"",icon:"🥦",color:T.teal};
  const [f,setF] = useState(blank);

  const save = () => {
    if(!f.name.trim()) return;
    setCategories(p => editing ? p.map(c=>c.id===editing.id?{...c,...f}:c) : [...p,{...f,id:Date.now()}]);
    setF(blank); setOpen(false); setEdit(null);
  };

  const remove = id => {
    if(products.find(p=>p.catId===id)) return alert("Remove all products in this category first.");
    if(window.confirm("Delete category?")) setCategories(p=>p.filter(c=>c.id!==id));
  };

  return (
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <h2 style={{fontSize:20,fontWeight:800,color:T.text,margin:0}}>Categories</h2>
          <p style={{color:T.muted,fontSize:13,marginTop:4}}>{categories.length} categories</p>
        </div>
        <Btn onClick={()=>{setF(blank);setEdit(null);setOpen(true);}}>+ Add Category</Btn>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:12}}>
        {categories.map(c=>{
          const count = products.filter(p=>p.catId===c.id).length;
          return (
            <Card key={c.id} style={{position:"relative",overflow:"hidden",padding:16}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:c.color}}/>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginTop:4}}>
                <div style={{width:44,height:44,borderRadius:12,background:c.color+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{c.icon}</div>
                <div style={{display:"flex",gap:5}}>
                  <button onClick={()=>{setF({name:c.name,icon:c.icon,color:c.color});setEdit(c);setOpen(true);}} style={{background:T.bg,border:`1px solid ${T.border}`,borderRadius:7,padding:"4px 8px",cursor:"pointer",fontSize:12}}>✏️</button>
                  <button onClick={()=>remove(c.id)} style={{background:T.redL,border:`1px solid #fca5a5`,borderRadius:7,padding:"4px 8px",cursor:"pointer",fontSize:12}}>🗑️</button>
                </div>
              </div>
              <div style={{marginTop:10,fontWeight:700,fontSize:14,color:T.text}}>{c.name}</div>
              <div style={{fontSize:12,color:c.color,fontWeight:600,marginTop:2}}>{count} product{count!==1?"s":""}</div>
            </Card>
          );
        })}
      </div>

      {open && (
        <Modal title={editing?"Edit Category":"Add Category"} onClose={()=>{setOpen(false);setEdit(null);}}>
          <div style={{marginBottom:14}}>
            <label style={{display:"block",fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:.5,marginBottom:8}}>Icon</label>
            <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
              {EMOJIS.map(e=>(
                <button key={e} onClick={()=>setF(x=>({...x,icon:e}))} style={{width:38,height:38,borderRadius:9,border:`2px solid ${f.icon===e?T.teal:T.border}`,background:f.icon===e?T.tealLt:T.bg,fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{e}</button>
              ))}
            </div>
          </div>
          <Field label="Category Name" value={f.name} onChange={v=>setF(x=>({...x,name:v}))} placeholder="e.g. Fresh Vegetables" required/>
          <div style={{marginBottom:14}}>
            <label style={{display:"block",fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:.5,marginBottom:6}}>Colour</label>
            <input type="color" value={f.color} onChange={e=>setF(x=>({...x,color:e.target.value}))} style={{width:48,height:34,borderRadius:8,border:`1px solid ${T.border}`,cursor:"pointer",padding:2}}/>
          </div>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
            <Btn v="ghost" onClick={()=>{setOpen(false);setEdit(null);}}>Cancel</Btn>
            <Btn onClick={save} disabled={!f.name.trim()}>{editing?"Save":"Add"}</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Customers ──────────────────────────────────────────────────
function Customers({customers,setCustomers}) {
  const [open,setOpen] = useState(null);

  return (
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div>
        <h2 style={{fontSize:20,fontWeight:800,color:T.text,margin:0}}>Customers</h2>
        <p style={{color:T.muted,fontSize:13,marginTop:4}}>{customers.length} registered customers</p>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
        {[
          {label:"Total",   value:customers.length,                               color:T.teal},
          {label:"Active",  value:customers.filter(c=>c.status==="Active").length, color:T.green},
          {label:"Inactive",value:customers.filter(c=>c.status==="Inactive").length,color:T.muted},
        ].map(s=>(
          <Card key={s.label} style={{textAlign:"center",padding:"14px 12px"}}>
            <div style={{fontSize:26,fontWeight:800,color:s.color}}>{s.value}</div>
            <div style={{fontSize:12,color:T.muted,marginTop:2}}>{s.label}</div>
          </Card>
        ))}
      </div>

      <Card style={{padding:0,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{background:T.bg}}>
            {["Customer","Phone","Orders","Spent","Last Seen","Status",""].map(h=><th key={h} style={{padding:"10px 14px",textAlign:"left",fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:.5}}>{h}</th>)}
          </tr></thead>
          <tbody>
            {customers.map((c,i)=>(
              <tr key={c.id} style={{borderTop:`1px solid ${T.border}`,background:i%2?T.bg:T.white}}>
                <td style={{padding:"10px 14px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:9}}>
                    <div style={{width:32,height:32,borderRadius:9,background:T.tealLt,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:12,color:T.teal,flexShrink:0}}>{c.name.split(" ").map(n=>n[0]).join("").slice(0,2)}</div>
                    <div>
                      <div style={{fontWeight:600,color:T.text}}>{c.name}</div>
                      <div style={{fontSize:11,color:T.muted}}>{c.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{padding:"10px 14px",color:T.muted,fontSize:12}}>{c.phone}</td>
                <td style={{padding:"10px 14px",fontWeight:700}}>{c.orders}</td>
                <td style={{padding:"10px 14px",fontWeight:700,color:T.teal}}>₵{c.spent}</td>
                <td style={{padding:"10px 14px",color:T.muted,fontSize:12}}>{c.lastSeen}</td>
                <td style={{padding:"10px 14px"}}><Tag s={c.status}/></td>
                <td style={{padding:"10px 14px"}}><Btn sm onClick={()=>setOpen(c)}>View</Btn></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {open && (
        <Modal title="Customer" onClose={()=>setOpen(null)}>
          <div style={{textAlign:"center",marginBottom:18}}>
            <div style={{width:56,height:56,borderRadius:16,background:T.tealLt,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:18,color:T.teal,margin:"0 auto 10px"}}>{open.name.split(" ").map(n=>n[0]).join("").slice(0,2)}</div>
            <div style={{fontSize:17,fontWeight:800,color:T.text}}>{open.name}</div>
            <div style={{fontSize:13,color:T.muted}}>{open.email}</div>
            <div style={{marginTop:7}}><Tag s={open.status}/></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
            {[["Phone",open.phone],["Joined",open.joined],["Last Seen",open.lastSeen],["Total Orders",open.orders],["Total Spent",`₵${open.spent}`]].map(([l,v])=>(
              <div key={l} style={{background:T.bg,borderRadius:9,padding:"9px 12px"}}>
                <div style={{fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:.5,marginBottom:2}}>{l}</div>
                <div style={{fontSize:13,fontWeight:700,color:T.text}}>{v}</div>
              </div>
            ))}
          </div>
          <Btn full v={open.status==="Active"?"danger":"primary"} onClick={()=>{setCustomers(p=>p.map(c=>c.id===open.id?{...c,status:c.status==="Active"?"Inactive":"Active"}:c));setOpen(null);}}>
            {open.status==="Active"?"Suspend Customer":"Re-activate Customer"}
          </Btn>
        </Modal>
      )}
    </div>
  );
}

// ── Payments ───────────────────────────────────────────────────
function Payments({orders}) {
  const paid    = orders.filter(o=>o.paid&&o.status!=="Cancelled");
  const revenue = paid.reduce((s,o)=>s+o.subtotal+o.fee,0);
  const byMethod = ["MTN MoMo","Card","Vodafone"].map(m=>({m,n:paid.filter(o=>o.method===m).length,total:paid.filter(o=>o.method===m).reduce((s,o)=>s+o.subtotal+o.fee,0)}));

  return (
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div>
        <h2 style={{fontSize:20,fontWeight:800,color:T.text,margin:0}}>Payments</h2>
        <p style={{color:T.muted,fontSize:13,marginTop:4}}>Money received from orders</p>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
        {[
          {label:"Total Collected", value:`₵${revenue}`,                                    icon:"💰", color:T.teal},
          {label:"Paid Orders",     value:paid.length,                                       icon:"✅", color:T.green},
          {label:"Avg. Order",      value:`₵${paid.length?Math.round(revenue/paid.length):0}`,icon:"📊", color:T.orange},
        ].map(s=>(
          <Card key={s.label} style={{display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:44,height:44,borderRadius:12,background:s.color+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{s.icon}</div>
            <div>
              <div style={{fontSize:22,fontWeight:800,color:T.text,lineHeight:1}}>{s.value}</div>
              <div style={{fontSize:12,color:T.muted,marginTop:3}}>{s.label}</div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <div style={{fontWeight:700,fontSize:14,color:T.text,marginBottom:14}}>By Payment Method</div>
        {byMethod.map(({m,n,total})=>(
          <div key={m} style={{display:"flex",alignItems:"center",gap:14,padding:"10px 0",borderTop:`1px solid ${T.border}`}}>
            <div style={{fontSize:20}}>{m==="MTN MoMo"?"📱":m==="Card"?"💳":"📲"}</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:600,fontSize:13}}>{m}</div>
              <div style={{fontSize:11,color:T.muted}}>{n} orders</div>
            </div>
            <div style={{fontWeight:800,fontSize:15,color:T.teal}}>₵{total}</div>
          </div>
        ))}
      </Card>

      <Card style={{padding:0,overflow:"hidden"}}>
        <div style={{padding:"12px 16px",borderBottom:`1px solid ${T.border}`,fontWeight:700,fontSize:13}}>All Transactions</div>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{background:T.bg}}>
            {["Order","Customer","Amount","Method","Status"].map(h=><th key={h} style={{padding:"9px 14px",textAlign:"left",fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:.5}}>{h}</th>)}
          </tr></thead>
          <tbody>
            {orders.map((o,i)=>(
              <tr key={o.id} style={{borderTop:`1px solid ${T.border}`,background:i%2?T.bg:T.white}}>
                <td style={{padding:"9px 14px",fontWeight:700,color:T.teal}}>{o.id}</td>
                <td style={{padding:"9px 14px"}}>{o.customer}</td>
                <td style={{padding:"9px 14px",fontWeight:700,color:o.paid?T.green:T.red}}>{o.paid?"+":"-"}₵{o.subtotal+o.fee}</td>
                <td style={{padding:"9px 14px",color:T.muted}}>{o.method}</td>
                <td style={{padding:"9px 14px"}}><Tag s={o.paid&&o.status!=="Cancelled"?"Settled":"Refunded"}/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ── Settings ───────────────────────────────────────────────────
function Settings() {
  const [name,setName]   = useState("Picky Basket");
  const [phone,setPhone] = useState("+233 30 000 0001");
  const [email,setEmail] = useState("admin@pickybasket.com");
  const [fee,setFee]     = useState("12");
  const [min,setMin]     = useState("20");
  const [saved,setSaved] = useState(false);

  return (
    <div style={{display:"flex",flexDirection:"column",gap:16,maxWidth:520}}>
      <div>
        <h2 style={{fontSize:20,fontWeight:800,color:T.text,margin:0}}>Settings</h2>
        <p style={{color:T.muted,fontSize:13,marginTop:4}}>Store configuration</p>
      </div>
      <Card>
        <div style={{fontWeight:700,fontSize:13,marginBottom:14}}>Store Info</div>
        <Field label="Store Name" value={name}  onChange={setName}/>
        <Field label="Phone"      value={phone} onChange={setPhone}/>
        <Field label="Email"      value={email} onChange={setEmail} type="email"/>
      </Card>
      <Card>
        <div style={{fontWeight:700,fontSize:13,marginBottom:14}}>Delivery</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Field label="Base Delivery Fee (₵)" value={fee} onChange={setFee} type="number"/>
          <Field label="Min. Order (₵)"         value={min} onChange={setMin} type="number"/>
        </div>
      </Card>
      <Card>
        <div style={{fontWeight:700,fontSize:13,marginBottom:14}}>Change Password</div>
        <Field label="Current Password" value="" onChange={()=>{}} type="password" placeholder="••••••••"/>
        <Field label="New Password"     value="" onChange={()=>{}} type="password" placeholder="••••••••"/>
      </Card>
      <div style={{display:"flex",gap:12,alignItems:"center"}}>
        <Btn onClick={()=>{setSaved(true);setTimeout(()=>setSaved(false),2200);}}>Save Changes</Btn>
        {saved && <span style={{fontSize:13,color:T.green,fontWeight:600}}>✓ Saved</span>}
      </div>
    </div>
  );
}

// ── Login ──────────────────────────────────────────────────────
function Login({onLogin}) {
  const [email,setEmail] = useState("");
  const [pass,setPass]   = useState("");
  const [err,setErr]     = useState("");
  const [loading,setLoading] = useState(false);

  const go = () => {
    if(!email||!pass){setErr("Enter email and password.");return;}
    setLoading(true); setErr("");
    setTimeout(()=>{
      if(email==="admin@pickybasket.com"&&pass==="picky2024") onLogin();
      else { setErr("Wrong email or password."); setLoading(false); }
    },600);
  };

  return (
    <div style={{minHeight:"100vh",background:T.navy,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:T.white,borderRadius:20,padding:"36px 32px",width:"100%",maxWidth:400,boxShadow:"0 32px 80px rgba(0,0,0,.25)"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{width:56,height:56,borderRadius:16,overflow:"hidden",margin:"0 auto 14px",border:`3px solid ${T.tealLt}`}}>
            <img src={logo} alt="" style={{width:"100%",height:"100%",objectFit:"contain"}}/>
          </div>
          <div style={{fontSize:22,fontWeight:800,color:T.text}}>Admin Login</div>
          <div style={{fontSize:13,color:T.muted,marginTop:3}}>Picky Basket</div>
        </div>
        <Field label="Email"    value={email} onChange={setEmail} type="email"    placeholder="admin@pickybasket.com"/>
        <Field label="Password" value={pass}  onChange={setPass}  type="password" placeholder="••••••••"/>
        {err && <div style={{fontSize:13,color:T.red,padding:"8px 12px",background:T.redL,borderRadius:8,marginBottom:12}}>{err}</div>}
        <Btn full onClick={go} disabled={loading}>{loading?"Signing in…":"Sign In"}</Btn>
        <div onClick={()=>{setEmail("admin@pickybasket.com");setPass("picky2024");onLogin();}} style={{marginTop:14,padding:12,background:T.tealLt,borderRadius:9,fontSize:12,color:T.teal,textAlign:"center",cursor:"pointer",border:`1px solid ${T.teal}55`,fontWeight:700}}>
          👆 Click here to log in
        </div>
      </div>
    </div>
  );
}

// ── Root ───────────────────────────────────────────────────────
export default function App() {
  const [loggedIn,setLoggedIn]     = useState(false);
  const [page,setPage]             = useState("dash");
  const [categories,setCategories] = useState(SEED_CATS);
  const [products,setProducts]     = useState(SEED_PRODUCTS);
  const [orders,setOrders]         = useState(SEED_ORDERS);
  const [customers,setCustomers]   = useState(SEED_CUSTOMERS);

  const pending = orders.filter(o=>o.status==="Pending").length;

  if(!loggedIn) return <Login onLogin={()=>setLoggedIn(true)}/>;

  return (
    <div style={{display:"flex",minHeight:"100vh",background:T.bg,fontFamily:"'Inter',system-ui,sans-serif",color:T.text}}>
      <Sidebar page={page} go={setPage} pendingCount={pending}/>
      <main style={{flex:1,padding:26,overflowY:"auto"}}>
        {page==="dash"       && <Dashboard  orders={orders} products={products} customers={customers}/>}
        {page==="orders"     && <Orders     orders={orders} setOrders={setOrders}/>}
        {page==="products"   && <Products   products={products} setProducts={setProducts} categories={categories}/>}
        {page==="categories" && <Categories categories={categories} setCategories={setCategories} products={products}/>}
        {page==="customers"  && <Customers  customers={customers} setCustomers={setCustomers}/>}
        {page==="payments"   && <Payments   orders={orders}/>}
        {page==="settings"   && <Settings/>}
      </main>
    </div>
  );
}

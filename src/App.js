import { useState, useRef } from "react";
import logo from "./logo.png";

// ── Theme ──────────────────────────────────────────────────────
const T = {
  teal:"#2A9D8F",tealDk:"#1f7a6e",tealLt:"#e0f5f3",tealMid:"#b2e8e2",
  orange:"#E76F51",orangeL:"#fdeee9",
  yellow:"#E9C46A",yellowL:"#fdf4dc",
  navy:"#1a2332",navyMid:"#243447",navyLight:"#2f4460",
  text:"#1a1a1a",muted:"#6b7280",border:"#e8ecf0",
  bg:"#f4f7f6",white:"#ffffff",
  green:"#22c55e",greenL:"#dcfce7",
  red:"#ef4444",redL:"#fee2e2",
  blue:"#3b82f6",blueL:"#dbeafe",
  purple:"#8b5cf6",purpleL:"#ede9fe",
  sidebar:"#1a2332",sidebarText:"#b2e8e2",
};

const readFile = (file) => new Promise(res => {
  const r = new FileReader(); r.onload = e => res(e.target.result); r.readAsDataURL(file);
});

// ── Initial Data ───────────────────────────────────────────────
const INIT_CATS = [
  { id:1, name:"Vegetables",       icon:"🥦", color:"#22c55e", itemCount:12, description:"Fresh farm vegetables" },
  { id:2, name:"Fruits",           icon:"🍎", color:"#f97316", itemCount:8,  description:"Seasonal fresh fruits" },
  { id:3, name:"Grains & Flours",  icon:"🌾", color:"#eab308", itemCount:6,  description:"Rice, flour, cereals" },
  { id:4, name:"Fish & Seafood",   icon:"🐟", color:"#06b6d4", itemCount:9,  description:"Fresh daily catch" },
  { id:5, name:"Herbs & Spices",   icon:"🌿", color:"#10b981", itemCount:14, description:"Fresh and dried herbs" },
  { id:6, name:"Dairy & Eggs",     icon:"🥚", color:"#f59e0b", itemCount:7,  description:"Eggs, milk, cheese" },
  { id:7, name:"Meats & Poultry",  icon:"🥩", color:"#ef4444", itemCount:5,  description:"Fresh meats, chicken" },
  { id:8, name:"Essentials",       icon:"🧄", color:"#8b5cf6", itemCount:11, description:"Kitchen essentials" },
];

const INIT_PRODUCTS = [
  { id:1, name:"Fresh Tilapia",    catId:4, price:45, unit:"kg",     stock:24, status:"In Stock",    image:null, description:"Fresh daily catch from Tema harbour",   sales:84 },
  { id:2, name:"Asparagus",        catId:1, price:12, unit:"bundle", stock:8,  status:"Low Stock",   image:null, description:"Organic fresh asparagus bundles",        sales:32 },
  { id:3, name:"Scotch Bonnet",    catId:5, price:4,  unit:"pack",   stock:0,  status:"Out of Stock",image:null, description:"Hot scotch bonnet peppers",               sales:156 },
  { id:4, name:"Long Grain Rice",  catId:3, price:8,  unit:"500g",   stock:45, status:"In Stock",    image:null, description:"Premium long grain white rice",           sales:210 },
  { id:5, name:"Free Range Eggs",  catId:6, price:18, unit:"dozen",  stock:32, status:"In Stock",    image:null, description:"Farm fresh free range eggs",              sales:98 },
  { id:6, name:"Organic Mango",    catId:2, price:15, unit:"kg",     stock:20, status:"In Stock",    image:null, description:"Sweet organic mangoes, seasonal",         sales:41 },
  { id:7, name:"Chicken Thighs",   catId:7, price:35, unit:"kg",     stock:15, status:"In Stock",    image:null, description:"Fresh boneless chicken thighs",           sales:67 },
  { id:8, name:"Catfish",          catId:4, price:55, unit:"kg",     stock:0,  status:"Out of Stock",image:null, description:"Fresh smoked and fresh catfish",          sales:28 },
  { id:9, name:"Ginger",           catId:5, price:6,  unit:"pack",   stock:60, status:"In Stock",    image:null, description:"Fresh ginger root, 200g pack",            sales:189 },
];

const INIT_ORDERS = [
  { id:"#PB-4825",customer:"Akosua Mensah",  phone:"0241112222",address:"12 Cantonments Rd",items:[{name:"Fresh Tilapia",qty:1,price:45},{name:"Asparagus",qty:2,price:12}],total:69, fee:15,status:"Pending",  time:"5 min ago",  paid:true,  payMethod:"MTN MoMo",   courier:null },
  { id:"#PB-4824",customer:"Kwame Asante",   phone:"0203334444",address:"45 Airport Res.",  items:[{name:"Long Grain Rice",qty:3,price:8}],                                  total:24, fee:12,status:"Packing",  time:"18 min ago", paid:true,  payMethod:"Card",       courier:"Esi Boateng" },
  { id:"#PB-4823",customer:"Ama Boateng",    phone:"0275556666",address:"8 Osu Rd",         items:[{name:"Free Range Eggs",qty:2,price:18},{name:"Ginger",qty:1,price:6}],   total:42, fee:10,status:"Delivering",time:"35 min ago", paid:true,  payMethod:"MTN MoMo",   courier:"Kofi Asante" },
  { id:"#PB-4822",customer:"Yaw Darko",      phone:"0557778888",address:"22 Labone St",     items:[{name:"Scotch Bonnet",qty:2,price:4}],                                    total:8,  fee:12,status:"Delivered", time:"1 hr ago",   paid:true,  payMethod:"Vodafone",   courier:"Kojo Mensah" },
  { id:"#PB-4821",customer:"Abena Frimpong", phone:"0309990000",address:"5 Ring Rd",        items:[{name:"Chicken Thighs",qty:2,price:35}],                                  total:70, fee:18,status:"Delivered", time:"2 hr ago",   paid:true,  payMethod:"Card",       courier:"Esi Boateng" },
  { id:"#PB-4820",customer:"Nana Agyei",     phone:"0241231231",address:"17 Tema Rd",       items:[{name:"Organic Mango",qty:3,price:15}],                                   total:45, fee:15,status:"Cancelled", time:"3 hr ago",   paid:false, payMethod:"MTN MoMo",   courier:null },
];

const INIT_PAYMENTS = [
  { id:"TXN-9201", orderId:"#PB-4823", customer:"Ama Boateng",    amount:52, method:"MTN MoMo",  status:"Settled",  time:"35 min ago", type:"Order Payment" },
  { id:"TXN-9200", orderId:"#PB-4822", customer:"Yaw Darko",      amount:20, method:"Vodafone",  status:"Settled",  time:"1 hr ago",   type:"Order Payment" },
  { id:"TXN-9199", orderId:"#PB-4821", customer:"Abena Frimpong", amount:88, method:"Card",      status:"Settled",  time:"2 hr ago",   type:"Order Payment" },
  { id:"TXN-9198", orderId:"#PB-4818", customer:"Kwame Asante",   amount:36, method:"Card",      status:"Refunded", time:"Yesterday",  type:"Refund" },
  { id:"TXN-9197", orderId:"#PB-4815", customer:"Akosua Mensah",  amount:120,method:"MTN MoMo",  status:"Settled",  time:"Yesterday",  type:"Order Payment" },
  { id:"TXN-9196", orderId:"#PB-4810", customer:"Nana Agyei",     amount:64, method:"MTN MoMo",  status:"Settled",  time:"2 days ago", type:"Order Payment" },
];

// Users who have logged into/registered on the app
const INIT_USERS = [
  { id:1, name:"Akosua Mensah",  email:"akosua@email.com",  phone:"0241112222",role:"Customer",  status:"Active",  lastLogin:"2 min ago",  orders:14, spent:842,  joined:"Jan 2024", device:"iPhone 14",   location:"Cantonments" },
  { id:2, name:"Kwame Asante",   email:"kwame@email.com",   phone:"0203334444",role:"Customer",  status:"Active",  lastLogin:"18 min ago", orders:7,  spent:390,  joined:"Mar 2024", device:"Samsung S23", location:"Airport Res." },
  { id:3, name:"Ama Boateng",    email:"ama@email.com",     phone:"0275556666",role:"Customer",  status:"Active",  lastLogin:"1 hr ago",   orders:22, spent:1430, joined:"Nov 2023", device:"iPhone 13",   location:"Osu" },
  { id:4, name:"Yaw Darko",      email:"yaw@email.com",     phone:"0557778888",role:"Customer",  status:"Inactive",lastLogin:"3 days ago", orders:3,  spent:120,  joined:"Feb 2024", device:"Tecno Camon", location:"Labone" },
  { id:5, name:"Abena Frimpong", email:"abena@email.com",   phone:"0309990000",role:"Customer",  status:"Active",  lastLogin:"2 hr ago",   orders:18, spent:980,  joined:"Dec 2023", device:"iPhone 12",   location:"East Legon" },
  { id:6, name:"Kofi Asante",    email:"kofi@courier.gh",   phone:"0201234567",role:"Courier",   status:"Active",  lastLogin:"35 min ago", orders:124,spent:0,    joined:"Jan 2024", device:"Samsung A54", location:"Cantonments" },
  { id:7, name:"Esi Boateng",    email:"esi@courier.gh",    phone:"0242345678",role:"Courier",   status:"Active",  lastLogin:"20 min ago", orders:231,spent:0,    joined:"Feb 2024", device:"iPhone SE",   location:"Airport Res." },
  { id:8, name:"Kojo Mensah",    email:"kojo@courier.gh",   phone:"0273456789",role:"Courier",   status:"Active",  lastLogin:"5 hr ago",   orders:88, spent:0,    joined:"Mar 2024", device:"Tecno Spark", location:"East Legon" },
  { id:9, name:"Admin",          email:"admin@pickybasket.com",phone:"0300000001",role:"Admin", status:"Active",  lastLogin:"Just now",   orders:0,  spent:0,    joined:"Jan 2024", device:"MacBook Pro",  location:"Accra, GH" },
];

const UNITS = ["kg","g","bundle","pack","pcs","punnet","litre","dozen","box","sachet","500g","250g"];
const CAT_EMOJI_OPTIONS = ["🥦","🍎","🌾","🐟","🌿","🥚","🥩","🧄","🫑","🍋","🥕","🫒","🍅","🧅","🍳","🥜","🍌","🫐","🍇","🧀","🥛","🍖","🌽","🥔"];

// ── Helpers ────────────────────────────────────────────────────
const pill = (s) => ({
  "In Stock":    {bg:T.greenL,  color:T.green},
  "Low Stock":   {bg:T.yellowL, color:"#b45309"},
  "Out of Stock":{bg:T.redL,    color:T.red},
  "Pending":     {bg:T.yellowL, color:"#b45309"},
  "Packing":     {bg:T.blueL,   color:T.blue},
  "Delivering":  {bg:"#ede9fe", color:T.purple},
  "Delivered":   {bg:T.greenL,  color:T.green},
  "Cancelled":   {bg:T.redL,    color:T.red},
  "Active":      {bg:T.greenL,  color:T.green},
  "Inactive":    {bg:T.redL,    color:T.red},
  "Settled":     {bg:T.greenL,  color:T.green},
  "Refunded":    {bg:T.redL,    color:T.red},
  "Pending Pay": {bg:T.yellowL, color:"#b45309"},
  "Customer":    {bg:T.blueL,   color:T.blue},
  "Courier":     {bg:"#ede9fe", color:T.purple},
  "Admin":       {bg:T.orangeL, color:T.orange},
}[s] || {bg:T.border, color:T.muted});

const Pill = ({s}) => { const p=pill(s); return <span style={{padding:"2px 10px",borderRadius:20,fontSize:11,fontWeight:700,background:p.bg,color:p.color,display:"inline-block"}}>{s}</span>; };

const Btn = ({children,onClick,variant="primary",sm=false,full=false,disabled=false}) => {
  const v = {
    primary: {background:T.teal,    color:"#fff",  border:"none"},
    outline: {background:"transparent",color:T.teal,border:`1.5px solid ${T.teal}`},
    ghost:   {background:T.bg,      color:T.muted, border:`1px solid ${T.border}`},
    danger:  {background:T.redL,    color:T.red,   border:`1px solid ${T.red}`},
    orange:  {background:T.orange,  color:"#fff",  border:"none"},
  }[variant]||{};
  return <button onClick={onClick} disabled={disabled} style={{...v,padding:sm?"6px 14px":"9px 18px",borderRadius:10,fontSize:sm?12:13,fontWeight:600,cursor:disabled?"not-allowed":"pointer",width:full?"100%":"auto",opacity:disabled?0.5:1,fontFamily:"inherit",transition:"opacity 0.15s"}}>{children}</button>;
};

const Input = ({label,value,onChange,type="text",placeholder="",required=false,options=null,rows=0}) => (
  <div style={{marginBottom:14}}>
    {label && <label style={{display:"block",fontSize:12,fontWeight:600,color:T.muted,marginBottom:5,textTransform:"uppercase",letterSpacing:0.5}}>{label}{required&&<span style={{color:T.red}}> *</span>}</label>}
    {options ? (
      <select value={value} onChange={e=>onChange(e.target.value)} style={{width:"100%",padding:"9px 12px",borderRadius:9,border:`1.5px solid ${T.border}`,fontSize:13,background:T.white,color:T.text,outline:"none",fontFamily:"inherit"}}>
        <option value="">Select {label}</option>
        {options.map(o=><option key={o} value={o}>{o}</option>)}
      </select>
    ) : rows>0 ? (
      <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows} style={{width:"100%",padding:"9px 12px",borderRadius:9,border:`1.5px solid ${T.border}`,fontSize:13,background:T.white,color:T.text,outline:"none",fontFamily:"inherit",resize:"vertical"}}/>
    ) : (
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{width:"100%",padding:"9px 12px",borderRadius:9,border:`1.5px solid ${T.border}`,fontSize:13,background:T.white,color:T.text,outline:"none",fontFamily:"inherit"}}/>
    )}
  </div>
);

const Modal = ({title,onClose,children,width=480}) => (
  <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
    <div style={{background:T.white,borderRadius:16,width:"100%",maxWidth:width,maxHeight:"90vh",overflowY:"auto",boxShadow:"0 24px 80px rgba(0,0,0,0.18)"}}>
      <div style={{padding:"18px 22px",borderBottom:`1px solid ${T.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,background:T.white,zIndex:1}}>
        <div style={{fontSize:16,fontWeight:700,color:T.text}}>{title}</div>
        <button onClick={onClose} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:T.muted,lineHeight:1}}>×</button>
      </div>
      <div style={{padding:"20px 22px"}}>{children}</div>
    </div>
  </div>
);

const Card = ({children,style={}}) => <div style={{background:T.white,borderRadius:14,border:`1px solid ${T.border}`,padding:20,...style}}>{children}</div>;

const StatCard = ({label,value,sub,color=T.teal,icon}) => (
  <Card style={{display:"flex",gap:14,alignItems:"center"}}>
    <div style={{width:48,height:48,borderRadius:12,background:color+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{icon}</div>
    <div>
      <div style={{fontSize:22,fontWeight:800,color:T.text}}>{value}</div>
      <div style={{fontSize:12,color:T.muted}}>{label}</div>
      {sub && <div style={{fontSize:11,color:color,fontWeight:600,marginTop:1}}>{sub}</div>}
    </div>
  </Card>
);

// ── Sidebar ────────────────────────────────────────────────────
const NAV = [
  {key:"dashboard", icon:"📊", label:"Dashboard"},
  {key:"orders",    icon:"📦", label:"Orders",    badge:"orders"},
  {key:"categories",icon:"🗂️", label:"Categories"},
  {key:"products",  icon:"🛒", label:"Products"},
  {key:"payments",  icon:"💰", label:"Payments"},
  {key:"users",     icon:"👥", label:"Users & Logins"},
  {key:"settings",  icon:"⚙️", label:"Settings"},
];

function Sidebar({active,setActive,pendingOrders}) {
  return (
    <div style={{width:220,background:T.sidebar,display:"flex",flexDirection:"column",flexShrink:0,height:"100vh",position:"sticky",top:0}}>
      {/* Logo */}
      <div style={{padding:"20px 16px",borderBottom:"1px solid rgba(255,255,255,0.07)",display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:38,height:38,borderRadius:10,overflow:"hidden",flexShrink:0,background:T.teal}}>
          <img src={logo} alt="" style={{width:"100%",height:"100%",objectFit:"contain"}}/>
        </div>
        <div>
          <div style={{color:T.white,fontWeight:800,fontSize:14,lineHeight:1}}>Picky Basket</div>
          <div style={{color:T.sidebarText,fontSize:10,marginTop:2,opacity:0.7}}>Admin Portal</div>
        </div>
      </div>
      {/* Nav */}
      <nav style={{flex:1,padding:"12px 10px",overflowY:"auto"}}>
        {NAV.map(n=>{
          const isActive = active===n.key;
          const badge = n.badge==="orders" ? pendingOrders : 0;
          return (
            <button key={n.key} onClick={()=>setActive(n.key)} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:10,border:"none",background:isActive?T.teal:"transparent",color:isActive?T.white:T.sidebarText,cursor:"pointer",marginBottom:2,textAlign:"left",fontFamily:"inherit",fontSize:13,fontWeight:isActive?700:400,transition:"all 0.15s",position:"relative"}}>
              <span style={{fontSize:16}}>{n.icon}</span>
              <span style={{flex:1}}>{n.label}</span>
              {badge>0 && <span style={{background:T.orange,color:"#fff",fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:20}}>{badge}</span>}
            </button>
          );
        })}
      </nav>
      {/* Admin badge */}
      <div style={{padding:"14px 16px",borderTop:"1px solid rgba(255,255,255,0.07)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:34,height:34,borderRadius:10,background:T.teal,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:14,color:"#fff"}}>A</div>
          <div>
            <div style={{color:T.white,fontSize:12,fontWeight:600}}>Admin</div>
            <div style={{color:T.sidebarText,fontSize:10,opacity:0.6}}>admin@pickybasket.com</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Dashboard ──────────────────────────────────────────────────
function Dashboard({orders,products,payments,users}) {
  const todayRevenue = payments.filter(p=>p.status==="Settled").reduce((s,p)=>s+p.amount,0);
  const pending = orders.filter(o=>o.status==="Pending").length;
  const activeUsers = users.filter(u=>u.status==="Active" && u.role==="Customer").length;
  const lowStock = products.filter(p=>p.status==="Low Stock"||p.status==="Out of Stock").length;
  const recentOrders = [...orders].slice(0,5);

  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div>
        <h2 style={{fontSize:22,fontWeight:800,color:T.text,marginBottom:4}}>Dashboard</h2>
        <p style={{color:T.muted,fontSize:13}}>Here's what's happening with your store today.</p>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14}}>
        <StatCard label="Today's Revenue"  value={`₵${todayRevenue}`}  sub="From settled orders"   color={T.teal}   icon="💰"/>
        <StatCard label="Pending Orders"   value={pending}              sub="Need your attention"   color={T.orange} icon="⏳"/>
        <StatCard label="Active Customers" value={activeUsers}          sub="Registered users"      color={T.blue}   icon="👤"/>
        <StatCard label="Low / Out Stock"  value={lowStock}             sub="Products to restock"   color={T.red}    icon="⚠️"/>
      </div>

      {/* Recent Orders */}
      <Card>
        <div style={{fontSize:15,fontWeight:700,color:T.text,marginBottom:14}}>Recent Orders</div>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead>
            <tr style={{background:T.bg}}>
              {["Order","Customer","Items","Total","Status","Paid Via"].map(h=>(
                <th key={h} style={{padding:"9px 12px",textAlign:"left",fontSize:11,color:T.muted,fontWeight:600,textTransform:"uppercase",letterSpacing:0.5}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((o,i)=>(
              <tr key={o.id} style={{borderTop:`1px solid ${T.border}`,background:i%2===0?T.white:T.bg}}>
                <td style={{padding:"10px 12px",fontWeight:700,color:T.teal}}>{o.id}</td>
                <td style={{padding:"10px 12px",color:T.text}}>{o.customer}</td>
                <td style={{padding:"10px 12px",color:T.muted}}>{o.items.length} item{o.items.length!==1?"s":""}</td>
                <td style={{padding:"10px 12px",fontWeight:700}}>₵{o.total + o.fee}</td>
                <td style={{padding:"10px 12px"}}><Pill s={o.status}/></td>
                <td style={{padding:"10px 12px",color:T.muted}}>{o.payMethod}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Quick Stats */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <Card>
          <div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:14}}>Payment Methods</div>
          {[["MTN MoMo","#ffcc00",payments.filter(p=>p.method==="MTN MoMo").length],["Card","#3b82f6",payments.filter(p=>p.method==="Card").length],["Vodafone","#e11d48",payments.filter(p=>p.method==="Vodafone").length]].map(([m,c,n])=>(
            <div key={m} style={{display:"flex",alignItems:"center",gap:12,padding:"8px 0",borderBottom:`1px solid ${T.border}`}}>
              <div style={{width:10,height:10,borderRadius:"50%",background:c,flexShrink:0}}/>
              <span style={{flex:1,fontSize:13,color:T.text}}>{m}</span>
              <span style={{fontSize:13,fontWeight:700,color:T.text}}>{n} orders</span>
            </div>
          ))}
        </Card>
        <Card>
          <div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:14}}>User Roles Online Now</div>
          {[["Customers",users.filter(u=>u.role==="Customer"&&u.status==="Active").length,T.blue],["Couriers",users.filter(u=>u.role==="Courier"&&u.status==="Active").length,T.purple],["Admin",1,T.teal]].map(([r,n,c])=>(
            <div key={r} style={{display:"flex",alignItems:"center",gap:12,padding:"8px 0",borderBottom:`1px solid ${T.border}`}}>
              <div style={{width:10,height:10,borderRadius:"50%",background:c,flexShrink:0}}/>
              <span style={{flex:1,fontSize:13,color:T.text}}>{r}</span>
              <span style={{fontSize:13,fontWeight:700,color:T.text}}>{n} active</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ── Orders ─────────────────────────────────────────────────────
function Orders({orders,setOrders}) {
  const [filter,setFilter] = useState("All");
  const [detail,setDetail] = useState(null);
  const statuses = ["All","Pending","Packing","Delivering","Delivered","Cancelled"];
  const shown = filter==="All" ? orders : orders.filter(o=>o.status===filter);

  const updateStatus = (id,s) => { setOrders(prev=>prev.map(o=>o.id===id?{...o,status:s}:o)); setDetail(null); };

  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <h2 style={{fontSize:22,fontWeight:800,color:T.text,marginBottom:4}}>Orders</h2>
          <p style={{color:T.muted,fontSize:13}}>{orders.length} total orders</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        {statuses.map(s=>(
          <button key={s} onClick={()=>setFilter(s)} style={{padding:"7px 16px",borderRadius:20,border:`1.5px solid ${filter===s?T.teal:T.border}`,background:filter===s?T.teal:T.white,color:filter===s?T.white:T.muted,fontWeight:filter===s?700:400,fontSize:13,cursor:"pointer",fontFamily:"inherit"}}>
            {s} {s!=="All"&&<span style={{opacity:0.7}}>({orders.filter(o=>o.status===s).length})</span>}
          </button>
        ))}
      </div>

      <Card style={{padding:0}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead>
            <tr style={{background:T.bg}}>
              {["Order ID","Customer","Items","Total+Fee","Status","Paid Via","Courier","Action"].map(h=>(
                <th key={h} style={{padding:"10px 14px",textAlign:"left",fontSize:11,color:T.muted,fontWeight:600,textTransform:"uppercase",letterSpacing:0.5}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map((o,i)=>(
              <tr key={o.id} style={{borderTop:`1px solid ${T.border}`,background:i%2===0?T.white:T.bg}}>
                <td style={{padding:"10px 14px",fontWeight:700,color:T.teal}}>{o.id}</td>
                <td style={{padding:"10px 14px"}}>
                  <div style={{fontWeight:600,color:T.text}}>{o.customer}</div>
                  <div style={{fontSize:11,color:T.muted}}>{o.phone}</div>
                </td>
                <td style={{padding:"10px 14px",color:T.muted}}>{o.items.length} item{o.items.length!==1?"s":""}</td>
                <td style={{padding:"10px 14px",fontWeight:700}}>₵{o.total+o.fee}</td>
                <td style={{padding:"10px 14px"}}><Pill s={o.status}/></td>
                <td style={{padding:"10px 14px"}}>
                  <div style={{fontSize:11}}>{o.payMethod}</div>
                  <div style={{fontSize:10,color:o.paid?T.green:T.red,fontWeight:700}}>{o.paid?"✓ Paid":"✗ Unpaid"}</div>
                </td>
                <td style={{padding:"10px 14px",color:T.muted,fontSize:12}}>{o.courier||"—"}</td>
                <td style={{padding:"10px 14px"}}>
                  <Btn sm onClick={()=>setDetail(o)}>View</Btn>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {detail && (
        <Modal title={`Order ${detail.id}`} onClose={()=>setDetail(null)}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16}}>
            <div><div style={{fontSize:11,color:T.muted,fontWeight:600,marginBottom:3}}>CUSTOMER</div><div style={{fontWeight:700}}>{detail.customer}</div><div style={{fontSize:12,color:T.muted}}>{detail.phone}</div></div>
            <div><div style={{fontSize:11,color:T.muted,fontWeight:600,marginBottom:3}}>DELIVERY ADDRESS</div><div style={{fontSize:13}}>{detail.address}</div></div>
            <div><div style={{fontSize:11,color:T.muted,fontWeight:600,marginBottom:3}}>STATUS</div><Pill s={detail.status}/></div>
            <div><div style={{fontSize:11,color:T.muted,fontWeight:600,marginBottom:3}}>PAYMENT</div><div style={{fontSize:13,fontWeight:600,color:detail.paid?T.green:T.red}}>{detail.paid?"✓ Paid":  "✗ Unpaid"} · {detail.payMethod}</div></div>
          </div>
          <div style={{background:T.bg,borderRadius:10,padding:14,marginBottom:16}}>
            <div style={{fontSize:12,fontWeight:600,color:T.muted,marginBottom:10,textTransform:"uppercase",letterSpacing:0.5}}>Items</div>
            {detail.items.map((item,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:i<detail.items.length-1?`1px solid ${T.border}`:"none"}}>
                <span>{item.name} × {item.qty}</span><span style={{fontWeight:700}}>₵{item.price*item.qty}</span>
              </div>
            ))}
            <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0 0",fontWeight:700,fontSize:14}}>
              <span>Delivery Fee</span><span>₵{detail.fee}</span>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0 0",fontWeight:800,fontSize:15,borderTop:`1px solid ${T.border}`,marginTop:6}}>
              <span>Total</span><span style={{color:T.teal}}>₵{detail.total+detail.fee}</span>
            </div>
          </div>
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            {["Packing","Delivering","Delivered","Cancelled"].map(s=>(
              detail.status!==s && <Btn key={s} sm variant={s==="Cancelled"?"danger":s==="Delivered"?"outline":"primary"} onClick={()=>updateStatus(detail.id,s)}>{s==="Delivered"?"✓ Mark Delivered":s==="Cancelled"?"Cancel Order":s==="Delivering"?"Out for Delivery":"Mark as Packing"}</Btn>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Categories ─────────────────────────────────────────────────
function Categories({categories,setCategories,products}) {
  const [showAdd,setShowAdd] = useState(false);
  const [editing,setEditing] = useState(null);
  const blank = {name:"",icon:"🥦",color:"#2A9D8F",description:""};
  const [form,setForm] = useState(blank);

  const save = () => {
    if (!form.name.trim()) return;
    if (editing) {
      setCategories(prev=>prev.map(c=>c.id===editing.id?{...c,...form}:c));
    } else {
      setCategories(prev=>[...prev,{...form,id:Date.now(),itemCount:0}]);
    }
    setForm(blank); setShowAdd(false); setEditing(null);
  };

  const del = (id) => { if (window.confirm("Delete this category?")) setCategories(prev=>prev.filter(c=>c.id!==id)); };

  const openEdit = (cat) => { setForm({name:cat.name,icon:cat.icon,color:cat.color,description:cat.description}); setEditing(cat); setShowAdd(true); };

  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <h2 style={{fontSize:22,fontWeight:800,color:T.text,marginBottom:4}}>Categories</h2>
          <p style={{color:T.muted,fontSize:13}}>{categories.length} categories · Organise your product catalog</p>
        </div>
        <Btn onClick={()=>{setForm(blank);setEditing(null);setShowAdd(true);}}>+ Add Category</Btn>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:14}}>
        {categories.map(cat=>{
          const count = products.filter(p=>p.catId===cat.id).length;
          return (
            <Card key={cat.id} style={{position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:4,background:cat.color}}/>
              <div style={{marginTop:6,display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div style={{width:48,height:48,borderRadius:12,background:cat.color+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>{cat.icon}</div>
                <div style={{display:"flex",gap:6}}>
                  <button onClick={()=>openEdit(cat)} style={{background:T.bg,border:`1px solid ${T.border}`,borderRadius:7,padding:"4px 8px",cursor:"pointer",fontSize:11}}>✏️</button>
                  <button onClick={()=>del(cat.id)} style={{background:T.redL,border:`1px solid ${T.red}44`,borderRadius:7,padding:"4px 8px",cursor:"pointer",fontSize:11}}>🗑️</button>
                </div>
              </div>
              <div style={{marginTop:12,fontWeight:700,fontSize:15,color:T.text}}>{cat.name}</div>
              <div style={{fontSize:12,color:T.muted,marginTop:3,marginBottom:10}}>{cat.description}</div>
              <div style={{fontSize:12,fontWeight:700,color:cat.color}}>{count} product{count!==1?"s":""}</div>
            </Card>
          );
        })}
      </div>

      {showAdd && (
        <Modal title={editing?"Edit Category":"Add New Category"} onClose={()=>{setShowAdd(false);setEditing(null);}}>
          {/* Icon picker */}
          <div style={{marginBottom:14}}>
            <label style={{display:"block",fontSize:12,fontWeight:600,color:T.muted,marginBottom:8,textTransform:"uppercase",letterSpacing:0.5}}>Choose Icon</label>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {CAT_EMOJI_OPTIONS.map(e=>(
                <button key={e} onClick={()=>setForm(f=>({...f,icon:e}))} style={{width:40,height:40,borderRadius:9,border:`2px solid ${form.icon===e?T.teal:T.border}`,background:form.icon===e?T.tealLt:T.bg,fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{e}</button>
              ))}
            </div>
          </div>
          <Input label="Category Name" value={form.name} onChange={v=>setForm(f=>({...f,name:v}))} placeholder="e.g. Fresh Vegetables" required/>
          <Input label="Description" value={form.description} onChange={v=>setForm(f=>({...f,description:v}))} placeholder="Short description" rows={2}/>
          <div style={{marginBottom:14}}>
            <label style={{display:"block",fontSize:12,fontWeight:600,color:T.muted,marginBottom:5,textTransform:"uppercase",letterSpacing:0.5}}>Accent Color</label>
            <input type="color" value={form.color} onChange={e=>setForm(f=>({...f,color:e.target.value}))} style={{width:48,height:36,borderRadius:8,border:`1px solid ${T.border}`,cursor:"pointer",padding:2}}/>
          </div>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
            <Btn variant="ghost" onClick={()=>{setShowAdd(false);setEditing(null);}}>Cancel</Btn>
            <Btn onClick={save}>{editing?"Save Changes":"Add Category"}</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Products ───────────────────────────────────────────────────
function Products({products,setProducts,categories}) {
  const [showAdd,setShowAdd]   = useState(false);
  const [editing,setEditing]   = useState(null);
  const [filterCat,setFilterCat] = useState("All");
  const [imgPreview,setImgPreview] = useState(null);
  const fileRef = useRef();
  const blank = {name:"",catId:"",price:"",unit:"kg",stock:"",description:"",status:"In Stock",image:null};
  const [form,setForm] = useState(blank);

  const handleImg = async (e) => {
    const f = e.target.files[0]; if(!f) return;
    const data = await readFile(f);
    setImgPreview(data); setForm(p=>({...p,image:data}));
  };

  const save = () => {
    if (!form.name||!form.catId||!form.price) return;
    const stockN = parseInt(form.stock)||0;
    const stockStatus = stockN===0?"Out of Stock":stockN<10?"Low Stock":"In Stock";
    const prod = {...form,price:parseFloat(form.price),stock:stockN,status:stockStatus};
    if (editing) {
      setProducts(prev=>prev.map(p=>p.id===editing.id?{...p,...prod}:p));
    } else {
      setProducts(prev=>[...prev,{...prod,id:Date.now(),sales:0}]);
    }
    setForm(blank); setImgPreview(null); setShowAdd(false); setEditing(null);
  };

  const del = (id) => { if(window.confirm("Delete this product?")) setProducts(prev=>prev.filter(p=>p.id!==id)); };

  const openEdit = (prod) => {
    setForm({name:prod.name,catId:prod.catId,price:prod.price,unit:prod.unit,stock:prod.stock,description:prod.description,status:prod.status,image:prod.image});
    setImgPreview(prod.image); setEditing(prod); setShowAdd(true);
  };

  const shown = filterCat==="All" ? products : products.filter(p=>p.catId===Number(filterCat));

  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <h2 style={{fontSize:22,fontWeight:800,color:T.text,marginBottom:4}}>Products</h2>
          <p style={{color:T.muted,fontSize:13}}>{products.length} products in your catalog</p>
        </div>
        <Btn onClick={()=>{setForm(blank);setImgPreview(null);setEditing(null);setShowAdd(true);}}>+ Add Product</Btn>
      </div>

      {/* Category filter */}
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        <button onClick={()=>setFilterCat("All")} style={{padding:"6px 14px",borderRadius:20,border:`1.5px solid ${filterCat==="All"?T.teal:T.border}`,background:filterCat==="All"?T.teal:T.white,color:filterCat==="All"?T.white:T.muted,fontSize:12,cursor:"pointer",fontFamily:"inherit",fontWeight:filterCat==="All"?700:400}}>All</button>
        {categories.map(c=>(
          <button key={c.id} onClick={()=>setFilterCat(String(c.id))} style={{padding:"6px 14px",borderRadius:20,border:`1.5px solid ${filterCat===String(c.id)?T.teal:T.border}`,background:filterCat===String(c.id)?T.teal:T.white,color:filterCat===String(c.id)?T.white:T.muted,fontSize:12,cursor:"pointer",fontFamily:"inherit",fontWeight:filterCat===String(c.id)?700:400}}>{c.icon} {c.name}</button>
        ))}
      </div>

      {/* Grid */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:14}}>
        {shown.map(prod=>{
          const cat = categories.find(c=>c.id===prod.catId);
          return (
            <Card key={prod.id} style={{padding:0,overflow:"hidden"}}>
              {/* Image */}
              <div style={{height:130,background:cat?cat.color+"11":T.bg,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
                {prod.image ? <img src={prod.image} alt={prod.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/> : <span style={{fontSize:48}}>{cat?.icon||"🛒"}</span>}
                <div style={{position:"absolute",top:8,right:8}}><Pill s={prod.status}/></div>
              </div>
              <div style={{padding:"12px 14px"}}>
                <div style={{fontWeight:700,fontSize:14,color:T.text,marginBottom:3}}>{prod.name}</div>
                <div style={{fontSize:11,color:T.muted,marginBottom:8}}>{cat?.name||"Uncategorised"} · {prod.unit}</div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                  <div style={{fontSize:18,fontWeight:800,color:T.teal}}>₵{prod.price}</div>
                  <div style={{fontSize:11,color:T.muted}}>Stock: <b style={{color:prod.stock<10?T.red:T.text}}>{prod.stock}</b></div>
                </div>
                <div style={{display:"flex",gap:6}}>
                  <Btn sm variant="outline" onClick={()=>openEdit(prod)} full>Edit</Btn>
                  <button onClick={()=>del(prod.id)} style={{padding:"6px 10px",borderRadius:8,border:`1px solid ${T.border}`,background:T.bg,cursor:"pointer",fontSize:12}}>🗑️</button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {showAdd && (
        <Modal title={editing?"Edit Product":"Add New Product"} onClose={()=>{setShowAdd(false);setEditing(null);}}>
          {/* Image upload */}
          <div style={{marginBottom:16,textAlign:"center"}}>
            <div onClick={()=>fileRef.current.click()} style={{width:"100%",height:160,borderRadius:12,border:`2px dashed ${T.border}`,background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",overflow:"hidden",marginBottom:6}}>
              {imgPreview ? <img src={imgPreview} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/> : (
                <div style={{textAlign:"center",color:T.muted}}>
                  <div style={{fontSize:32,marginBottom:6}}>📷</div>
                  <div style={{fontSize:13,fontWeight:600}}>Click to upload photo</div>
                  <div style={{fontSize:11}}>JPG, PNG, WEBP</div>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImg} style={{display:"none"}}/>
            {imgPreview && <button onClick={()=>{setImgPreview(null);setForm(f=>({...f,image:null}));}} style={{fontSize:11,color:T.red,background:"none",border:"none",cursor:"pointer"}}>Remove photo</button>}
          </div>

          <Input label="Product Name" value={form.name} onChange={v=>setForm(f=>({...f,name:v}))} placeholder="e.g. Fresh Tilapia" required/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div>
              <label style={{display:"block",fontSize:12,fontWeight:600,color:T.muted,marginBottom:5,textTransform:"uppercase",letterSpacing:0.5}}>Category <span style={{color:T.red}}>*</span></label>
              <select value={form.catId} onChange={e=>setForm(f=>({...f,catId:Number(e.target.value)}))} style={{width:"100%",padding:"9px 12px",borderRadius:9,border:`1.5px solid ${T.border}`,fontSize:13,background:T.white,color:T.text,outline:"none",fontFamily:"inherit"}}>
                <option value="">Select category</option>
                {categories.map(c=><option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{display:"block",fontSize:12,fontWeight:600,color:T.muted,marginBottom:5,textTransform:"uppercase",letterSpacing:0.5}}>Unit</label>
              <select value={form.unit} onChange={e=>setForm(f=>({...f,unit:e.target.value}))} style={{width:"100%",padding:"9px 12px",borderRadius:9,border:`1.5px solid ${T.border}`,fontSize:13,background:T.white,color:T.text,outline:"none",fontFamily:"inherit"}}>
                {UNITS.map(u=><option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <Input label="Price (₵)" value={form.price} onChange={v=>setForm(f=>({...f,price:v}))} type="number" placeholder="0.00" required/>
            <Input label="Stock Qty" value={form.stock} onChange={v=>setForm(f=>({...f,stock:v}))} type="number" placeholder="0"/>
          </div>
          <Input label="Description" value={form.description} onChange={v=>setForm(f=>({...f,description:v}))} placeholder="Short product description" rows={2}/>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
            <Btn variant="ghost" onClick={()=>{setShowAdd(false);setEditing(null);}}>Cancel</Btn>
            <Btn onClick={save} disabled={!form.name||!form.catId||!form.price}>{editing?"Save Changes":"Add Product"}</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Payments ───────────────────────────────────────────────────
function Payments({payments,orders}) {
  const [filter,setFilter] = useState("All");
  const settled   = payments.filter(p=>p.status==="Settled");
  const refunded  = payments.filter(p=>p.status==="Refunded");
  const totalIn   = settled.reduce((s,p)=>s+p.amount,0);
  const totalOut  = refunded.reduce((s,p)=>s+p.amount,0);
  const shown = filter==="All" ? payments : payments.filter(p=>p.status===filter||p.method===filter);

  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div>
        <h2 style={{fontSize:22,fontWeight:800,color:T.text,marginBottom:4}}>Payments</h2>
        <p style={{color:T.muted,fontSize:13}}>Track all money flowing in and out of your store</p>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
        <StatCard label="Total Revenue"   value={`₵${totalIn}`}   sub={`${settled.length} transactions`} color={T.teal}   icon="💰"/>
        <StatCard label="Total Refunds"   value={`₵${totalOut}`}  sub={`${refunded.length} refunds`}     color={T.red}    icon="↩️"/>
        <StatCard label="Net Revenue"     value={`₵${totalIn-totalOut}`} sub="After refunds"             color={T.green}  icon="📈"/>
      </div>

      {/* Filter */}
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        {["All","Settled","Refunded","MTN MoMo","Card","Vodafone"].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={{padding:"6px 14px",borderRadius:20,border:`1.5px solid ${filter===f?T.teal:T.border}`,background:filter===f?T.teal:T.white,color:filter===f?T.white:T.muted,fontSize:12,cursor:"pointer",fontFamily:"inherit",fontWeight:filter===f?700:400}}>{f}</button>
        ))}
      </div>

      <Card style={{padding:0}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead>
            <tr style={{background:T.bg}}>
              {["Transaction ID","Order","Customer","Amount","Method","Type","Status","Time"].map(h=>(
                <th key={h} style={{padding:"10px 14px",textAlign:"left",fontSize:11,color:T.muted,fontWeight:600,textTransform:"uppercase",letterSpacing:0.5}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map((p,i)=>(
              <tr key={p.id} style={{borderTop:`1px solid ${T.border}`,background:i%2===0?T.white:T.bg}}>
                <td style={{padding:"10px 14px",fontFamily:"monospace",fontSize:12,color:T.muted}}>{p.id}</td>
                <td style={{padding:"10px 14px",fontWeight:600,color:T.teal}}>{p.orderId}</td>
                <td style={{padding:"10px 14px"}}>{p.customer}</td>
                <td style={{padding:"10px 14px",fontWeight:700,color:p.status==="Refunded"?T.red:T.green}}>
                  {p.status==="Refunded"?"-":"+"}₵{p.amount}
                </td>
                <td style={{padding:"10px 14px",color:T.muted}}>{p.method}</td>
                <td style={{padding:"10px 14px",color:T.muted,fontSize:12}}>{p.type}</td>
                <td style={{padding:"10px 14px"}}><Pill s={p.status}/></td>
                <td style={{padding:"10px 14px",color:T.muted,fontSize:12}}>{p.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ── Users & Logins ─────────────────────────────────────────────
function Users({users,setUsers}) {
  const [filter,setFilter] = useState("All");
  const [search,setSearch]  = useState("");
  const [detail,setDetail]  = useState(null);

  const shown = users
    .filter(u=>filter==="All"||u.role===filter||u.status===filter)
    .filter(u=>!search||u.name.toLowerCase().includes(search.toLowerCase())||u.email.toLowerCase().includes(search.toLowerCase()));

  const toggleStatus = (id) => setUsers(prev=>prev.map(u=>u.id===id?{...u,status:u.status==="Active"?"Inactive":"Active"}:u));

  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div>
        <h2 style={{fontSize:22,fontWeight:800,color:T.text,marginBottom:4}}>Users & Logins</h2>
        <p style={{color:T.muted,fontSize:13}}>Everyone who has an account on the Picky Basket app</p>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14}}>
        <StatCard label="Total Users"    value={users.length}                             sub="All accounts"      color={T.teal}   icon="👥"/>
        <StatCard label="Customers"      value={users.filter(u=>u.role==="Customer").length} sub="Registered"     color={T.blue}   icon="🛒"/>
        <StatCard label="Couriers"       value={users.filter(u=>u.role==="Courier").length}  sub="On the team"    color={T.purple} icon="🛵"/>
        <StatCard label="Active Now"     value={users.filter(u=>u.status==="Active").length} sub="Within 24hrs"   color={T.green}  icon="🟢"/>
      </div>

      {/* Filters & Search */}
      <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name or email…" style={{flex:1,minWidth:200,padding:"9px 14px",borderRadius:10,border:`1.5px solid ${T.border}`,fontSize:13,background:T.white,outline:"none",fontFamily:"inherit"}}/>
        {["All","Customer","Courier","Active","Inactive"].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={{padding:"7px 14px",borderRadius:20,border:`1.5px solid ${filter===f?T.teal:T.border}`,background:filter===f?T.teal:T.white,color:filter===f?T.white:T.muted,fontSize:12,cursor:"pointer",fontFamily:"inherit",fontWeight:filter===f?700:400}}>{f}</button>
        ))}
      </div>

      <Card style={{padding:0}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead>
            <tr style={{background:T.bg}}>
              {["User","Role","Status","Last Login","Device","Location","Orders / Spent","Actions"].map(h=>(
                <th key={h} style={{padding:"10px 14px",textAlign:"left",fontSize:11,color:T.muted,fontWeight:600,textTransform:"uppercase",letterSpacing:0.5}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map((u,i)=>(
              <tr key={u.id} style={{borderTop:`1px solid ${T.border}`,background:i%2===0?T.white:T.bg}}>
                <td style={{padding:"10px 14px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:34,height:34,borderRadius:10,background:T.tealLt,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:13,color:T.teal,flexShrink:0}}>{u.name.split(" ").map(n=>n[0]).join("").slice(0,2)}</div>
                    <div>
                      <div style={{fontWeight:600,color:T.text}}>{u.name}</div>
                      <div style={{fontSize:11,color:T.muted}}>{u.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{padding:"10px 14px"}}><Pill s={u.role}/></td>
                <td style={{padding:"10px 14px"}}><Pill s={u.status}/></td>
                <td style={{padding:"10px 14px",color:T.muted,fontSize:12}}>{u.lastLogin}</td>
                <td style={{padding:"10px 14px",color:T.muted,fontSize:12}}>{u.device}</td>
                <td style={{padding:"10px 14px",color:T.muted,fontSize:12}}>{u.location}</td>
                <td style={{padding:"10px 14px"}}>
                  {u.role==="Customer" ? <div><div style={{fontWeight:700,fontSize:13}}>{u.orders} orders</div><div style={{fontSize:11,color:T.teal}}>₵{u.spent} spent</div></div>
                    : u.role==="Courier" ? <div><div style={{fontWeight:700,fontSize:13}}>{u.orders} deliveries</div></div>
                    : <div style={{fontSize:12,color:T.muted}}>—</div>}
                </td>
                <td style={{padding:"10px 14px"}}>
                  <div style={{display:"flex",gap:6}}>
                    <Btn sm onClick={()=>setDetail(u)}>View</Btn>
                    {u.role!=="Admin" && <Btn sm variant={u.status==="Active"?"danger":"outline"} onClick={()=>toggleStatus(u.id)}>{u.status==="Active"?"Suspend":"Activate"}</Btn>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {detail && (
        <Modal title="User Details" onClose={()=>setDetail(null)}>
          <div style={{textAlign:"center",marginBottom:20}}>
            <div style={{width:64,height:64,borderRadius:18,background:T.tealLt,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:22,color:T.teal,margin:"0 auto 12px"}}>{detail.name.split(" ").map(n=>n[0]).join("").slice(0,2)}</div>
            <div style={{fontSize:18,fontWeight:800,color:T.text}}>{detail.name}</div>
            <div style={{fontSize:13,color:T.muted}}>{detail.email}</div>
            <div style={{marginTop:8,display:"flex",justifyContent:"center",gap:8}}><Pill s={detail.role}/><Pill s={detail.status}/></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
            {[["Phone",detail.phone],["Joined",detail.joined],["Last Login",detail.lastLogin],["Device",detail.device],["Location",detail.location],[detail.role==="Customer"?"Total Orders":detail.role==="Courier"?"Deliveries":"Orders",detail.orders],[detail.role==="Customer"?"Total Spent":"—",detail.role==="Customer"?`₵${detail.spent}`:"—"]].map(([l,v])=>(
              <div key={l} style={{background:T.bg,borderRadius:10,padding:"10px 14px"}}>
                <div style={{fontSize:11,color:T.muted,fontWeight:600,marginBottom:2,textTransform:"uppercase",letterSpacing:0.5}}>{l}</div>
                <div style={{fontSize:13,fontWeight:700,color:T.text}}>{v}</div>
              </div>
            ))}
          </div>
          {detail.role!=="Admin" && (
            <Btn full variant={detail.status==="Active"?"danger":"primary"} onClick={()=>{toggleStatus(detail.id);setDetail(null);}}>
              {detail.status==="Active"?"Suspend This User":"Activate This User"}
            </Btn>
          )}
        </Modal>
      )}
    </div>
  );
}

// ── Settings ───────────────────────────────────────────────────
function Settings() {
  const [storeName,setStoreName]   = useState("Picky Basket");
  const [storePhone,setStorePhone] = useState("+233 30 000 0001");
  const [storeEmail,setStoreEmail] = useState("admin@pickybasket.com");
  const [deliveryFee,setDeliveryFee] = useState("12");
  const [minOrder,setMinOrder]     = useState("20");
  const [saved,setSaved]           = useState(false);

  const save = () => { setSaved(true); setTimeout(()=>setSaved(false),2500); };

  return (
    <div style={{display:"flex",flexDirection:"column",gap:20,maxWidth:600}}>
      <div>
        <h2 style={{fontSize:22,fontWeight:800,color:T.text,marginBottom:4}}>Settings</h2>
        <p style={{color:T.muted,fontSize:13}}>Manage your store configuration</p>
      </div>
      <Card>
        <div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:16}}>Store Details</div>
        <Input label="Store Name"  value={storeName}  onChange={setStoreName}  placeholder="Picky Basket"/>
        <Input label="Phone"       value={storePhone} onChange={setStorePhone} placeholder="+233..."/>
        <Input label="Email"       value={storeEmail} onChange={setStoreEmail} placeholder="admin@..."/>
      </Card>
      <Card>
        <div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:16}}>Delivery Settings</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Input label="Base Delivery Fee (₵)" value={deliveryFee} onChange={setDeliveryFee} type="number"/>
          <Input label="Min. Order Value (₵)"  value={minOrder}    onChange={setMinOrder}    type="number"/>
        </div>
      </Card>
      <Card>
        <div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:16}}>Admin Login</div>
        <Input label="Current Password" value="" onChange={()=>{}} type="password" placeholder="••••••••"/>
        <Input label="New Password"     value="" onChange={()=>{}} type="password" placeholder="••••••••"/>
        <Input label="Confirm Password" value="" onChange={()=>{}} type="password" placeholder="••••••••"/>
      </Card>
      <div style={{display:"flex",gap:10,alignItems:"center"}}>
        <Btn onClick={save}>Save Changes</Btn>
        {saved && <span style={{fontSize:13,color:T.green,fontWeight:600}}>✓ Saved!</span>}
      </div>
    </div>
  );
}

// ── Login ──────────────────────────────────────────────────────
function Login({onLogin}) {
  const [email,setEmail]   = useState("");
  const [pass,setPass]     = useState("");
  const [err,setErr]       = useState("");
  const [loading,setLoading] = useState(false);

  const attempt = () => {
    if (!email||!pass) { setErr("Please enter email and password."); return; }
    setLoading(true); setErr("");
    setTimeout(()=>{
      if (email==="admin@pickybasket.com" && pass==="picky2024") { onLogin(); }
      else { setErr("Invalid email or password."); setLoading(false); }
    }, 700);
  };

  return (
    <div style={{minHeight:"100vh",background:T.navy,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{background:T.white,borderRadius:20,padding:"40px 36px",width:"100%",maxWidth:420,boxShadow:"0 32px 80px rgba(0,0,0,0.25)"}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{width:60,height:60,borderRadius:16,overflow:"hidden",margin:"0 auto 16px",border:`3px solid ${T.tealLt}`}}>
            <img src={logo} alt="" style={{width:"100%",height:"100%",objectFit:"contain"}}/>
          </div>
          <div style={{fontSize:24,fontWeight:800,color:T.text}}>Admin Portal</div>
          <div style={{fontSize:13,color:T.muted,marginTop:4}}>Picky Basket · Accra, Ghana</div>
        </div>
        <Input label="Email"    value={email} onChange={setEmail} type="email"    placeholder="admin@pickybasket.com"/>
        <Input label="Password" value={pass}  onChange={setPass}  type="password" placeholder="••••••••"/>
        {err && <div style={{fontSize:13,color:T.red,marginBottom:12,padding:"8px 12px",background:T.redL,borderRadius:8}}>{err}</div>}
        <Btn full onClick={attempt} disabled={loading}>{loading?"Signing in…":"Sign In"}</Btn>
        <div style={{marginTop:16,padding:"12px",background:T.bg,borderRadius:10,fontSize:12,color:T.muted,textAlign:"center"}}>
          Demo · <b style={{color:T.text}}>admin@pickybasket.com</b> / <b style={{color:T.text}}>picky2024</b>
        </div>
      </div>
    </div>
  );
}

// ── App Root ───────────────────────────────────────────────────
export default function App() {
  const [loggedIn,setLoggedIn] = useState(false);
  const [page,setPage]         = useState("dashboard");
  const [categories,setCategories] = useState(INIT_CATS);
  const [products,setProducts]     = useState(INIT_PRODUCTS);
  const [orders,setOrders]         = useState(INIT_ORDERS);
  const [payments,setPayments]     = useState(INIT_PAYMENTS);
  const [users,setUsers]           = useState(INIT_USERS);

  const pendingOrders = orders.filter(o=>o.status==="Pending").length;

  if (!loggedIn) return <Login onLogin={()=>setLoggedIn(true)}/>;

  return (
    <div style={{display:"flex",minHeight:"100vh",background:T.bg,fontFamily:"'Inter',system-ui,sans-serif",color:T.text}}>
      <Sidebar active={page} setActive={setPage} pendingOrders={pendingOrders}/>
      <main style={{flex:1,padding:28,overflowY:"auto",minHeight:"100vh"}}>
        {page==="dashboard"  && <Dashboard  orders={orders} products={products} payments={payments} users={users}/>}
        {page==="orders"     && <Orders     orders={orders} setOrders={setOrders}/>}
        {page==="categories" && <Categories categories={categories} setCategories={setCategories} products={products}/>}
        {page==="products"   && <Products   products={products} setProducts={setProducts} categories={categories}/>}
        {page==="payments"   && <Payments   payments={payments} orders={orders}/>}
        {page==="users"      && <Users      users={users} setUsers={setUsers}/>}
        {page==="settings"   && <Settings/>}
      </main>
    </div>
  );
}
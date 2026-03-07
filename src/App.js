import { useState, useEffect, useRef } from "react";

// ── Theme tokens ───────────────────────────────────────────────
const light = {
  teal:"#2A9D8F", tealDark:"#1f7a6e", tealLight:"#e0f5f3", tealMid:"#b2e8e2",
  orange:"#E76F51", orangeL:"#fdeee9", yellow:"#E9C46A", yellowL:"#fdf4dc",
  navy:"#1a2332", navyMid:"#243447", navyLight:"#2f4460",
  text:"#1a1a1a", muted:"#6b7280", border:"#e8ecf0",
  bg:"#f4f7f6", white:"#ffffff", green:"#22c55e", greenL:"#dcfce7",
  red:"#ef4444", redL:"#fee2e2", sidebar:"#1a2332", sidebarText:"#b2e8e2",
  cardBg:"#ffffff", inputBg:"#ffffff", tableBg:"#f9fafb",
};
const dark = {
  teal:"#2A9D8F", tealDark:"#1f7a6e", tealLight:"#0d3330", tealMid:"#1f5c56",
  orange:"#E76F51", orangeL:"#3d1f17", yellow:"#E9C46A", yellowL:"#3d3010",
  navy:"#0d1117", navyMid:"#161b22", navyLight:"#21262d",
  text:"#e6edf3", muted:"#8b949e", border:"#30363d",
  bg:"#0d1117", white:"#161b22", green:"#22c55e", greenL:"#0d2818",
  red:"#ef4444", redL:"#2d1010", sidebar:"#0d1117", sidebarText:"#b2e8e2",
  cardBg:"#161b22", inputBg:"#21262d", tableBg:"#0d1117",
};

// ── Initial data ───────────────────────────────────────────────
const INIT = {
  orders: [
    { id:"#PB-4821", customer:"Akosua Mensah",   items:5, total:77,  status:"Delivering", time:"10 min ago", courier:"Kofi A.",    address:"12 Cantonments Rd" },
    { id:"#PB-4820", customer:"Kwame Asante",    items:3, total:45,  status:"Packing",    time:"22 min ago", courier:"—",           address:"45 Airport Res." },
    { id:"#PB-4819", customer:"Ama Boateng",     items:8, total:132, status:"Delivered",  time:"1 hr ago",   courier:"Esi B.",      address:"8 Osu Rd" },
    { id:"#PB-4818", customer:"Yaw Darko",       items:2, total:28,  status:"Pending",    time:"1 hr ago",   courier:"—",           address:"22 Labone St" },
    { id:"#PB-4817", customer:"Abena Frimpong",  items:6, total:98,  status:"Delivered",  time:"2 hr ago",   courier:"Kojo M.",     address:"5 Ring Rd" },
    { id:"#PB-4816", customer:"Nana Agyei",      items:4, total:61,  status:"Cancelled",  time:"3 hr ago",   courier:"—",           address:"17 Tema Rd" },
  ],
  products: [
    { id:1, name:"Fresh Tilapia",   category:"Fish & Seafood",   price:45, unit:"kg",  stock:24, status:"In Stock",     supplier:"AquaFresh GH",   image:"🐟" },
    { id:2, name:"Asparagus",       category:"Vegetables",       price:12, unit:"bdl", stock:8,  status:"Low Stock",    supplier:"GreenFarm Co.",  image:"🥦" },
    { id:3, name:"Scotch Bonnet",   category:"Herbs & Season.",  price:4,  unit:"pack",stock:0,  status:"Out of Stock", supplier:"Volta Farms",    image:"🌶️" },
    { id:4, name:"Long Grain Rice", category:"Grains & Flours",  price:8,  unit:"500g",stock:45, status:"In Stock",     supplier:"Rice Direct GH", image:"🌾" },
    { id:5, name:"Free Range Eggs", category:"Dairy & Eggs",     price:18, unit:"doz", stock:32, status:"In Stock",     supplier:"Happy Hens Ltd", image:"🥚" },
  ],
  suppliers: [
    { id:1, name:"AquaFresh GH",   products:12, orders:84,  revenue:12400, rating:4.8, status:"Active",  email:"info@aquafresh.gh",  phone:"+233 20 111 2222" },
    { id:2, name:"GreenFarm Co.",  products:28, orders:156, revenue:8720,  rating:4.5, status:"Active",  email:"hello@greenfarm.gh", phone:"+233 24 333 4444" },
    { id:3, name:"Volta Farms",    products:7,  orders:41,  revenue:3100,  rating:3.9, status:"Review",  email:"volta@farms.gh",     phone:"+233 27 555 6666" },
    { id:4, name:"Rice Direct GH", products:4,  orders:210, revenue:18900, rating:4.9, status:"Active",  email:"rice@direct.gh",     phone:"+233 30 777 8888" },
    { id:5, name:"Happy Hens Ltd", products:5,  orders:98,  revenue:6300,  rating:4.7, status:"Active",  email:"eggs@happyhens.gh",  phone:"+233 55 999 0000" },
  ],
  couriers: [
    { id:1, name:"Kofi Asante",    deliveries:24, rating:4.9, status:"On Delivery", zone:"Cantonments",  earnings:180, phone:"+233 20 123 4567" },
    { id:2, name:"Esi Boateng",    deliveries:31, rating:4.7, status:"Available",   zone:"Airport Res.", earnings:240, phone:"+233 24 234 5678" },
    { id:3, name:"Kojo Mensah",    deliveries:18, rating:4.6, status:"Available",   zone:"East Legon",   earnings:135, phone:"+233 27 345 6789" },
    { id:4, name:"Adwoa Frimpong", deliveries:9,  rating:4.2, status:"Off Duty",    zone:"Osu",          earnings:68,  phone:"+233 55 456 7890" },
  ],
  customers: [
    { id:1, name:"Akosua Mensah",  email:"akosua@email.com", orders:14, spent:842,  joined:"Jan 2024", plan:"Individual", status:"Active" },
    { id:2, name:"Kwame Asante",   email:"kwame@email.com",  orders:7,  spent:390,  joined:"Mar 2024", plan:"Individual", status:"Active" },
    { id:3, name:"Ama Boateng",    email:"ama@email.com",    orders:22, spent:1430, joined:"Nov 2023", plan:"Family",     status:"Active" },
    { id:4, name:"Yaw Darko",      email:"yaw@email.com",    orders:3,  spent:120,  joined:"Feb 2024", plan:"Individual", status:"Inactive" },
    { id:5, name:"Abena Frimpong", email:"abena@email.com",  orders:18, spent:980,  joined:"Dec 2023", plan:"Business",   status:"Active" },
  ],
  notifications: [
    { id:1, type:"order",    message:"New order #PB-4822 from Kofi Brew",        time:"2 min ago",  read:false },
    { id:2, type:"supplier", message:"Volta Farms submitted 3 new products",     time:"15 min ago", read:false },
    { id:3, type:"alert",    message:"Scotch Bonnet is out of stock",            time:"1 hr ago",   read:false },
    { id:4, type:"courier",  message:"Kofi Asante completed delivery #PB-4819", time:"2 hr ago",   read:true  },
    { id:5, type:"finance",  message:"Payout of ₵1,240 due to Volta Farms",     time:"3 hr ago",   read:true  },
  ],
  auditLog: [
    { id:1, admin:"Super Admin", action:"Approved supplier",   target:"AquaFresh GH",   time:"Today 09:14" },
    { id:2, admin:"Super Admin", action:"Updated product",     target:"Fresh Tilapia",  time:"Today 08:52" },
    { id:3, admin:"Super Admin", action:"Changed order status",target:"#PB-4819 → Delivered", time:"Today 08:30" },
    { id:4, admin:"Super Admin", action:"Added new courier",   target:"Adwoa Frimpong", time:"Yesterday 17:44" },
    { id:5, admin:"Super Admin", action:"Processed payout",    target:"Rice Direct GH ₵18,900", time:"Yesterday 16:10" },
  ],
  admins: [
    { id:1, name:"Super Admin",    email:"admin@pickybasket.com", role:"Super Admin",    status:"Active",   lastLogin:"Today 09:00" },
    { id:2, name:"Ops Manager",    email:"ops@pickybasket.com",   role:"Operations",     status:"Active",   lastLogin:"Today 07:30" },
    { id:3, name:"Finance Officer",email:"finance@pickybasket.com",role:"Finance",       status:"Active",   lastLogin:"Yesterday"   },
  ],
};

const CREDENTIALS = { email:"admin@pickybasket.com", password:"picky2024" };

// ── Status colours ─────────────────────────────────────────────
const statusColor = (s) => ({
  "Delivering":   { bg:"#dbeafe", text:"#1d4ed8" },
  "Packing":      { bg:"#fdf4dc", text:"#92400e" },
  "Delivered":    { bg:"#dcfce7", text:"#15803d" },
  "Pending":      { bg:"#f3e8ff", text:"#7c3aed" },
  "Cancelled":    { bg:"#fee2e2", text:"#ef4444" },
  "In Stock":     { bg:"#dcfce7", text:"#15803d" },
  "Low Stock":    { bg:"#fdf4dc", text:"#92400e" },
  "Out of Stock": { bg:"#fee2e2", text:"#ef4444" },
  "Active":       { bg:"#dcfce7", text:"#15803d" },
  "Inactive":     { bg:"#fee2e2", text:"#ef4444" },
  "Review":       { bg:"#fdf4dc", text:"#92400e" },
  "On Delivery":  { bg:"#dbeafe", text:"#1d4ed8" },
  "Available":    { bg:"#dcfce7", text:"#15803d" },
  "Off Duty":     { bg:"#f3f4f6", text:"#6b7280" },
  "Individual":   { bg:"#e0f5f3", text:"#1f7a6e" },
  "Family":       { bg:"#f3e8ff", text:"#7c3aed" },
  "Business":     { bg:"#fdf4dc", text:"#92400e" },
  "Super Admin":  { bg:"#fee2e2", text:"#ef4444" },
  "Operations":   { bg:"#dbeafe", text:"#1d4ed8" },
  "Finance":      { bg:"#dcfce7", text:"#15803d" },
}[s] || { bg:"#f3f4f6", text:"#6b7280" });

// ── Reusable components ────────────────────────────────────────
const Badge = ({ label }) => {
  const sc = statusColor(label);
  return <span style={{ padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:700,
    background:sc.bg, color:sc.text, whiteSpace:"nowrap" }}>{label}</span>;
};

const Modal = ({ title, onClose, children, T }) => (
  <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:1000,
    display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
    <div style={{ background:T.cardBg, borderRadius:20, padding:28, width:"100%", maxWidth:480,
      boxShadow:"0 20px 60px rgba(0,0,0,0.3)", maxHeight:"90vh", overflowY:"auto" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <h3 style={{ margin:0, fontSize:18, fontFamily:"'Playfair Display',serif", color:T.text }}>{title}</h3>
        <button onClick={onClose} style={{ background:"none", border:"none", fontSize:22,
          cursor:"pointer", color:T.muted, lineHeight:1 }}>×</button>
      </div>
      {children}
    </div>
  </div>
);

const Input = ({ label, value, onChange, type="text", placeholder="", T, options }) => (
  <div style={{ marginBottom:14 }}>
    {label && <label style={{ display:"block", fontSize:12, fontWeight:600,
      color:T.muted, marginBottom:6, textTransform:"uppercase", letterSpacing:0.5 }}>{label}</label>}
    {options ? (
      <select value={value} onChange={e=>onChange(e.target.value)} style={{
        width:"100%", padding:"10px 12px", borderRadius:10, border:`1.5px solid ${T.border}`,
        background:T.inputBg, color:T.text, fontSize:13, outline:"none" }}>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    ) : (
      <input type={type} value={value} onChange={e=>onChange(e.target.value)}
        placeholder={placeholder} style={{ width:"100%", padding:"10px 12px", borderRadius:10,
          border:`1.5px solid ${T.border}`, background:T.inputBg, color:T.text,
          fontSize:13, outline:"none", boxSizing:"border-box" }} />
    )}
  </div>
);

const Btn = ({ children, onClick, variant="primary", T, small=false }) => {
  const styles = {
    primary:   { background:T.teal,    color:"#fff",    border:"none" },
    secondary: { background:"transparent", color:T.teal, border:`1.5px solid ${T.teal}` },
    danger:    { background:"transparent", color:T.red,  border:`1.5px solid ${T.red}` },
    ghost:     { background:"transparent", color:T.muted,border:`1.5px solid ${T.border}` },
  };
  const s = styles[variant] || styles.primary;
  return (
    <button onClick={onClick} style={{ ...s, padding: small?"6px 12px":"10px 18px",
      borderRadius:10, fontSize: small?11:13, fontWeight:600, cursor:"pointer",
      transition:"opacity 0.15s" }}
      onMouseEnter={e=>e.currentTarget.style.opacity="0.8"}
      onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
      {children}
    </button>
  );
};

const Card = ({ children, style={}, T }) => (
  <div style={{ background:T.cardBg, borderRadius:16, padding:20,
    boxShadow:"0 1px 12px rgba(0,0,0,0.06)", border:`1px solid ${T.border}`, ...style }}>{children}</div>
);

const StatCard = ({ icon, label, value, sub, color, bgColor, T }) => (
  <Card T={T} style={{ display:"flex", alignItems:"center", gap:14 }}>
    <div style={{ width:50, height:50, borderRadius:14, background:bgColor||T.tealLight,
      display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>{icon}</div>
    <div>
      <div style={{ fontSize:12, color:T.muted, fontWeight:500 }}>{label}</div>
      <div style={{ fontSize:22, fontWeight:800, color:T.text, lineHeight:1.2 }}>{value}</div>
      {sub && <div style={{ fontSize:11, color:color||T.teal, fontWeight:600, marginTop:1 }}>{sub}</div>}
    </div>
  </Card>
);

const Table = ({ cols, rows, renderRow, T }) => (
  <div style={{ overflowX:"auto" }}>
    <table style={{ width:"100%", borderCollapse:"collapse" }}>
      <thead>
        <tr style={{ background:T.tableBg }}>
          {cols.map(c => <th key={c} style={{ padding:"10px 14px", textAlign:"left", fontSize:10,
            fontWeight:700, color:T.muted, textTransform:"uppercase", letterSpacing:0.8,
            whiteSpace:"nowrap", borderBottom:`1px solid ${T.border}` }}>{c}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((row,i) => (
          <tr key={i} style={{ borderBottom:`1px solid ${T.border}`, transition:"background 0.1s" }}
            onMouseEnter={e=>e.currentTarget.style.background=T.tableBg}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            {renderRow(row)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Td = ({ children, style={} }) => (
  <td style={{ padding:"11px 14px", fontSize:13, ...style }}>{children}</td>
);

const BarChart = ({ data, T }) => {
  const max = Math.max(...data.map(d=>d.v), 1);
  return (
    <div style={{ display:"flex", alignItems:"flex-end", gap:6, height:80 }}>
      {data.map((d,i) => (
        <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
          <div style={{ width:"100%", height:Math.round((d.v/max)*64)+4,
            borderRadius:"6px 6px 0 0",
            background: i===data.length-1 ? T.teal : T.tealMid,
            transition:"height 0.4s ease" }} />
          <span style={{ fontSize:9, color:T.muted }}>{d.l}</span>
        </div>
      ))}
    </div>
  );
};

const SectionHeader = ({ title, T, action, onAction }) => (
  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
    <h2 style={{ margin:0, fontSize:22, fontFamily:"'Playfair Display',serif", color:T.text }}>{title}</h2>
    {action && <Btn onClick={onAction} T={T}>{action}</Btn>}
  </div>
);

const Toast = ({ msg, T }) => (
  <div style={{ position:"fixed", bottom:24, right:24, background:T.teal, color:"#fff",
    padding:"12px 20px", borderRadius:12, fontSize:13, fontWeight:600,
    boxShadow:"0 4px 20px rgba(0,0,0,0.2)", zIndex:9999, animation:"slideUp 0.3s ease" }}>
    ✓ {msg}
  </div>
);

// ── LOGIN ──────────────────────────────────────────────────────
function LoginScreen({ onLogin, T }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleLogin = () => {
    setError("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    setTimeout(() => {
      if (email === CREDENTIALS.email && password === CREDENTIALS.password) {
        onLogin();
      } else {
        setError("Invalid email or password. Try admin@pickybasket.com / picky2024");
        setLoading(false);
      }
    }, 900);
  };

  return (
    <div style={{ minHeight:"100vh", background:T.navy, display:"flex",
      alignItems:"center", justifyContent:"center", fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        *{box-sizing:border-box}`}</style>

      <div style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none" }}>
        {[...Array(6)].map((_,i) => (
          <div key={i} style={{ position:"absolute",
            width: 200+i*80, height: 200+i*80, borderRadius:"50%",
            border:`1px solid ${T.teal}22`,
            top:`${10+i*12}%`, left:`${-10+i*15}%`, opacity:0.4 }} />
        ))}
      </div>

      <div style={{ width:"100%", maxWidth:420, padding:20, animation:"slideUp 0.5s ease" }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ width:64, height:64, borderRadius:18, background:T.teal,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:32, margin:"0 auto 14px" }}>🧺</div>
          <h1 style={{ color:"#fff", margin:"0 0 4px", fontSize:26,
            fontFamily:"'Playfair Display',serif" }}>Picky Basket</h1>
          <p style={{ color:T.tealMid, margin:0, fontSize:14 }}>Admin Portal</p>
        </div>

        <div style={{ background:T.cardBg, borderRadius:20, padding:28,
          boxShadow:"0 20px 60px rgba(0,0,0,0.3)" }}>
          <h2 style={{ margin:"0 0 20px", fontSize:18, color:T.text,
            fontFamily:"'Playfair Display',serif" }}>Sign in to your account</h2>

          <Input label="Email Address" value={email} onChange={setEmail}
            type="email" placeholder="admin@pickybasket.com" T={T} />
          <div style={{ position:"relative" }}>
            <Input label="Password" value={password} onChange={setPassword}
              type={showPw?"text":"password"} placeholder="Enter password" T={T} />
            <button onClick={()=>setShowPw(v=>!v)} style={{
              position:"absolute", right:10, top:30, background:"none",
              border:"none", cursor:"pointer", color:T.muted, fontSize:13 }}>
              {showPw?"Hide":"Show"}
            </button>
          </div>

          {error && (
            <div style={{ background:T.redL, color:T.red, padding:"10px 14px",
              borderRadius:10, fontSize:13, marginBottom:14 }}>{error}</div>
          )}

          <div style={{ background:T.tealLight, borderRadius:10, padding:"10px 14px",
            fontSize:12, color:T.tealDark, marginBottom:16 }}>
            💡 Demo: <b>admin@pickybasket.com</b> / <b>picky2024</b>
          </div>

          <button onClick={handleLogin} disabled={loading} style={{
            width:"100%", padding:"13px", borderRadius:12, border:"none",
            background:T.teal, color:"#fff", fontSize:15, fontWeight:700,
            cursor:loading?"not-allowed":"pointer", opacity:loading?0.7:1 }}>
            {loading ? "Signing in…" : "Sign In →"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── DASHBOARD ─────────────────────────────────────────────────
function Dashboard({ data, T }) {
  const weekData = [{l:"Mon",v:42},{l:"Tue",v:58},{l:"Wed",v:35},{l:"Thu",v:71},{l:"Fri",v:89},{l:"Sat",v:112},{l:"Sun",v:67}];
  const totalRevenue = data.orders.reduce((s,o)=>s+o.total,0);
  const activeDeliveries = data.orders.filter(o=>o.status==="Delivering").length;
  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div>
        <h1 style={{margin:"0 0 4px",fontSize:26,fontFamily:"'Playfair Display',serif",color:T.text}}>
          Good morning, Admin 👋
        </h1>
        <p style={{margin:0,color:T.muted,fontSize:14}}>Here's what's happening with The Picky Basket today.</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:14}}>
        <StatCard T={T} icon="🛒" label="Orders Today" value={data.orders.length} sub="↑ 12% vs yesterday" color={T.green} bgColor={T.greenL}/>
        <StatCard T={T} icon="💰" label="Revenue Today" value={`₵${totalRevenue.toLocaleString()}`} sub="↑ 8% vs yesterday"/>
        <StatCard T={T} icon="🚚" label="Active Deliveries" value={activeDeliveries} sub="Live now" color={T.orange} bgColor={T.orangeL}/>
        <StatCard T={T} icon="👥" label="Customers" value={data.customers.length} sub="Total registered" color="#7c3aed" bgColor="#f3e8ff"/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <Card T={T}>
          <div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:14}}>Orders This Week</div>
          <BarChart data={weekData} T={T}/>
        </Card>
        <Card T={T}>
          <div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:14}}>Top Products</div>
          {data.products.slice(0,4).map(p=>(
            <div key={p.id} style={{marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                <span style={{fontSize:13,color:T.text}}>{p.name}</span>
                <span style={{fontSize:11,color:T.muted}}>{p.stock} in stock</span>
              </div>
              <div style={{height:5,background:T.border,borderRadius:3,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${Math.min((p.stock/50)*100,100)}%`,background:T.teal,borderRadius:3}}/>
              </div>
            </div>
          ))}
        </Card>
      </div>
      <Card T={T}>
        <SectionHeader title="Recent Orders" T={T}/>
        <Table T={T} cols={["Order","Customer","Items","Total","Status","Courier"]} rows={data.orders.slice(0,5)}
          renderRow={r=><>
            <Td style={{fontWeight:700,color:T.teal}}>{r.id}</Td>
            <Td style={{color:T.text}}>{r.customer}</Td>
            <Td style={{color:T.muted}}>{r.items} items</Td>
            <Td style={{fontWeight:700,color:T.text}}>₵{r.total}</Td>
            <Td><Badge label={r.status}/></Td>
            <Td style={{color:T.muted}}>{r.courier}</Td>
          </>}/>
      </Card>
    </div>
  );
}

// ── ORDERS ────────────────────────────────────────────────────
function Orders({ data, setData, addLog, toast, T }) {
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const statuses = ["All","Pending","Packing","Delivering","Delivered","Cancelled"];
  const filtered = filter==="All" ? data.orders : data.orders.filter(o=>o.status===filter);

  const updateStatus = (id, newStatus) => {
    setData(d=>({...d, orders:d.orders.map(o=>o.id===id?{...o,status:newStatus}:o)}));
    addLog("Changed order status", `${id} → ${newStatus}`);
    toast(`Order ${id} updated to ${newStatus}`);
    setSelected(s=>s?{...s,status:newStatus}:null);
  };

  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <SectionHeader title="Order Management" T={T}/>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        {statuses.map(s=>(
          <button key={s} onClick={()=>setFilter(s)} style={{
            padding:"7px 16px",borderRadius:20,border:"none",cursor:"pointer",
            background:filter===s?T.teal:T.cardBg, color:filter===s?"#fff":T.muted,
            fontWeight:filter===s?700:400, fontSize:12,
            boxShadow:"0 1px 4px rgba(0,0,0,0.08)"}}>
            {s} {s==="All"?`(${data.orders.length})`:s==="Pending"?`(${data.orders.filter(o=>o.status==="Pending").length})`:""}
          </button>
        ))}
      </div>
      <Card T={T}>
        <Table T={T} cols={["Order ID","Customer","Items","Total","Status","Time","Courier","Action"]} rows={filtered}
          renderRow={r=><>
            <Td style={{fontWeight:700,color:T.teal}}>{r.id}</Td>
            <Td style={{fontWeight:500,color:T.text}}>{r.customer}</Td>
            <Td style={{color:T.muted}}>{r.items}</Td>
            <Td style={{fontWeight:700,color:T.text}}>₵{r.total}</Td>
            <Td><Badge label={r.status}/></Td>
            <Td style={{color:T.muted,fontSize:12}}>{r.time}</Td>
            <Td style={{color:T.muted,fontSize:12}}>{r.courier}</Td>
            <Td>
              <Btn small T={T} variant="secondary" onClick={()=>setSelected(r)}>View</Btn>
            </Td>
          </>}/>
      </Card>

      {selected && (
        <Modal title={`Order ${selected.id}`} onClose={()=>setSelected(null)} T={T}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
            {[["Customer",selected.customer],["Address",selected.address],["Items",selected.items],
              ["Total",`₵${selected.total}`],["Courier",selected.courier],["Time",selected.time]].map(([k,v])=>(
              <div key={k} style={{background:T.tableBg,borderRadius:10,padding:"10px 12px"}}>
                <div style={{fontSize:10,color:T.muted,fontWeight:700,textTransform:"uppercase"}}>{k}</div>
                <div style={{fontSize:14,fontWeight:600,color:T.text,marginTop:2}}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{marginBottom:16}}>
            <div style={{fontSize:11,color:T.muted,fontWeight:700,textTransform:"uppercase",marginBottom:8}}>Update Status</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {["Pending","Packing","Delivering","Delivered","Cancelled"].map(s=>(
                <button key={s} onClick={()=>updateStatus(selected.id,s)} style={{
                  padding:"7px 12px",borderRadius:8,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,
                  background:selected.status===s?T.teal:T.tableBg,
                  color:selected.status===s?"#fff":T.text}}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <Btn T={T} variant="ghost" onClick={()=>setSelected(null)}>Close</Btn>
        </Modal>
      )}
    </div>
  );
}

// ── PRODUCTS ──────────────────────────────────────────────────
function Products({ data, setData, addLog, toast, T }) {
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const emptyForm = { name:"", category:"Vegetables", price:"", unit:"kg", stock:"", supplier:"", image:"📦" };
  const [form, setForm] = useState(emptyForm);
  const categories = ["Vegetables","Fruits","Grains & Flours","Herbs & Season.","Fish & Seafood","Dairy & Eggs","Meats & Poultry","Essentials"];

  const filtered = data.products.filter(p=>p.name.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => { setForm(emptyForm); setEditing(null); setShowAdd(true); };
  const openEdit = (p) => { setForm({...p,price:String(p.price),stock:String(p.stock)}); setEditing(p.id); setShowAdd(true); };

  const save = () => {
    if (!form.name || !form.price || !form.stock) { alert("Please fill name, price, and stock."); return; }
    const stockNum = parseInt(form.stock);
    const priceNum = parseFloat(form.price);
    const status = stockNum===0?"Out of Stock":stockNum<10?"Low Stock":"In Stock";
    if (editing) {
      setData(d=>({...d,products:d.products.map(p=>p.id===editing?{...p,...form,price:priceNum,stock:stockNum,status}:p)}));
      addLog("Updated product", form.name); toast(`${form.name} updated`);
    } else {
      const newP = {...form,id:Date.now(),price:priceNum,stock:stockNum,status};
      setData(d=>({...d,products:[...d.products,newP]}));
      addLog("Added product", form.name); toast(`${form.name} added`);
    }
    setShowAdd(false);
  };

  const remove = (p) => {
    if (!window.confirm(`Delete "${p.name}"?`)) return;
    setData(d=>({...d,products:d.products.filter(x=>x.id!==p.id)}));
    addLog("Deleted product", p.name); toast(`${p.name} deleted`);
  };

  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <SectionHeader title="Products & Inventory" T={T} action="+ Add Product" onAction={openAdd}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12}}>
        <StatCard T={T} icon="📦" label="Total" value={data.products.length}/>
        <StatCard T={T} icon="✅" label="In Stock" value={data.products.filter(p=>p.status==="In Stock").length} bgColor={T.greenL} color={T.green}/>
        <StatCard T={T} icon="⚠️" label="Low Stock" value={data.products.filter(p=>p.status==="Low Stock").length} bgColor={T.yellowL} color="#d97706"/>
        <StatCard T={T} icon="❌" label="Out of Stock" value={data.products.filter(p=>p.status==="Out of Stock").length} bgColor={T.redL} color={T.red}/>
      </div>
      <Card T={T}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍  Search products…"
          style={{width:"100%",padding:"10px 14px",borderRadius:10,border:`1.5px solid ${T.border}`,
            background:T.inputBg,color:T.text,fontSize:13,outline:"none",marginBottom:14,boxSizing:"border-box"}}/>
        <Table T={T} cols={["","Product","Category","Price","Stock","Status","Supplier","Actions"]} rows={filtered}
          renderRow={r=><>
            <Td><span style={{fontSize:22}}>{r.image}</span></Td>
            <Td style={{fontWeight:600,color:T.text}}>{r.name}</Td>
            <Td style={{color:T.muted,fontSize:12}}>{r.category}</Td>
            <Td style={{fontWeight:700,color:T.teal}}>₵{r.price}/{r.unit}</Td>
            <Td style={{color:r.stock===0?T.red:r.stock<10?"#d97706":T.green,fontWeight:700}}>{r.stock}</Td>
            <Td><Badge label={r.status}/></Td>
            <Td style={{color:T.muted,fontSize:12}}>{r.supplier}</Td>
            <Td>
              <div style={{display:"flex",gap:6}}>
                <Btn small T={T} variant="secondary" onClick={()=>openEdit(r)}>Edit</Btn>
                <Btn small T={T} variant="danger" onClick={()=>remove(r)}>Delete</Btn>
              </div>
            </Td>
          </>}/>
      </Card>

      {showAdd && (
        <Modal title={editing?"Edit Product":"Add New Product"} onClose={()=>setShowAdd(false)} T={T}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
            <div style={{gridColumn:"1/-1"}}>
              <Input label="Product Name" value={form.name} onChange={v=>setForm(f=>({...f,name:v}))} T={T} placeholder="e.g. Fresh Tomatoes"/>
            </div>
            <Input label="Category" value={form.category} onChange={v=>setForm(f=>({...f,category:v}))} T={T} options={categories}/>
            <Input label="Supplier" value={form.supplier} onChange={v=>setForm(f=>({...f,supplier:v}))} T={T} placeholder="e.g. GreenFarm Co."/>
            <Input label="Price (₵)" value={form.price} onChange={v=>setForm(f=>({...f,price:v}))} T={T} placeholder="0.00" type="number"/>
            <Input label="Unit" value={form.unit} onChange={v=>setForm(f=>({...f,unit:v}))} T={T} placeholder="kg, pack, pcs…"/>
            <div style={{gridColumn:"1/-1"}}>
              <Input label="Stock Quantity" value={form.stock} onChange={v=>setForm(f=>({...f,stock:v}))} T={T} placeholder="0" type="number"/>
            </div>
          </div>
          <div style={{display:"flex",gap:10,marginTop:4}}>
            <Btn T={T} onClick={save}>{editing?"Save Changes":"Add Product"}</Btn>
            <Btn T={T} variant="ghost" onClick={()=>setShowAdd(false)}>Cancel</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── SUPPLIERS ─────────────────────────────────────────────────
function Suppliers({ data, setData, addLog, toast, T }) {
  const approve = (id) => {
    setData(d=>({...d,suppliers:d.suppliers.map(s=>s.id===id?{...s,status:"Active"}:s)}));
    const s = data.suppliers.find(s=>s.id===id);
    addLog("Approved supplier", s.name); toast(`${s.name} approved`);
  };
  const suspend = (id) => {
    setData(d=>({...d,suppliers:d.suppliers.map(s=>s.id===id?{...s,status:"Review"}:s)}));
    const s = data.suppliers.find(s=>s.id===id);
    addLog("Suspended supplier", s.name); toast(`${s.name} moved to review`);
  };
  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <SectionHeader title="Supplier Management" T={T} action="+ Add Supplier" onAction={()=>toast("Supplier invite sent")}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12}}>
        <StatCard T={T} icon="🏪" label="Total" value={data.suppliers.length}/>
        <StatCard T={T} icon="✅" label="Active" value={data.suppliers.filter(s=>s.status==="Active").length} bgColor={T.greenL} color={T.green}/>
        <StatCard T={T} icon="🔍" label="Under Review" value={data.suppliers.filter(s=>s.status==="Review").length} bgColor={T.yellowL} color="#d97706"/>
        <StatCard T={T} icon="💰" label="Total Revenue" value={`₵${data.suppliers.reduce((s,x)=>s+x.revenue,0).toLocaleString()}`}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:14}}>
        {data.suppliers.map(s=>(
          <Card key={s.id} T={T}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:42,height:42,borderRadius:12,background:T.tealLight,
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🏪</div>
                <div>
                  <div style={{fontWeight:700,fontSize:15,color:T.text}}>{s.name}</div>
                  <div style={{fontSize:11,color:T.muted}}>{s.email}</div>
                </div>
              </div>
              <Badge label={s.status}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>
              {[["Orders",s.orders],[`₵${s.revenue.toLocaleString()}`,"Revenue"],[`⭐ ${s.rating}`,"Rating"]].map(([v,l])=>(
                <div key={l} style={{textAlign:"center",padding:"8px 4px",background:T.tableBg,borderRadius:10}}>
                  <div style={{fontSize:13,fontWeight:700,color:T.text}}>{v}</div>
                  <div style={{fontSize:10,color:T.muted}}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:8}}>
              {s.status==="Review"
                ? <Btn T={T} onClick={()=>approve(s.id)} small>✓ Approve</Btn>
                : <Btn T={T} variant="ghost" onClick={()=>suspend(s.id)} small>Suspend</Btn>}
              <Btn T={T} variant="secondary" small onClick={()=>toast(`Viewing ${s.name}`)}>View Profile</Btn>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ── COURIERS ──────────────────────────────────────────────────
function Couriers({ data, setData, addLog, toast, T }) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name:"", zone:"Cantonments", phone:"", status:"Available" });
  const zones = ["Cantonments","Airport Res.","East Legon","Osu","Labone","Adenta","Tema"];
  const statuses = ["Available","On Delivery","Off Duty"];

  const updateStatus = (id, status) => {
    setData(d=>({...d,couriers:d.couriers.map(c=>c.id===id?{...c,status}:c)}));
    const c = data.couriers.find(c=>c.id===id);
    addLog("Updated courier status", `${c.name} → ${status}`); toast(`${c.name} status updated`);
  };

  const addCourier = () => {
    if (!form.name) return;
    const newC = {...form,id:Date.now(),deliveries:0,rating:5.0,earnings:0};
    setData(d=>({...d,couriers:[...d.couriers,newC]}));
    addLog("Added courier", form.name); toast(`${form.name} added`);
    setAdding(false); setForm({name:"",zone:"Cantonments",phone:"",status:"Available"});
  };

  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <SectionHeader title="Courier Management" T={T} action="+ Add Courier" onAction={()=>setAdding(true)}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12}}>
        <StatCard T={T} icon="🚴" label="Total" value={data.couriers.length}/>
        <StatCard T={T} icon="📦" label="On Delivery" value={data.couriers.filter(c=>c.status==="On Delivery").length} bgColor={"#dbeafe"} color={"#1d4ed8"}/>
        <StatCard T={T} icon="✅" label="Available" value={data.couriers.filter(c=>c.status==="Available").length} bgColor={T.greenL} color={T.green}/>
        <StatCard T={T} icon="🌙" label="Off Duty" value={data.couriers.filter(c=>c.status==="Off Duty").length} bgColor={T.border} color={T.muted}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:14}}>
        {data.couriers.map(c=>(
          <Card key={c.id} T={T}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:44,height:44,borderRadius:"50%",
                  background:`hsl(${c.id*60},55%,65%)`,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontWeight:700,fontSize:15,color:"#fff",flexShrink:0}}>
                  {c.name.split(" ").map(n=>n[0]).join("")}
                </div>
                <div>
                  <div style={{fontWeight:700,color:T.text}}>{c.name}</div>
                  <div style={{fontSize:12,color:T.muted}}>{c.zone} · {c.phone}</div>
                </div>
              </div>
              <Badge label={c.status}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>
              {[[c.deliveries,"Deliveries"],[`⭐ ${c.rating}`,"Rating"],[`₵${c.earnings}`,"Earned"]].map(([v,l])=>(
                <div key={l} style={{textAlign:"center",padding:"8px 4px",background:T.tableBg,borderRadius:10}}>
                  <div style={{fontSize:13,fontWeight:700,color:T.text}}>{v}</div>
                  <div style={{fontSize:10,color:T.muted}}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {statuses.map(s=>(
                <button key={s} onClick={()=>updateStatus(c.id,s)} style={{
                  padding:"5px 10px",borderRadius:8,border:"none",cursor:"pointer",fontSize:11,fontWeight:600,
                  background:c.status===s?T.teal:T.tableBg,color:c.status===s?"#fff":T.muted}}>
                  {s}
                </button>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {adding && (
        <Modal title="Add New Courier" onClose={()=>setAdding(false)} T={T}>
          <Input label="Full Name" value={form.name} onChange={v=>setForm(f=>({...f,name:v}))} T={T} placeholder="e.g. Kwame Adusei"/>
          <Input label="Phone" value={form.phone} onChange={v=>setForm(f=>({...f,phone:v}))} T={T} placeholder="+233 XX XXX XXXX"/>
          <Input label="Zone" value={form.zone} onChange={v=>setForm(f=>({...f,zone:v}))} T={T} options={zones}/>
          <div style={{display:"flex",gap:10}}>
            <Btn T={T} onClick={addCourier}>Add Courier</Btn>
            <Btn T={T} variant="ghost" onClick={()=>setAdding(false)}>Cancel</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── CUSTOMERS ─────────────────────────────────────────────────
function Customers({ data, T, toast }) {
  const [search, setSearch] = useState("");
  const filtered = data.customers.filter(c=>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <SectionHeader title="Customer Management" T={T}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12}}>
        <StatCard T={T} icon="👥" label="Total" value={data.customers.length}/>
        <StatCard T={T} icon="✅" label="Active" value={data.customers.filter(c=>c.status==="Active").length} bgColor={T.greenL} color={T.green}/>
        <StatCard T={T} icon="💤" label="Inactive" value={data.customers.filter(c=>c.status==="Inactive").length} bgColor={T.border} color={T.muted}/>
        <StatCard T={T} icon="💰" label="Total Spent" value={`₵${data.customers.reduce((s,c)=>s+c.spent,0).toLocaleString()}`}/>
      </div>
      <Card T={T}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍  Search by name or email…"
          style={{width:"100%",padding:"10px 14px",borderRadius:10,border:`1.5px solid ${T.border}`,
            background:T.inputBg,color:T.text,fontSize:13,outline:"none",marginBottom:14,boxSizing:"border-box"}}/>
        <Table T={T} cols={["Customer","Email","Plan","Orders","Spent","Joined","Status","Action"]} rows={filtered}
          renderRow={r=><>
            <Td>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:30,height:30,borderRadius:"50%",background:T.tealLight,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontWeight:700,fontSize:11,color:T.teal,flexShrink:0}}>
                  {r.name.split(" ").map(n=>n[0]).join("")}
                </div>
                <span style={{fontWeight:600,color:T.text}}>{r.name}</span>
              </div>
            </Td>
            <Td style={{color:T.muted,fontSize:12}}>{r.email}</Td>
            <Td><Badge label={r.plan}/></Td>
            <Td style={{color:T.text}}>{r.orders}</Td>
            <Td style={{fontWeight:700,color:T.teal}}>₵{r.spent}</Td>
            <Td style={{color:T.muted,fontSize:12}}>{r.joined}</Td>
            <Td><Badge label={r.status}/></Td>
            <Td><Btn small T={T} variant="secondary" onClick={()=>toast(`Viewing ${r.name}`)}>View</Btn></Td>
          </>}/>
      </Card>
    </div>
  );
}

// ── FINANCIALS ────────────────────────────────────────────────
function Financials({ data, setData, addLog, toast, T }) {
  const monthData = [{l:"Aug",v:28.4},{l:"Sep",v:31.2},{l:"Oct",v:29.8},{l:"Nov",v:38.1},{l:"Dec",v:52.4},{l:"Jan",v:41.2},{l:"Feb",v:39.6},{l:"Mar",v:18.2}];
  const [payouts, setPayouts] = useState([
    {id:1,supplier:"Volta Farms",orders:14,amount:1240,due:"Mar 10",paid:false},
    {id:2,supplier:"GreenFarm Co.",orders:28,amount:1880,due:"Mar 10",paid:false},
  ]);

  const pay = (id) => {
    const p = payouts.find(x=>x.id===id);
    setPayouts(pp=>pp.map(x=>x.id===id?{...x,paid:true}:x));
    addLog("Processed payout", `${p.supplier} ₵${p.amount.toLocaleString()}`);
    toast(`Payout of ₵${p.amount.toLocaleString()} sent to ${p.supplier}`);
  };

  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <SectionHeader title="Financials & Payouts" T={T} action="Export Report" onAction={()=>toast("Report exported")}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:12}}>
        <StatCard T={T} icon="💰" label="Revenue (Mar)" value="₵18,200" sub="↑ 4% vs Feb"/>
        <StatCard T={T} icon="📈" label="Total Revenue" value="₵278,900" sub="All time" bgColor={T.greenL} color={T.green}/>
        <StatCard T={T} icon="🚚" label="Delivery Fees (Mar)" value="₵4,200" bgColor={"#dbeafe"} color={"#1d4ed8"}/>
        <StatCard T={T} icon="⏳" label="Pending Payouts" value={`₵${payouts.filter(p=>!p.paid).reduce((s,p)=>s+p.amount,0).toLocaleString()}`} bgColor={T.orangeL} color={T.orange}/>
      </div>
      <Card T={T}>
        <div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:16}}>Monthly Revenue (₵ thousands)</div>
        <BarChart data={monthData} T={T}/>
      </Card>
      <Card T={T}>
        <div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:14}}>Pending Supplier Payouts</div>
        <Table T={T} cols={["Supplier","Orders","Amount","Due Date","Status","Action"]} rows={payouts}
          renderRow={r=><>
            <Td style={{fontWeight:600,color:T.text}}>{r.supplier}</Td>
            <Td style={{color:T.muted}}>{r.orders} orders</Td>
            <Td style={{fontWeight:700,color:T.teal}}>₵{r.amount.toLocaleString()}</Td>
            <Td style={{color:T.muted,fontSize:12}}>{r.due}</Td>
            <Td><Badge label={r.paid?"Active":"Pending"}/></Td>
            <Td>
              {r.paid
                ? <span style={{fontSize:12,color:T.green,fontWeight:600}}>✓ Paid</span>
                : <Btn small T={T} onClick={()=>pay(r.id)}>Pay Now</Btn>}
            </Td>
          </>}/>
      </Card>
      <Card T={T}>
        <div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:14}}>Courier Earnings — This Week</div>
        <Table T={T} cols={["Courier","Zone","Deliveries","Earned","Status"]} rows={data.couriers}
          renderRow={r=><>
            <Td style={{fontWeight:600,color:T.text}}>{r.name}</Td>
            <Td style={{color:T.muted,fontSize:12}}>{r.zone}</Td>
            <Td style={{color:T.text}}>{r.deliveries}</Td>
            <Td style={{fontWeight:700,color:T.teal}}>₵{r.earnings}</Td>
            <Td><Badge label={r.status}/></Td>
          </>}/>
      </Card>
    </div>
  );
}

// ── NOTIFICATIONS ─────────────────────────────────────────────
function Notifications({ data, setData, T }) {
  const markAll = () => setData(d=>({...d,notifications:d.notifications.map(n=>({...n,read:true}))}));
  const markOne = (id) => setData(d=>({...d,notifications:d.notifications.map(n=>n.id===id?{...n,read:true}:n)}));
  const icons = { order:"🛒", supplier:"🏪", alert:"⚠️", courier:"🚴", finance:"💰" };
  const unread = data.notifications.filter(n=>!n.read).length;

  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <h2 style={{margin:0,fontSize:22,fontFamily:"'Playfair Display',serif",color:T.text}}>
          Notifications {unread>0 && <span style={{fontSize:14,background:T.red,color:"#fff",padding:"2px 8px",borderRadius:12,marginLeft:8}}>{unread}</span>}
        </h2>
        {unread>0 && <Btn T={T} variant="secondary" onClick={markAll}>Mark all read</Btn>}
      </div>
      <Card T={T}>
        {data.notifications.map(n=>(
          <div key={n.id} onClick={()=>markOne(n.id)} style={{
            display:"flex",alignItems:"flex-start",gap:14,padding:"14px 16px",
            borderRadius:12,marginBottom:4,cursor:"pointer",
            background:n.read?"transparent":T.tealLight,
            transition:"background 0.15s"}}
            onMouseEnter={e=>e.currentTarget.style.background=T.tableBg}
            onMouseLeave={e=>e.currentTarget.style.background=n.read?"transparent":T.tealLight}>
            <div style={{width:38,height:38,borderRadius:10,background:T.cardBg,
              border:`1px solid ${T.border}`,display:"flex",alignItems:"center",
              justifyContent:"center",fontSize:18,flexShrink:0}}>{icons[n.type]}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:14,color:T.text,fontWeight:n.read?400:600}}>{n.message}</div>
              <div style={{fontSize:11,color:T.muted,marginTop:3}}>{n.time}</div>
            </div>
            {!n.read && <div style={{width:8,height:8,borderRadius:"50%",background:T.teal,marginTop:6,flexShrink:0}}/>}
          </div>
        ))}
        {data.notifications.every(n=>n.read) && (
          <div style={{textAlign:"center",padding:"40px 0",color:T.muted}}>
            <div style={{fontSize:32,marginBottom:8}}>🎉</div>
            <div style={{fontSize:14}}>All caught up! No new notifications.</div>
          </div>
        )}
      </Card>
    </div>
  );
}

// ── AUDIT LOG ─────────────────────────────────────────────────
function AuditLog({ data, T }) {
  const icons = { "Changed order status":"🛒","Updated product":"📦","Added product":"➕",
    "Deleted product":"🗑️","Approved supplier":"✅","Suspended supplier":"⏸️",
    "Added courier":"🚴","Updated courier status":"🔄","Processed payout":"💰","Added new courier":"🚴" };
  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <SectionHeader title="Activity & Audit Log" T={T}/>
      <Card T={T}>
        {data.auditLog.map((log,i)=>(
          <div key={log.id||i} style={{display:"flex",alignItems:"flex-start",gap:14,
            padding:"12px 0",borderBottom:`1px solid ${T.border}`}}>
            <div style={{width:36,height:36,borderRadius:10,background:T.tealLight,
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>
              {icons[log.action]||"📋"}
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:14,color:T.text}}>
                <b>{log.admin}</b> — {log.action}
              </div>
              <div style={{fontSize:12,color:T.teal,marginTop:2}}>{log.target}</div>
            </div>
            <div style={{fontSize:11,color:T.muted,whiteSpace:"nowrap"}}>{log.time}</div>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ── SETTINGS ──────────────────────────────────────────────────
function Settings({ data, setData, darkMode, setDarkMode, toast, addLog, T }) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name:"", email:"", role:"Operations" });
  const roles = ["Super Admin","Operations","Finance"];

  const addAdmin = () => {
    if (!form.name || !form.email) return;
    const newA = {...form, id:Date.now(), status:"Active", lastLogin:"Never"};
    setData(d=>({...d,admins:[...d.admins,newA]}));
    addLog("Added admin user", form.name); toast(`${form.name} invited`);
    setAdding(false); setForm({name:"",email:"",role:"Operations"});
  };

  const removeAdmin = (a) => {
    if (a.role==="Super Admin") { toast("Cannot remove Super Admin"); return; }
    setData(d=>({...d,admins:d.admins.filter(x=>x.id!==a.id)}));
    addLog("Removed admin user", a.name); toast(`${a.name} removed`);
  };

  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <SectionHeader title="Settings" T={T}/>

      {/* Appearance */}
      <Card T={T}>
        <div style={{fontSize:15,fontWeight:700,color:T.text,marginBottom:14}}>⚙️ Appearance</div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
          padding:"12px 0",borderBottom:`1px solid ${T.border}`}}>
          <div>
            <div style={{fontSize:14,fontWeight:600,color:T.text}}>Dark Mode</div>
            <div style={{fontSize:12,color:T.muted}}>Switch between light and dark theme</div>
          </div>
          <div onClick={()=>setDarkMode(v=>!v)} style={{
            width:48,height:26,borderRadius:13,background:darkMode?T.teal:T.border,
            position:"relative",cursor:"pointer",transition:"background 0.2s"}}>
            <div style={{position:"absolute",top:3,left:darkMode?22:3,width:20,height:20,
              borderRadius:"50%",background:"#fff",transition:"left 0.2s",
              boxShadow:"0 1px 4px rgba(0,0,0,0.2)"}}/>
          </div>
        </div>
      </Card>

      {/* Admin roles */}
      <Card T={T}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div style={{fontSize:15,fontWeight:700,color:T.text}}>👤 Admin Users & Roles</div>
          <Btn T={T} onClick={()=>setAdding(true)} small>+ Invite Admin</Btn>
        </div>
        <Table T={T} cols={["Name","Email","Role","Last Login","Status","Action"]} rows={data.admins}
          renderRow={r=><>
            <Td style={{fontWeight:600,color:T.text}}>{r.name}</Td>
            <Td style={{color:T.muted,fontSize:12}}>{r.email}</Td>
            <Td><Badge label={r.role}/></Td>
            <Td style={{color:T.muted,fontSize:12}}>{r.lastLogin}</Td>
            <Td><Badge label={r.status}/></Td>
            <Td>
              {r.role!=="Super Admin"
                ? <Btn small T={T} variant="danger" onClick={()=>removeAdmin(r)}>Remove</Btn>
                : <span style={{fontSize:12,color:T.muted}}>—</span>}
            </Td>
          </>}/>
      </Card>

      {/* App info */}
      <Card T={T}>
        <div style={{fontSize:15,fontWeight:700,color:T.text,marginBottom:14}}>ℹ️ App Information</div>
        {[["App Name","The Picky Basket"],["Version","v1.0.0"],["Admin Portal","v1.0.0"],["Support","support@pickybasket.com"]].map(([k,v])=>(
          <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",
            borderBottom:`1px solid ${T.border}`}}>
            <span style={{fontSize:13,color:T.muted}}>{k}</span>
            <span style={{fontSize:13,fontWeight:600,color:T.text}}>{v}</span>
          </div>
        ))}
      </Card>

      {adding && (
        <Modal title="Invite Admin User" onClose={()=>setAdding(false)} T={T}>
          <Input label="Full Name" value={form.name} onChange={v=>setForm(f=>({...f,name:v}))} T={T} placeholder="e.g. Ama Serwaa"/>
          <Input label="Email" value={form.email} onChange={v=>setForm(f=>({...f,email:v}))} T={T} placeholder="ama@pickybasket.com" type="email"/>
          <Input label="Role" value={form.role} onChange={v=>setForm(f=>({...f,role:v}))} T={T} options={roles}/>
          <div style={{display:"flex",gap:10}}>
            <Btn T={T} onClick={addAdmin}>Send Invite</Btn>
            <Btn T={T} variant="ghost" onClick={()=>setAdding(false)}>Cancel</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── NAV config ─────────────────────────────────────────────────
const NAV = [
  { key:"dashboard",      label:"Dashboard",     icon:"📊" },
  { key:"orders",         label:"Orders",        icon:"🛒" },
  { key:"products",       label:"Products",      icon:"📦" },
  { key:"suppliers",      label:"Suppliers",     icon:"🏪" },
  { key:"couriers",       label:"Couriers",      icon:"🚴" },
  { key:"customers",      label:"Customers",     icon:"👥" },
  { key:"financials",     label:"Financials",    icon:"💰" },
  { key:"notifications",  label:"Notifications", icon:"🔔" },
  { key:"auditlog",       label:"Audit Log",     icon:"📋" },
  { key:"settings",       label:"Settings",      icon:"⚙️" },
];

// ── ROOT ──────────────────────────────────────────────────────
export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const T = darkMode ? dark : light;
  const [active, setActive] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [data, setData] = useState(INIT);
  const [toastMsg, setToastMsg] = useState("");
  const toastTimer = useRef(null);

  const toast = (msg) => {
    setToastMsg(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(""), 3000);
  };

  const addLog = (action, target) => {
    const entry = { id:Date.now(), admin:"Super Admin", action, target, time:"Just now" };
    setData(d=>({...d, auditLog:[entry,...d.auditLog]}));
  };

  const unreadCount = data.notifications.filter(n=>!n.read).length;

  if (!loggedIn) return <LoginScreen onLogin={()=>setLoggedIn(true)} T={T}/>;

  const props = { data, setData, addLog, toast, T };

  const Section = {
    dashboard:     ()=><Dashboard {...props}/>,
    orders:        ()=><Orders {...props}/>,
    products:      ()=><Products {...props}/>,
    suppliers:     ()=><Suppliers {...props}/>,
    couriers:      ()=><Couriers {...props}/>,
    customers:     ()=><Customers {...props}/>,
    financials:    ()=><Financials {...props}/>,
    notifications: ()=><Notifications {...props}/>,
    auditlog:      ()=><AuditLog {...props}/>,
    settings:      ()=><Settings {...props} darkMode={darkMode} setDarkMode={setDarkMode}/>,
  }[active] || (()=>null);

  return (
    <div style={{ display:"flex", height:"100vh", background:T.bg, overflow:"hidden",
      fontFamily:"'DM Sans','Segoe UI',sans-serif", transition:"background 0.2s" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-thumb{background:${T.tealMid};border-radius:3px}
        @keyframes slideUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      {/* Sidebar */}
      <div style={{ width:sidebarOpen?220:64, flexShrink:0, background:T.sidebar,
        display:"flex", flexDirection:"column", transition:"width 0.25s ease", overflow:"hidden" }}>
        <div style={{ padding:"18px 12px 14px", borderBottom:`1px solid ${T.navyLight}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:36,height:36,borderRadius:10,background:T.teal,flexShrink:0,
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:18 }}>🧺</div>
            {sidebarOpen && (
              <div>
                <div style={{ color:"#fff",fontWeight:800,fontSize:13,lineHeight:1.2 }}>Picky Basket</div>
                <div style={{ color:T.tealMid,fontSize:10 }}>Admin Portal</div>
              </div>
            )}
          </div>
        </div>

        <nav style={{ flex:1, padding:"10px 8px", overflowY:"auto" }}>
          {NAV.map(n=>{
            const isActive = active===n.key;
            return (
              <div key={n.key} onClick={()=>setActive(n.key)} style={{
                display:"flex",alignItems:"center",gap:10,padding:"9px 10px",
                borderRadius:10,marginBottom:2,cursor:"pointer",position:"relative",
                background:isActive?T.teal:"transparent",transition:"background 0.15s"}}
                onMouseEnter={e=>{if(!isActive)e.currentTarget.style.background=T.navyLight}}
                onMouseLeave={e=>{if(!isActive)e.currentTarget.style.background="transparent"}}>
                <span style={{fontSize:17,flexShrink:0}}>{n.icon}</span>
                {sidebarOpen && (
                  <span style={{fontSize:12,fontWeight:isActive?700:400,
                    color:isActive?"#fff":T.sidebarText,whiteSpace:"nowrap"}}>{n.label}</span>
                )}
                {n.key==="notifications" && unreadCount>0 && (
                  <span style={{marginLeft:"auto",background:T.red,color:"#fff",
                    borderRadius:10,fontSize:10,fontWeight:700,padding:"1px 6px",minWidth:18,textAlign:"center"}}>
                    {unreadCount}
                  </span>
                )}
              </div>
            );
          })}
        </nav>

        <div style={{ padding:"10px 8px", borderTop:`1px solid ${T.navyLight}` }}>
          <div onClick={()=>setSidebarOpen(v=>!v)} style={{
            display:"flex",alignItems:"center",gap:10,padding:"9px 10px",
            borderRadius:10,cursor:"pointer",color:T.sidebarText}}
            onMouseEnter={e=>e.currentTarget.style.background=T.navyLight}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <span style={{fontSize:14}}>{sidebarOpen?"◀":"▶"}</span>
            {sidebarOpen && <span style={{fontSize:12}}>Collapse</span>}
          </div>
          <div onClick={()=>setLoggedIn(false)} style={{
            display:"flex",alignItems:"center",gap:10,padding:"9px 10px",
            borderRadius:10,cursor:"pointer",color:"#ef4444"}}
            onMouseEnter={e=>e.currentTarget.style.background=T.navyLight}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <span style={{fontSize:14}}>🚪</span>
            {sidebarOpen && <span style={{fontSize:12,fontWeight:600}}>Logout</span>}
          </div>
        </div>
      </div>

      {/* Main area */}
      <div style={{ flex:1,display:"flex",flexDirection:"column",overflow:"hidden" }}>
        {/* Topbar */}
        <div style={{ background:T.cardBg,padding:"12px 24px",borderBottom:`1px solid ${T.border}`,
          display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0 }}>
          <div style={{ fontSize:13,color:T.muted }}>
            <span style={{color:T.teal,fontWeight:600}}>Admin</span>
            {" / "}{NAV.find(n=>n.key===active)?.label}
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:10 }}>
            <button onClick={()=>setActive("notifications")} style={{
              padding:"7px 12px",borderRadius:10,border:`1px solid ${T.border}`,
              background:"transparent",fontSize:12,color:T.muted,cursor:"pointer",
              position:"relative"}}>
              🔔 {unreadCount>0 && <span style={{color:T.red,fontWeight:700}}>{unreadCount}</span>}
            </button>
            <button onClick={()=>setDarkMode(v=>!v)} style={{
              padding:"7px 12px",borderRadius:10,border:`1px solid ${T.border}`,
              background:"transparent",fontSize:14,cursor:"pointer"}}>
              {darkMode?"☀️":"🌙"}
            </button>
            <div style={{ display:"flex",alignItems:"center",gap:8,padding:"6px 12px",
              background:T.tealLight,borderRadius:10,cursor:"pointer" }}
              onClick={()=>setActive("settings")}>
              <div style={{ width:26,height:26,borderRadius:"50%",background:T.teal,
                display:"flex",alignItems:"center",justifyContent:"center",
                color:"#fff",fontSize:11,fontWeight:700 }}>A</div>
              {sidebarOpen && <span style={{fontSize:12,fontWeight:600,color:T.tealDark}}>Super Admin</span>}
            </div>
          </div>
        </div>

        {/* Page content */}
        <div style={{ flex:1,overflowY:"auto",padding:24 }}>
          <Section/>
        </div>
      </div>

      {toastMsg && <Toast msg={toastMsg} T={T}/>}
    </div>
  );
}
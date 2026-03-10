import { useState } from "react";

// ── Brand tokens ──────────────────────────────────────────────
const C = {
  teal:      "#2A9D8F",
  tealDark:  "#1f7a6e",
  tealLight: "#e0f5f3",
  tealMid:   "#b2e8e2",
  warm:      "#fdf8f0",
  orange:    "#E76F51",
  orangeL:   "#fdeee9",
  yellow:    "#E9C46A",
  yellowL:   "#fdf4dc",
  navy:      "#1a2332",
  navyMid:   "#243447",
  navyLight: "#2f4460",
  text:      "#1a1a1a",
  muted:     "#6b7280",
  border:    "#e8ecf0",
  bg:        "#f4f7f6",
  white:     "#ffffff",
  green:     "#22c55e",
  greenL:    "#dcfce7",
  red:       "#ef4444",
  redL:      "#fee2e2",
};

// ── Mock data ─────────────────────────────────────────────────
const mockOrders = [
  { id:"#PB-4821", customer:"Akosua Mensah", items:5, total:"₵77", status:"Delivering", time:"10 min ago", courier:"Kofi A." },
  { id:"#PB-4820", customer:"Kwame Asante",  items:3, total:"₵45", status:"Packing",    time:"22 min ago", courier:"—" },
  { id:"#PB-4819", customer:"Ama Boateng",   items:8, total:"₵132",status:"Delivered",  time:"1 hr ago",   courier:"Esi B." },
  { id:"#PB-4818", customer:"Yaw Darko",     items:2, total:"₵28", status:"Pending",    time:"1 hr ago",   courier:"—" },
  { id:"#PB-4817", customer:"Abena Frimpong",items:6, total:"₵98", status:"Delivered",  time:"2 hr ago",   courier:"Kojo M." },
  { id:"#PB-4816", customer:"Nana Agyei",    items:4, total:"₵61", status:"Cancelled",  time:"3 hr ago",   courier:"—" },
];

const mockProducts = [
  { id:1, name:"Fresh Tilapia",    category:"Fish & Seafood",  price:"₵45/kg",  stock:24, status:"In Stock",    supplier:"AquaFresh GH" },
  { id:2, name:"Asparagus",        category:"Vegetables",      price:"₵12/bdl", stock:8,  status:"Low Stock",   supplier:"GreenFarm Co." },
  { id:3, name:"Scotch Bonnet",    category:"Herbs & Season.", price:"₵4/pack", stock:0,  status:"Out of Stock",supplier:"Volta Farms" },
  { id:4, name:"Long Grain Rice",  category:"Grains & Flours", price:"₵8/500g", stock:45, status:"In Stock",    supplier:"Rice Direct GH" },
  { id:5, name:"Free Range Eggs",  category:"Dairy & Eggs",    price:"₵18/doz", stock:32, status:"In Stock",    supplier:"Happy Hens Ltd" },
];

const mockSuppliers = [
  { id:1, name:"AquaFresh GH",    products:12, orders:84,  revenue:"₵12,400", rating:4.8, status:"Active" },
  { id:2, name:"GreenFarm Co.",   products:28, orders:156, revenue:"₵8,720",  rating:4.5, status:"Active" },
  { id:3, name:"Volta Farms",     products:7,  orders:41,  revenue:"₵3,100",  rating:3.9, status:"Review" },
  { id:4, name:"Rice Direct GH",  products:4,  orders:210, revenue:"₵18,900", rating:4.9, status:"Active" },
  { id:5, name:"Happy Hens Ltd",  products:5,  orders:98,  revenue:"₵6,300",  rating:4.7, status:"Active" },
];

const mockCouriers = [
  { id:1, name:"Kofi Asante",    deliveries:24, rating:4.9, status:"On Delivery", zone:"Cantonments",    earnings:"₵180" },
  { id:2, name:"Esi Boateng",    deliveries:31, rating:4.7, status:"Available",   zone:"Airport Res.",   earnings:"₵240" },
  { id:3, name:"Kojo Mensah",    deliveries:18, rating:4.6, status:"Available",   zone:"East Legon",     earnings:"₵135" },
  { id:4, name:"Adwoa Frimpong", deliveries:9,  rating:4.2, status:"Off Duty",    zone:"Osu",            earnings:"₵68" },
];

const mockCustomers = [
  { id:1, name:"Akosua Mensah",  email:"akosua@email.com",  orders:14, spent:"₵842",  joined:"Jan 2024", plan:"Individual" },
  { id:2, name:"Kwame Asante",   email:"kwame@email.com",   orders:7,  spent:"₵390",  joined:"Mar 2024", plan:"Individual" },
  { id:3, name:"Ama Boateng",    email:"ama@email.com",     orders:22, spent:"₵1,430",joined:"Nov 2023", plan:"Family" },
  { id:4, name:"Yaw Darko",      email:"yaw@email.com",     orders:3,  spent:"₵120",  joined:"Feb 2024", plan:"Individual" },
  { id:5, name:"Abena Frimpong", email:"abena@email.com",   orders:18, spent:"₵980",  joined:"Dec 2023", plan:"Business" },
];

// ── Helpers ───────────────────────────────────────────────────
const statusColor = (s) => ({
  "Delivering": { bg:"#dbeafe", text:"#1d4ed8" },
  "Packing":    { bg:C.yellowL, text:"#92400e" },
  "Delivered":  { bg:C.greenL,  text:"#15803d" },
  "Pending":    { bg:"#f3e8ff", text:"#7c3aed" },
  "Cancelled":  { bg:C.redL,    text:C.red },
  "In Stock":   { bg:C.greenL,  text:"#15803d" },
  "Low Stock":  { bg:C.yellowL, text:"#92400e" },
  "Out of Stock":{ bg:C.redL,   text:C.red },
  "Active":     { bg:C.greenL,  text:"#15803d" },
  "Review":     { bg:C.yellowL, text:"#92400e" },
  "On Delivery":{ bg:"#dbeafe", text:"#1d4ed8" },
  "Available":  { bg:C.greenL,  text:"#15803d" },
  "Off Duty":   { bg:C.border,  text:C.muted },
  "Individual": { bg:C.tealLight,text:C.tealDark },
  "Family":     { bg:"#f3e8ff", text:"#7c3aed" },
  "Business":   { bg:C.yellowL, text:"#92400e" },
}[s] || { bg:C.border, text:C.muted });

const Badge = ({ label }) => {
  const sc = statusColor(label);
  return (
    <span style={{ padding:"3px 10px", borderRadius:20, fontSize:12, fontWeight:600,
      background:sc.bg, color:sc.text, whiteSpace:"nowrap" }}>{label}</span>
  );
};

const Card = ({ children, style={} }) => (
  <div style={{ background:C.white, borderRadius:16, padding:20,
    boxShadow:"0 1px 12px rgba(0,0,0,0.06)", ...style }}>{children}</div>
);

const StatCard = ({ icon, label, value, sub, color=C.teal, bg=C.tealLight }) => (
  <Card style={{ display:"flex", alignItems:"center", gap:16 }}>
    <div style={{ width:52, height:52, borderRadius:14, background:bg,
      display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>{icon}</div>
    <div>
      <div style={{ fontSize:13, color:C.muted, fontWeight:500 }}>{label}</div>
      <div style={{ fontSize:24, fontWeight:800, color:C.text, lineHeight:1.2 }}>{value}</div>
      {sub && <div style={{ fontSize:12, color:color, fontWeight:600, marginTop:2 }}>{sub}</div>}
    </div>
  </Card>
);

const SectionHeader = ({ title, action, onAction }) => (
  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
    <h2 style={{ margin:0, fontSize:20, fontFamily:"'Playfair Display',serif", color:C.text }}>{title}</h2>
    {action && <button onClick={onAction} style={{ padding:"8px 16px", borderRadius:10, border:"none",
      background:C.teal, color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer" }}>{action}</button>}
  </div>
);

const Table = ({ cols, rows, renderRow }) => (
  <div style={{ overflowX:"auto" }}>
    <table style={{ width:"100%", borderCollapse:"collapse" }}>
      <thead>
        <tr style={{ background:C.bg }}>
          {cols.map(c => (
            <th key={c} style={{ padding:"10px 14px", textAlign:"left", fontSize:11,
              fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:0.8,
              whiteSpace:"nowrap" }}>{c}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={{ borderBottom:`1px solid ${C.border}`,
            transition:"background 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.background=C.bg}
            onMouseLeave={e => e.currentTarget.style.background="transparent"}>
            {renderRow(row)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Td = ({ children, style={} }) => (
  <td style={{ padding:"12px 14px", fontSize:13, color:C.text, ...style }}>{children}</td>
);

// ── Mini bar chart ────────────────────────────────────────────
const BarChart = ({ data }) => {
  const max = Math.max(...data.map(d=>d.v));
  return (
    <div style={{ display:"flex", alignItems:"flex-end", gap:6, height:80 }}>
      {data.map((d,i) => (
        <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
          <div style={{ width:"100%", height: Math.round((d.v/max)*64)+4, borderRadius:"6px 6px 0 0",
            background: i===data.length-1 ? C.teal : C.tealMid, transition:"height 0.4s ease" }} />
          <span style={{ fontSize:10, color:C.muted }}>{d.l}</span>
        </div>
      ))}
    </div>
  );
};

// ── Sections ──────────────────────────────────────────────────

function Dashboard() {
  const weekData = [
    {l:"Mon",v:42},{l:"Tue",v:58},{l:"Wed",v:35},{l:"Thu",v:71},
    {l:"Fri",v:89},{l:"Sat",v:112},{l:"Sun",v:67},
  ];
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div>
        <h1 style={{ margin:"0 0 4px", fontSize:26, fontFamily:"'Playfair Display',serif", color:C.text }}>
          Good morning, Admin 👋
        </h1>
        <p style={{ margin:0, color:C.muted, fontSize:14 }}>Here's what's happening with The Picky Basket today.</p>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:14 }}>
        <StatCard icon="🛒" label="Orders Today"    value="47"     sub="↑ 12% vs yesterday" color={C.green} bg={C.greenL} />
        <StatCard icon="💰" label="Revenue Today"   value="₵3,840" sub="↑ 8% vs yesterday"  color={C.teal}  bg={C.tealLight} />
        <StatCard icon="🚚" label="Active Deliveries" value="11"   sub="3 delayed"           color={C.orange} bg={C.orangeL} />
        <StatCard icon="👥" label="New Customers"   value="6"      sub="This week: 28"       color="#7c3aed" bg="#f3e8ff" />
      </div>

      {/* Chart + top items */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <Card>
          <div style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:14 }}>Orders This Week</div>
          <BarChart data={weekData} />
          <div style={{ marginTop:10, display:"flex", justifyContent:"space-between" }}>
            <span style={{ fontSize:12, color:C.muted }}>Total: <b style={{color:C.text}}>474 orders</b></span>
            <span style={{ fontSize:12, color:C.teal, fontWeight:600 }}>↑ 18% vs last week</span>
          </div>
        </Card>
        <Card>
          <div style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:14 }}>Top Products</div>
          {[
            { name:"Fresh Tilapia", sales:84, pct:84 },
            { name:"Long Grain Rice", sales:71, pct:71 },
            { name:"Asparagus", sales:58, pct:58 },
            { name:"Scotch Bonnet", sales:43, pct:43 },
          ].map(p => (
            <div key={p.name} style={{ marginBottom:12 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                <span style={{ fontSize:13, color:C.text }}>{p.name}</span>
                <span style={{ fontSize:12, color:C.muted }}>{p.sales} sold</span>
              </div>
              <div style={{ height:6, background:C.border, borderRadius:3, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${p.pct}%`, background:C.teal, borderRadius:3 }} />
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* Recent orders */}
      <Card>
        <SectionHeader title="Recent Orders" />
        <Table
          cols={["Order","Customer","Items","Total","Status","Courier"]}
          rows={mockOrders.slice(0,5)}
          renderRow={r => (<>
            <Td><span style={{fontWeight:600,color:C.teal}}>{r.id}</span></Td>
            <Td>{r.customer}</Td>
            <Td>{r.items}</Td>
            <Td style={{fontWeight:600}}>{r.total}</Td>
            <Td><Badge label={r.status}/></Td>
            <Td style={{color:C.muted}}>{r.courier}</Td>
          </>)}
        />
      </Card>
    </div>
  );
}

function Orders() {
  const [filter, setFilter] = useState("All");
  const statuses = ["All","Pending","Packing","Delivering","Delivered","Cancelled"];
  const filtered = filter==="All" ? mockOrders : mockOrders.filter(o=>o.status===filter);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <SectionHeader title="Order Management" action="+ Export CSV" />

      {/* Filter tabs */}
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        {statuses.map(s => (
          <button key={s} onClick={()=>setFilter(s)} style={{
            padding:"7px 16px", borderRadius:20, border:"none", cursor:"pointer",
            background: filter===s ? C.teal : C.white,
            color: filter===s ? "#fff" : C.muted,
            fontWeight: filter===s ? 700 : 400,
            fontSize:13, boxShadow:"0 1px 4px rgba(0,0,0,0.08)"
          }}>{s}</button>
        ))}
      </div>

      <Card>
        <Table
          cols={["Order ID","Customer","Items","Total","Status","Time","Courier","Action"]}
          rows={filtered}
          renderRow={r => (<>
            <Td><span style={{fontWeight:700,color:C.teal}}>{r.id}</span></Td>
            <Td style={{fontWeight:500}}>{r.customer}</Td>
            <Td>{r.items} items</Td>
            <Td style={{fontWeight:700}}>{r.total}</Td>
            <Td><Badge label={r.status}/></Td>
            <Td style={{color:C.muted}}>{r.time}</Td>
            <Td style={{color:C.muted}}>{r.courier}</Td>
            <Td>
              <button style={{ padding:"5px 12px", borderRadius:8, border:`1px solid ${C.teal}`,
                background:"transparent", color:C.teal, fontSize:12, fontWeight:600, cursor:"pointer" }}>
                View
              </button>
            </Td>
          </>)}
        />
      </Card>
    </div>
  );
}

function Products() {
  const [search, setSearch] = useState("");
  const filtered = mockProducts.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <SectionHeader title="Products & Inventory" action="+ Add Product" />

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:12 }}>
        <StatCard icon="📦" label="Total Products" value="48"  bg={C.tealLight} />
        <StatCard icon="✅" label="In Stock"       value="39"  bg={C.greenL}    color={C.green} />
        <StatCard icon="⚠️" label="Low Stock"      value="6"   bg={C.yellowL}   color="#d97706" />
        <StatCard icon="❌" label="Out of Stock"   value="3"   bg={C.redL}      color={C.red} />
      </div>

      <Card>
        <div style={{ marginBottom:14 }}>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="🔍  Search products…"
            style={{ width:"100%", padding:"10px 14px", borderRadius:10, border:`1.5px solid ${C.border}`,
              fontSize:13, outline:"none", boxSizing:"border-box" }} />
        </div>
        <Table
          cols={["Product","Category","Price","Stock","Status","Supplier","Actions"]}
          rows={filtered}
          renderRow={r => (<>
            <Td style={{fontWeight:600}}>{r.name}</Td>
            <Td style={{color:C.muted}}>{r.category}</Td>
            <Td style={{fontWeight:600,color:C.teal}}>{r.price}</Td>
            <Td>
              <span style={{ color: r.stock===0?C.red:r.stock<10?"#d97706":C.green, fontWeight:700 }}>
                {r.stock} units
              </span>
            </Td>
            <Td><Badge label={r.status}/></Td>
            <Td style={{color:C.muted,fontSize:12}}>{r.supplier}</Td>
            <Td>
              <div style={{display:"flex",gap:6}}>
                <button style={{padding:"5px 10px",borderRadius:7,border:`1px solid ${C.teal}`,
                  background:"transparent",color:C.teal,fontSize:11,fontWeight:600,cursor:"pointer"}}>Edit</button>
                <button style={{padding:"5px 10px",borderRadius:7,border:`1px solid ${C.red}`,
                  background:"transparent",color:C.red,fontSize:11,fontWeight:600,cursor:"pointer"}}>Remove</button>
              </div>
            </Td>
          </>)}
        />
      </Card>
    </div>
  );
}

function Suppliers() {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <SectionHeader title="Supplier Management" action="+ Add Supplier" />

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:12 }}>
        <StatCard icon="🏪" label="Total Suppliers" value="12" bg={C.tealLight} />
        <StatCard icon="✅" label="Active"           value="10" bg={C.greenL}   color={C.green} />
        <StatCard icon="🔍" label="Under Review"    value="2"  bg={C.yellowL}  color="#d97706" />
        <StatCard icon="💰" label="Total Paid Out"  value="₵49,420" bg={C.orangeL} color={C.orange} />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:14 }}>
        {mockSuppliers.map(s => (
          <Card key={s.id}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:42, height:42, borderRadius:12, background:C.tealLight,
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🏪</div>
                <div>
                  <div style={{ fontWeight:700, fontSize:15, color:C.text }}>{s.name}</div>
                  <div style={{ fontSize:12, color:C.muted }}>{s.products} products</div>
                </div>
              </div>
              <Badge label={s.status} />
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:14 }}>
              {[
                { l:"Orders", v:s.orders },
                { l:"Revenue", v:s.revenue },
                { l:"Rating", v:`⭐ ${s.rating}` },
              ].map(m => (
                <div key={m.l} style={{ textAlign:"center", padding:"8px 4px",
                  background:C.bg, borderRadius:10 }}>
                  <div style={{ fontSize:14, fontWeight:700, color:C.text }}>{m.v}</div>
                  <div style={{ fontSize:11, color:C.muted }}>{m.l}</div>
                </div>
              ))}
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <button style={{ flex:1, padding:"8px", borderRadius:9, border:`1px solid ${C.teal}`,
                background:"transparent", color:C.teal, fontSize:12, fontWeight:600, cursor:"pointer" }}>View</button>
              {s.status==="Review" && (
                <button style={{ flex:1, padding:"8px", borderRadius:9, border:"none",
                  background:C.teal, color:"#fff", fontSize:12, fontWeight:600, cursor:"pointer" }}>Approve</button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Couriers() {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <SectionHeader title="Courier Management" action="+ Add Courier" />

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:12 }}>
        <StatCard icon="🚴" label="Total Couriers"   value="8"  bg={C.tealLight} />
        <StatCard icon="📦" label="On Delivery"      value="3"  bg={"#dbeafe"}  color={"#1d4ed8"} />
        <StatCard icon="✅" label="Available"        value="4"  bg={C.greenL}   color={C.green} />
        <StatCard icon="🌙" label="Off Duty"         value="1"  bg={C.border}   color={C.muted} />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:14 }}>
        {mockCouriers.map(c => (
          <Card key={c.id}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:44, height:44, borderRadius:"50%",
                  background:`hsl(${c.id*60},60%,80%)`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontWeight:700, fontSize:16, color:"#fff" }}>
                  {c.name.split(" ").map(n=>n[0]).join("")}
                </div>
                <div>
                  <div style={{ fontWeight:700, fontSize:15 }}>{c.name}</div>
                  <div style={{ fontSize:12, color:C.muted }}>{c.zone}</div>
                </div>
              </div>
              <Badge label={c.status} />
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:14 }}>
              {[
                { l:"Deliveries", v:c.deliveries },
                { l:"Rating",     v:`⭐ ${c.rating}` },
                { l:"Earned",     v:c.earnings },
              ].map(m => (
                <div key={m.l} style={{ textAlign:"center", padding:"8px 4px",
                  background:C.bg, borderRadius:10 }}>
                  <div style={{ fontSize:14, fontWeight:700, color:C.text }}>{m.v}</div>
                  <div style={{ fontSize:11, color:C.muted }}>{m.l}</div>
                </div>
              ))}
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <button style={{ flex:1, padding:"8px", borderRadius:9, border:`1px solid ${C.teal}`,
                background:"transparent", color:C.teal, fontSize:12, fontWeight:600, cursor:"pointer" }}>Profile</button>
              <button style={{ flex:1, padding:"8px", borderRadius:9, border:`1px solid ${C.border}`,
                background:"transparent", color:C.muted, fontSize:12, fontWeight:600, cursor:"pointer" }}>Assign Order</button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Customers() {
  const [search, setSearch] = useState("");
  const filtered = mockCustomers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <SectionHeader title="Customer Management" />

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:12 }}>
        <StatCard icon="👥" label="Total Customers"   value="1,248" bg={C.tealLight} />
        <StatCard icon="🆕" label="New This Month"    value="84"    bg={C.greenL}   color={C.green} />
        <StatCard icon="🔄" label="Active Subscriptions" value="312" bg={"#f3e8ff"} color={"#7c3aed"} />
        <StatCard icon="💤" label="Inactive (30d)"    value="56"    bg={C.border}   color={C.muted} />
      </div>

      <Card>
        <div style={{ marginBottom:14 }}>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="🔍  Search customers…"
            style={{ width:"100%", padding:"10px 14px", borderRadius:10, border:`1.5px solid ${C.border}`,
              fontSize:13, outline:"none", boxSizing:"border-box" }} />
        </div>
        <Table
          cols={["Customer","Email","Plan","Orders","Total Spent","Joined","Action"]}
          rows={filtered}
          renderRow={r => (<>
            <Td>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ width:32,height:32,borderRadius:"50%",background:C.tealLight,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontWeight:700,fontSize:12,color:C.teal }}>
                  {r.name.split(" ").map(n=>n[0]).join("")}
                </div>
                <span style={{fontWeight:600}}>{r.name}</span>
              </div>
            </Td>
            <Td style={{color:C.muted}}>{r.email}</Td>
            <Td><Badge label={r.plan}/></Td>
            <Td>{r.orders}</Td>
            <Td style={{fontWeight:700,color:C.teal}}>{r.spent}</Td>
            <Td style={{color:C.muted}}>{r.joined}</Td>
            <Td>
              <button style={{padding:"5px 12px",borderRadius:8,border:`1px solid ${C.teal}`,
                background:"transparent",color:C.teal,fontSize:12,fontWeight:600,cursor:"pointer"}}>View</button>
            </Td>
          </>)}
        />
      </Card>
    </div>
  );
}

function Financials() {
  const monthData = [
    {l:"Aug",v:28400},{l:"Sep",v:31200},{l:"Oct",v:29800},{l:"Nov",v:38100},
    {l:"Dec",v:52400},{l:"Jan",v:41200},{l:"Feb",v:39600},{l:"Mar",v:18200},
  ];
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <SectionHeader title="Financials & Payouts" action="Export Report" />

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:12 }}>
        <StatCard icon="💰" label="Revenue (Mar)"     value="₵18,200" sub="↑ 4% vs Feb"  bg={C.tealLight} />
        <StatCard icon="📈" label="Total Revenue"     value="₵278,900" sub="All time"    bg={C.greenL}   color={C.green} />
        <StatCard icon="🚚" label="Delivery Fees"     value="₵4,200"  sub="Mar earnings" bg={"#dbeafe"}  color={"#1d4ed8"} />
        <StatCard icon="🏪" label="Supplier Payouts"  value="₵12,480" sub="Pending: ₵3,120" bg={C.orangeL} color={C.orange} />
      </div>

      <Card>
        <div style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:16 }}>Monthly Revenue</div>
        <BarChart data={monthData.map(d=>({...d,v:d.v/1000}))} />
        <div style={{ textAlign:"center", fontSize:11, color:C.muted, marginTop:6 }}>Values in ₵ thousands</div>
      </Card>

      {/* Payout queue */}
      <Card>
        <div style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:14 }}>Pending Supplier Payouts</div>
        <Table
          cols={["Supplier","Orders","Amount","Due Date","Action"]}
          rows={[
            { name:"Volta Farms",    orders:14, amount:"₵1,240", due:"Mar 10" },
            { name:"GreenFarm Co.",  orders:28, amount:"₵1,880", due:"Mar 10" },
          ]}
          renderRow={r => (<>
            <Td style={{fontWeight:600}}>{r.name}</Td>
            <Td>{r.orders} orders</Td>
            <Td style={{fontWeight:700,color:C.teal}}>{r.amount}</Td>
            <Td style={{color:C.muted}}>{r.due}</Td>
            <Td>
              <button style={{padding:"6px 14px",borderRadius:8,border:"none",
                background:C.teal,color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer"}}>Pay Now</button>
            </Td>
          </>)}
        />
      </Card>

      {/* Courier earnings */}
      <Card>
        <div style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:14 }}>Courier Earnings — This Week</div>
        <Table
          cols={["Courier","Deliveries","Earned","Status"]}
          rows={mockCouriers}
          renderRow={r => (<>
            <Td style={{fontWeight:600}}>{r.name}</Td>
            <Td>{r.deliveries}</Td>
            <Td style={{fontWeight:700,color:C.teal}}>{r.earnings}</Td>
            <Td><Badge label={r.status}/></Td>
          </>)}
        />
      </Card>
    </div>
  );
}

// ── Nav config ────────────────────────────────────────────────
const NAV = [
  { key:"dashboard",  label:"Dashboard",  icon:"📊" },
  { key:"orders",     label:"Orders",     icon:"🛒" },
  { key:"products",   label:"Products",   icon:"📦" },
  { key:"suppliers",  label:"Suppliers",  icon:"🏪" },
  { key:"couriers",   label:"Couriers",   icon:"🚴" },
  { key:"customers",  label:"Customers",  icon:"👥" },
  { key:"financials", label:"Financials", icon:"💰" },
];

// ── Root App ──────────────────────────────────────────────────
export default function AdminPortal() {
  const [active, setActive] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const Section = {
    dashboard:  Dashboard,
    orders:     Orders,
    products:   Products,
    suppliers:  Suppliers,
    couriers:   Couriers,
    customers:  Customers,
    financials: Financials,
  }[active];

  return (
    <div style={{ display:"flex", height:"100vh", background:C.bg,
      fontFamily:"'DM Sans','Segoe UI',sans-serif", overflow:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${C.tealMid}; border-radius: 3px; }
      `}</style>

      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? 220 : 68, flexShrink:0,
        background:C.navy, display:"flex", flexDirection:"column",
        transition:"width 0.25s ease", overflow:"hidden"
      }}>
        {/* Logo */}
        <div style={{ padding:"20px 16px 16px", borderBottom:`1px solid ${C.navyLight}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:C.teal,
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>🧺</div>
            {sidebarOpen && (
              <div>
                <div style={{ color:"#fff", fontWeight:800, fontSize:14, lineHeight:1.2 }}>Picky Basket</div>
                <div style={{ color:C.tealMid, fontSize:10, fontWeight:500 }}>Admin Portal</div>
              </div>
            )}
          </div>
        </div>

        {/* Nav items */}
        <nav style={{ flex:1, padding:"12px 8px", overflowY:"auto" }}>
          {NAV.map(n => {
            const isActive = active===n.key;
            return (
              <div key={n.key} onClick={()=>setActive(n.key)} style={{
                display:"flex", alignItems:"center", gap:12,
                padding:"10px 12px", borderRadius:10, marginBottom:4,
                cursor:"pointer",
                background: isActive ? C.teal : "transparent",
                transition:"background 0.15s",
              }}
              onMouseEnter={e=>{ if(!isActive) e.currentTarget.style.background=C.navyLight; }}
              onMouseLeave={e=>{ if(!isActive) e.currentTarget.style.background="transparent"; }}>
                <span style={{ fontSize:18, flexShrink:0 }}>{n.icon}</span>
                {sidebarOpen && (
                  <span style={{ fontSize:13, fontWeight: isActive?700:400,
                    color: isActive?"#fff":C.tealMid, whiteSpace:"nowrap" }}>{n.label}</span>
                )}
              </div>
            );
          })}
        </nav>

        {/* Bottom */}
        <div style={{ padding:"12px 8px", borderTop:`1px solid ${C.navyLight}` }}>
          <div onClick={()=>setSidebarOpen(v=>!v)} style={{
            display:"flex", alignItems:"center", gap:12, padding:"10px 12px",
            borderRadius:10, cursor:"pointer", color:C.tealMid,
          }}
          onMouseEnter={e=>e.currentTarget.style.background=C.navyLight}
          onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <span style={{fontSize:18}}>{sidebarOpen?"◀":"▶"}</span>
            {sidebarOpen && <span style={{fontSize:13,whiteSpace:"nowrap"}}>Collapse</span>}
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        {/* Topbar */}
        <div style={{ background:C.white, padding:"14px 24px",
          borderBottom:`1px solid ${C.border}`,
          display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
          <div style={{ fontSize:13, color:C.muted }}>
            <span style={{color:C.teal,fontWeight:600}}>Admin</span>
            {" / "}{NAV.find(n=>n.key===active)?.label}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <button style={{ padding:"8px 14px", borderRadius:10, border:`1px solid ${C.border}`,
              background:"transparent", fontSize:12, color:C.muted, cursor:"pointer" }}>🔔 3</button>
            <div style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 12px",
              background:C.tealLight, borderRadius:10 }}>
              <div style={{ width:28, height:28, borderRadius:"50%", background:C.teal,
                display:"flex", alignItems:"center", justifyContent:"center",
                color:"#fff", fontSize:12, fontWeight:700 }}>A</div>
              <span style={{ fontSize:13, fontWeight:600, color:C.tealDark }}>Super Admin</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex:1, overflowY:"auto", padding:24 }}>
          <Section />
        </div>
      </div>
    </div>
  );
}

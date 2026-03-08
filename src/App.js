import { useState, useRef } from "react";
import logo from "./logo.png";

// ── Theme tokens ───────────────────────────────────────────────
const light = {
  teal:"#2A9D8F",tealDark:"#1f7a6e",tealLight:"#e0f5f3",tealMid:"#b2e8e2",
  orange:"#E76F51",orangeL:"#fdeee9",yellow:"#E9C46A",yellowL:"#fdf4dc",
  navy:"#1a2332",navyMid:"#243447",navyLight:"#2f4460",
  text:"#1a1a1a",muted:"#6b7280",border:"#e8ecf0",
  bg:"#f4f7f6",white:"#ffffff",green:"#22c55e",greenL:"#dcfce7",
  red:"#ef4444",redL:"#fee2e2",blue:"#3b82f6",blueL:"#dbeafe",
  purple:"#8b5cf6",purpleL:"#f3e8ff",
  sidebar:"#1a2332",sidebarText:"#b2e8e2",
  cardBg:"#ffffff",inputBg:"#ffffff",tableBg:"#f9fafb",
};
const dark = {
  teal:"#2A9D8F",tealDark:"#1f7a6e",tealLight:"#0d3330",tealMid:"#1f5c56",
  orange:"#E76F51",orangeL:"#3d1f17",yellow:"#E9C46A",yellowL:"#3d3010",
  navy:"#0d1117",navyMid:"#161b22",navyLight:"#21262d",
  text:"#e6edf3",muted:"#8b949e",border:"#30363d",
  bg:"#0d1117",white:"#161b22",green:"#22c55e",greenL:"#0d2818",
  red:"#ef4444",redL:"#2d1010",blue:"#3b82f6",blueL:"#0d1f3c",
  purple:"#8b5cf6",purpleL:"#1e1040",
  sidebar:"#0d1117",sidebarText:"#b2e8e2",
  cardBg:"#161b22",inputBg:"#21262d",tableBg:"#0d1117",
};

const CATEGORIES = ["Vegetables","Fruits","Grains & Flours","Herbs & Seasonings","Fish & Seafood","Dairy & Eggs","Meats & Poultry","Essentials"];
const CAT_ICONS = {"Vegetables":"🥦","Fruits":"🍎","Grains & Flours":"🌾","Herbs & Seasonings":"🌿","Fish & Seafood":"🐟","Dairy & Eggs":"🥚","Meats & Poultry":"🥩","Essentials":"🧄"};
const ZONES = ["Cantonments","Airport Res.","East Legon","Osu","Labone","Adenta","Tema","Madina","Spintex","Haatso"];
const UNITS = ["kg","g","bundle","pack","pcs","punnet","litre","dozen","box","sachet"];

const readFile = (file) => new Promise(res => { const r = new FileReader(); r.onload = e => res(e.target.result); r.readAsDataURL(file); });

// ── Initial data ───────────────────────────────────────────────
const INIT = {
  orders:[
    { id:"#PB-4821",customer:"Akosua Mensah",  items:[{name:"Fresh Tilapia",qty:1,price:45},{name:"Bell Peppers",qty:2,price:8}], total:61, status:"Delivering",time:"10 min ago",courier:"Kofi Asante",courierId:1,address:"12 Cantonments Rd",zone:"Cantonments",note:"Leave at gate" },
    { id:"#PB-4820",customer:"Kwame Asante",   items:[{name:"Long Grain Rice",qty:3,price:8}],total:24,status:"Packing",   time:"22 min ago",courier:"—",courierId:null,address:"45 Airport Res.",zone:"Airport Res.",note:"" },
    { id:"#PB-4819",customer:"Ama Boateng",    items:[{name:"Free Range Eggs",qty:2,price:18},{name:"Asparagus",qty:1,price:12}],total:48,status:"Delivered", time:"1 hr ago",courier:"Esi Boateng",courierId:2,address:"8 Osu Rd",zone:"Osu",note:"" },
    { id:"#PB-4818",customer:"Yaw Darko",      items:[{name:"Scotch Bonnet",qty:2,price:4}],total:8,status:"Pending",   time:"1 hr ago",courier:"—",courierId:null,address:"22 Labone St",zone:"Labone",note:"Call on arrival" },
    { id:"#PB-4817",customer:"Abena Frimpong", items:[{name:"Fresh Tilapia",qty:3,price:45}],total:135,status:"Delivered",time:"2 hr ago",courier:"Kojo Mensah",courierId:3,address:"5 Ring Rd",zone:"East Legon",note:"" },
    { id:"#PB-4816",customer:"Nana Agyei",     items:[{name:"Asparagus",qty:2,price:12}],total:24,status:"Cancelled",  time:"3 hr ago",courier:"—",courierId:null,address:"17 Tema Rd",zone:"Tema",note:"" },
  ],
  products:[
    { id:1,name:"Fresh Tilapia",  category:"Fish & Seafood",  price:45,unit:"kg",  stock:24,status:"In Stock",    supplier:"AquaFresh GH",  image:null,approvalStatus:"Approved",description:"Fresh daily catch from Tema harbour" },
    { id:2,name:"Asparagus",      category:"Vegetables",      price:12,unit:"bundle",stock:8,status:"Low Stock",  supplier:"GreenFarm Co.", image:null,approvalStatus:"Approved",description:"Organic fresh asparagus" },
    { id:3,name:"Scotch Bonnet",  category:"Herbs & Seasonings",price:4,unit:"pack",stock:0,status:"Out of Stock",supplier:"Volta Farms",   image:null,approvalStatus:"Approved",description:"Hot scotch bonnet peppers" },
    { id:4,name:"Long Grain Rice",category:"Grains & Flours", price:8,unit:"500g", stock:45,status:"In Stock",   supplier:"Rice Direct GH",image:null,approvalStatus:"Approved",description:"Premium long grain white rice" },
    { id:5,name:"Free Range Eggs",category:"Dairy & Eggs",    price:18,unit:"doz", stock:32,status:"In Stock",   supplier:"Happy Hens Ltd",image:null,approvalStatus:"Approved",description:"Farm fresh free range eggs" },
    { id:6,name:"Catfish",        category:"Fish & Seafood",  price:55,unit:"kg",  stock:0, status:"Out of Stock",supplier:"AquaFresh GH", image:null,approvalStatus:"Pending",  description:"Fresh catfish — pending review" },
    { id:7,name:"Organic Mango",  category:"Fruits",          price:15,unit:"kg",  stock:0, status:"Out of Stock",supplier:"GreenFarm Co.", image:null,approvalStatus:"Pending",  description:"Sweet organic mangoes" },
  ],
  suppliers:[
    { id:1,name:"AquaFresh GH",  products:12,orders:84, revenue:12400,rating:4.8,status:"Active", email:"info@aquafresh.gh",  phone:"+233 20 111 2222",category:"Fish & Seafood",brandType:"Farm / Grower",   joined:"Jan 2024",pendingPayout:1240,
      documents:[{name:"Business Reg.",status:"Approved"},{name:"Food Safety",status:"Pending"}],
      bankDetails:{method:"MTN Mobile Money",number:"0201112222",name:"AquaFresh GH"} },
    { id:2,name:"GreenFarm Co.", products:28,orders:156,revenue:8720, rating:4.5,status:"Active", email:"hello@greenfarm.gh", phone:"+233 24 333 4444",category:"Vegetables",    brandType:"Farm / Grower",   joined:"Mar 2023",pendingPayout:1880,
      documents:[{name:"Business Reg.",status:"Approved"},{name:"Organic Cert.",status:"Approved"},{name:"Food Safety",status:"Missing"}],
      bankDetails:{method:"GCB Bank",number:"1234567890",name:"GreenFarm Co."} },
    { id:3,name:"Volta Farms",   products:7, orders:41, revenue:3100, rating:3.9,status:"Review", email:"volta@farms.gh",     phone:"+233 27 555 6666",category:"Herbs & Seasonings",brandType:"Wholesaler",    joined:"Jun 2024",pendingPayout:620,
      documents:[{name:"Business Reg.",status:"Pending"}],
      bankDetails:{method:"Vodafone Cash",number:"0501234567",name:"Volta Farms"} },
    { id:4,name:"Rice Direct GH",products:4, orders:210,revenue:18900,rating:4.9,status:"Active", email:"rice@direct.gh",     phone:"+233 30 777 8888",category:"Grains & Flours", brandType:"Importer / Distributor",joined:"Aug 2023",pendingPayout:3200,
      documents:[{name:"Business Reg.",status:"Approved"},{name:"Import License",status:"Approved"}],
      bankDetails:{method:"Ecobank",number:"9876543210",name:"Rice Direct GH"} },
    { id:5,name:"Happy Hens Ltd",products:5, orders:98, revenue:6300, rating:4.7,status:"Active", email:"eggs@happyhens.gh",  phone:"+233 55 999 0000",category:"Dairy & Eggs",    brandType:"Farm / Grower",   joined:"Oct 2023",pendingPayout:940,
      documents:[{name:"Business Reg.",status:"Approved"},{name:"Food Safety",status:"Approved"}],
      bankDetails:{method:"Fidelity Bank",number:"1122334455",name:"Happy Hens Ltd"} },
  ],
  couriers:[
    { id:1,name:"Kofi Asante",   deliveries:24,rating:4.9,status:"On Delivery",zone:"Cantonments", earnings:180,phone:"+233 20 123 4567",email:"kofi@courier.gh",   joined:"Jan 2024",vehicle:"Motorbike" },
    { id:2,name:"Esi Boateng",   deliveries:31,rating:4.7,status:"Available",   zone:"Airport Res.",earnings:240,phone:"+233 24 234 5678",email:"esi@courier.gh",    joined:"Feb 2024",vehicle:"Motorbike" },
    { id:3,name:"Kojo Mensah",   deliveries:18,rating:4.6,status:"Available",   zone:"East Legon",  earnings:135,phone:"+233 27 345 6789",email:"kojo@courier.gh",   joined:"Mar 2024",vehicle:"Bicycle" },
    { id:4,name:"Adwoa Frimpong",deliveries:9, rating:4.2,status:"Off Duty",    zone:"Osu",         earnings:68, phone:"+233 55 456 7890",email:"adwoa@courier.gh",  joined:"Apr 2024",vehicle:"Motorbike" },
  ],
  customers:[
    { id:1,name:"Akosua Mensah", email:"akosua@email.com",orders:14,spent:842, joined:"Jan 2024",plan:"Individual",status:"Active",  phone:"+233 24 111 2222",address:"12 Cantonments Rd" },
    { id:2,name:"Kwame Asante",  email:"kwame@email.com", orders:7, spent:390, joined:"Mar 2024",plan:"Individual",status:"Active",  phone:"+233 20 333 4444",address:"45 Airport Res." },
    { id:3,name:"Ama Boateng",   email:"ama@email.com",   orders:22,spent:1430,joined:"Nov 2023",plan:"Family",    status:"Active",  phone:"+233 27 555 6666",address:"8 Osu Rd" },
    { id:4,name:"Yaw Darko",     email:"yaw@email.com",   orders:3, spent:120, joined:"Feb 2024",plan:"Individual",status:"Inactive",phone:"+233 55 777 8888",address:"22 Labone St" },
    { id:5,name:"Abena Frimpong",email:"abena@email.com", orders:18,spent:980, joined:"Dec 2023",plan:"Business",  status:"Active",  phone:"+233 30 999 0000",address:"5 Ring Rd" },
  ],
  complaints:[
    { id:1,customer:"Nana Agyei",    orderId:"#PB-4790",product:"Fresh Tilapia",  supplier:"AquaFresh GH", issue:"Product arrived smelling bad",      status:"Open",    date:"Feb 25",response:"" },
    { id:2,customer:"Kwame Asante",  orderId:"#PB-4780",product:"Scotch Bonnet",  supplier:"Volta Farms",  issue:"Wrong quantity delivered",           status:"Resolved",date:"Feb 22",response:"Refund processed for missing items." },
    { id:3,customer:"Abena Frimpong",orderId:"#PB-4770",product:"Long Grain Rice",supplier:"Rice Direct GH",issue:"Packaging was damaged on arrival",   status:"Open",    date:"Feb 20",response:"" },
  ],
  coupons:[
    { id:1,code:"PICKY10",   type:"Fixed",      value:10, minOrder:50,  used:34,limit:100,status:"Active",  expiry:"Mar 31" },
    { id:2,code:"WELCOME20", type:"Percentage", value:20, minOrder:80,  used:12,limit:50, status:"Active",  expiry:"Apr 15" },
    { id:3,code:"FREESHIP",  type:"Free Delivery",value:0,minOrder:100,used:8, limit:200,status:"Active",  expiry:"Mar 20" },
    { id:4,code:"FLASH50",   type:"Fixed",      value:50, minOrder:200, used:50,limit:50, status:"Expired", expiry:"Feb 28" },
  ],
  zones:[
    { id:1,name:"Cantonments", baseFee:15,extraPerKm:2,couriers:1,active:true,  estimatedTime:"20-30 min" },
    { id:2,name:"Airport Res.",baseFee:12,extraPerKm:2,couriers:1,active:true,  estimatedTime:"20-35 min" },
    { id:3,name:"East Legon",  baseFee:18,extraPerKm:2,couriers:1,active:true,  estimatedTime:"25-40 min" },
    { id:4,name:"Osu",         baseFee:10,extraPerKm:1,couriers:0,active:true,  estimatedTime:"15-25 min" },
    { id:5,name:"Labone",      baseFee:12,extraPerKm:2,couriers:0,active:true,  estimatedTime:"20-30 min" },
    { id:6,name:"Tema",        baseFee:25,extraPerKm:3,couriers:0,active:false, estimatedTime:"45-60 min" },
  ],
  notifications:[
    { id:1,type:"order",   message:"New order #PB-4822 from Kofi Brew",       time:"2 min ago", read:false },
    { id:2,type:"supplier",message:"Volta Farms submitted 2 new products",    time:"15 min ago",read:false },
    { id:3,type:"alert",   message:"Scotch Bonnet is out of stock",            time:"1 hr ago",  read:false },
    { id:4,type:"courier", message:"Kofi Asante completed delivery #PB-4819", time:"2 hr ago",  read:true  },
    { id:5,type:"finance", message:"Payout of ₵1,240 due to AquaFresh GH",   time:"3 hr ago",  read:true  },
  ],
  auditLog:[
    { id:1,admin:"Super Admin",action:"Approved supplier",   target:"AquaFresh GH",  time:"Today 09:14" },
    { id:2,admin:"Super Admin",action:"Updated product",     target:"Fresh Tilapia", time:"Today 08:52" },
    { id:3,admin:"Super Admin",action:"Changed order status",target:"#PB-4819 → Delivered",time:"Today 08:30" },
    { id:4,admin:"Super Admin",action:"Added courier",       target:"Adwoa Frimpong",time:"Yesterday" },
    { id:5,admin:"Super Admin",action:"Processed payout",    target:"Rice Direct GH ₵18,900",time:"Yesterday" },
  ],
  admins:[
    { id:1,name:"Super Admin",    email:"admin@pickybasket.com", role:"Super Admin",lastLogin:"Today 09:00",status:"Active" },
    { id:2,name:"Ops Manager",    email:"ops@pickybasket.com",   role:"Operations", lastLogin:"Today 07:30",status:"Active" },
    { id:3,name:"Finance Officer",email:"finance@pickybasket.com",role:"Finance",  lastLogin:"Yesterday",  status:"Active" },
  ],
};

// ── Helpers ────────────────────────────────────────────────────
const stockStatus = n => parseInt(n)===0?"Out of Stock":parseInt(n)<10?"Low Stock":"In Stock";

const statusColor = (s,T) => ({
  "Delivering":  {bg:T.blueL,  text:T.blue},
  "Packing":     {bg:T.yellowL,text:"#92400e"},
  "Delivered":   {bg:T.greenL, text:"#15803d"},
  "Pending":     {bg:T.purpleL,text:T.purple},
  "Cancelled":   {bg:T.redL,   text:T.red},
  "In Stock":    {bg:T.greenL, text:"#15803d"},
  "Low Stock":   {bg:T.yellowL,text:"#92400e"},
  "Out of Stock":{bg:T.redL,   text:T.red},
  "Active":      {bg:T.greenL, text:"#15803d"},
  "Inactive":    {bg:T.redL,   text:T.red},
  "Review":      {bg:T.yellowL,text:"#92400e"},
  "On Delivery": {bg:T.blueL,  text:T.blue},
  "Available":   {bg:T.greenL, text:"#15803d"},
  "Off Duty":    {bg:T.border, text:T.muted},
  "Individual":  {bg:T.tealLight,text:T.tealDark},
  "Family":      {bg:T.purpleL,text:T.purple},
  "Business":    {bg:T.yellowL,text:"#92400e"},
  "Super Admin": {bg:T.redL,   text:T.red},
  "Operations":  {bg:T.blueL,  text:T.blue},
  "Finance":     {bg:T.greenL, text:"#15803d"},
  "Approved":    {bg:T.greenL, text:"#15803d"},
  "Rejected":    {bg:T.redL,   text:T.red},
  "Missing":     {bg:T.redL,   text:T.red},
  "Expired":     {bg:T.border, text:T.muted},
  "Open":        {bg:T.orangeL,text:T.orange},
  "Resolved":    {bg:T.greenL, text:"#15803d"},
}[s]||{bg:T.border,text:T.muted});

// ── Reusable UI ────────────────────────────────────────────────
const Badge = ({label,T}) => { const sc=statusColor(label,T); return <span style={{padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700,background:sc.bg,color:sc.text,whiteSpace:"nowrap"}}>{label}</span>; };
const Card = ({children,style={},T}) => <div style={{background:T.cardBg,borderRadius:16,padding:20,boxShadow:"0 1px 12px rgba(0,0,0,0.06)",border:`1px solid ${T.border}`,...style}}>{children}</div>;
const FL = ({children,T}) => <div style={{fontSize:11,fontWeight:700,color:T.muted,marginBottom:6,textTransform:"uppercase",letterSpacing:0.5}}>{children}</div>;
const Toast = ({msg,T}) => <div style={{position:"fixed",bottom:24,right:24,background:T.teal,color:"#fff",padding:"12px 20px",borderRadius:12,fontSize:13,fontWeight:600,boxShadow:"0 4px 20px rgba(0,0,0,0.2)",zIndex:9999}}>✓ {msg}</div>;

const StatCard = ({icon,label,value,sub,color,bgColor,T}) => (
  <Card T={T} style={{display:"flex",alignItems:"center",gap:14}}>
    <div style={{width:50,height:50,borderRadius:14,background:bgColor||T.tealLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{icon}</div>
    <div>
      <div style={{fontSize:12,color:T.muted,fontWeight:500}}>{label}</div>
      <div style={{fontSize:22,fontWeight:800,color:T.text,lineHeight:1.2}}>{value}</div>
      {sub&&<div style={{fontSize:11,color:color||T.teal,fontWeight:600,marginTop:1}}>{sub}</div>}
    </div>
  </Card>
);

const Input = ({label,value,onChange,type="text",placeholder="",T,options,textarea=false}) => (
  <div style={{marginBottom:14}}>
    {label&&<FL T={T}>{label}</FL>}
    {options
      ?<select value={value} onChange={e=>onChange(e.target.value)} style={{width:"100%",padding:"10px 12px",borderRadius:10,border:`1.5px solid ${T.border}`,background:T.inputBg,color:T.text,fontSize:13,outline:"none"}}>{options.map(o=><option key={o} value={o}>{o}</option>)}</select>
      :textarea
        ?<textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={3} style={{width:"100%",padding:"10px 12px",borderRadius:10,border:`1.5px solid ${T.border}`,background:T.inputBg,color:T.text,fontSize:13,outline:"none",boxSizing:"border-box",resize:"vertical",fontFamily:"inherit"}}/>
        :<input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{width:"100%",padding:"10px 12px",borderRadius:10,border:`1.5px solid ${T.border}`,background:T.inputBg,color:T.text,fontSize:13,outline:"none",boxSizing:"border-box"}}/>
    }
  </div>
);

const Btn = ({children,onClick,variant="primary",T,small=false,full=false}) => {
  const s={primary:{background:T.teal,color:"#fff",border:"none"},secondary:{background:"transparent",color:T.teal,border:`1.5px solid ${T.teal}`},danger:{background:"transparent",color:T.red,border:`1.5px solid ${T.red}`},ghost:{background:"transparent",color:T.muted,border:`1.5px solid ${T.border}`},orange:{background:T.orange,color:"#fff",border:"none"}}[variant]||{};
  return <button onClick={onClick} style={{...s,padding:small?"6px 12px":"10px 18px",borderRadius:10,fontSize:small?11:13,fontWeight:600,cursor:"pointer",transition:"opacity 0.15s",width:full?"100%":"auto"}} onMouseEnter={e=>e.currentTarget.style.opacity="0.8"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>{children}</button>;
};

const Modal = ({title,onClose,children,T,wide=false}) => (
  <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
    <div style={{background:T.cardBg,borderRadius:20,padding:28,width:"100%",maxWidth:wide?680:480,boxShadow:"0 20px 60px rgba(0,0,0,0.3)",maxHeight:"90vh",overflowY:"auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <h3 style={{margin:0,fontSize:18,fontFamily:"'Playfair Display',serif",color:T.text}}>{title}</h3>
        <button onClick={onClose} style={{background:"none",border:"none",fontSize:22,cursor:"pointer",color:T.muted}}>×</button>
      </div>
      {children}
    </div>
  </div>
);

const Table = ({cols,rows,renderRow,T}) => (
  <div style={{overflowX:"auto"}}>
    <table style={{width:"100%",borderCollapse:"collapse"}}>
      <thead><tr style={{background:T.tableBg}}>{cols.map(c=><th key={c} style={{padding:"10px 14px",textAlign:"left",fontSize:10,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:0.8,whiteSpace:"nowrap",borderBottom:`1px solid ${T.border}`}}>{c}</th>)}</tr></thead>
      <tbody>{rows.map((row,i)=><tr key={i} style={{borderBottom:`1px solid ${T.border}`,transition:"background 0.1s"}} onMouseEnter={e=>e.currentTarget.style.background=T.tableBg} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>{renderRow(row)}</tr>)}</tbody>
    </table>
  </div>
);
const Td = ({children,style={}}) => <td style={{padding:"11px 14px",fontSize:13,...style}}>{children}</td>;

const BarChart = ({data,T}) => {
  const max=Math.max(...data.map(d=>d.v),1);
  return <div style={{display:"flex",alignItems:"flex-end",gap:6,height:80}}>{data.map((d,i)=><div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}><div style={{width:"100%",height:Math.round((d.v/max)*64)+4,borderRadius:"6px 6px 0 0",background:i===data.length-1?T.teal:T.tealMid,transition:"height 0.4s ease"}}/><span style={{fontSize:9,color:T.muted}}>{d.l}</span></div>)}</div>;
};

const SectionHeader = ({title,T,action,onAction}) => (
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
    <h2 style={{margin:0,fontSize:22,fontFamily:"'Playfair Display',serif",color:T.text}}>{title}</h2>
    {action&&<Btn onClick={onAction} T={T}>{action}</Btn>}
  </div>
);

// ── Image Upload ───────────────────────────────────────────────
function ImageUpload({value,onChange,label,T,size=100}) {
  const ref=useRef();
  const handle=async(e)=>{ const f=e.target.files[0]; if(!f) return; if(f.size>3*1024*1024){alert("Max 3MB");return;} onChange(await readFile(f)); };
  return (
    <div style={{marginBottom:14}}>
      {label&&<FL T={T}>{label}</FL>}
      <div style={{display:"flex",alignItems:"center",gap:14}}>
        <div onClick={()=>ref.current.click()} style={{width:size,height:size,borderRadius:12,border:`2px dashed ${value?T.teal:T.border}`,background:value?"transparent":T.tableBg,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",overflow:"hidden",flexShrink:0}}>
          {value?<img src={value} alt="upload" style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<div style={{textAlign:"center",padding:8}}><div style={{fontSize:24}}>📷</div><div style={{fontSize:10,color:T.muted}}>Upload</div></div>}
        </div>
        <div>
          <Btn small T={T} variant="secondary" onClick={()=>ref.current.click()}>{value?"Change":"Upload"}</Btn>
          {value&&<button onClick={()=>onChange(null)} style={{marginLeft:8,background:"none",border:"none",color:T.red,fontSize:12,cursor:"pointer",fontWeight:600}}>Remove</button>}
        </div>
      </div>
      <input ref={ref} type="file" accept="image/*" onChange={handle} style={{display:"none"}}/>
    </div>
  );
}

// ── LOGIN ──────────────────────────────────────────────────────
function LoginScreen({onLogin,T}) {
  const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
  const [error,setError]=useState(""); const [loading,setLoading]=useState(false); const [showPw,setShowPw]=useState(false);
  const handle=()=>{ setError(""); if(!email||!password){setError("Fill all fields.");return;} setLoading(true);
    setTimeout(()=>{ if(email==="admin@pickybasket.com"&&password==="picky2024") onLogin(); else{setError("Invalid credentials. Try admin@pickybasket.com / picky2024");setLoading(false);}},900); };
  return (
    <div style={{minHeight:"100vh",background:T.navy,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans',sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600;700;800&display=swap');@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}*{box-sizing:border-box}`}</style>
      <div style={{width:"100%",maxWidth:420,padding:20,animation:"fadeUp 0.5s ease"}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <img src={logo} alt="Picky Basket" style={{width:72,height:72,borderRadius:18,margin:"0 auto 14px",display:"block",objectFit:"contain"}}/>
          <h1 style={{color:"#fff",margin:"0 0 4px",fontSize:26,fontFamily:"'Playfair Display',serif"}}>Picky Basket</h1>
          <p style={{color:T.tealMid,margin:0,fontSize:14}}>Admin Portal</p>
        </div>
        <div style={{background:T.cardBg,borderRadius:20,padding:28,boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}}>
          <h2 style={{margin:"0 0 20px",fontSize:18,color:T.text,fontFamily:"'Playfair Display',serif"}}>Sign in to your account</h2>
          <Input label="Email" value={email} onChange={setEmail} type="email" placeholder="admin@pickybasket.com" T={T}/>
          <div style={{position:"relative"}}>
            <Input label="Password" value={password} onChange={setPassword} type={showPw?"text":"password"} placeholder="Password" T={T}/>
            <button onClick={()=>setShowPw(v=>!v)} style={{position:"absolute",right:10,top:30,background:"none",border:"none",cursor:"pointer",color:T.muted,fontSize:12}}>{showPw?"Hide":"Show"}</button>
          </div>
          {error&&<div style={{background:T.redL,color:T.red,padding:"10px 14px",borderRadius:10,fontSize:13,marginBottom:14}}>{error}</div>}
          <div style={{background:T.tealLight,borderRadius:10,padding:"10px 14px",fontSize:12,color:T.tealDark,marginBottom:16}}>💡 Demo: <b>admin@pickybasket.com</b> / <b>picky2024</b></div>
          <button onClick={handle} disabled={loading} style={{width:"100%",padding:"13px",borderRadius:12,border:"none",background:T.teal,color:"#fff",fontSize:15,fontWeight:700,cursor:loading?"not-allowed":"pointer",opacity:loading?0.7:1}}>{loading?"Signing in…":"Sign In →"}</button>
        </div>
      </div>
    </div>
  );
}

// ── DASHBOARD ─────────────────────────────────────────────────
function Dashboard({data,T}) {
  const weekData=[{l:"Mon",v:42},{l:"Tue",v:58},{l:"Wed",v:35},{l:"Thu",v:71},{l:"Fri",v:89},{l:"Sat",v:112},{l:"Sun",v:67}];
  const totalRevenue=data.orders.reduce((s,o)=>s+o.total,0);
  const pendingProducts=data.products.filter(p=>p.approvalStatus==="Pending").length;
  const openComplaints=data.complaints.filter(c=>c.status==="Open").length;
  const pendingPayouts=data.suppliers.reduce((s,x)=>s+x.pendingPayout,0);
  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div>
        <h1 style={{margin:"0 0 4px",fontSize:26,fontFamily:"'Playfair Display',serif",color:T.text}}>Good morning, Admin 👋</h1>
        <p style={{margin:0,color:T.muted,fontSize:14}}>Here's what's happening with The Picky Basket today.</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:14}}>
        <StatCard T={T} icon="🛒" label="Orders Today"      value={data.orders.length}       sub="↑ 12% vs yesterday" color={T.green}  bgColor={T.greenL}/>
        <StatCard T={T} icon="💰" label="Revenue Today"     value={`₵${totalRevenue}`}       sub="↑ 8% vs yesterday"/>
        <StatCard T={T} icon="🚴" label="Active Couriers"   value={data.couriers.filter(c=>c.status==="On Delivery").length} sub="On delivery" color={T.orange} bgColor={T.orangeL}/>
        <StatCard T={T} icon="⏳" label="Pending Payouts"   value={`₵${pendingPayouts.toLocaleString()}`} sub="Due this cycle" color="#d97706" bgColor={T.yellowL}/>
      </div>
      {pendingProducts>0&&<div style={{background:T.blueL,borderRadius:14,padding:"14px 18px",border:`1px solid ${T.blue}33`,display:"flex",alignItems:"center",gap:12}}><span style={{fontSize:20}}>📦</span><div><b style={{color:T.blue}}>{pendingProducts} supplier product{pendingProducts>1?"s":""} awaiting your approval</b><div style={{fontSize:12,color:T.muted,marginTop:2}}>Go to Products → Supplier Submissions to review</div></div></div>}
      {openComplaints>0&&<div style={{background:T.orangeL,borderRadius:14,padding:"14px 18px",border:`1px solid ${T.orange}33`,display:"flex",alignItems:"center",gap:12}}><span style={{fontSize:20}}>⚠️</span><div><b style={{color:T.orange}}>{openComplaints} open customer complaint{openComplaints>1?"s":""}</b><div style={{fontSize:12,color:T.muted,marginTop:2}}>Go to Complaints to review and respond</div></div></div>}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <Card T={T}><div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:14}}>Orders This Week</div><BarChart data={weekData} T={T}/></Card>
        <Card T={T}>
          <div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:14}}>Top Suppliers by Revenue</div>
          {data.suppliers.sort((a,b)=>b.revenue-a.revenue).slice(0,4).map(s=>(
            <div key={s.id} style={{marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                <span style={{fontSize:13,color:T.text}}>{s.name}</span>
                <span style={{fontSize:11,color:T.muted,fontWeight:600}}>₵{s.revenue.toLocaleString()}</span>
              </div>
              <div style={{height:5,background:T.border,borderRadius:3,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${Math.min((s.revenue/20000)*100,100)}%`,background:T.teal,borderRadius:3}}/>
              </div>
            </div>
          ))}
        </Card>
      </div>
      <Card T={T}>
        <SectionHeader title="Recent Orders" T={T}/>
        <Table T={T} cols={["Order","Customer","Items","Total","Status","Courier","Zone"]} rows={data.orders.slice(0,5)}
          renderRow={r=><>
            <Td style={{fontWeight:700,color:T.teal}}>{r.id}</Td>
            <Td style={{color:T.text,fontWeight:500}}>{r.customer}</Td>
            <Td style={{color:T.muted}}>{r.items.length} item{r.items.length>1?"s":""}</Td>
            <Td style={{fontWeight:700,color:T.text}}>₵{r.total}</Td>
            <Td><Badge label={r.status} T={T}/></Td>
            <Td style={{color:T.muted,fontSize:12}}>{r.courier}</Td>
            <Td style={{color:T.muted,fontSize:12}}>{r.zone}</Td>
          </>}/>
      </Card>
    </div>
  );
}

// ── ORDERS ────────────────────────────────────────────────────
function Orders({data,setData,addLog,toast,T}) {
  const [filter,setFilter]=useState("All"); const [selected,setSelected]=useState(null);
  const statuses=["All","Pending","Packing","Delivering","Delivered","Cancelled"];
  const filtered=filter==="All"?data.orders:data.orders.filter(o=>o.status===filter);

  const updateStatus=(id,s)=>{ setData(d=>({...d,orders:d.orders.map(o=>o.id===id?{...o,status:s}:o)})); addLog("Changed order status",`${id} → ${s}`); toast(`Order ${id} → ${s}`); if(selected?.id===id) setSelected(sel=>({...sel,status:s})); };
  const assignCourier=(id,courierId)=>{ const c=data.couriers.find(x=>x.id===courierId); setData(d=>({...d,orders:d.orders.map(o=>o.id===id?{...o,courierId,courier:c?c.name:"—"}:o)})); toast(`Courier assigned`); if(selected?.id===id) setSelected(sel=>({...sel,courierId,courier:c?.name||"—"})); };

  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <SectionHeader title="Order Management" T={T}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:12}}>
        {["Pending","Packing","Delivering","Delivered","Cancelled"].map(s=>(
          <StatCard key={s} T={T} icon={{"Pending":"🟣","Packing":"📦","Delivering":"🚴","Delivered":"✅","Cancelled":"❌"}[s]} label={s} value={data.orders.filter(o=>o.status===s).length}/>
        ))}
      </div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        {statuses.map(s=><button key={s} onClick={()=>setFilter(s)} style={{padding:"7px 16px",borderRadius:20,border:"none",cursor:"pointer",background:filter===s?T.teal:T.cardBg,color:filter===s?"#fff":T.muted,fontWeight:filter===s?700:400,fontSize:12,boxShadow:`0 1px 4px rgba(0,0,0,0.06)`}}>{s}</button>)}
      </div>
      <Card T={T}>
        <Table T={T} cols={["Order","Customer","Items","Total","Status","Courier","Zone","Time","Actions"]} rows={filtered}
          renderRow={r=><>
            <Td style={{fontWeight:700,color:T.teal}}>{r.id}</Td>
            <Td style={{fontWeight:500,color:T.text}}>{r.customer}</Td>
            <Td style={{color:T.muted,fontSize:12}}>{r.items.map(i=>`${i.name}×${i.qty}`).join(", ")}</Td>
            <Td style={{fontWeight:700}}>₵{r.total}</Td>
            <Td><Badge label={r.status} T={T}/></Td>
            <Td style={{fontSize:12,color:T.muted}}>{r.courier}</Td>
            <Td style={{fontSize:12,color:T.muted}}>{r.zone}</Td>
            <Td style={{fontSize:11,color:T.muted}}>{r.time}</Td>
            <Td><Btn small T={T} variant="secondary" onClick={()=>setSelected(r)}>View</Btn></Td>
          </>}/>
      </Card>
      {selected&&(
        <Modal title={`Order ${selected.id}`} onClose={()=>setSelected(null)} T={T} wide>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
            <div>
              <div style={{background:T.tableBg,borderRadius:12,padding:14,marginBottom:14}}>
                <FL T={T}>Order Items</FL>
                {selected.items.map((item,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:`1px solid ${T.border}`,fontSize:13}}>
                    <span>{item.name} × {item.qty}</span><span style={{fontWeight:700,color:T.teal}}>₵{item.price*item.qty}</span>
                  </div>
                ))}
                <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0 0",fontWeight:800,fontSize:14}}><span>Total</span><span style={{color:T.teal}}>₵{selected.total}</span></div>
              </div>
              <div style={{background:T.tableBg,borderRadius:12,padding:14}}>
                <FL T={T}>Delivery Info</FL>
                {[["Customer",selected.customer],["Address",selected.address],["Zone",selected.zone],["Note",selected.note||"—"]].map(([k,v])=>(
                  <div key={k} style={{display:"flex",gap:10,marginBottom:6,fontSize:13}}><span style={{color:T.muted,minWidth:70}}>{k}:</span><span style={{fontWeight:500}}>{v}</span></div>
                ))}
              </div>
            </div>
            <div>
              <FL T={T}>Update Status</FL>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:14}}>
                {["Pending","Packing","Delivering","Delivered","Cancelled"].map(s=>(
                  <button key={s} onClick={()=>updateStatus(selected.id,s)} style={{padding:"9px",borderRadius:10,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,background:selected.status===s?T.teal:T.tableBg,color:selected.status===s?"#fff":T.text}}>{s}</button>
                ))}
              </div>
              <FL T={T}>Assign Courier</FL>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {data.couriers.map(c=>(
                  <div key={c.id} onClick={()=>assignCourier(selected.id,c.id)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 12px",borderRadius:10,cursor:"pointer",border:`2px solid ${selected.courierId===c.id?T.teal:T.border}`,background:selected.courierId===c.id?T.tealLight:T.tableBg}}>
                    <div style={{fontSize:13,fontWeight:500}}>{c.name} · {c.zone}</div>
                    <Badge label={c.status} T={T}/>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{marginTop:16,paddingTop:16,borderTop:`1px solid ${T.border}`,display:"flex",gap:10}}>
            <Btn T={T} variant="ghost" onClick={()=>setSelected(null)}>Close</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── PRODUCTS ──────────────────────────────────────────────────
function Products({data,setData,addLog,toast,T}) {
  const [tab,setTab]=useState("All Products");
  const [search,setSearch]=useState(""); const [showAdd,setShowAdd]=useState(false);
  const [editing,setEditing]=useState(null); const [selected,setSelected]=useState(null);
  const emptyForm={name:"",category:"Vegetables",price:"",unit:"kg",stock:"",supplier:"",image:null,description:""};
  const [form,setForm]=useState(emptyForm);

  const filtered=data.products.filter(p=>{
    const ms=p.name.toLowerCase().includes(search.toLowerCase());
    const mt=tab==="All Products"||tab==="Pending Approval"?p.approvalStatus==="Pending":true;
    return tab==="Pending Approval"?ms&&mt:ms;
  });

  const openAdd=()=>{setForm(emptyForm);setEditing(null);setShowAdd(true);};
  const openEdit=(p)=>{setForm({...p,price:String(p.price),stock:String(p.stock)});setEditing(p.id);setShowAdd(true);};

  const save=()=>{
    if(!form.name||!form.price||!form.stock){alert("Fill name, price, stock.");return;}
    const n=parseInt(form.stock); const updated={...form,price:parseFloat(form.price),stock:n,status:stockStatus(n),approvalStatus:editing?form.approvalStatus:"Approved"};
    if(editing){ setData(d=>({...d,products:d.products.map(p=>p.id===editing?{...p,...updated}:p)})); addLog("Updated product",form.name); toast(`${form.name} updated`); }
    else { setData(d=>({...d,products:[...d.products,{...updated,id:Date.now()}]})); addLog("Added product",form.name); toast(`${form.name} added`); }
    setShowAdd(false);
  };

  const approveProduct=(id)=>{ setData(d=>({...d,products:d.products.map(p=>p.id===id?{...p,approvalStatus:"Approved"}:p)})); addLog("Approved product",data.products.find(p=>p.id===id)?.name); toast("Product approved"); };
  const rejectProduct=(id,reason)=>{ setData(d=>({...d,products:d.products.map(p=>p.id===id?{...p,approvalStatus:"Rejected",rejectionReason:reason}:p)})); addLog("Rejected product",data.products.find(p=>p.id===id)?.name); toast("Product rejected"); };
  const remove=(p)=>{ if(!window.confirm(`Delete "${p.name}"?`)) return; setData(d=>({...d,products:d.products.filter(x=>x.id!==p.id)})); addLog("Deleted product",p.name); toast(`${p.name} deleted`); };

  const pending=data.products.filter(p=>p.approvalStatus==="Pending");

  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <SectionHeader title="Products & Inventory" T={T} action="+ Add Product" onAction={openAdd}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:12}}>
        <StatCard T={T} icon="📦" label="Total"        value={data.products.length}/>
        <StatCard T={T} icon="✅" label="In Stock"      value={data.products.filter(p=>p.status==="In Stock").length}     bgColor={T.greenL}  color={T.green}/>
        <StatCard T={T} icon="⚠️" label="Low Stock"    value={data.products.filter(p=>p.status==="Low Stock").length}    bgColor={T.yellowL} color="#d97706"/>
        <StatCard T={T} icon="❌" label="Out of Stock" value={data.products.filter(p=>p.status==="Out of Stock").length} bgColor={T.redL}    color={T.red}/>
        <StatCard T={T} icon="⏳" label="Pending"      value={pending.length} bgColor={T.blueL} color={T.blue}/>
      </div>

      {pending.length>0&&(
        <div style={{background:T.blueL,borderRadius:14,padding:"14px 18px",border:`1px solid ${T.blue}33`}}>
          <div style={{fontWeight:700,color:T.blue,marginBottom:10}}>⏳ {pending.length} Supplier Submission{pending.length>1?"s":""} Awaiting Review</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {pending.map(p=>(
              <div key={p.id} style={{background:T.cardBg,borderRadius:12,padding:"12px 14px",display:"flex",alignItems:"center",gap:14}}>
                <div style={{width:44,height:44,borderRadius:10,background:T.tealLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0,overflow:"hidden"}}>
                  {p.image?<img src={p.image} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:CAT_ICONS[p.category]||"📦"}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:13,color:T.text}}>{p.name}</div>
                  <div style={{fontSize:11,color:T.muted}}>{p.supplier} · {p.category} · ₵{p.price}/{p.unit}</div>
                  {p.description&&<div style={{fontSize:11,color:T.muted,marginTop:2}}>{p.description}</div>}
                </div>
                <div style={{display:"flex",gap:6}}>
                  <Btn small T={T} variant="secondary" onClick={()=>openEdit(p)}>Edit & Approve</Btn>
                  <Btn small T={T} onClick={()=>approveProduct(p.id)}>✓ Approve</Btn>
                  <Btn small T={T} variant="danger" onClick={()=>{ const r=window.prompt("Rejection reason:"); if(r) rejectProduct(p.id,r); }}>✗ Reject</Btn>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Card T={T}>
        <div style={{display:"flex",gap:10,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search products…"
            style={{flex:1,minWidth:160,padding:"9px 14px",borderRadius:10,border:`1.5px solid ${T.border}`,background:T.inputBg,color:T.text,fontSize:13,outline:"none"}}/>
          {["All Products","Pending Approval"].map(t=><button key={t} onClick={()=>setTab(t)} style={{padding:"7px 14px",borderRadius:20,border:"none",cursor:"pointer",fontSize:11,fontWeight:600,background:tab===t?T.teal:T.tableBg,color:tab===t?"#fff":T.muted}}>{t}</button>)}
        </div>
        <Table T={T} cols={["","Product","Category","Price","Stock","Status","Supplier","Approval","Actions"]}
          rows={tab==="Pending Approval"?pending:data.products.filter(p=>p.name.toLowerCase().includes(search.toLowerCase()))}
          renderRow={r=><>
            <Td><div style={{width:36,height:36,borderRadius:8,overflow:"hidden",background:T.tealLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{r.image?<img src={r.image} alt={r.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:CAT_ICONS[r.category]||"📦"}</div></Td>
            <Td style={{fontWeight:600,color:T.text}}>{r.name}</Td>
            <Td style={{color:T.muted,fontSize:12}}>{r.category}</Td>
            <Td style={{fontWeight:700,color:T.teal}}>₵{r.price}/{r.unit}</Td>
            <Td style={{color:r.stock===0?T.red:r.stock<10?"#d97706":T.green,fontWeight:700}}>{r.stock}</Td>
            <Td><Badge label={r.status} T={T}/></Td>
            <Td style={{color:T.muted,fontSize:12}}>{r.supplier}</Td>
            <Td><Badge label={r.approvalStatus} T={T}/></Td>
            <Td><div style={{display:"flex",gap:6}}>
              <Btn small T={T} variant="secondary" onClick={()=>openEdit(r)}>Edit</Btn>
              <Btn small T={T} variant="danger" onClick={()=>remove(r)}>Del</Btn>
            </div></Td>
          </>}/>
      </Card>

      {showAdd&&(
        <Modal title={editing?"Edit Product":"Add New Product"} onClose={()=>setShowAdd(false)} T={T} wide>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 16px"}}>
            <div>
              <ImageUpload label="Product Image" value={form.image} onChange={v=>setForm(f=>({...f,image:v}))} T={T} size={110}/>
              <Input label="Product Name" value={form.name} onChange={v=>setForm(f=>({...f,name:v}))} T={T} placeholder="e.g. Fresh Tomatoes"/>
              <Input label="Description" value={form.description||""} onChange={v=>setForm(f=>({...f,description:v}))} T={T} placeholder="Brief product description…" textarea/>
              <Input label="Supplier" value={form.supplier} onChange={v=>setForm(f=>({...f,supplier:v}))} T={T} placeholder="Supplier name"/>
            </div>
            <div>
              <Input label="Category" value={form.category} onChange={v=>setForm(f=>({...f,category:v}))} T={T} options={CATEGORIES}/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <Input label="Price (₵)" value={form.price} onChange={v=>setForm(f=>({...f,price:v}))} T={T} type="number" placeholder="0.00"/>
                <Input label="Unit" value={form.unit} onChange={v=>setForm(f=>({...f,unit:v}))} T={T} options={UNITS}/>
              </div>
              <Input label="Stock Qty" value={form.stock} onChange={v=>setForm(f=>({...f,stock:v}))} T={T} type="number" placeholder="0"/>
              {editing&&<Input label="Approval Status" value={form.approvalStatus||"Approved"} onChange={v=>setForm(f=>({...f,approvalStatus:v}))} T={T} options={["Approved","Pending","Rejected"]}/>}
            </div>
          </div>
          <div style={{display:"flex",gap:10,marginTop:8,paddingTop:14,borderTop:`1px solid ${T.border}`}}>
            <Btn T={T} onClick={save}>{editing?"Save Changes":"Add Product"}</Btn>
            <Btn T={T} variant="ghost" onClick={()=>setShowAdd(false)}>Cancel</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── SUPPLIERS ─────────────────────────────────────────────────
function Suppliers({data,setData,addLog,toast,T}) {
  const [selected,setSelected]=useState(null); const [editingSupplier,setEditingSupplier]=useState(null);
  const [msgSupplier,setMsgSupplier]=useState(null); const [msgText,setMsgText]=useState("");

  const approve=(id)=>{ setData(d=>({...d,suppliers:d.suppliers.map(s=>s.id===id?{...s,status:"Active"}:s)})); const s=data.suppliers.find(x=>x.id===id); addLog("Approved supplier",s.name); toast(`${s.name} approved`); };
  const suspend=(id)=>{ setData(d=>({...d,suppliers:d.suppliers.map(s=>s.id===id?{...s,status:"Review"}:s)})); const s=data.suppliers.find(x=>x.id===id); addLog("Suspended supplier",s.name); toast(`${s.name} suspended`); };
  const saveEdit=()=>{ setData(d=>({...d,suppliers:d.suppliers.map(s=>s.id===editingSupplier.id?editingSupplier:s)})); toast("Supplier updated"); addLog("Updated supplier",editingSupplier.name); setEditingSupplier(null); };
  const processPayout=(id)=>{ const s=data.suppliers.find(x=>x.id===id); setData(d=>({...d,suppliers:d.suppliers.map(x=>x.id===id?{...x,pendingPayout:0}:x)})); addLog("Processed payout",`${s.name} ₵${s.pendingPayout}`); toast(`₵${s.pendingPayout} paid to ${s.name}`); };
  const sendMsg=()=>{ if(!msgText.trim()) return; toast(`Message sent to ${msgSupplier.name}`); addLog("Sent message to supplier",msgSupplier.name); setMsgSupplier(null); setMsgText(""); };

  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <SectionHeader title="Supplier Management" T={T} action="+ Invite Supplier" onAction={()=>toast("Invite link copied")}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12}}>
        <StatCard T={T} icon="🏪" label="Total"       value={data.suppliers.length}/>
        <StatCard T={T} icon="✅" label="Active"       value={data.suppliers.filter(s=>s.status==="Active").length} bgColor={T.greenL} color={T.green}/>
        <StatCard T={T} icon="🔍" label="Under Review" value={data.suppliers.filter(s=>s.status==="Review").length} bgColor={T.yellowL} color="#d97706"/>
        <StatCard T={T} icon="💰" label="Pending Payouts" value={`₵${data.suppliers.reduce((s,x)=>s+x.pendingPayout,0).toLocaleString()}`} bgColor={T.orangeL} color={T.orange}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:14}}>
        {data.suppliers.map(s=>(
          <Card key={s.id} T={T}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:44,height:44,borderRadius:12,background:T.tealLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{CAT_ICONS[s.category]||"🏪"}</div>
                <div><div style={{fontWeight:700,fontSize:14,color:T.text}}>{s.name}</div><div style={{fontSize:11,color:T.muted}}>{s.brandType} · {s.category}</div><div style={{fontSize:11,color:T.muted}}>{s.email}</div></div>
              </div>
              <Badge label={s.status} T={T}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:10}}>
              {[[s.orders,"Orders"],[`₵${s.revenue.toLocaleString()}`,"Revenue"],[`⭐ ${s.rating}`,"Rating"]].map(([v,l])=>(
                <div key={l} style={{textAlign:"center",padding:"7px 4px",background:T.tableBg,borderRadius:8}}><div style={{fontSize:12,fontWeight:700,color:T.text}}>{v}</div><div style={{fontSize:10,color:T.muted}}>{l}</div></div>
              ))}
            </div>
            {/* Pending payout banner */}
            {s.pendingPayout>0&&<div style={{background:T.yellowL,borderRadius:8,padding:"8px 10px",marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:12,color:"#92400e",fontWeight:600}}>Payout due: ₵{s.pendingPayout.toLocaleString()}</span>
              <Btn small T={T} onClick={()=>processPayout(s.id)}>Pay Now</Btn>
            </div>}
            {/* Documents */}
            <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:10}}>
              {s.documents.map((d,i)=><span key={i} style={{fontSize:10,padding:"2px 8px",borderRadius:10,fontWeight:600,...statusColor(d.status,T)}}>{d.name}: {d.status}</span>)}
            </div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              <Btn small T={T} variant="secondary" onClick={()=>setSelected(s)}>View</Btn>
              <Btn small T={T} variant="ghost" onClick={()=>setEditingSupplier({...s})}>Edit</Btn>
              <Btn small T={T} variant="ghost" onClick={()=>setMsgSupplier(s)}>Message</Btn>
              {s.status==="Review"?<Btn small T={T} onClick={()=>approve(s.id)}>✓ Approve</Btn>:<Btn small T={T} variant="danger" onClick={()=>suspend(s.id)}>Suspend</Btn>}
            </div>
          </Card>
        ))}
      </div>

      {/* View supplier detail */}
      {selected&&(
        <Modal title={selected.name} onClose={()=>setSelected(null)} T={T} wide>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
            {[["Email",selected.email],["Phone",selected.phone],["Category",selected.category],["Brand Type",selected.brandType],["Joined",selected.joined],["Rating",`⭐ ${selected.rating}`],["Status",selected.status],["Payout Method",selected.bankDetails?.method],["Account #",selected.bankDetails?.number],["Account Name",selected.bankDetails?.name]].map(([k,v])=>(
              <div key={k} style={{background:T.tableBg,borderRadius:10,padding:"10px 12px"}}><div style={{fontSize:10,color:T.muted,marginBottom:2}}>{k}</div><div style={{fontSize:13,fontWeight:600,color:T.text}}>{v||"—"}</div></div>
            ))}
          </div>
          <FL T={T}>Products by this supplier</FL>
          <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:16}}>
            {data.products.filter(p=>p.supplier===selected.name).map(p=>(
              <span key={p.id} style={{fontSize:12,padding:"4px 10px",borderRadius:10,border:`1px solid ${T.border}`,background:T.tableBg,color:T.text}}>{CAT_ICONS[p.category]} {p.name} · ₵{p.price}</span>
            ))}
          </div>
          <Btn T={T} variant="ghost" onClick={()=>setSelected(null)}>Close</Btn>
        </Modal>
      )}

      {/* Edit supplier */}
      {editingSupplier&&(
        <Modal title={`Edit — ${editingSupplier.name}`} onClose={()=>setEditingSupplier(null)} T={T} wide>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 16px"}}>
            <Input label="Business Name" value={editingSupplier.name} onChange={v=>setEditingSupplier(s=>({...s,name:v}))} T={T}/>
            <Input label="Email" value={editingSupplier.email} onChange={v=>setEditingSupplier(s=>({...s,email:v}))} T={T}/>
            <Input label="Phone" value={editingSupplier.phone} onChange={v=>setEditingSupplier(s=>({...s,phone:v}))} T={T}/>
            <Input label="Category" value={editingSupplier.category} onChange={v=>setEditingSupplier(s=>({...s,category:v}))} T={T} options={CATEGORIES}/>
            <Input label="Status" value={editingSupplier.status} onChange={v=>setEditingSupplier(s=>({...s,status:v}))} T={T} options={["Active","Review"]}/>
            <Input label="Rating (0–5)" value={String(editingSupplier.rating)} onChange={v=>setEditingSupplier(s=>({...s,rating:parseFloat(v)||0}))} T={T} type="number"/>
          </div>
          <div style={{display:"flex",gap:10,paddingTop:14,borderTop:`1px solid ${T.border}`}}>
            <Btn T={T} onClick={saveEdit}>Save Changes</Btn>
            <Btn T={T} variant="ghost" onClick={()=>setEditingSupplier(null)}>Cancel</Btn>
          </div>
        </Modal>
      )}

      {/* Message supplier */}
      {msgSupplier&&(
        <Modal title={`Message ${msgSupplier.name}`} onClose={()=>setMsgSupplier(null)} T={T}>
          <Input label="Message" value={msgText} onChange={setMsgText} T={T} placeholder="Type your message to this supplier…" textarea/>
          <div style={{display:"flex",gap:10}}><Btn T={T} onClick={sendMsg}>Send Message</Btn><Btn T={T} variant="ghost" onClick={()=>setMsgSupplier(null)}>Cancel</Btn></div>
        </Modal>
      )}
    </div>
  );
}

// ── COURIERS ──────────────────────────────────────────────────
function Couriers({data,setData,addLog,toast,T}) {
  const [adding,setAdding]=useState(false); const [editing,setEditing]=useState(null);
  const [form,setForm]=useState({name:"",zone:"Cantonments",phone:"",email:"",vehicle:"Motorbike",status:"Available"});

  const updateStatus=(id,status)=>{ setData(d=>({...d,couriers:d.couriers.map(c=>c.id===id?{...c,status}:c)})); const c=data.couriers.find(c=>c.id===id); addLog("Updated courier status",`${c.name} → ${status}`); toast(`${c.name} → ${status}`); };
  const addCourier=()=>{ if(!form.name) return; setData(d=>({...d,couriers:[...d.couriers,{...form,id:Date.now(),deliveries:0,rating:5.0,earnings:0,joined:"Mar 2026"}]})); addLog("Added courier",form.name); toast(`${form.name} added`); setAdding(false); setForm({name:"",zone:"Cantonments",phone:"",email:"",vehicle:"Motorbike",status:"Available"}); };
  const saveEdit=()=>{ setData(d=>({...d,couriers:d.couriers.map(c=>c.id===editing.id?editing:c)})); toast("Courier updated"); addLog("Updated courier",editing.name); setEditing(null); };
  const remove=(c)=>{ if(!window.confirm(`Remove ${c.name}?`)) return; setData(d=>({...d,couriers:d.couriers.filter(x=>x.id!==c.id)})); addLog("Removed courier",c.name); toast(`${c.name} removed`); };

  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <SectionHeader title="Courier Management" T={T} action="+ Add Courier" onAction={()=>setAdding(true)}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12}}>
        <StatCard T={T} icon="🚴" label="Total"       value={data.couriers.length}/>
        <StatCard T={T} icon="📦" label="On Delivery" value={data.couriers.filter(c=>c.status==="On Delivery").length} bgColor={T.blueL}  color={T.blue}/>
        <StatCard T={T} icon="✅" label="Available"   value={data.couriers.filter(c=>c.status==="Available").length}   bgColor={T.greenL} color={T.green}/>
        <StatCard T={T} icon="🌙" label="Off Duty"    value={data.couriers.filter(c=>c.status==="Off Duty").length}    bgColor={T.border} color={T.muted}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:14}}>
        {data.couriers.map(c=>(
          <Card key={c.id} T={T}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:44,height:44,borderRadius:"50%",background:`hsl(${c.id*60},55%,65%)`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:15,color:"#fff",flexShrink:0}}>{c.name.split(" ").map(n=>n[0]).join("")}</div>
                <div><div style={{fontWeight:700,color:T.text}}>{c.name}</div><div style={{fontSize:11,color:T.muted}}>{c.zone} · {c.vehicle}</div><div style={{fontSize:11,color:T.muted}}>{c.phone}</div></div>
              </div>
              <Badge label={c.status} T={T}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:12}}>
              {[[c.deliveries,"Deliveries"],[`⭐ ${c.rating}`,"Rating"],[`₵${c.earnings}`,"Earned"]].map(([v,l])=>(
                <div key={l} style={{textAlign:"center",padding:"7px 4px",background:T.tableBg,borderRadius:8}}><div style={{fontSize:12,fontWeight:700,color:T.text}}>{v}</div><div style={{fontSize:10,color:T.muted}}>{l}</div></div>
              ))}
            </div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>
              {["Available","On Delivery","Off Duty"].map(s=><button key={s} onClick={()=>updateStatus(c.id,s)} style={{padding:"5px 10px",borderRadius:8,border:"none",cursor:"pointer",fontSize:11,fontWeight:600,background:c.status===s?T.teal:T.tableBg,color:c.status===s?"#fff":T.muted}}>{s}</button>)}
            </div>
            <div style={{display:"flex",gap:6}}>
              <Btn small T={T} variant="secondary" onClick={()=>setEditing({...c})}>Edit</Btn>
              <Btn small T={T} variant="danger" onClick={()=>remove(c)}>Remove</Btn>
            </div>
          </Card>
        ))}
      </div>

      {adding&&(
        <Modal title="Add New Courier" onClose={()=>setAdding(false)} T={T}>
          <Input label="Full Name" value={form.name} onChange={v=>setForm(f=>({...f,name:v}))} T={T} placeholder="e.g. Kwame Adusei"/>
          <Input label="Phone" value={form.phone} onChange={v=>setForm(f=>({...f,phone:v}))} T={T} placeholder="+233 XX XXX XXXX"/>
          <Input label="Email" value={form.email} onChange={v=>setForm(f=>({...f,email:v}))} T={T} placeholder="courier@email.com"/>
          <Input label="Zone" value={form.zone} onChange={v=>setForm(f=>({...f,zone:v}))} T={T} options={ZONES}/>
          <Input label="Vehicle" value={form.vehicle} onChange={v=>setForm(f=>({...f,vehicle:v}))} T={T} options={["Motorbike","Bicycle","Car","On Foot"]}/>
          <div style={{display:"flex",gap:10}}><Btn T={T} onClick={addCourier}>Add Courier</Btn><Btn T={T} variant="ghost" onClick={()=>setAdding(false)}>Cancel</Btn></div>
        </Modal>
      )}
      {editing&&(
        <Modal title={`Edit — ${editing.name}`} onClose={()=>setEditing(null)} T={T}>
          <Input label="Full Name" value={editing.name} onChange={v=>setEditing(e=>({...e,name:v}))} T={T}/>
          <Input label="Phone" value={editing.phone} onChange={v=>setEditing(e=>({...e,phone:v}))} T={T}/>
          <Input label="Email" value={editing.email||""} onChange={v=>setEditing(e=>({...e,email:v}))} T={T}/>
          <Input label="Zone" value={editing.zone} onChange={v=>setEditing(e=>({...e,zone:v}))} T={T} options={ZONES}/>
          <Input label="Vehicle" value={editing.vehicle||"Motorbike"} onChange={v=>setEditing(e=>({...e,vehicle:v}))} T={T} options={["Motorbike","Bicycle","Car","On Foot"]}/>
          <Input label="Status" value={editing.status} onChange={v=>setEditing(e=>({...e,status:v}))} T={T} options={["Available","On Delivery","Off Duty"]}/>
          <div style={{display:"flex",gap:10}}><Btn T={T} onClick={saveEdit}>Save</Btn><Btn T={T} variant="ghost" onClick={()=>setEditing(null)}>Cancel</Btn></div>
        </Modal>
      )}
    </div>
  );
}

// ── CUSTOMERS ─────────────────────────────────────────────────
function Customers({data,setData,toast,T}) {
  const [search,setSearch]=useState(""); const [selected,setSelected]=useState(null);
  const filtered=data.customers.filter(c=>c.name.toLowerCase().includes(search.toLowerCase())||c.email.toLowerCase().includes(search.toLowerCase()));
  const toggleStatus=(id)=>{ setData(d=>({...d,customers:d.customers.map(c=>c.id===id?{...c,status:c.status==="Active"?"Inactive":"Active"}:c)})); toast("Customer status updated"); };
  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <SectionHeader title="Customer Management" T={T}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12}}>
        <StatCard T={T} icon="👥" label="Total"        value={data.customers.length}/>
        <StatCard T={T} icon="✅" label="Active"       value={data.customers.filter(c=>c.status==="Active").length} bgColor={T.greenL} color={T.green}/>
        <StatCard T={T} icon="💤" label="Inactive"     value={data.customers.filter(c=>c.status==="Inactive").length} bgColor={T.border} color={T.muted}/>
        <StatCard T={T} icon="💰" label="Total Spent"  value={`₵${data.customers.reduce((s,c)=>s+c.spent,0).toLocaleString()}`}/>
      </div>
      <Card T={T}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search customers…"
          style={{width:"100%",padding:"9px 14px",borderRadius:10,border:`1.5px solid ${T.border}`,background:T.inputBg,color:T.text,fontSize:13,outline:"none",marginBottom:14,boxSizing:"border-box"}}/>
        <Table T={T} cols={["Customer","Email","Plan","Orders","Spent","Joined","Status","Actions"]} rows={filtered}
          renderRow={r=><>
            <Td><div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:30,height:30,borderRadius:"50%",background:T.tealLight,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:11,color:T.teal,flexShrink:0}}>{r.name.split(" ").map(n=>n[0]).join("")}</div><span style={{fontWeight:600,color:T.text}}>{r.name}</span></div></Td>
            <Td style={{color:T.muted,fontSize:12}}>{r.email}</Td>
            <Td><Badge label={r.plan} T={T}/></Td>
            <Td style={{color:T.text}}>{r.orders}</Td>
            <Td style={{fontWeight:700,color:T.teal}}>₵{r.spent}</Td>
            <Td style={{color:T.muted,fontSize:12}}>{r.joined}</Td>
            <Td><Badge label={r.status} T={T}/></Td>
            <Td><div style={{display:"flex",gap:6}}>
              <Btn small T={T} variant="secondary" onClick={()=>setSelected(r)}>View</Btn>
              <Btn small T={T} variant="ghost" onClick={()=>toggleStatus(r.id)}>{r.status==="Active"?"Suspend":"Activate"}</Btn>
            </div></Td>
          </>}/>
      </Card>
      {selected&&(
        <Modal title={selected.name} onClose={()=>setSelected(null)} T={T}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
            {[["Email",selected.email],["Phone",selected.phone||"—"],["Plan",selected.plan],["Status",selected.status],["Orders",selected.orders],["Total Spent",`₵${selected.spent}`],["Member Since",selected.joined],["Address",selected.address||"—"]].map(([k,v])=>(
              <div key={k} style={{background:T.tableBg,borderRadius:10,padding:"10px 12px"}}><div style={{fontSize:10,color:T.muted,marginBottom:2}}>{k}</div><div style={{fontSize:13,fontWeight:600,color:T.text}}>{v}</div></div>
            ))}
          </div>
          <FL T={T}>Recent Orders</FL>
          <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:14}}>
            {data.orders.filter(o=>o.customer===selected.name).map(o=>(
              <div key={o.id} style={{display:"flex",justifyContent:"space-between",padding:"8px 12px",background:T.tableBg,borderRadius:10,fontSize:13}}>
                <span style={{fontWeight:600,color:T.teal}}>{o.id}</span>
                <span style={{color:T.muted}}>{o.items.map(i=>i.name).join(", ")}</span>
                <span style={{fontWeight:700}}>₵{o.total}</span>
                <Badge label={o.status} T={T}/>
              </div>
            ))}
          </div>
          <Btn T={T} variant="ghost" onClick={()=>setSelected(null)}>Close</Btn>
        </Modal>
      )}
    </div>
  );
}

// ── FINANCIALS ────────────────────────────────────────────────
function Financials({data,setData,addLog,toast,T}) {
  const monthData=[{l:"Aug",v:28.4},{l:"Sep",v:31.2},{l:"Oct",v:29.8},{l:"Nov",v:38.1},{l:"Dec",v:52.4},{l:"Jan",v:41.2},{l:"Feb",v:39.6},{l:"Mar",v:18.2}];
  const processPayout=(id)=>{ const s=data.suppliers.find(x=>x.id===id); setData(d=>({...d,suppliers:d.suppliers.map(x=>x.id===id?{...x,pendingPayout:0}:x)})); addLog("Processed payout",`${s.name} ₵${s.pendingPayout}`); toast(`₵${s.pendingPayout} sent to ${s.name}`); };
  const totalPending=data.suppliers.reduce((s,x)=>s+x.pendingPayout,0);
  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <SectionHeader title="Financials & Payouts" T={T} action="Export Report" onAction={()=>toast("Report exported")}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:12}}>
        <StatCard T={T} icon="📈" label="This Month"    value="₵18,200" sub="↑ 12% vs last month" color={T.green} bgColor={T.greenL}/>
        <StatCard T={T} icon="💳" label="Total Revenue" value="₵49,420" sub="All time"/>
        <StatCard T={T} icon="⏳" label="Pending Payouts" value={`₵${totalPending.toLocaleString()}`} sub="To suppliers" bgColor={T.yellowL} color="#d97706"/>
        <StatCard T={T} icon="🚴" label="Courier Earnings" value={`₵${data.couriers.reduce((s,c)=>s+c.earnings,0)}`} sub="This cycle"/>
      </div>
      <Card T={T}><div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:14}}>Monthly Revenue (₵k)</div><BarChart data={monthData} T={T}/></Card>
      <Card T={T}>
        <div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:14}}>Supplier Payouts</div>
        <Table T={T} cols={["Supplier","Category","Payment Method","Account","Amount Due","Actions"]}
          rows={data.suppliers.filter(s=>s.pendingPayout>0)}
          renderRow={r=><>
            <Td style={{fontWeight:600,color:T.text}}>{r.name}</Td>
            <Td style={{color:T.muted,fontSize:12}}>{r.category}</Td>
            <Td style={{fontSize:12,color:T.muted}}>{r.bankDetails?.method}</Td>
            <Td style={{fontSize:12,color:T.muted}}>{r.bankDetails?.number} · {r.bankDetails?.name}</Td>
            <Td style={{fontWeight:800,color:T.teal}}>₵{r.pendingPayout.toLocaleString()}</Td>
            <Td><Btn small T={T} onClick={()=>processPayout(r.id)}>Pay Now</Btn></Td>
          </>}/>
      </Card>
      <Card T={T}>
        <div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:14}}>Courier Earnings</div>
        <Table T={T} cols={["Courier","Zone","Vehicle","Deliveries","Earned","Status"]}
          rows={data.couriers}
          renderRow={r=><>
            <Td style={{fontWeight:600,color:T.text}}>{r.name}</Td>
            <Td style={{color:T.muted,fontSize:12}}>{r.zone}</Td>
            <Td style={{color:T.muted,fontSize:12}}>{r.vehicle||"—"}</Td>
            <Td>{r.deliveries}</Td>
            <Td style={{fontWeight:700,color:T.teal}}>₵{r.earnings}</Td>
            <Td><Badge label={r.status} T={T}/></Td>
          </>}/>
      </Card>
    </div>
  );
}

// ── COMPLAINTS ────────────────────────────────────────────────
function ComplaintsSection({data,setData,addLog,toast,T}) {
  const [selected,setSelected]=useState(null); const [response,setResponse]=useState("");
  const resolve=(id)=>{
    setData(d=>({...d,complaints:d.complaints.map(c=>c.id===id?{...c,status:"Resolved",response}:c)}));
    addLog("Resolved complaint",`Order ${selected.orderId}`); toast("Complaint resolved"); setSelected(null); setResponse("");
  };
  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <SectionHeader title="Customer Complaints" T={T}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12}}>
        <StatCard T={T} icon="⚠️" label="Total"    value={data.complaints.length}/>
        <StatCard T={T} icon="🔴" label="Open"     value={data.complaints.filter(c=>c.status==="Open").length}     bgColor={T.redL}   color={T.red}/>
        <StatCard T={T} icon="✅" label="Resolved" value={data.complaints.filter(c=>c.status==="Resolved").length} bgColor={T.greenL} color={T.green}/>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {data.complaints.map(c=>(
          <Card key={c.id} T={T}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
              <div>
                <div style={{fontWeight:700,fontSize:14,color:T.text}}>{c.product}</div>
                <div style={{fontSize:12,color:T.muted,marginTop:2}}>Order {c.orderId} · {c.customer} · Supplier: {c.supplier} · {c.date}</div>
              </div>
              <Badge label={c.status} T={T}/>
            </div>
            <div style={{background:T.redL,borderRadius:10,padding:"10px 14px",fontSize:13,color:T.red,marginBottom:10}}>{c.issue}</div>
            {c.response&&<div style={{background:T.greenL,borderRadius:10,padding:"10px 14px",fontSize:12,color:"#15803d",marginBottom:10}}>Response: {c.response}</div>}
            {c.status==="Open"&&<Btn small T={T} onClick={()=>{setSelected(c);setResponse("");}}>Respond & Resolve</Btn>}
          </Card>
        ))}
      </div>
      {selected&&(
        <Modal title="Respond to Complaint" onClose={()=>setSelected(null)} T={T}>
          <div style={{background:T.redL,borderRadius:10,padding:"10px 14px",fontSize:13,color:T.red,marginBottom:14}}>{selected.issue}</div>
          <Input label="Response to Customer" value={response} onChange={setResponse} T={T} placeholder="Explain resolution and next steps…" textarea/>
          <div style={{display:"flex",gap:10}}><Btn T={T} onClick={()=>resolve(selected.id)}>Resolve Complaint</Btn><Btn T={T} variant="ghost" onClick={()=>setSelected(null)}>Cancel</Btn></div>
        </Modal>
      )}
    </div>
  );
}

// ── PROMOTIONS & COUPONS ───────────────────────────────────────
function Promotions({data,setData,addLog,toast,T}) {
  const [showAdd,setShowAdd]=useState(false); const [editing,setEditing]=useState(null);
  const emptyForm={code:"",type:"Fixed",value:"",minOrder:"",limit:"",expiry:""};
  const [form,setForm]=useState(emptyForm);
  const openAdd=()=>{setForm(emptyForm);setEditing(null);setShowAdd(true);};
  const openEdit=(c)=>{setForm({...c,value:String(c.value),minOrder:String(c.minOrder),limit:String(c.limit)});setEditing(c.id);setShowAdd(true);};
  const save=()=>{
    if(!form.code||!form.expiry){alert("Fill code and expiry.");return;}
    const updated={...form,value:parseFloat(form.value)||0,minOrder:parseFloat(form.minOrder)||0,limit:parseInt(form.limit)||999,status:"Active"};
    if(editing){ setData(d=>({...d,coupons:d.coupons.map(c=>c.id===editing?{...c,...updated}:c)})); toast("Coupon updated"); addLog("Updated coupon",form.code); }
    else { setData(d=>({...d,coupons:[...d.coupons,{...updated,id:Date.now(),used:0}]})); toast(`Coupon ${form.code} created`); addLog("Created coupon",form.code); }
    setShowAdd(false);
  };
  const remove=(c)=>{ if(!window.confirm(`Delete coupon ${c.code}?`)) return; setData(d=>({...d,coupons:d.coupons.filter(x=>x.id!==c.id)})); toast(`${c.code} deleted`); };
  const toggle=(c)=>{ setData(d=>({...d,coupons:d.coupons.map(x=>x.id===c.id?{...x,status:x.status==="Active"?"Expired":"Active"}:x)})); toast(`${c.code} ${c.status==="Active"?"deactivated":"activated"}`); };
  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <SectionHeader title="Promotions & Coupons" T={T} action="+ Create Coupon" onAction={openAdd}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12}}>
        <StatCard T={T} icon="🎟️" label="Total"    value={data.coupons.length}/>
        <StatCard T={T} icon="✅" label="Active"   value={data.coupons.filter(c=>c.status==="Active").length}  bgColor={T.greenL} color={T.green}/>
        <StatCard T={T} icon="🔢" label="Total Used" value={data.coupons.reduce((s,c)=>s+c.used,0)}/>
        <StatCard T={T} icon="💸" label="Discount Given" value={`₵${data.coupons.filter(c=>c.type==="Fixed").reduce((s,c)=>s+c.used*c.value,0)}`} bgColor={T.orangeL} color={T.orange}/>
      </div>
      <Card T={T}>
        <Table T={T} cols={["Code","Type","Value","Min Order","Used/Limit","Expiry","Status","Actions"]} rows={data.coupons}
          renderRow={r=><>
            <Td style={{fontWeight:800,color:T.teal,letterSpacing:1}}>{r.code}</Td>
            <Td style={{color:T.muted,fontSize:12}}>{r.type}</Td>
            <Td style={{fontWeight:700}}>{r.type==="Percentage"?`${r.value}%`:r.type==="Free Delivery"?"Free":` ₵${r.value}`}</Td>
            <Td style={{color:T.muted,fontSize:12}}>₵{r.minOrder}+</Td>
            <Td><div style={{fontSize:12}}>{r.used}/{r.limit}<div style={{height:4,background:T.border,borderRadius:2,marginTop:3,overflow:"hidden"}}><div style={{height:"100%",width:`${(r.used/r.limit)*100}%`,background:T.teal,borderRadius:2}}/></div></div></Td>
            <Td style={{color:T.muted,fontSize:12}}>{r.expiry}</Td>
            <Td><Badge label={r.status} T={T}/></Td>
            <Td><div style={{display:"flex",gap:6}}>
              <Btn small T={T} variant="secondary" onClick={()=>openEdit(r)}>Edit</Btn>
              <Btn small T={T} variant="ghost" onClick={()=>toggle(r)}>{r.status==="Active"?"Disable":"Enable"}</Btn>
              <Btn small T={T} variant="danger" onClick={()=>remove(r)}>Del</Btn>
            </div></Td>
          </>}/>
      </Card>
      {showAdd&&(
        <Modal title={editing?"Edit Coupon":"Create Coupon"} onClose={()=>setShowAdd(false)} T={T}>
          <Input label="Coupon Code" value={form.code} onChange={v=>setForm(f=>({...f,code:v.toUpperCase()}))} T={T} placeholder="e.g. SAVE20"/>
          <Input label="Discount Type" value={form.type} onChange={v=>setForm(f=>({...f,type:v}))} T={T} options={["Fixed","Percentage","Free Delivery"]}/>
          {form.type!=="Free Delivery"&&<Input label={form.type==="Percentage"?"Discount %":"Discount Amount (₵)"} value={form.value} onChange={v=>setForm(f=>({...f,value:v}))} T={T} type="number" placeholder="0"/>}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <Input label="Min Order (₵)" value={form.minOrder} onChange={v=>setForm(f=>({...f,minOrder:v}))} T={T} type="number" placeholder="0"/>
            <Input label="Usage Limit" value={form.limit} onChange={v=>setForm(f=>({...f,limit:v}))} T={T} type="number" placeholder="100"/>
          </div>
          <Input label="Expiry Date" value={form.expiry} onChange={v=>setForm(f=>({...f,expiry:v}))} T={T} placeholder="e.g. Apr 30"/>
          <div style={{display:"flex",gap:10}}><Btn T={T} onClick={save}>{editing?"Save":"Create"}</Btn><Btn T={T} variant="ghost" onClick={()=>setShowAdd(false)}>Cancel</Btn></div>
        </Modal>
      )}
    </div>
  );
}

// ── DELIVERY ZONES ────────────────────────────────────────────
function DeliveryZones({data,setData,addLog,toast,T}) {
  const [editing,setEditing]=useState(null); const [showAdd,setShowAdd]=useState(false);
  const [form,setForm]=useState({name:"",baseFee:"",extraPerKm:"",estimatedTime:"",active:true});
  const saveZone=()=>{
    if(!form.name) return;
    const updated={...form,baseFee:parseFloat(form.baseFee)||0,extraPerKm:parseFloat(form.extraPerKm)||0,couriers:0};
    if(editing){ setData(d=>({...d,zones:d.zones.map(z=>z.id===editing.id?{...z,...updated}:z)})); toast("Zone updated"); addLog("Updated zone",form.name); }
    else { setData(d=>({...d,zones:[...d.zones,{...updated,id:Date.now()}]})); toast(`Zone ${form.name} added`); addLog("Added zone",form.name); }
    setEditing(null); setShowAdd(false);
  };
  const toggleZone=(id)=>{ setData(d=>({...d,zones:d.zones.map(z=>z.id===id?{...z,active:!z.active}:z)})); toast("Zone updated"); };
  const openEdit=(z)=>{ setForm({...z,baseFee:String(z.baseFee),extraPerKm:String(z.extraPerKm)}); setEditing(z); setShowAdd(true); };
  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <SectionHeader title="Delivery Zones" T={T} action="+ Add Zone" onAction={()=>{setForm({name:"",baseFee:"",extraPerKm:"",estimatedTime:"",active:true});setEditing(null);setShowAdd(true);}}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12}}>
        <StatCard T={T} icon="📍" label="Total Zones" value={data.zones.length}/>
        <StatCard T={T} icon="✅" label="Active"      value={data.zones.filter(z=>z.active).length}  bgColor={T.greenL} color={T.green}/>
        <StatCard T={T} icon="⏸️" label="Inactive"   value={data.zones.filter(z=>!z.active).length} bgColor={T.border} color={T.muted}/>
        <StatCard T={T} icon="🚴" label="Couriers Assigned" value={data.zones.reduce((s,z)=>s+z.couriers,0)}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:14}}>
        {data.zones.map(z=>(
          <Card key={z.id} T={T} style={{opacity:z.active?1:0.6}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
              <div>
                <div style={{fontWeight:700,fontSize:15,color:T.text}}>📍 {z.name}</div>
                <div style={{fontSize:12,color:T.muted,marginTop:2}}>⏱ {z.estimatedTime}</div>
              </div>
              <Badge label={z.active?"Active":"Inactive"} T={T}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
              {[[`₵${z.baseFee}`, "Base Fee"],[`₵${z.extraPerKm}/km`,"Extra/km"],[`${z.couriers} courier${z.couriers!==1?"s":""}`, "Assigned"],[z.estimatedTime,"Est. Time"]].map(([v,l])=>(
                <div key={l} style={{background:T.tableBg,borderRadius:8,padding:"8px 10px"}}><div style={{fontSize:12,fontWeight:700,color:T.text}}>{v}</div><div style={{fontSize:10,color:T.muted}}>{l}</div></div>
              ))}
            </div>
            <div style={{display:"flex",gap:6}}>
              <Btn small T={T} variant="secondary" onClick={()=>openEdit(z)}>Edit</Btn>
              <Btn small T={T} variant="ghost" onClick={()=>toggleZone(z.id)}>{z.active?"Deactivate":"Activate"}</Btn>
            </div>
          </Card>
        ))}
      </div>
      {showAdd&&(
        <Modal title={editing?"Edit Zone":"Add Zone"} onClose={()=>setShowAdd(false)} T={T}>
          <Input label="Zone Name" value={form.name} onChange={v=>setForm(f=>({...f,name:v}))} T={T} placeholder="e.g. Spintex"/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <Input label="Base Fee (₵)" value={form.baseFee} onChange={v=>setForm(f=>({...f,baseFee:v}))} T={T} type="number" placeholder="0"/>
            <Input label="Extra/km (₵)" value={form.extraPerKm} onChange={v=>setForm(f=>({...f,extraPerKm:v}))} T={T} type="number" placeholder="0"/>
          </div>
          <Input label="Estimated Time" value={form.estimatedTime} onChange={v=>setForm(f=>({...f,estimatedTime:v}))} T={T} placeholder="e.g. 20-30 min"/>
          <div style={{display:"flex",gap:10}}><Btn T={T} onClick={saveZone}>{editing?"Save":"Add Zone"}</Btn><Btn T={T} variant="ghost" onClick={()=>setShowAdd(false)}>Cancel</Btn></div>
        </Modal>
      )}
    </div>
  );
}

// ── REPORTS ───────────────────────────────────────────────────
function Reports({data,toast,T}) {
  const totalRevenue=data.orders.filter(o=>o.status==="Delivered").reduce((s,o)=>s+o.total,0);
  const totalOrders=data.orders.length;
  const deliveredOrders=data.orders.filter(o=>o.status==="Delivered").length;
  const cancelledOrders=data.orders.filter(o=>o.status==="Cancelled").length;
  const topSupplier=data.suppliers.sort((a,b)=>b.revenue-a.revenue)[0];
  const topProduct=data.products.filter(p=>p.status==="In Stock").sort((a,b)=>b.stock-a.stock)[0];
  const weekData=[{l:"Mon",v:42},{l:"Tue",v:58},{l:"Wed",v:35},{l:"Thu",v:71},{l:"Fri",v:89},{l:"Sat",v:112},{l:"Sun",v:67}];
  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <h2 style={{margin:0,fontSize:22,fontFamily:"'Playfair Display',serif",color:T.text}}>Reports & Analytics</h2>
        <div style={{display:"flex",gap:8}}>
          <Btn T={T} variant="secondary" onClick={()=>toast("Orders CSV exported")}>Export Orders</Btn>
          <Btn T={T} onClick={()=>toast("Full report exported")}>Export Full Report</Btn>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:14}}>
        <StatCard T={T} icon="💰" label="Total Revenue"      value={`₵${totalRevenue}`}      sub="Delivered orders only" bgColor={T.greenL} color={T.green}/>
        <StatCard T={T} icon="🛒" label="Total Orders"       value={totalOrders}              sub={`${deliveredOrders} delivered`}/>
        <StatCard T={T} icon="❌" label="Cancellation Rate"  value={`${Math.round((cancelledOrders/totalOrders)*100)}%`} bgColor={T.redL} color={T.red}/>
        <StatCard T={T} icon="🏪" label="Top Supplier"       value={topSupplier?.name}        sub={`₵${topSupplier?.revenue.toLocaleString()}`} bgColor={T.purpleL} color={T.purple}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <Card T={T}><div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:14}}>Orders This Week</div><BarChart data={weekData} T={T}/></Card>
        <Card T={T}>
          <div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:14}}>Order Status Breakdown</div>
          {["Delivered","Delivering","Packing","Pending","Cancelled"].map(s=>{
            const count=data.orders.filter(o=>o.status===s).length;
            const pct=Math.round((count/totalOrders)*100);
            return <div key={s} style={{marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:12,color:T.text}}>{s}</span><span style={{fontSize:11,color:T.muted}}>{count} ({pct}%)</span></div>
              <div style={{height:5,background:T.border,borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:`${pct}%`,background:T.teal,borderRadius:3}}/></div>
            </div>;
          })}
        </Card>
      </div>
      <Card T={T}>
        <div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:14}}>Supplier Performance</div>
        <Table T={T} cols={["Supplier","Category","Products","Orders","Revenue","Rating","Status"]} rows={data.suppliers}
          renderRow={r=><>
            <Td style={{fontWeight:600,color:T.text}}>{r.name}</Td>
            <Td style={{color:T.muted,fontSize:12}}>{r.category}</Td>
            <Td>{r.products}</Td>
            <Td>{r.orders}</Td>
            <Td style={{fontWeight:700,color:T.teal}}>₵{r.revenue.toLocaleString()}</Td>
            <Td>⭐ {r.rating}</Td>
            <Td><Badge label={r.status} T={T}/></Td>
          </>}/>
      </Card>
    </div>
  );
}

// ── NOTIFICATIONS ─────────────────────────────────────────────
function Notifications({data,setData,T}) {
  const icons={"order":"🛒","supplier":"🏪","alert":"⚠️","courier":"🚴","finance":"💰"};
  const markAll=()=>setData(d=>({...d,notifications:d.notifications.map(n=>({...n,read:true}))}));
  const markOne=(id)=>setData(d=>({...d,notifications:d.notifications.map(n=>n.id===id?{...n,read:true}:n)}));
  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <h2 style={{margin:0,fontSize:22,fontFamily:"'Playfair Display',serif",color:T.text}}>Notifications</h2>
        <Btn T={T} variant="ghost" onClick={markAll}>Mark all read</Btn>
      </div>
      <Card T={T}>
        {data.notifications.map(n=>(
          <div key={n.id} onClick={()=>markOne(n.id)} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 0",borderBottom:`1px solid ${T.border}`,cursor:n.read?"default":"pointer",background:"transparent",transition:"background 0.1s"}}
            onMouseEnter={e=>e.currentTarget.style.background=T.tableBg} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <div style={{width:40,height:40,borderRadius:12,background:n.read?T.tableBg:T.tealLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{icons[n.type]||"🔔"}</div>
            <div style={{flex:1}}><div style={{fontSize:13,fontWeight:n.read?400:600,color:T.text}}>{n.message}</div><div style={{fontSize:11,color:T.muted,marginTop:2}}>{n.time}</div></div>
            {!n.read&&<div style={{width:8,height:8,borderRadius:"50%",background:T.teal,flexShrink:0}}/>}
          </div>
        ))}
      </Card>
    </div>
  );
}

// ── AUDIT LOG ─────────────────────────────────────────────────
function AuditLog({data,T}) {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <SectionHeader title="Audit Log" T={T}/>
      <Card T={T}>
        <Table T={T} cols={["Admin","Action","Target","Time"]} rows={data.auditLog}
          renderRow={r=><>
            <Td style={{fontWeight:600,color:T.teal}}>{r.admin}</Td>
            <Td style={{color:T.text}}>{r.action}</Td>
            <Td style={{color:T.muted,fontSize:12}}>{r.target}</Td>
            <Td style={{color:T.muted,fontSize:12}}>{r.time}</Td>
          </>}/>
      </Card>
    </div>
  );
}

// ── SETTINGS ──────────────────────────────────────────────────
function Settings({data,setData,toast,addLog,T,darkMode,setDarkMode}) {
  const [showAdd,setShowAdd]=useState(false);
  const [form,setForm]=useState({name:"",email:"",role:"Operations"});
  const addAdmin=()=>{
    if(!form.name||!form.email) return;
    setData(d=>({...d,admins:[...d.admins,{...form,id:Date.now(),status:"Active",lastLogin:"Never"}]}));
    addLog("Added admin user",form.name); toast(`${form.name} added`); setShowAdd(false); setForm({name:"",email:"",role:"Operations"});
  };
  const removeAdmin=(id)=>{ setData(d=>({...d,admins:d.admins.filter(a=>a.id!==id)})); toast("Admin removed"); };
  return (
    <div style={{display:"flex",flexDirection:"column",gap:20,maxWidth:640}}>
      <SectionHeader title="Settings" T={T}/>
      <Card T={T}>
        <div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:14}}>🎨 Appearance</div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:`1px solid ${T.border}`}}>
          <div><div style={{fontSize:13,fontWeight:600,color:T.text}}>Dark Mode</div><div style={{fontSize:11,color:T.muted}}>Switch between light and dark theme</div></div>
          <div onClick={()=>setDarkMode(v=>!v)} style={{width:44,height:24,borderRadius:12,background:darkMode?T.teal:T.border,position:"relative",cursor:"pointer",transition:"background 0.2s"}}>
            <div style={{position:"absolute",top:2,left:darkMode?20:2,width:20,height:20,borderRadius:"50%",background:T.white,transition:"left 0.2s",boxShadow:"0 1px 4px rgba(0,0,0,0.15)"}}/>
          </div>
        </div>
      </Card>
      <Card T={T}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div style={{fontSize:14,fontWeight:700,color:T.text}}>👤 Admin Users</div>
          <Btn small T={T} onClick={()=>setShowAdd(true)}>+ Add Admin</Btn>
        </div>
        {data.admins.map(a=>(
          <div key={a.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:`1px solid ${T.border}`}}>
            <div style={{width:36,height:36,borderRadius:"50%",background:T.tealLight,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:12,color:T.teal,flexShrink:0}}>{a.name.split(" ").map(n=>n[0]).join("")}</div>
            <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:T.text}}>{a.name}</div><div style={{fontSize:11,color:T.muted}}>{a.email} · Last: {a.lastLogin}</div></div>
            <Badge label={a.role} T={T}/>
            {a.id!==1&&<button onClick={()=>removeAdmin(a.id)} style={{background:"none",border:"none",color:T.red,cursor:"pointer",fontSize:18,lineHeight:1}}>×</button>}
          </div>
        ))}
      </Card>
      <Card T={T}>
        <div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:8}}>ℹ️ App Info</div>
        {[["App","The Picky Basket Admin Portal"],["Version","2.0.0"],["Environment","Production"],["Last Updated","Mar 8, 2026"]].map(([k,v])=>(
          <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${T.border}`,fontSize:13}}><span style={{color:T.muted}}>{k}</span><span style={{fontWeight:600,color:T.text}}>{v}</span></div>
        ))}
      </Card>
      {showAdd&&(
        <Modal title="Add Admin User" onClose={()=>setShowAdd(false)} T={T}>
          <Input label="Full Name" value={form.name} onChange={v=>setForm(f=>({...f,name:v}))} T={T} placeholder="e.g. Kofi Adu"/>
          <Input label="Email" value={form.email} onChange={v=>setForm(f=>({...f,email:v}))} T={T} type="email" placeholder="admin@pickybasket.com"/>
          <Input label="Role" value={form.role} onChange={v=>setForm(f=>({...f,role:v}))} T={T} options={["Super Admin","Operations","Finance"]}/>
          <div style={{display:"flex",gap:10}}><Btn T={T} onClick={addAdmin}>Add</Btn><Btn T={T} variant="ghost" onClick={()=>setShowAdd(false)}>Cancel</Btn></div>
        </Modal>
      )}
    </div>
  );
}

// ── NAV ────────────────────────────────────────────────────────
const NAV = [
  {key:"dashboard",  label:"Dashboard",   icon:"📊"},
  {key:"orders",     label:"Orders",      icon:"🛒"},
  {key:"products",   label:"Products",    icon:"📦"},
  {key:"suppliers",  label:"Suppliers",   icon:"🏪"},
  {key:"couriers",   label:"Couriers",    icon:"🚴"},
  {key:"customers",  label:"Customers",   icon:"👥"},
  {key:"financials", label:"Financials",  icon:"💰"},
  {key:"complaints", label:"Complaints",  icon:"⚠️"},
  {key:"promotions", label:"Promotions",  icon:"🎟️"},
  {key:"zones",      label:"Zones",       icon:"📍"},
  {key:"reports",    label:"Reports",     icon:"📈"},
  {key:"notifications",label:"Alerts",   icon:"🔔"},
  {key:"auditlog",   label:"Audit Log",   icon:"📋"},
  {key:"settings",   label:"Settings",    icon:"⚙️"},
];

// ── ROOT ───────────────────────────────────────────────────────
export default function App() {
  const [loggedIn,setLoggedIn]=useState(false); const [darkMode,setDarkMode]=useState(false);
  const T=darkMode?dark:light;
  const [active,setActive]=useState("dashboard"); const [sidebarOpen,setSidebarOpen]=useState(true);
  const [data,setData]=useState(INIT); const [toastMsg,setToastMsg]=useState("");
  const toastTimer=useRef(null);

  const toast=(msg)=>{ setToastMsg(msg); if(toastTimer.current) clearTimeout(toastTimer.current); toastTimer.current=setTimeout(()=>setToastMsg(""),3000); };
  const addLog=(action,target)=>{ const entry={id:Date.now(),admin:"Super Admin",action,target,time:"Just now"}; setData(d=>({...d,auditLog:[entry,...d.auditLog]})); };

  const unreadCount=data.notifications.filter(n=>!n.read).length;
  const pendingProducts=data.products.filter(p=>p.approvalStatus==="Pending").length;
  const openComplaints=data.complaints.filter(c=>c.status==="Open").length;

  if(!loggedIn) return <LoginScreen onLogin={()=>setLoggedIn(true)} T={T}/>;

  const props={data,setData,addLog,toast,T};
  const Section={
    dashboard:   ()=><Dashboard {...props}/>,
    orders:      ()=><Orders {...props}/>,
    products:    ()=><Products {...props}/>,
    suppliers:   ()=><Suppliers {...props}/>,
    couriers:    ()=><Couriers {...props}/>,
    customers:   ()=><Customers {...props}/>,
    financials:  ()=><Financials {...props}/>,
    complaints:  ()=><ComplaintsSection {...props}/>,
    promotions:  ()=><Promotions {...props}/>,
    zones:       ()=><DeliveryZones {...props}/>,
    reports:     ()=><Reports {...props}/>,
    notifications:()=><Notifications {...props}/>,
    auditlog:    ()=><AuditLog {...props}/>,
    settings:    ()=><Settings {...props} darkMode={darkMode} setDarkMode={setDarkMode}/>,
  }[active]||(()=>null);

  return (
    <div style={{display:"flex",height:"100vh",background:T.bg,overflow:"hidden",fontFamily:"'DM Sans','Segoe UI',sans-serif",transition:"background 0.2s"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600;700;800&display=swap');*{box-sizing:border-box}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:${T.tealMid};border-radius:3px}@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Sidebar */}
      <div style={{width:sidebarOpen?224:64,flexShrink:0,background:T.sidebar,display:"flex",flexDirection:"column",transition:"width 0.25s ease",overflow:"hidden"}}>
        <div style={{padding:"16px 12px 14px",borderBottom:`1px solid ${T.navyLight}`,flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <img src={logo} alt="Picky Basket" style={{width:36,height:36,borderRadius:10,objectFit:"contain",flexShrink:0}}/>
            {sidebarOpen&&<div><div style={{color:"#fff",fontWeight:800,fontSize:13,lineHeight:1.2}}>Picky Basket</div><div style={{color:T.tealMid,fontSize:10}}>Admin Portal</div></div>}
          </div>
        </div>
        <nav style={{flex:1,padding:"8px 8px",overflowY:"auto"}}>
          {NAV.map(n=>{
            const isActive=active===n.key;
            const badge=n.key==="notifications"?unreadCount:n.key==="products"?pendingProducts:n.key==="complaints"?openComplaints:0;
            return (
              <div key={n.key} onClick={()=>setActive(n.key)} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",borderRadius:10,marginBottom:1,cursor:"pointer",background:isActive?T.teal:"transparent",transition:"background 0.15s"}}
                onMouseEnter={e=>{if(!isActive)e.currentTarget.style.background=T.navyLight}}
                onMouseLeave={e=>{if(!isActive)e.currentTarget.style.background="transparent"}}>
                <span style={{fontSize:16,flexShrink:0}}>{n.icon}</span>
                {sidebarOpen&&<span style={{fontSize:12,fontWeight:isActive?700:400,color:isActive?"#fff":T.sidebarText,whiteSpace:"nowrap"}}>{n.label}</span>}
                {badge>0&&<span style={{marginLeft:"auto",background:n.key==="complaints"?T.orange:T.red,color:"#fff",borderRadius:10,fontSize:10,fontWeight:700,padding:"1px 6px",minWidth:18,textAlign:"center"}}>{badge}</span>}
              </div>
            );
          })}
        </nav>
        <div style={{padding:"8px 8px",borderTop:`1px solid ${T.navyLight}`,flexShrink:0}}>
          <div onClick={()=>setSidebarOpen(v=>!v)} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",borderRadius:10,cursor:"pointer",color:T.sidebarText}} onMouseEnter={e=>e.currentTarget.style.background=T.navyLight} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <span style={{fontSize:14}}>{sidebarOpen?"◀":"▶"}</span>
            {sidebarOpen&&<span style={{fontSize:12}}>Collapse</span>}
          </div>
          <div onClick={()=>setLoggedIn(false)} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",borderRadius:10,cursor:"pointer",color:T.red}} onMouseEnter={e=>e.currentTarget.style.background=T.navyLight} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <span style={{fontSize:14}}>🚪</span>
            {sidebarOpen&&<span style={{fontSize:12,fontWeight:600}}>Logout</span>}
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{background:T.cardBg,padding:"12px 24px",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
          <div style={{fontSize:13,color:T.muted}}><span style={{color:T.teal,fontWeight:600}}>Admin</span>{" / "}{NAV.find(n=>n.key===active)?.label}</div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            {pendingProducts>0&&<button onClick={()=>setActive("products")} style={{padding:"6px 12px",borderRadius:10,border:"none",background:T.blueL,color:T.blue,fontSize:11,fontWeight:700,cursor:"pointer"}}>📦 {pendingProducts} pending</button>}
            {openComplaints>0&&<button onClick={()=>setActive("complaints")} style={{padding:"6px 12px",borderRadius:10,border:"none",background:T.orangeL,color:T.orange,fontSize:11,fontWeight:700,cursor:"pointer"}}>⚠️ {openComplaints} complaints</button>}
            <button onClick={()=>setActive("notifications")} style={{padding:"7px 12px",borderRadius:10,border:`1px solid ${T.border}`,background:"transparent",fontSize:12,color:T.muted,cursor:"pointer"}}>🔔{unreadCount>0&&<span style={{color:T.red,fontWeight:700}}> {unreadCount}</span>}</button>
            <button onClick={()=>setDarkMode(v=>!v)} style={{padding:"7px 12px",borderRadius:10,border:`1px solid ${T.border}`,background:"transparent",fontSize:14,cursor:"pointer"}}>{darkMode?"☀️":"🌙"}</button>
            <div style={{display:"flex",alignItems:"center",gap:8,padding:"6px 12px",background:T.tealLight,borderRadius:10,cursor:"pointer"}} onClick={()=>setActive("settings")}>
              <div style={{width:26,height:26,borderRadius:"50%",background:T.teal,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:11,fontWeight:700}}>A</div>
              {sidebarOpen&&<span style={{fontSize:12,fontWeight:600,color:T.tealDark}}>Super Admin</span>}
            </div>
          </div>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:24,animation:"fadeUp 0.3s ease"}}><Section/></div>
      </div>
      {toastMsg&&<Toast msg={toastMsg} T={T}/>}
    </div>
  );
}
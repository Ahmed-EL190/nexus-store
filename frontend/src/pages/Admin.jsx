import { useState, useEffect } from 'react';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut, Plus, Pencil, Trash2, TrendingUp, Eye, X, Upload, BarChart3, Menu } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { handleImageError } from '../utils/imageFallback';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: Package, label: 'Products', path: '/admin/products' },
  { icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
  { icon: Users, label: 'Customers', path: '/admin/customers' },
];

function Sidebar({ open, setOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <>
      {open && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setOpen(false)}/>}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-brand-black text-white z-40 flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 border-b border-brand-gray-800">
          <h1 className="font-display text-3xl tracking-widest text-brand-accent">NEXUS</h1>
          <p className="text-xs text-brand-gray-500 font-mono mt-1">ADMIN PANEL</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <Link key={item.path} to={item.path}
              className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-brand-gray-300 hover:text-white hover:bg-brand-gray-800 transition-colors"
              onClick={() => setOpen(false)}>
              <item.icon size={18}/>{item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-brand-gray-800">
          <p className="text-xs text-brand-gray-500 font-mono mb-3 truncate">{user?.email}</p>
          <button onClick={() => { logout(); navigate('/'); }}
            className="flex items-center gap-2 text-sm text-brand-gray-400 hover:text-white transition-colors">
            <LogOut size={16}/> Logout
          </button>
        </div>
      </aside>
    </>
  );
}

// Dashboard Stats Overview
function DashStats() {
  const [stats, setStats] = useState(null);
  useEffect(() => { axios.get('/api/admin/stats').then(r => setStats(r.data)).catch(() => {}); }, []);

  if (!stats) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"/></div>;

  const cards = [
    { label: 'Total Revenue', value: `LE ${stats.totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'bg-brand-accent' },
    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'bg-blue-500' },
    { label: 'Products', value: stats.totalProducts, icon: Package, color: 'bg-purple-500' },
    { label: 'Customers', value: stats.totalCustomers, icon: Users, color: 'bg-green-500' },
  ];

  return (
    <div>
      <h2 className="font-display text-4xl tracking-widest mb-6">DASHBOARD</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(c => (
          <div key={c.label} className="bg-white border border-brand-gray-200 p-5">
            <div className={`w-10 h-10 ${c.color} flex items-center justify-center mb-3`}>
              <c.icon size={18} className="text-white"/>
            </div>
            <p className="text-2xl font-bold">{c.value}</p>
            <p className="text-xs text-brand-gray-500 font-mono tracking-wider mt-1 uppercase">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-brand-gray-200 p-6">
          <h3 className="font-semibold text-sm uppercase tracking-wider text-brand-gray-600 mb-4">Revenue (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stats.revenueChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
              <XAxis dataKey="date" tick={{fontSize:11}}/>
              <YAxis tick={{fontSize:11}}/>
              <Tooltip formatter={v => `LE ${v.toLocaleString()}`}/>
              <Bar dataKey="revenue" fill="#c8f542"/>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white border border-brand-gray-200 p-6">
          <h3 className="font-semibold text-sm uppercase tracking-wider text-brand-gray-600 mb-4">Order Status</h3>
          <div className="space-y-3 mt-6">
            {Object.entries(stats.statusCounts).map(([k, v]) => (
              <div key={k} className="flex items-center justify-between">
                <span className="text-sm font-semibold capitalize">{k}</span>
                <span className="text-sm text-brand-gray-500">{v} orders</span>
              </div>
            ))}
            {Object.keys(stats.statusCounts).length === 0 && <p className="text-brand-gray-400 text-sm">No orders yet</p>}
          </div>
        </div>
      </div>

      {/* Top products */}
      <div className="bg-white border border-brand-gray-200 p-6">
        <h3 className="font-semibold text-sm uppercase tracking-wider text-brand-gray-600 mb-4">Top Products</h3>
        <div className="space-y-3">
          {stats.topProducts.map(p => (
            <div key={p.id} className="flex items-center gap-3">
              <img src={p.images[0]} alt="" className="w-10 h-10 object-cover bg-brand-gray-100" referrerPolicy="no-referrer" loading="lazy" onError={handleImageError}/>
              <div className="flex-1"><p className="text-sm font-semibold">{p.name}</p>
                <p className="text-xs text-brand-gray-500">{p.reviews} reviews</p></div>
              <span className="font-mono text-sm">LE {p.price.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Products Management
function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});

  const load = () => axios.get('/api/products').then(r => setProducts(r.data.products));
  useEffect(() => { load(); }, []);

  const openNew = () => setModal({ mode: 'new', data: { name: '', price: '', originalPrice: '', category: 'compressions', gender: 'men', sizes: ['S','M','L','XL'], colors: ['#000000'], images: [], description: '', stock: 50, badge: '', discount: 0 } });
  const openEdit = (p) => setModal({ mode: 'edit', data: { ...p } });

  const save = async () => {
    try {
      if (modal.mode === 'new') await axios.post('/api/products', modal.data);
      else await axios.put(`/api/products/${modal.data.id}`, modal.data);
      toast.success('Product saved!');
      setModal(null); load();
    } catch { toast.error('Failed to save'); }
  };

  const del = async (id) => {
    if (!confirm('Delete this product?')) return;
    await axios.delete(`/api/products/${id}`);
    toast.success('Deleted');
    load();
  };

  const upd = (k, v) => setModal(m => ({ ...m, data: { ...m.data, [k]: v } }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-4xl tracking-widest">PRODUCTS</h2>
        <button onClick={openNew} className="btn-primary flex items-center gap-2"><Plus size={16}/> Add Product</button>
      </div>

      <div className="bg-white border border-brand-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-brand-gray-200">
            <tr className="text-left">
              {['Product', 'Category', 'Price', 'Stock', 'Rating', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-xs font-mono text-brand-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-b border-brand-gray-100 hover:bg-brand-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={p.images[0]} alt="" className="w-10 h-10 object-cover bg-brand-gray-100" referrerPolicy="no-referrer" loading="lazy" onError={handleImageError}/>
                    <span className="font-semibold">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-brand-gray-600 capitalize">{p.category}</td>
                <td className="px-4 py-3 font-mono">LE {p.price.toLocaleString()}</td>
                <td className="px-4 py-3">{p.stock}</td>
                <td className="px-4 py-3">⭐ {p.rating}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(p)} className="p-1.5 hover:bg-brand-gray-200 transition-colors"><Pencil size={14}/></button>
                    <button onClick={() => del(p.id)} className="p-1.5 hover:bg-red-100 hover:text-red-600 transition-colors"><Trash2 size={14}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-2xl tracking-widest">{modal.mode === 'new' ? 'ADD PRODUCT' : 'EDIT PRODUCT'}</h3>
              <button onClick={() => setModal(null)}><X size={20}/></button>
            </div>
            <div className="space-y-4">
              {[['Product Name (EN)', 'name', 'text'], ['Product Name (AR)', 'nameAr', 'text'], ['Description', 'description', 'text']].map(([label, key, type]) => (
                <div key={key}>
                  <label className="text-xs font-mono text-brand-gray-500 uppercase tracking-wider block mb-1">{label}</label>
                  <input type={type} value={modal.data[key] || ''} onChange={e => upd(key, e.target.value)} className="input-field"/>
                </div>
              ))}
              <div className="grid grid-cols-3 gap-3">
                <div><label className="text-xs font-mono text-brand-gray-500 uppercase tracking-wider block mb-1">Price (LE)</label>
                  <input type="number" value={modal.data.price || ''} onChange={e => upd('price', +e.target.value)} className="input-field"/></div>
                <div><label className="text-xs font-mono text-brand-gray-500 uppercase tracking-wider block mb-1">Original Price</label>
                  <input type="number" value={modal.data.originalPrice || ''} onChange={e => upd('originalPrice', +e.target.value)} className="input-field"/></div>
                <div><label className="text-xs font-mono text-brand-gray-500 uppercase tracking-wider block mb-1">Stock</label>
                  <input type="number" value={modal.data.stock || ''} onChange={e => upd('stock', +e.target.value)} className="input-field"/></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-mono text-brand-gray-500 uppercase tracking-wider block mb-1">Category</label>
                  <select value={modal.data.category} onChange={e => upd('category', e.target.value)} className="input-field">
                    {['compressions','hoodies','shorts','tshirts','sports-bra','accessories'].map(c => <option key={c}>{c}</option>)}
                  </select></div>
                <div><label className="text-xs font-mono text-brand-gray-500 uppercase tracking-wider block mb-1">Gender</label>
                  <select value={modal.data.gender} onChange={e => upd('gender', e.target.value)} className="input-field">
                    <option>men</option><option>women</option><option>unisex</option>
                  </select></div>
              </div>
              <div><label className="text-xs font-mono text-brand-gray-500 uppercase tracking-wider block mb-1">Badge</label>
                <input value={modal.data.badge || ''} onChange={e => upd('badge', e.target.value)} placeholder="e.g. NEW, BUY 1 GET 1 FREE" className="input-field"/></div>
              <div><label className="text-xs font-mono text-brand-gray-500 uppercase tracking-wider block mb-1">Images (URLs, one per line)</label>
                <textarea value={(modal.data.images || []).join('\n')} onChange={e => upd('images', e.target.value.split('\n').filter(Boolean))} rows={4} className="input-field resize-none"/></div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="feat" checked={modal.data.featured || false} onChange={e => upd('featured', e.target.checked)} className="w-4 h-4"/>
                <label htmlFor="feat" className="text-sm font-semibold">Featured product</label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setModal(null)} className="btn-outline flex-1">Cancel</button>
              <button onClick={save} className="btn-primary flex-1">Save Product</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Orders Management
function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);

  const load = () => axios.get('/api/orders').then(r => setOrders(r.data.orders)).catch(() => {});
  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    await axios.put(`/api/orders/${id}/status`, { status });
    toast.success('Status updated');
    load();
    if (selected?.id === id) setSelected(s => ({ ...s, status }));
  };

  const statusColor = (s) => ({
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  })[s] || 'bg-gray-100';

  return (
    <div>
      <h2 className="font-display text-4xl tracking-widest mb-6">ORDERS</h2>
      {orders.length === 0 ? (
        <div className="bg-white border border-brand-gray-200 p-12 text-center text-brand-gray-400">
          <ShoppingCart size={40} className="mx-auto mb-4 opacity-30"/>
          <p className="font-display text-3xl tracking-widest">NO ORDERS YET</p>
        </div>
      ) : (
        <div className="bg-white border border-brand-gray-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-brand-gray-200">
              <tr className="text-left">
                {['Order #', 'Customer', 'Total', 'Payment', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-xs font-mono text-brand-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} className="border-b border-brand-gray-100 hover:bg-brand-gray-50">
                  <td className="px-4 py-3 font-mono text-xs">{o.orderNumber}</td>
                  <td className="px-4 py-3 font-semibold">{o.customer?.firstName} {o.customer?.lastName}</td>
                  <td className="px-4 py-3 font-mono">LE {o.totalAmount?.toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs uppercase font-mono">{o.paymentMethod}</td>
                  <td className="px-4 py-3">
                    <select value={o.status} onChange={e => updateStatus(o.id, e.target.value)}
                      className={`text-xs font-semibold px-2 py-1 rounded ${statusColor(o.status)} border-0 outline-none cursor-pointer`}>
                      {['pending','processing','shipped','delivered','cancelled'].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-xs text-brand-gray-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => setSelected(o)} className="p-1.5 hover:bg-brand-gray-200"><Eye size={14}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between mb-4">
              <h3 className="font-display text-2xl tracking-widest">{selected.orderNumber}</h3>
              <button onClick={() => setSelected(null)}><X size={20}/></button>
            </div>
            <div className="space-y-4 text-sm">
              <div><strong>Customer:</strong> {selected.customer?.firstName} {selected.customer?.lastName}<br/>
                <span className="text-brand-gray-500">{selected.customer?.email} | {selected.customer?.phone}</span></div>
              <div><strong>Address:</strong> {selected.shippingAddress?.address}, {selected.shippingAddress?.city}, {selected.shippingAddress?.governorate}</div>
              <div><strong>Payment:</strong> {selected.paymentMethod} — {selected.paymentStatus}</div>
              <div>
                <strong>Items:</strong>
                {selected.items?.map((item, i) => (
                  <div key={i} className="flex justify-between py-1 border-b border-brand-gray-100">
                    <span>{item.name} x{item.qty} ({item.size})</span>
                    <span>LE {(item.price * item.qty).toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold pt-2">
                  <span>Total</span><span>LE {selected.totalAmount?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Customers
function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  useEffect(() => { axios.get('/api/admin/customers').then(r => setCustomers(r.data)).catch(() => {}); }, []);
  return (
    <div>
      <h2 className="font-display text-4xl tracking-widest mb-6">CUSTOMERS</h2>
      <div className="bg-white border border-brand-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-brand-gray-200">
            <tr>{['Name', 'Email', 'Joined'].map(h => <th key={h} className="px-4 py-3 text-xs font-mono text-brand-gray-500 uppercase tracking-wider text-left">{h}</th>)}</tr>
          </thead>
          <tbody>
            {customers.map(c => (
              <tr key={c.id} className="border-b border-brand-gray-100 hover:bg-brand-gray-50">
                <td className="px-4 py-3 font-semibold">{c.name}</td>
                <td className="px-4 py-3 text-brand-gray-600">{c.email}</td>
                <td className="px-4 py-3 text-xs text-brand-gray-400">{new Date(c.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {customers.length === 0 && <tr><td colSpan={3} className="px-4 py-8 text-center text-brand-gray-400">No customers yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Admin wrapper
export default function Admin() {
  const [sideOpen, setSideOpen] = useState(false);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { if (!isAdmin) navigate('/login'); }, [isAdmin]);

  return (
    <div className="min-h-screen bg-brand-gray-100 flex">
      <Sidebar open={sideOpen} setOpen={setSideOpen}/>
      <main className="flex-1 lg:ml-64 min-h-screen">
        <div className="sticky top-0 bg-white border-b border-brand-gray-200 px-4 py-3 flex items-center gap-3 lg:hidden z-20">
          <button onClick={() => setSideOpen(true)}><Menu size={22}/></button>
          <span className="font-display text-2xl tracking-widest">NEXUS ADMIN</span>
        </div>
        <div className="p-6 max-w-7xl">
          <Routes>
            <Route index element={<DashStats/>}/>
            <Route path="products" element={<AdminProducts/>}/>
            <Route path="orders" element={<AdminOrders/>}/>
            <Route path="customers" element={<AdminCustomers/>}/>
          </Routes>
        </div>
      </main>
    </div>
  );
}

import { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  BarChart3, 
  ShoppingBag, 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Loader, 
  TrendingUp,
  Package,
  IndianRupee,
  Calendar,
  Layers,
  User,
  ClipboardList,
  Tag
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    topProducts: [],
    recentOrders: []
  });

  // Product Form state
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    category: 'Pickles',
    description: '',
    image: ''
  });
  const [isOtherCategory, setIsOtherCategory] = useState(false);
  const [customCategory, setCustomCategory] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const { data: prods } = await api.get('/api/products');
      const { data: ords } = await api.get('/api/orders');
      
      setProducts(prods);
      setOrders(ords);

      // Simple stats calculation
      const revenue = ords.reduce((acc, o) => o.paymentStatus === 'Completed' ? acc + o.totalAmount : acc, 0);
      setStats({
        totalOrders: ords.length,
        totalRevenue: revenue,
        topProducts: prods.slice(0, 3), // Simplified
        recentOrders: ords.slice(0, 5)
      });

    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const finalForm = { ...productForm };
      if (isOtherCategory && customCategory) {
        finalForm.category = customCategory;
      }
      
      if (editingProduct) {
        await api.put(`/api/products/${editingProduct._id}`, finalForm);
      } else {
        await api.post('/api/products', finalForm);
      }
      fetchAdminData();
      resetProductForm();
    } catch (error) {
       alert(error.response?.data?.message || 'Action failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/api/products/${id}`);
        fetchAdminData();
      } catch (error) {
        alert('Delete failed');
      }
    }
  };

  const resetProductForm = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      price: '',
      category: 'Pickles',
      description: '',
      image: ''
    });
    setIsOtherCategory(false);
    setCustomCategory('');
    setShowProductModal(false);
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await api.put(`/api/orders/${orderId}/status`, { status });
      fetchAdminData();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const deleteCategory = async (categoryName) => {
    const count = products.filter(p => p.category === categoryName).length;
    if (window.confirm(`Are you sure you want to delete the category "${categoryName}"? This will delete all ${count} products in this category.`)) {
      try {
        setLoading(true);
        const categoryProducts = products.filter(p => p.category === categoryName);
        for (const p of categoryProducts) {
          await api.delete(`/api/products/${p._id}`);
        }
        fetchAdminData();
      } catch (error) {
        alert('Bulk delete failed');
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <Loader className="animate-spin text-orange-600" size={64} />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-gray-900 mb-2">Admin Control Center</h1>
          <p className="text-gray-500 font-medium">Manage your local food ecosystem products, orders and growth.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => { resetProductForm(); setShowProductModal(true); }}
            className="flex items-center space-x-2 bg-orange-600 text-white font-bold px-6 py-3 rounded-2xl hover:bg-orange-700 transition shadow-lg shadow-orange-100"
          >
            <Plus size={20} />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-10 overflow-x-auto pb-2 scrollbar-hide">
        {[
          { id: 'stats', label: 'Dashboard Overview', icon: BarChart3 },
          { id: 'products', label: 'Products Catalog', icon: Layers },
          { id: 'categories', label: 'Category Manager', icon: Tag },
          { id: 'orders', label: 'Order History', icon: ClipboardList }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-bold transition whitespace-nowrap ${
              activeTab === tab.id 
              ? 'bg-orange-600 text-white shadow-lg shadow-orange-100' 
              : 'bg-white text-gray-500 hover:bg-orange-50 hover:text-orange-600 border border-gray-100'
            }`}
          >
            <tab.icon size={20} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-white/50 backdrop-blur-sm rounded-[3rem] border border-gray-100 p-8 min-h-[600px] shadow-sm">
        
        {activeTab === 'stats' && (
          <div className="space-y-12 animate-in fade-in duration-500">
            {/* Quick Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center space-x-4">
                 <div className="bg-orange-100 p-4 rounded-2xl text-orange-600">
                    <TrendingUp size={24} />
                 </div>
                 <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Revenue</p>
                    <p className="text-2xl font-black text-gray-900">₹{stats.totalRevenue}</p>
                 </div>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center space-x-4">
                 <div className="bg-blue-100 p-4 rounded-2xl text-blue-600">
                    <ShoppingBag size={24} />
                 </div>
                 <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Orders</p>
                    <p className="text-2xl font-black text-gray-900">{stats.totalOrders}</p>
                 </div>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center space-x-4">
                 <div className="bg-purple-100 p-4 rounded-2xl text-purple-600">
                    <Package size={24} />
                 </div>
                 <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Products</p>
                    <p className="text-2xl font-black text-gray-900">{products.length}</p>
                 </div>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center space-x-4">
                 <div className="bg-green-100 p-4 rounded-2xl text-green-600">
                    <CheckCircle size={24} />
                 </div>
                 <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Success Rate</p>
                    <p className="text-2xl font-black text-gray-900">100%</p>
                 </div>
              </div>
            </div>

            {/* Growth & Top section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
               <div className="lg:col-span-2 space-y-6">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center px-2">
                    <Calendar size={20} className="mr-2 text-orange-600" />
                    Recent Activity
                  </h3>
                  <div className="space-y-4">
                    {stats.recentOrders.map(order => (
                      <div key={order._id} className="bg-white p-4 rounded-2xl flex items-center justify-between border border-gray-100 shadow-sm hover:shadow-md transition">
                        <div className="flex items-center space-x-4">
                           <div className="bg-gray-50 h-10 w-10 rounded-xl flex items-center justify-center text-gray-400">
                              <User size={20} />
                           </div>
                           <div>
                              <p className="font-bold text-gray-800">{order.userId?.name || 'Guest'}</p>
                              <p className="text-xs text-gray-500">{new Date(order.createdAt).toDateString()}</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="font-black text-orange-600">₹{order.totalAmount}</p>
                           <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{order.orderStatus}</p>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>

               <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center px-2">
                    <TrendingUp size={20} className="mr-2 text-orange-600" />
                    Bestsellers
                  </h3>
                  <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                    <div className="space-y-6">
                      {stats.topProducts.map(prod => (
                        <div key={prod._id} className="flex items-center space-x-4">
                           <img src={prod.image} alt="" className="w-12 h-12 rounded-xl object-cover shadow-sm" />
                           <div className="flex-grow">
                              <p className="font-bold text-gray-800 text-sm">{prod.name}</p>
                              <p className="text-xs text-orange-600 font-bold">₹{prod.price}</p>
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="animate-in slide-in-from-bottom-5 duration-500">
             <div className="overflow-x-auto rounded-3xl border border-gray-100">
                <table className="w-full text-left bg-white">
                  <thead className="bg-gray-50 text-gray-400 text-xs font-black uppercase tracking-widest border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4">Image</th>
                      <th className="px-6 py-4">Product Info</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.map(prod => (
                      <tr key={prod._id} className="hover:bg-gray-50/50 transition duration-150">
                        <td className="px-6 py-4">
                          <img src={prod.image} alt={prod.name} className="w-14 h-14 rounded-2xl object-cover shadow-sm" />
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-gray-800">{prod.name}</p>
                          <p className="text-xs text-gray-400 line-clamp-1 max-w-[200px] mt-1">{prod.description}</p>
                        </td>
                        <td className="px-6 py-4 uppercase text-[10px] font-black tracking-widest text-gray-500">
                          {prod.category}
                        </td>
                        <td className="px-6 py-4 font-black text-orange-600">₹{prod.price}</td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                             <button 
                               onClick={() => { setEditingProduct(prod); setProductForm(prod); setShowProductModal(true); }}
                               className="p-2 text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition"
                             >
                                <Edit size={16} />
                             </button>
                             <button 
                               onClick={() => handleDeleteProduct(prod._id)}
                               className="p-2 text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition"
                             >
                                <Trash2 size={16} />
                             </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-5 duration-500">
            {[...new Set(products.map(p => p.category))].map(cat => (
              <div key={cat} className="bg-white p-6 rounded-[2rem] border border-gray-100 flex items-center justify-between shadow-sm">
                <div>
                   <h4 className="text-xl font-black text-gray-800">{cat}</h4>
                   <p className="text-sm text-gray-400 font-bold">{products.filter(p => p.category === cat).length} Products</p>
                </div>
                <button 
                  onClick={() => deleteCategory(cat)}
                  className="p-3 text-red-600 bg-red-50 rounded-2xl hover:bg-red-100 transition shadow-sm"
                  title="Delete Category and all its products"
                >
                   <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-5 duration-500">
            {orders.map(order => (
               <div key={order._id} className="bg-white rounded-3xl border border-gray-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm hover:shadow-md transition">
                  <div className="flex-grow space-y-2">
                     <div className="flex items-center space-x-3 mb-2">
                        <span className="font-mono text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">#{order._id.slice(-8).toUpperCase()}</span>
                        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${order.paymentStatus === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                           PI: {order.paymentStatus}
                        </div>
                     </div>
                     <p className="font-bold text-gray-800">{order.userId?.name || 'Unknown User'} <span className="text-gray-400 font-medium ml-2">— {order.userId?.email}</span></p>
                     <p className="text-sm text-gray-500 flex items-center">
                        <Package size={14} className="mr-2" /> 
                        {order.products.length} Products • <span className="font-black text-orange-600 ml-1">₹{order.totalAmount}</span>
                     </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                     <select 
                       value={order.orderStatus} 
                       onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                       className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                     >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                     </select>
                  </div>
               </div>
            ))}
          </div>
        )}

      </div>

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-10 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-8">
               <h2 className="text-2xl font-black text-gray-900">{editingProduct ? 'Edit Product' : 'Add New Local Item'}</h2>
               <button onClick={resetProductForm} className="text-gray-400 hover:text-gray-600">
                  <XCircle size={32} />
               </button>
            </div>
            
            <form onSubmit={handleProductSubmit} className="space-y-6">
               <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-1">
                     <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Product Name</label>
                     <input 
                       required 
                       className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-orange-500/20 transition" 
                       value={productForm.name} 
                       onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                       placeholder="e.g. Mango Pickle"
                     />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Price (₹)</label>
                        <input 
                          required 
                          type="number" 
                          className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-orange-500/20 transition" 
                          value={productForm.price} 
                          onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                          placeholder="250"
                        />
                     </div>
                     <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Category</label>
                        <select 
                          className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-orange-500/20 transition" 
                          value={isOtherCategory ? 'Other' : productForm.category} 
                          onChange={(e) => {
                            if (e.target.value === 'Other') {
                              setIsOtherCategory(true);
                            } else {
                              setIsOtherCategory(false);
                              setProductForm({...productForm, category: e.target.value});
                            }
                          }}
                        >
                           <option value="Pickles">Pickles</option>
                           <option value="Sweets">Sweets</option>
                           <option value="Powders">Powders</option>
                           <option value="Other">Add New Category +</option>
                        </select>
                        {isOtherCategory && (
                          <input 
                            required 
                            className="w-full mt-2 bg-orange-50 border border-orange-100 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-orange-500/20 transition text-sm font-bold" 
                            value={customCategory} 
                            onChange={(e) => setCustomCategory(e.target.value)}
                            placeholder="Enter new category name..."
                          />
                        )}
                     </div>
                  </div>
                  <div className="space-y-1">
                     <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Image URL</label>
                     <input 
                       required 
                       type="url" 
                       className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-orange-500/20 transition" 
                       value={productForm.image} 
                       onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                       placeholder="https://images.unsplash.com/..."
                     />
                  </div>
                  <div className="space-y-1">
                     <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Description</label>
                     <textarea 
                       required 
                       rows="3" 
                       className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-orange-500/20 transition resize-none" 
                       value={productForm.description} 
                       onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                       placeholder="Tell customers about the taste, ingredients..."
                     />
                  </div>
               </div>

               <button 
                 disabled={submitting}
                 className="w-full bg-orange-600 text-white font-black py-5 rounded-3xl hover:bg-orange-700 transition shadow-xl shadow-orange-100 flex items-center justify-center space-x-2"
               >
                 {submitting ? <Loader className="animate-spin" size={20} /> : (
                   <span>{editingProduct ? 'Save Changes' : 'Launch Product'}</span>
                 )}
               </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

import { useState, useEffect } from 'react';
import api from '../services/api';
import { Package, Clock, ShoppingBag, Loader, ChevronDown } from 'lucide-react';

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/api/orders/user');
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Confirmed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Shipped': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Delivered': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <Loader className="animate-spin text-orange-600" size={48} />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="text-4xl font-black text-gray-900 mb-10 flex items-center">
        <Package className="mr-4 text-orange-600" size={36} />
        My Order History
      </h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[2.5rem] shadow-xl border border-gray-50 px-8">
          <ShoppingBag className="text-gray-300 mx-auto mb-6" size={64} />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No orders yet</h2>
          <p className="text-gray-500 mb-6">Start ordering to see your history here.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-[2rem] shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition duration-300">
              <div className="bg-gray-50 p-6 flex flex-wrap justify-between items-center gap-4 border-b border-gray-100">
                <div className="flex items-center space-x-6">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Order ID</p>
                    <p className="font-mono text-sm font-bold text-gray-700">#{order._id.substring(order._id.length - 8).toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Date Placed</p>
                    <p className="text-sm font-bold text-gray-700">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                   <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus}
                   </div>
                   <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${order.paymentStatus === 'Completed' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                      {order.paymentStatus}
                   </div>
                </div>
              </div>

              <div className="p-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4">
                       {order.products.map((item, idx) => (
                         <div key={idx} className="flex items-center space-x-4">
                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                               <img src={item.productId?.image} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div>
                               <p className="font-bold text-gray-800">{item.productId?.name || 'Product Removed'}</p>
                               <p className="text-sm text-gray-500">{item.quantity} x ₹{item.price}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                    <div className="md:text-right">
                       <p className="text-gray-500 font-medium mb-1 italic">Order Total</p>
                       <h2 className="text-3xl font-black text-orange-600">₹{order.totalAmount}</h2>
                    </div>
                 </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserOrders;

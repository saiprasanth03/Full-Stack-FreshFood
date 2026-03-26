import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { CreditCard, Truck, ClipboardList, Loader, CheckCircle } from 'lucide-react';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!user) {
      navigate('/login?redirect=checkout');
      return;
    }

    setLoading(true);

    try {
      // 1. Create order in our backend
      const { data: newOrder } = await api.post('/api/orders', {
        products: cartItems.map(item => ({
          productId: item.product,
          quantity: item.qty,
          price: item.price
        })),
        totalAmount: cartTotal,
      });

      // 2. Load Razorpay
      const res = await loadRazorpay();
      if (!res) {
        alert('Razorpay SDK failed to load. Check your internet connection.');
        setLoading(false);
        return;
      }

      // 3. Create Razorpay order in backend
      const { data: payData } = await api.post('/api/payment/create-order', {
        amount: cartTotal,
        orderId: newOrder._id,
      });

      // 4. Razorpay options
      const options = {
        key: 'rzp_test_placeholder', // Should come from backend or env in real production
        amount: payData.order.amount,
        currency: payData.order.currency,
        name: 'Fresh Food System',
        description: 'Order Payment',
        order_id: payData.order.id,
        handler: async (response) => {
          try {
            await api.post('/api/payment/verify', {
              ...response,
              orderId: newOrder._id,
            });
            setOrderComplete(true);
            clearCart();
          } catch (error) {
            console.error('Payment verification failed', error);
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: '#ea580c',
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error('Checkout error:', error);
      alert(error.response?.data?.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle className="text-green-600" size={64} />
        </div>
        <h1 className="text-4xl font-black text-gray-900 mb-6">Payment Successful!</h1>
        <p className="text-xl text-gray-600 mb-10 leading-relaxed font-medium">
          Your order has been placed successfully and is being processed. You'll receive a notification soon.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => navigate('/orders')}
            className="bg-orange-600 text-white font-bold px-10 py-4 rounded-2xl hover:bg-orange-700 transition shadow-lg shadow-orange-100"
          >
            Track My Order
          </button>
          <button 
            onClick={() => navigate('/')}
            className="bg-white text-orange-600 border-2 border-orange-600 font-bold px-10 py-4 rounded-2xl hover:bg-orange-50 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-4xl font-black text-gray-900 mb-12">Checkout Preview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
             <h3 className="text-xl font-bold flex items-center mb-6 text-gray-800">
               <Truck className="mr-3 text-orange-600" size={24} />
               Shipping Information
             </h3>
             <div className="space-y-1">
               <p className="font-bold text-gray-800">{user?.name}</p>
               <p className="text-gray-500">{user?.email}</p>
               <div className="mt-4 p-4 bg-orange-50 rounded-xl border border-orange-100 text-orange-800 text-sm italic">
                  Currently shipping to local regions only. Ensure your profile has the correct contact details.
               </div>
             </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
             <h3 className="text-xl font-bold flex items-center mb-6 text-gray-800">
               <CreditCard className="mr-3 text-orange-600" size={24} />
               Payment Method
             </h3>
             <div className="flex items-center p-4 border-2 border-orange-600 bg-orange-50 rounded-2xl">
               <div className="bg-white p-2 rounded-lg shadow-sm mr-4">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" alt="Razorpay" className="h-6" />
               </div>
               <span className="font-bold text-orange-900">Online Payment / UPI / Cards</span>
             </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50 flex flex-col h-fit sticky top-28">
           <h3 className="text-xl font-bold flex items-center mb-8 text-gray-800">
             <ClipboardList className="mr-3 text-orange-600" size={24} />
             Order Review
           </h3>
           
           <div className="space-y-4 mb-10 overflow-auto max-h-60 pr-2">
             {cartItems.map(item => (
               <div key={item.product} className="flex justify-between items-center text-sm">
                 <div className="flex items-center">
                    <span className="font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded mr-3">{item.qty}x</span>
                    <span className="text-gray-700 font-medium truncate max-w-[120px]">{item.name}</span>
                 </div>
                 <span className="font-bold text-gray-900">₹{item.price * item.qty}</span>
               </div>
             ))}
           </div>

           <div className="border-t pt-6 space-y-4">
              <div className="flex justify-between text-lg">
                <span className="font-bold text-gray-800">Total Amount</span>
                <span className="text-3xl font-black text-orange-600">₹{cartTotal}</span>
              </div>
              <button 
                onClick={handlePayment}
                disabled={loading || cartItems.length === 0}
                className="w-full bg-orange-600 text-white font-black py-5 rounded-2xl hover:bg-orange-700 transition flex items-center justify-center space-x-3 shadow-xl hover:shadow-orange-200 disabled:opacity-50"
              >
                {loading ? <Loader className="animate-spin" size={24} /> : (
                  <>
                    <span>Pay ₹{cartTotal} Now</span>
                    <CheckCircle size={24} />
                  </>
                )}
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

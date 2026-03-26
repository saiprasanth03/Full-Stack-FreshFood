import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';

const Cart = () => {
  const { cartItems, cartTotal } = useCart();
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="text-4xl font-black text-gray-900 mb-10 flex items-center">
        <ShoppingBag className="mr-4 text-orange-600" size={36} />
        Your Shopping Cart
      </h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[2.5rem] shadow-xl border border-gray-50 px-8">
          <div className="bg-orange-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="text-orange-600" size={48} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
          <p className="text-gray-500 mb-10 max-w-sm mx-auto">Looks like you haven't added anything to your cart yet. Explore our delicious local foods!</p>
          <Link 
            to="/" 
            className="inline-flex items-center space-x-2 bg-orange-600 text-white font-bold px-8 py-4 rounded-2xl hover:bg-orange-700 transition shadow-lg hover:shadow-orange-200"
          >
            <ArrowLeft size={20} />
            <span>Go Back Shopping</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <CartItem key={item.product} item={item} />
            ))}
            <div className="mt-8">
               <Link to="/" className="text-orange-600 font-bold hover:underline flex items-center">
                  <ArrowLeft size={18} className="mr-2" /> Continue Shopping
               </Link>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50 sticky top-28">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span className="font-semibold text-gray-800">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-bold">FREE</span>
                </div>
                <div className="border-t pt-4 flex justify-between">
                  <span className="text-xl font-bold text-gray-800">Total</span>
                  <span className="text-2xl font-black text-orange-600">₹{cartTotal}</span>
                </div>
              </div>

              <button 
                onClick={() => navigate('/checkout')}
                className="w-full bg-orange-600 text-white font-black py-5 rounded-2xl hover:bg-orange-700 transition flex items-center justify-center space-x-3 shadow-xl hover:shadow-orange-200"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={24} />
              </button>
              
              <p className="text-center text-gray-400 text-xs mt-6 px-4 leading-relaxed">
                Safe and Secure Payments powered by Razorpay.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;

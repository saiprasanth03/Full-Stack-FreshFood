import { Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartItem = ({ item }) => {
  const { removeFromCart, updateCartItemQty } = useCart();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-gray-100 mb-4 hover:shadow-md transition">
      <div className="flex items-center w-full sm:w-1/2">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-20 h-20 object-cover rounded-xl shadow-sm"
        />
        <div className="ml-4">
          <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
          <p className="text-orange-600 font-semibold">₹{item.price}</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between w-full sm:w-1/2 mt-4 sm:mt-0 px-4">
        <div className="flex items-center space-x-3 bg-gray-100 p-1 rounded-xl">
          <button 
            onClick={() => updateCartItemQty(item.product, item.qty - 1)}
            className="p-1 hover:bg-white rounded-lg transition text-gray-600"
          >
            <Minus size={18} />
          </button>
          <span className="font-bold w-6 text-center">{item.qty}</span>
          <button 
            onClick={() => updateCartItemQty(item.product, item.qty + 1)}
            className="p-1 hover:bg-white rounded-lg transition text-gray-600"
          >
            <Plus size={18} />
          </button>
        </div>
        
        <div className="text-right ml-4">
          <p className="text-lg font-bold text-gray-800">₹{item.price * item.qty}</p>
          <button 
            onClick={() => removeFromCart(item.product)}
            className="text-red-500 hover:text-red-600 transition flex items-center text-sm font-medium mt-1 ml-auto"
          >
            <Trash2 size={16} className="mr-1" /> Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;

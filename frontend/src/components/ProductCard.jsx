import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition duration-300 overflow-hidden border border-gray-100 flex flex-col h-full group">
      <div className="relative overflow-hidden h-52">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-orange-600 shadow-sm">
          {product.category}
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/product/${product._id}`} className="text-lg font-bold text-gray-800 hover:text-orange-600 transition">
            {product.name}
          </Link>
          <span className="text-xl font-bold text-orange-600">₹{product.price}</span>
        </div>
        
        <p className="text-gray-500 text-sm mb-4 line-clamp-2 transition flex-grow">
          {product.description}
        </p>
        
        <div className="flex items-center space-x-2 mt-auto">
          <button 
            onClick={() => addToCart(product)}
            className="flex-grow bg-orange-600 text-white font-semibold py-2 px-4 rounded-xl hover:bg-orange-700 transition flex items-center justify-center space-x-2 shadow-sm hover:shadow-md"
          >
            <ShoppingCart size={18} />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

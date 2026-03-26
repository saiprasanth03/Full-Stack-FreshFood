import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Loader, Plus, Minus, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import api from '../services/api';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/api/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="flex justify-center py-20">
      <Loader className="animate-spin text-orange-600" size={48} />
    </div>
  );

  if (!product) return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold text-gray-800">Product not found</h2>
      <button onClick={() => navigate('/')} className="mt-4 text-orange-600 font-bold hover:underline font-bold">Back to Home</button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto py-8">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-gray-600 hover:text-orange-600 mb-8 font-semibold transition group"
      >
        <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition" />
        Back to results
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50">
        <div className="rounded-3xl overflow-hidden shadow-inner bg-gray-50 border border-gray-100 h-[400px] md:h-auto">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col">
          <div className="mb-6">
            <span className="bg-orange-100 text-orange-600 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider">
              {product.category}
            </span>
            <h1 className="text-4xl font-black text-gray-900 mt-4 leading-tight">{product.name}</h1>
            <p className="text-3xl font-bold text-orange-600 mt-2">₹{product.price}</p>
          </div>

          <div className="prose prose-orange mb-8">
            <p className="text-gray-600 leading-relaxed text-lg">
              {product.description}
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center">
              <ShieldCheck className="mr-2 text-green-500" size={20} />
              Quality Guaranteed
            </h3>
            <div className="flex items-center space-x-6">
              <span className="text-gray-600 font-medium">Quantity</span>
              <div className="flex items-center space-x-4 bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
                <button 
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="p-1 hover:bg-orange-50 rounded-lg text-orange-600 transition"
                >
                  <Minus size={20} />
                </button>
                <span className="font-bold text-lg w-8 text-center">{qty}</span>
                <button 
                  onClick={() => setQty(qty + 1)}
                  className="p-1 hover:bg-orange-50 rounded-lg text-orange-600 transition"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
          </div>

          <button 
            onClick={() => addToCart(product, qty)}
            className="w-full bg-orange-600 text-white font-bold py-5 rounded-2xl hover:bg-orange-700 transition flex items-center justify-center space-x-3 shadow-xl hover:shadow-orange-200"
          >
            <ShoppingCart size={24} />
            <span className="text-lg">Add to My Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

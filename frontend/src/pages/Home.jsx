import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import api from '../services/api';
import { Search, Filter, Loader } from 'lucide-react';

import heroBg from '../assets/hero-bg.png';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/api/products');
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-24 pb-20">
      {/* Ultra-Premium Hero Section v3 */}
      <section className="relative min-h-[600px] flex items-center justify-center rounded-[4rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] group border border-white/10 mx-2">
        <img 
          src={heroBg} 
          alt="Fresh Food" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60"></div>
        
        <div className="relative z-10 w-full max-w-5xl px-6 text-center animate-in fade-in zoom-in-95 duration-1000">
           <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-xl px-5 py-2.5 rounded-full mb-10 border border-white/20 shadow-2xl">
              <span className="flex h-2.5 w-2.5 rounded-full bg-orange-500 animate-pulse"></span>
              <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white">The Artisan's Choice</span>
           </div>
           
           <h1 className="text-5xl md:text-8xl font-black text-white leading-tight mb-8">
              Savor the <span className="text-orange-500 italic">Authentic</span> <br />
              Local Delights
           </h1>
           
           <p className="text-lg md:text-xl text-white/90 font-medium max-w-2xl mx-auto mb-14 leading-relaxed">
              Experience the true essence of home-cooked flavors with our curated collection of artisanal pickles, sweets, and spices.
           </p>
           
           <div className="flex flex-col md:flex-row items-center justify-center gap-6 max-w-3xl mx-auto">
              <div className="relative w-full md:w-[450px] group/input shadow-2xl">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-orange-500 group-focus-within/input:scale-110 transition-transform" size={24} />
                <input 
                  type="text" 
                  placeholder="Search for your favorite items..." 
                  className="w-full bg-white backdrop-blur-3xl border-none rounded-[2rem] pl-16 pr-6 py-5 text-lg text-gray-800 placeholder-gray-400 focus:ring-4 focus:ring-orange-500/20 transition-all outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button 
                onClick={() => document.getElementById('browse').scrollIntoView({ behavior: 'smooth' })}
                className="w-full md:w-auto bg-orange-600 hover:bg-orange-700 text-white font-black px-10 py-5 rounded-[2rem] transition duration-300 shadow-xl shadow-orange-950/20 active:scale-95 flex items-center justify-center space-x-2"
              >
                <span>Browse Menu</span>
                <Filter size={20} />
              </button>
           </div>
        </div>

        {/* Minimal stats overlay */}
        <div className="absolute bottom-12 left-0 right-0 flex justify-center space-x-12 text-white/60 text-xs font-black uppercase tracking-widest hidden md:flex">
           <div className="flex items-center space-x-2">
              <span className="text-orange-500 text-lg">100%</span>
              <span>Natural</span>
           </div>
           <div className="w-px h-4 bg-white/20"></div>
           <div className="flex items-center space-x-2">
              <span className="text-orange-500 text-lg">Fresh</span>
              <span>Daily Batches</span>
           </div>
           <div className="w-px h-4 bg-white/20"></div>
           <div className="flex items-center space-x-2">
              <span className="text-orange-500 text-lg">Fast</span>
              <span>Local Delivery</span>
           </div>
        </div>
      </section>

      {/* Category Filter */}
      <div id="browse" className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
           <div className="space-y-1">
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">Catered to Your Taste</h2>
              <p className="text-gray-500 font-medium">Select a category to explore our local specialties.</p>
           </div>
           <div className="flex flex-wrap gap-3">
             {categories.map(cat => (
               <button
                 key={cat}
                 onClick={() => setSelectedCategory(cat)}
                 className={`px-8 py-3.5 rounded-2xl font-black text-sm transition-all duration-300 transform ${
                   selectedCategory === cat 
                   ? 'bg-orange-600 text-white shadow-xl shadow-orange-100 -translate-y-1' 
                   : 'bg-white text-gray-400 hover:bg-gray-50 hover:text-gray-600 border border-gray-100'
                 }`}
               >
                 {cat}
               </button>
             ))}
           </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-600"></div>
          </div>
        ) : (
          <div>
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
                {filteredProducts.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-32 bg-gray-50/50 rounded-[3rem] border border-gray-100 flex flex-col items-center">
                <Search size={64} className="text-gray-200 mb-6" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">No items found</h3>
                <p className="text-gray-500 font-medium">Try choosing a different category or search term.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

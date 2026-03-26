import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);


  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const cartItemCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-orange-600">
          FreshFood
        </Link>
        <div className="flex items-center space-x-6">
          <Link to="/cart" className="relative text-gray-700 hover:text-orange-600 transition">
            <ShoppingCart size={24} />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 text-gray-700 hover:text-orange-600 transition bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100 shadow-sm"
              >
                <div className="bg-orange-100 p-1.5 rounded-xl text-orange-600">
                  <User size={20} />
                </div>
                <span className="font-bold hidden sm:inline">{user.name}</span>
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-[1.5rem] shadow-2xl overflow-hidden z-[60] animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-2">
                    {user.role === 'admin' && (
                      <Link 
                        to="/admin" 
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center space-x-3 px-4 py-3 hover:bg-orange-50 text-gray-700 rounded-xl transition font-bold"
                      >
                         <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                         <span>Admin Dashboard</span>
                      </Link>
                    )}
                    <Link 
                      to="/orders" 
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-orange-50 text-gray-700 rounded-xl transition font-bold"
                    >
                       <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                       <span>My Orders</span>
                    </Link>
                    <div className="h-px bg-gray-100 my-1 mx-2"></div>
                    <button 
                      onClick={() => { handleLogout(); setShowDropdown(false); }} 
                      className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 flex items-center rounded-xl transition font-bold"
                    >
                      <LogOut size={18} className="mr-3" /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="bg-orange-600 text-white px-5 py-2 rounded-full hover:bg-orange-700 transition shadow hover:shadow-md">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

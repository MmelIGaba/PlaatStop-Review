import React from 'react';
import { ShoppingCart, User as UserIcon, Tractor, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'aws-amplify/auth'; 

import { CognitoUser, DbUser } from '../types';
import { useCart } from '../context/CartContext'; 

interface NavbarProps {
  user: CognitoUser | null;
  dbUser: DbUser | null;
  onOpenAuth: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, dbUser, onOpenAuth }) => {
  const navigate = useNavigate();
  
  const { cartCount } = useCart(); 

  const handleLogout = async () => {
    try {
      await signOut();
      window.location.href = '/'; 
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Tractor className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold text-gray-900 tracking-tight">Plaasstop</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/marketplace" className="text-gray-600 hover:text-green-600 font-medium transition">Marketplace</Link>
            {dbUser?.role === 'vendor' ? (
               <Link to="/vendors" className="text-green-600 font-medium transition">Vendor Dashboard</Link>
            ) : (
               <Link to="/vendors" className="text-gray-600 hover:text-green-600 font-medium transition">For Farms</Link>
            )}
            <Link to="/about" className="text-gray-600 hover:text-green-600 font-medium transition">About Us</Link>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-4">
            
            {/* DYNAMIC CART ICON */}
            <Link 
              to="/cart" 
              className="p-2 hover:bg-gray-100 rounded-full relative cursor-pointer group transition"
              aria-label="View Shopping Cart"
            >
              <ShoppingCart className="h-6 w-6 text-gray-600 group-hover:text-green-600 transition" />
              
              {/* Only show badge if count > 0, OR keep it always visible based on your preference */}
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center animate-pulse">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center gap-4">
                <span className="hidden lg:block text-sm font-medium text-gray-700">
                  {dbUser?.name || user.username}
                </span>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <button 
                onClick={onOpenAuth}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition cursor-pointer shadow-sm hover:shadow"
              >
                <UserIcon className="h-4 w-4" />
                <span>Login</span>
              </button>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
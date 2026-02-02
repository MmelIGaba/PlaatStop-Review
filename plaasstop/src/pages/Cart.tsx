import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';

// MOCK DATA: Replace this with your Context/State later
const MOCK_CART: CartItem[] = [
  {
    id: 1,
    name: "Organic Potatoes",
    price: 45.00,
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=200",
    farmName: "Green Valley Farm",
    unit: "10kg bag",
    quantity: 1
  },
  {
    id: 2,
    name: "Fresh Honey",
    price: 120.00,
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=200",
    farmName: "Bee Happy Apiary",
    unit: "500g jar",
    quantity: 2
  }
];

const Cart: React.FC = () => {
  const navigate = useNavigate();
  // In a real app, use a Context hook here
  const [cartItems, setCartItems] = useState<CartItem[]>(MOCK_CART);

  const updateQuantity = (id: number, change: number) => {
    setCartItems(items => items.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 50.00; // Flat rate example
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Looks like you haven't added any farm fresh produce yet.</p>
        <Link 
          to="/marketplace" 
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        
        {/* Cart Items List */}
        <div className="lg:col-span-8">
          <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-100">
            <ul className="divide-y divide-gray-200">
              {cartItems.map((item) => (
                <li key={item.id} className="p-6 flex flex-col sm:flex-row sm:items-center gap-6">
                  {/* Product Image */}
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="h-full w-full object-cover object-center" 
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          <Link to={`/product/${item.id}`}>{item.name}</Link>
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">Sold by: <span className="text-green-600 font-medium">{item.farmName}</span></p>
                        <p className="mt-1 text-sm text-gray-500">Unit: {item.unit}</p>
                      </div>
                      <p className="text-lg font-medium text-gray-900">R {item.price.toFixed(2)}</p>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      {/* Quantity Control */}
                      <div className="flex items-center border border-gray-300 rounded-md">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-2 hover:bg-gray-100 text-gray-600"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-4 font-medium text-gray-900">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-2 hover:bg-gray-100 text-gray-600"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-sm font-medium text-red-500 hover:text-red-700 flex items-center gap-1 transition"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mt-6">
            <Link to="/marketplace" className="text-green-600 font-medium flex items-center gap-2 hover:underline">
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary Sticky Sidebar */}
        <div className="lg:col-span-4 mt-8 lg:mt-0">
          <div className="bg-white shadow-sm rounded-lg border border-gray-100 p-6 sticky top-24">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Order Summary</h2>
            
            <div className="flow-root">
              <dl className="-my-4 text-sm divide-y divide-gray-200">
                <div className="py-4 flex items-center justify-between">
                  <dt className="text-gray-600">Subtotal</dt>
                  <dd className="font-medium text-gray-900">R {subtotal.toFixed(2)}</dd>
                </div>
                <div className="py-4 flex items-center justify-between">
                  <dt className="text-gray-600">Shipping Estimate</dt>
                  <dd className="font-medium text-gray-900">R {shipping.toFixed(2)}</dd>
                </div>
                <div className="py-4 flex items-center justify-between border-t border-gray-200">
                  <dt className="text-base font-bold text-gray-900">Order Total</dt>
                  <dd className="text-xl font-bold text-green-600">R {total.toFixed(2)}</dd>
                </div>
              </dl>
            </div>

            <div className="mt-6">
              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-green-600 border border-transparent rounded-lg shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition"
              >
                Proceed to Checkout
              </button>
            </div>
            
            <div className="mt-4 text-center text-xs text-gray-500">
              Secure Checkout powered by PayFast
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Cart;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Store, CreditCard, Banknote, ShieldCheck } from 'lucide-react';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  
  // Mock Totals
  const subtotal = 210.00;
  const shipping = deliveryMethod === 'delivery' ? 50.00 : 0.00;
  const total = subtotal + shipping;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to process payment via API
    alert("Order processed!");
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-500 mt-1">Complete your order to support local farmers.</p>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
          
          {/* LEFT COLUMN: Forms */}
          <section className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* 1. Contact Info */}
              <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                    <input type="email" id="email" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 border focus:ring-green-500 focus:border-green-500 sm:text-sm" />
                  </div>
                  <div>
                    <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">First name</label>
                    <input type="text" id="first-name" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 border focus:ring-green-500 focus:border-green-500 sm:text-sm" />
                  </div>
                  <div>
                    <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">Last name</label>
                    <input type="text" id="last-name" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 border focus:ring-green-500 focus:border-green-500 sm:text-sm" />
                  </div>
                </div>
              </div>

              {/* 2. Delivery Method */}
              <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Delivery Method</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Option: Delivery */}
                  <div 
                    onClick={() => setDeliveryMethod('delivery')}
                    className={`border rounded-lg p-4 cursor-pointer flex items-center gap-4 transition ${deliveryMethod === 'delivery' ? 'border-green-600 bg-green-50 ring-1 ring-green-600' : 'border-gray-200 hover:border-green-400'}`}
                  >
                    <Truck className={`h-6 w-6 ${deliveryMethod === 'delivery' ? 'text-green-600' : 'text-gray-400'}`} />
                    <div>
                      <p className="font-medium text-gray-900">Standard Delivery</p>
                      <p className="text-sm text-gray-500">2-4 Business Days</p>
                    </div>
                    <div className="ml-auto font-medium text-gray-900">R50.00</div>
                  </div>

                  {/* Option: Pickup */}
                  <div 
                    onClick={() => setDeliveryMethod('pickup')}
                    className={`border rounded-lg p-4 cursor-pointer flex items-center gap-4 transition ${deliveryMethod === 'pickup' ? 'border-green-600 bg-green-50 ring-1 ring-green-600' : 'border-gray-200 hover:border-green-400'}`}
                  >
                    <Store className={`h-6 w-6 ${deliveryMethod === 'pickup' ? 'text-green-600' : 'text-gray-400'}`} />
                    <div>
                      <p className="font-medium text-gray-900">Farm Pickup</p>
                      <p className="text-sm text-gray-500">Collect yourself</p>
                    </div>
                    <div className="ml-auto font-medium text-gray-900">Free</div>
                  </div>

                </div>
              </div>

              {/* 3. Shipping Address (Only show if Delivery) */}
              {deliveryMethod === 'delivery' && (
                <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-100 animate-fade-in">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Address</h2>
                  <div className="grid grid-cols-1 gap-y-6">
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700">Street Address</label>
                      <input type="text" id="address" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 border focus:ring-green-500 focus:border-green-500 sm:text-sm" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                        <input type="text" id="city" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 border focus:ring-green-500 focus:border-green-500 sm:text-sm" />
                      </div>
                      <div>
                        <label htmlFor="postal-code" className="block text-sm font-medium text-gray-700">Postal Code</label>
                        <input type="text" id="postal-code" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 border focus:ring-green-500 focus:border-green-500 sm:text-sm" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. Payment */}
              <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Details</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <input id="card" name="payment-type" type="radio" defaultChecked className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300" />
                    <label htmlFor="card" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <CreditCard className="h-4 w-4 text-gray-500" /> Credit / Debit Card
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input id="cash" name="payment-type" type="radio" className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300" />
                    <label htmlFor="cash" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Banknote className="h-4 w-4 text-gray-500" /> Cash on Delivery / Pickup
                    </label>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 border border-transparent rounded-lg shadow-sm py-4 px-4 text-lg font-bold text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition"
              >
                Pay R {total.toFixed(2)}
              </button>
            </form>
          </section>

          {/* RIGHT COLUMN: Order Summary */}
          <section className="lg:col-span-5 mt-8 lg:mt-0">
            <div className="bg-white shadow-sm rounded-lg border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Order Summary</h2>
              
              {/* Product List (Condensed) */}
              <ul className="divide-y divide-gray-200 mb-6">
                {[1, 2].map((i) => (
                  <li key={i} className="py-4 flex items-start gap-4">
                    <div className="h-16 w-16 rounded-md border border-gray-200 overflow-hidden bg-gray-100">
                      {/* Placeholder for item image */}
                      <img src="https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=100" className="h-full w-full object-cover" alt="" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">Organic Potatoes</h3>
                      <p className="text-sm text-gray-500">Green Valley Farm</p>
                      <p className="text-sm text-gray-500">Qty: 1</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">R 45.00</p>
                  </li>
                ))}
              </ul>

              <dl className="space-y-4 border-t border-gray-200 pt-6 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-gray-600">Subtotal</dt>
                  <dd className="font-medium text-gray-900">R {subtotal.toFixed(2)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-gray-600">Shipping</dt>
                  <dd className="font-medium text-gray-900">
                    {shipping === 0 ? <span className="text-green-600">Free</span> : `R ${shipping.toFixed(2)}`}
                  </dd>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <dt className="text-base font-bold text-gray-900">Total</dt>
                  <dd className="text-xl font-bold text-green-600">R {total.toFixed(2)}</dd>
                </div>
              </dl>

              <div className="mt-6 flex items-center justify-center gap-2 text-gray-500 text-sm">
                <ShieldCheck className="h-4 w-4 text-green-600" />
                <span>Secure SSL Encryption</span>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default Checkout;

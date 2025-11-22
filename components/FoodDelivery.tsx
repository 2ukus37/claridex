import React, { useState } from 'react';
import { User } from '../App';

interface FoodDeliveryProps {
  user: User;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  image: string;
  menu: MenuItem[];
}

interface CartItem extends MenuItem {
  quantity: number;
}

interface Order {
  id: string;
  restaurant: Restaurant;
  items: CartItem[];
  total: number;
  status: 'preparing' | 'ready' | 'picked-up' | 'delivered';
  deliveryAddress: string;
}

const restaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Burger Palace',
    cuisine: 'American',
    rating: 4.8,
    deliveryTime: '20-30 min',
    deliveryFee: 2.99,
    image: '🍔',
    menu: [
      { id: '1-1', name: 'Classic Burger', description: 'Beef patty, lettuce, tomato, cheese', price: 12.99, image: '🍔', category: 'Burgers' },
      { id: '1-2', name: 'Cheese Fries', description: 'Crispy fries with melted cheese', price: 5.99, image: '🍟', category: 'Sides' },
      { id: '1-3', name: 'Milkshake', description: 'Vanilla, chocolate, or strawberry', price: 4.99, image: '🥤', category: 'Drinks' },
    ],
  },
  {
    id: '2',
    name: 'Pizza Heaven',
    cuisine: 'Italian',
    rating: 4.9,
    deliveryTime: '25-35 min',
    deliveryFee: 3.49,
    image: '🍕',
    menu: [
      { id: '2-1', name: 'Margherita Pizza', description: 'Fresh mozzarella, basil, tomato sauce', price: 14.99, image: '🍕', category: 'Pizza' },
      { id: '2-2', name: 'Pepperoni Pizza', description: 'Classic pepperoni with cheese', price: 16.99, image: '🍕', category: 'Pizza' },
      { id: '2-3', name: 'Caesar Salad', description: 'Romaine, parmesan, croutons', price: 8.99, image: '🥗', category: 'Salads' },
    ],
  },
  {
    id: '3',
    name: 'Sushi Master',
    cuisine: 'Japanese',
    rating: 4.7,
    deliveryTime: '30-40 min',
    deliveryFee: 4.99,
    image: '🍣',
    menu: [
      { id: '3-1', name: 'California Roll', description: '8 pieces with crab and avocado', price: 11.99, image: '🍣', category: 'Rolls' },
      { id: '3-2', name: 'Salmon Nigiri', description: '6 pieces of fresh salmon', price: 13.99, image: '🍣', category: 'Nigiri' },
      { id: '3-3', name: 'Miso Soup', description: 'Traditional Japanese soup', price: 3.99, image: '🍜', category: 'Soups' },
    ],
  },
  {
    id: '4',
    name: 'Taco Fiesta',
    cuisine: 'Mexican',
    rating: 4.6,
    deliveryTime: '15-25 min',
    deliveryFee: 2.49,
    image: '🌮',
    menu: [
      { id: '4-1', name: 'Beef Tacos', description: '3 tacos with seasoned beef', price: 9.99, image: '🌮', category: 'Tacos' },
      { id: '4-2', name: 'Burrito Bowl', description: 'Rice, beans, meat, veggies', price: 12.99, image: '🥙', category: 'Bowls' },
      { id: '4-3', name: 'Guacamole & Chips', description: 'Fresh guacamole with tortilla chips', price: 6.99, image: '🥑', category: 'Appetizers' },
    ],
  },
];

export const FoodDelivery: React.FC<FoodDeliveryProps> = ({ user }) => {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState('123 Main Street, Apt 4B');

  const addToCart = (item: MenuItem) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId: string) => {
    const existingItem = cart.find(cartItem => cartItem.id === itemId);
    if (existingItem && existingItem.quantity > 1) {
      setCart(cart.map(cartItem =>
        cartItem.id === itemId
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      ));
    } else {
      setCart(cart.filter(cartItem => cartItem.id !== itemId));
    }
  };

  const getCartTotal = () => {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = selectedRestaurant?.deliveryFee || 0;
    return subtotal + deliveryFee;
  };

  const handleCheckout = () => {
    if (selectedRestaurant && cart.length > 0) {
      const newOrder: Order = {
        id: Math.random().toString(36).substr(2, 9),
        restaurant: selectedRestaurant,
        items: [...cart],
        total: getCartTotal(),
        status: 'preparing',
        deliveryAddress,
      };
      setActiveOrder(newOrder);
      setCart([]);
      setSelectedRestaurant(null);

      setTimeout(() => {
        setActiveOrder(prev => prev ? { ...prev, status: 'ready' } : null);
      }, 3000);

      setTimeout(() => {
        setActiveOrder(prev => prev ? { ...prev, status: 'picked-up' } : null);
      }, 6000);
    }
  };

  const handleCompleteOrder = () => {
    setActiveOrder(null);
  };

  if (activeOrder) {
    return (
      <div className="p-4 space-y-4">
        {/* Order Tracking */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Order Tracking</h2>

          {/* Status Timeline */}
          <div className="space-y-4 mb-6">
            <div className={`flex items-center space-x-4 ${activeOrder.status === 'preparing' ? 'opacity-100' : 'opacity-50'}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                activeOrder.status === 'preparing' ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'
              }`}>
                <span className="text-2xl">👨‍🍳</span>
              </div>
              <div>
                <p className="font-bold">Preparing your order</p>
                <p className="text-sm text-gray-600">Restaurant is cooking your food</p>
              </div>
            </div>

            <div className={`flex items-center space-x-4 ${activeOrder.status === 'ready' ? 'opacity-100' : 'opacity-50'}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                activeOrder.status === 'ready' ? 'bg-yellow-500 animate-pulse' : activeOrder.status === 'picked-up' || activeOrder.status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'
              }`}>
                <span className="text-2xl">📦</span>
              </div>
              <div>
                <p className="font-bold">Order ready</p>
                <p className="text-sm text-gray-600">Waiting for driver pickup</p>
              </div>
            </div>

            <div className={`flex items-center space-x-4 ${activeOrder.status === 'picked-up' ? 'opacity-100' : 'opacity-50'}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                activeOrder.status === 'picked-up' ? 'bg-yellow-500 animate-pulse' : activeOrder.status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'
              }`}>
                <span className="text-2xl">🚗</span>
              </div>
              <div>
                <p className="font-bold">On the way</p>
                <p className="text-sm text-gray-600">Driver is delivering your order</p>
              </div>
            </div>

            <div className={`flex items-center space-x-4 ${activeOrder.status === 'delivered' ? 'opacity-100' : 'opacity-50'}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                activeOrder.status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'
              }`}>
                <span className="text-2xl">✅</span>
              </div>
              <div>
                <p className="font-bold">Delivered</p>
                <p className="text-sm text-gray-600">Enjoy your meal!</p>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="border-t pt-4 space-y-3">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">{activeOrder.restaurant.image}</span>
              <div>
                <p className="font-bold">{activeOrder.restaurant.name}</p>
                <p className="text-sm text-gray-600">{activeOrder.restaurant.cuisine}</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              {activeOrder.items.map(item => (
                <div key={item.id} className="flex justify-between">
                  <span className="text-sm">{item.quantity}x {item.name}</span>
                  <span className="text-sm font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-2 flex justify-between font-bold">
                <span>Total</span>
                <span>${activeOrder.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <span className="text-xl">📍</span>
              <div>
                <p className="text-sm text-gray-600">Delivery Address</p>
                <p className="font-medium">{activeOrder.deliveryAddress}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 space-y-3">
            {activeOrder.status === 'picked-up' && (
              <button
                onClick={() => setActiveOrder({ ...activeOrder, status: 'delivered' })}
                className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700"
              >
                Mark as Delivered
              </button>
            )}
            {activeOrder.status === 'delivered' && (
              <button
                onClick={handleCompleteOrder}
                className="w-full py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800"
              >
                Done
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (selectedRestaurant) {
    return (
      <div className="p-4 space-y-4">
        {/* Restaurant Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-orange-400 to-red-400 h-32 flex items-center justify-center">
            <span className="text-7xl">{selectedRestaurant.image}</span>
          </div>
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold">{selectedRestaurant.name}</h2>
                <p className="text-gray-600">{selectedRestaurant.cuisine}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm">
                  <span className="flex items-center">⭐ {selectedRestaurant.rating}</span>
                  <span>🕐 {selectedRestaurant.deliveryTime}</span>
                  <span>🚚 ${selectedRestaurant.deliveryFee.toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedRestaurant(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                ← Back
              </button>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-3">
          <h3 className="text-xl font-bold px-2">Menu</h3>
          {selectedRestaurant.menu.map(item => (
            <div key={item.id} className="bg-white rounded-2xl shadow-md p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <span className="text-5xl">{item.image}</span>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold">{item.name}</h4>
                    <p className="text-sm text-gray-600">{item.description}</p>
                    <p className="text-lg font-bold mt-2">${item.price.toFixed(2)}</p>
                  </div>
                </div>
                <button
                  onClick={() => addToCart(item)}
                  className="px-6 py-2 bg-black text-white rounded-lg font-semibold hover:bg-gray-800"
                >
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        {cart.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-2xl p-4 z-50">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm text-gray-600">{cart.reduce((sum, item) => sum + item.quantity, 0)} items</p>
                  <p className="text-2xl font-bold">${getCartTotal().toFixed(2)}</p>
                </div>
                <button
                  onClick={handleCheckout}
                  className="px-8 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800"
                >
                  Checkout
                </button>
              </div>
              <div className="flex space-x-2 overflow-x-auto">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2 whitespace-nowrap">
                    <span>{item.quantity}x {item.name}</span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 pb-20">
      {/* Delivery Address */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Delivery Address
        </label>
        <div className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-xl">
          <span className="text-2xl">📍</span>
          <input
            type="text"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            className="flex-1 outline-none text-lg"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex space-x-3 overflow-x-auto pb-2">
        {['All', 'American', 'Italian', 'Japanese', 'Mexican', 'Chinese', 'Indian'].map(category => (
          <button
            key={category}
            className="px-6 py-2 bg-white rounded-full font-semibold whitespace-nowrap shadow-md hover:shadow-lg hover:bg-black hover:text-white transition-all"
          >
            {category}
          </button>
        ))}
      </div>

      {/* Restaurants */}
      <div className="space-y-3">
        <h3 className="text-xl font-bold px-2">Restaurants near you</h3>
        {restaurants.map(restaurant => (
          <div
            key={restaurant.id}
            onClick={() => setSelectedRestaurant(restaurant)}
            className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
          >
            <div className="bg-gradient-to-r from-orange-300 to-red-300 h-40 flex items-center justify-center">
              <span className="text-8xl">{restaurant.image}</span>
            </div>
            <div className="p-5">
              <h4 className="text-xl font-bold mb-1">{restaurant.name}</h4>
              <p className="text-gray-600 mb-3">{restaurant.cuisine}</p>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center font-semibold">⭐ {restaurant.rating}</span>
                  <span>🕐 {restaurant.deliveryTime}</span>
                </div>
                <span className="font-semibold">🚚 ${restaurant.deliveryFee.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-bold mb-4">Recent Orders</h3>
        <div className="space-y-3">
          {[
            { restaurant: 'Burger Palace', items: '2 items', date: 'Today', price: 24.97 },
            { restaurant: 'Pizza Heaven', items: '3 items', date: 'Yesterday', price: 42.47 },
            { restaurant: 'Sushi Master', items: '4 items', date: '2 days ago', price: 38.95 },
          ].map((order, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer">
              <div className="flex-1">
                <p className="font-medium">{order.restaurant}</p>
                <p className="text-sm text-gray-600">{order.items} • {order.date}</p>
              </div>
              <p className="font-bold">${order.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

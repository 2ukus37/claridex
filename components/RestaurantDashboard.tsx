import React, { useState } from 'react';
import { User } from '../App';

interface RestaurantDashboardProps {
  user: User;
  onLogout: () => void;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
}

interface Order {
  id: string;
  customer: {
    name: string;
    phone: string;
  };
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: 'new' | 'preparing' | 'ready' | 'picked-up';
  orderTime: string;
  deliveryAddress: string;
}

const initialMenu: MenuItem[] = [
  { id: '1', name: 'Classic Burger', description: 'Beef patty, lettuce, tomato, cheese', price: 12.99, category: 'Burgers', available: true },
  { id: '2', name: 'Cheese Fries', description: 'Crispy fries with melted cheese', price: 5.99, category: 'Sides', available: true },
  { id: '3', name: 'Milkshake', description: 'Vanilla, chocolate, or strawberry', price: 4.99, category: 'Drinks', available: true },
  { id: '4', name: 'Chicken Burger', description: 'Grilled chicken, lettuce, mayo', price: 11.99, category: 'Burgers', available: true },
  { id: '5', name: 'Onion Rings', description: 'Crispy golden onion rings', price: 4.99, category: 'Sides', available: false },
];

const mockOrders: Order[] = [
  {
    id: '1',
    customer: { name: 'John Doe', phone: '+1 (555) 123-4567' },
    items: [
      { name: 'Classic Burger', quantity: 2, price: 12.99 },
      { name: 'Cheese Fries', quantity: 1, price: 5.99 },
    ],
    total: 31.97,
    status: 'new',
    orderTime: '2 min ago',
    deliveryAddress: '123 Main St, Apt 4B',
  },
  {
    id: '2',
    customer: { name: 'Sarah Smith', phone: '+1 (555) 987-6543' },
    items: [
      { name: 'Chicken Burger', quantity: 1, price: 11.99 },
      { name: 'Milkshake', quantity: 2, price: 4.99 },
    ],
    total: 21.97,
    status: 'preparing',
    orderTime: '8 min ago',
    deliveryAddress: '456 Oak Avenue',
  },
];

export const RestaurantDashboard: React.FC<RestaurantDashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'menu'>('orders');
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [menu, setMenu] = useState<MenuItem[]>(initialMenu);
  const [isOpen, setIsOpen] = useState(true);
  const [stats] = useState({
    todayOrders: 47,
    todayRevenue: 1247.50,
    avgRating: 4.8,
  });

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const toggleItemAvailability = (itemId: string) => {
    setMenu(menu.map(item =>
      item.id === itemId ? { ...item, available: !item.available } : item
    ));
  };

  const getOrdersByStatus = (status: Order['status']) => {
    return orders.filter(order => order.status === status);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-black text-white p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-sm text-gray-300">Restaurant Dashboard</p>
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-white text-black rounded-lg font-semibold hover:bg-gray-100"
            >
              Logout
            </button>
          </div>

          {/* Open/Close Toggle */}
          <div className="flex items-center justify-between bg-gray-800 rounded-xl p-4">
            <div>
              <p className="font-semibold">
                {isOpen ? '🟢 Restaurant Open' : '🔴 Restaurant Closed'}
              </p>
              <p className="text-sm text-gray-300">
                {isOpen ? 'Accepting orders' : 'Not accepting orders'}
              </p>
            </div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                isOpen
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {isOpen ? 'Close' : 'Open'}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
            <p className="text-sm opacity-90 mb-2">Today's Orders</p>
            <p className="text-4xl font-bold">{stats.todayOrders}</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white">
            <p className="text-sm opacity-90 mb-2">Revenue</p>
            <p className="text-4xl font-bold">${stats.todayRevenue.toFixed(0)}</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl shadow-lg p-6 text-white">
            <p className="text-sm opacity-90 mb-2">Rating</p>
            <p className="text-4xl font-bold">⭐ {stats.avgRating}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                activeTab === 'orders'
                  ? 'bg-black text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('menu')}
              className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                activeTab === 'menu'
                  ? 'bg-black text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Menu ({menu.length})
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'orders' && (
              <div className="space-y-6">
                {!isOpen && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
                    <p className="text-yellow-800 font-semibold">Restaurant is closed</p>
                    <p className="text-sm text-yellow-700">Open your restaurant to receive orders</p>
                  </div>
                )}

                {/* New Orders */}
                {getOrdersByStatus('new').length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold mb-3 flex items-center">
                      <span className="w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                      New Orders
                    </h3>
                    <div className="space-y-3">
                      {getOrdersByStatus('new').map(order => (
                        <div key={order.id} className="bg-red-50 border-2 border-red-200 rounded-xl p-5">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="text-lg font-bold">{order.customer.name}</h4>
                              <p className="text-sm text-gray-600">📞 {order.customer.phone}</p>
                              <p className="text-sm text-gray-600">🕐 {order.orderTime}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-green-600">${order.total.toFixed(2)}</p>
                            </div>
                          </div>

                          <div className="bg-white rounded-lg p-4 mb-4">
                            <p className="font-semibold mb-2">Order Items:</p>
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between text-sm mb-1">
                                <span>{item.quantity}x {item.name}</span>
                                <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>

                          <div className="flex items-start space-x-2 mb-4">
                            <span className="text-lg">📍</span>
                            <div>
                              <p className="text-xs text-gray-500">Delivery Address</p>
                              <p className="text-sm font-medium">{order.deliveryAddress}</p>
                            </div>
                          </div>

                          <div className="flex space-x-3">
                            <button
                              onClick={() => updateOrderStatus(order.id, 'preparing')}
                              className="flex-1 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800"
                            >
                              Accept Order
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Preparing Orders */}
                {getOrdersByStatus('preparing').length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold mb-3 flex items-center">
                      <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                      Preparing
                    </h3>
                    <div className="space-y-3">
                      {getOrdersByStatus('preparing').map(order => (
                        <div key={order.id} className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="text-lg font-bold">{order.customer.name}</h4>
                              <p className="text-sm text-gray-600">🕐 {order.orderTime}</p>
                            </div>
                            <p className="text-xl font-bold">${order.total.toFixed(2)}</p>
                          </div>

                          <div className="bg-white rounded-lg p-4 mb-4">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between text-sm mb-1">
                                <span>{item.quantity}x {item.name}</span>
                              </div>
                            ))}
                          </div>

                          <button
                            onClick={() => updateOrderStatus(order.id, 'ready')}
                            className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
                          >
                            Mark as Ready
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ready Orders */}
                {getOrdersByStatus('ready').length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold mb-3 flex items-center">
                      <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                      Ready for Pickup
                    </h3>
                    <div className="space-y-3">
                      {getOrdersByStatus('ready').map(order => (
                        <div key={order.id} className="bg-green-50 border border-green-200 rounded-xl p-5">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="text-lg font-bold">{order.customer.name}</h4>
                              <p className="text-sm text-gray-600">Waiting for driver</p>
                            </div>
                            <p className="text-xl font-bold">${order.total.toFixed(2)}</p>
                          </div>

                          <button
                            onClick={() => updateOrderStatus(order.id, 'picked-up')}
                            className="w-full py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800"
                          >
                            Mark as Picked Up
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {orders.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📦</div>
                    <p className="text-xl font-semibold text-gray-600">No active orders</p>
                    <p className="text-sm text-gray-500 mt-2">New orders will appear here</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'menu' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Menu Items</h3>
                  <button className="px-4 py-2 bg-black text-white rounded-lg font-semibold hover:bg-gray-800">
                    + Add Item
                  </button>
                </div>

                <div className="space-y-3">
                  {menu.map(item => (
                    <div key={item.id} className="bg-gray-50 rounded-xl p-5 flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-lg font-bold">{item.name}</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            item.available
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {item.available ? 'Available' : 'Unavailable'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="font-semibold text-green-600">${item.price.toFixed(2)}</span>
                          <span className="text-gray-500">{item.category}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => toggleItemAvailability(item.id)}
                          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                            item.available
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {item.available ? 'Disable' : 'Enable'}
                        </button>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
